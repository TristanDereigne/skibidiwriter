import { db } from "@/libs/db";
import { eqOrNull } from "@/libs/sql";
import { fileTable } from "@/models";
import { fileShareTable } from "@/models/file-share.model";
import { and, eq, exists, getColumns, ne, or, sql } from "drizzle-orm";
import { TextCrdt, type DocumentOperation } from "skibidiwriter-shared";

const PERSIST_DELAY = 500;
const DOCUMENT_MIME_TYPE = "text/markdown";

interface OpenDocument {
  crdt: TextCrdt;
  persistTimer?: ReturnType<typeof setTimeout>;
}

const openDocuments = new Map<string, Promise<OpenDocument | null>>();
const releasing = new Map<string, Promise<void>>();

const {
  data: _data,
  operations: _operations,
  ...summarySelect
} = getColumns(fileTable);

function ownedBy(userId: string) {
  return eq(fileTable.ownerId, userId);
}

function accessibleTo(userId: string) {
  return or(
    ownedBy(userId),
    exists(
      db
        .select({ one: sql`1` })
        .from(fileShareTable)
        .where(
          and(
            eq(fileShareTable.fileId, fileTable.id),
            eq(fileShareTable.userId, userId),
          ),
        ),
    ),
  );
}

async function hasAccess(id: string, userId: string) {
  const [row] = await db
    .select({ id: fileTable.id })
    .from(fileTable)
    .where(and(eq(fileTable.id, id), accessibleTo(userId)));

  return !!row;
}

async function findInFolder(folderId: string | null, userId: string) {
  return await db
    .select(summarySelect)
    .from(fileTable)
    .where(and(eqOrNull(fileTable.folderId, folderId), ownedBy(userId)));
}

async function nameTaken(
  name: string,
  folderId: string | null,
  userId: string,
  exceptId?: string,
) {
  const [row] = await db
    .select({ id: fileTable.id })
    .from(fileTable)
    .where(
      and(
        eqOrNull(fileTable.folderId, folderId),
        ownedBy(userId),
        eq(sql`lower(${fileTable.name})`, sql`lower(${name})`),
        exceptId ? ne(fileTable.id, exceptId) : undefined,
      ),
    );

  return !!row;
}

async function findById(id: string, userId: string) {
  const [row] = await db
    .select(summarySelect)
    .from(fileTable)
    .where(and(eq(fileTable.id, id), accessibleTo(userId)));

  return row;
}

async function createDocument(
  name: string,
  folderId: string | null,
  userId: string,
  content?: string,
) {
  const crdt = new TextCrdt("server");
  const operations = content ? crdt.setText(content) : [];

  const [row] = await db
    .insert(fileTable)
    .values({
      name,
      kind: "document",
      mimeType: DOCUMENT_MIME_TYPE,
      sizeBytes: Buffer.byteLength(content ?? ""),
      folderId,
      operations,
      ownerId: userId,
    })
    .returning(summarySelect);

  return row!;
}

async function createUpload(
  file: { name: string; mimeType: string; data: Buffer },
  folderId: string | null,
  userId: string,
) {
  const [row] = await db
    .insert(fileTable)
    .values({
      ...file,
      kind: "upload",
      sizeBytes: file.data.length,
      folderId,
      ownerId: userId,
    })
    .returning(summarySelect);

  return row!;
}

async function rename(id: string, name: string, userId: string) {
  const [row] = await db
    .update(fileTable)
    .set({ name })
    .where(and(eq(fileTable.id, id), ownedBy(userId)))
    .returning(summarySelect);

  return row;
}

async function move(id: string, folderId: string | null, userId: string) {
  const [row] = await db
    .update(fileTable)
    .set({ folderId })
    .where(and(eq(fileTable.id, id), ownedBy(userId)))
    .returning(summarySelect);

  return row;
}

async function remove(id: string, userId: string) {
  const [row] = await db
    .delete(fileTable)
    .where(and(eq(fileTable.id, id), ownedBy(userId)))
    .returning({ id: fileTable.id });

  if (row) await forget([id]);

  return row;
}

async function content(id: string, userId: string) {
  const [row] = await db
    .select({
      name: fileTable.name,
      kind: fileTable.kind,
      mimeType: fileTable.mimeType,
      data: fileTable.data,
      operations: fileTable.operations,
    })
    .from(fileTable)
    .where(and(eq(fileTable.id, id), accessibleTo(userId)));
  if (!row) return;

  if (row.kind === "upload") {
    return {
      name: row.name,
      mimeType: row.mimeType,
      data: row.data ?? Buffer.alloc(0),
    };
  }

  const opened = await openDocuments.get(id);
  const text = opened?.crdt.text ?? replay(row.operations).text;

  return {
    name: /\.(md|markdown|txt)$/i.test(row.name) ? row.name : `${row.name}.md`,
    mimeType: `${row.mimeType}; charset=utf-8`,
    data: Buffer.from(text),
  };
}

function replay(operations: DocumentOperation[] | null) {
  const crdt = new TextCrdt("server");
  crdt.apply(operations ?? []);

  return crdt;
}

function open(id: string) {
  let opened = openDocuments.get(id);
  if (!opened) {
    opened = load(id);
    openDocuments.set(id, opened);
  }

  return opened;
}

async function load(id: string): Promise<OpenDocument | null> {
  await releasing.get(id);

  const row = await db.query.fileTable.findFirst({
    where: { id, kind: "document" },
  });
  if (!row) {
    openDocuments.delete(id);
    return null;
  }

  return { crdt: replay(row.operations) };
}

async function persist(id: string, document: OpenDocument) {
  clearTimeout(document.persistTimer);
  document.persistTimer = undefined;

  await db
    .update(fileTable)
    .set({
      operations: document.crdt.toOperations(),
      sizeBytes: Buffer.byteLength(document.crdt.text),
    })
    .where(eq(fileTable.id, id));
}

async function operations(id: string): Promise<DocumentOperation[] | null> {
  const document = await open(id);

  return document?.crdt.toOperations() ?? null;
}

async function apply(
  id: string,
  incoming: DocumentOperation[],
): Promise<DocumentOperation[] | null> {
  const document = await open(id);
  if (!document) return null;

  const applied = document.crdt.apply(incoming);

  if (applied.length > 0) {
    clearTimeout(document.persistTimer);
    document.persistTimer = setTimeout(
      () => void persist(id, document),
      PERSIST_DELAY,
    );
  }

  return applied;
}

async function release(id: string) {
  const opened = openDocuments.get(id);
  openDocuments.delete(id);

  const saving = (async () => {
    const document = await opened;
    if (document?.persistTimer) await persist(id, document);
  })();

  releasing.set(id, saving);
  await saving.finally(() => {
    if (releasing.get(id) === saving) releasing.delete(id);
  });
}

async function forget(ids: string[]) {
  await Promise.all(
    ids.map(async (id) => {
      const opened = openDocuments.get(id);
      openDocuments.delete(id);

      clearTimeout((await opened)?.persistTimer);
    }),
  );
}

export default {
  hasAccess,
  findInFolder,
  findById,
  nameTaken,
  createDocument,
  createUpload,
  rename,
  move,
  remove,
  content,
  operations,
  apply,
  release,
  forget,
};

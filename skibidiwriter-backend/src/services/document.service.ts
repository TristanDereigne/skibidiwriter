import { db } from "@/libs/db";
import { documentTable } from "@/models/document.model";
import { eqOrNull } from "@/libs/sql";
import { and, eq } from "drizzle-orm";
import { TextCrdt, type DocumentOperation } from "skibidiwriter-shared";

const PERSIST_DELAY = 500;

interface OpenDocument {
  crdt: TextCrdt;
  persistTimer?: ReturnType<typeof setTimeout>;
}

const openDocuments = new Map<string, Promise<OpenDocument | null>>();
const releasing = new Map<string, Promise<void>>();

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

  const row = await db.query.documentTable.findFirst({
    where: { id },
  });
  if (!row) {
    openDocuments.delete(id);
    return null;
  }

  const crdt = new TextCrdt("server");
  crdt.apply(row.operations);

  return { crdt };
}

async function persist(id: string, document: OpenDocument) {
  clearTimeout(document.persistTimer);
  document.persistTimer = undefined;

  await db
    .update(documentTable)
    .set({ operations: document.crdt.toOperations() })
    .where(eq(documentTable.id, id));
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

const summarySelect = {
  id: documentTable.id,
  name: documentTable.name,
  folderId: documentTable.folderId,
  updatedAt: documentTable.updatedAt,
};

async function forget(ids: string[]) {
  for (const id of ids) {
    const opened = openDocuments.get(id);
    openDocuments.delete(id);

    clearTimeout((await opened)?.persistTimer);
  }
}

function accessibleTo(userId: string) {
  return eq(documentTable.ownerId, userId);
}

async function hasAccess(id: string, userId: string) {
  const [row] = await db
    .select({ id: documentTable.id })
    .from(documentTable)
    .where(and(eq(documentTable.id, id), accessibleTo(userId)));

  return !!row;
}

async function findInFolder(folderId: string | null, userId: string) {
  return await db
    .select(summarySelect)
    .from(documentTable)
    .where(
      and(eqOrNull(documentTable.folderId, folderId), accessibleTo(userId)),
    );
}

async function findById(id: string, userId: string) {
  const [row] = await db
    .select(summarySelect)
    .from(documentTable)
    .where(and(eq(documentTable.id, id), accessibleTo(userId)));

  return row;
}

async function create(
  name: string,
  folderId: string | null,
  userId: string,
  content?: string,
) {
  const crdt = new TextCrdt("server");
  const operations = content ? crdt.setText(content) : [];

  const [row] = await db
    .insert(documentTable)
    .values({ name, folderId, operations, ownerId: userId })
    .returning(summarySelect);

  return row!;
}

async function rename(id: string, name: string, userId: string) {
  const [row] = await db
    .update(documentTable)
    .set({ name })
    .where(and(eq(documentTable.id, id), accessibleTo(userId)))
    .returning(summarySelect);

  return row;
}

async function remove(id: string, userId: string) {
  const canAccess = await hasAccess(id, userId);
  if (!canAccess) return;

  const opened = openDocuments.get(id);
  openDocuments.delete(id);

  const document = await opened;
  clearTimeout(document?.persistTimer);

  const [row] = await db
    .delete(documentTable)
    .where(and(eq(documentTable.id, id), accessibleTo(userId)))
    .returning({ id: documentTable.id });

  return row;
}

export default {
  hasAccess,
  operations,
  apply,
  release,
  forget,
  findInFolder,
  findById,
  create,
  rename,
  remove,
};

import { db } from "@/libs/db";
import { documentTable } from "@/models";
import { eq } from "drizzle-orm";
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
  incoming: DocumentOperation[]
): Promise<DocumentOperation[] | null> {
  const document = await open(id);
  if (!document) return null;

  const applied = document.crdt.apply(incoming);

  if (applied.length > 0) {
    clearTimeout(document.persistTimer);
    document.persistTimer = setTimeout(
      () => void persist(id, document),
      PERSIST_DELAY
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

async function findAll() {
  return await db.query.documentTable.findMany();
}

async function create(name: string) {
  const [row] = await db.insert(documentTable).values({ name }).returning();

  return row!;
}

async function rename(id: string, name: string) {
  const [row] = await db
    .update(documentTable)
    .set({ name })
    .where(eq(documentTable.id, id))
    .returning();

  return row;
}

async function remove(id: string) {
  const opened = openDocuments.get(id);
  openDocuments.delete(id);

  const document = await opened;
  clearTimeout(document?.persistTimer);

  const [row] = await db
    .delete(documentTable)
    .where(eq(documentTable.id, id))
    .returning({ id: documentTable.id });

  return row;
}

export default {
  operations,
  apply,
  release,
  findAll,
  create,
  rename,
  remove,
};

export const explorerPath = (folderId: string | null) =>
  folderId ? `/${folderId}` : "/";

export const editPath = (documentId: string) => `/edit/${documentId}`;

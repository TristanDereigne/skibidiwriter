export const explorerPath = (folderId: string | null) =>
  folderId ? `/explorer/${folderId}` : "/explorer";

export const editPath = (documentId: string) => `/edit/${documentId}`;

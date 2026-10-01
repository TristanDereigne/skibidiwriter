export const explorerPath = (folderId: string | null) =>
  folderId ? `/${folderId}` : "/";

export const sharedPath = () => "/shared";

export const editPath = (documentId: string) => `/edit/${documentId}`;

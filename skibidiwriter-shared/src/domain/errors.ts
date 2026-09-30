export const ErrorCode = {
  Unauthorized: "auth/unauthorized",
  InvalidRequest: "request/invalid",
  FileNotFound: "file/not-found",
  FileTooLarge: "file/too-large",
  FileNameInvalid: "file/name-invalid",
  FolderNotFound: "folder/not-found",
  ParentFolderNotFound: "folder/parent-not-found",
  FolderMoveIntoItself: "folder/move-into-itself",
  NameAlreadyInUse: "name/already-in-use",
  DocumentNotFound: "document/not-found",
  SocketTextExpected: "socket/text-expected",
  SocketMalformedJson: "socket/malformed-json",
  SocketInvalidEvent: "socket/invalid-event",
} as const;
export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];

export interface ErrorDTO {
  code: ErrorCode;
}

export const ErrorCode = {
  Auth_Unauthorized: "auth/unauthorized",
  Request_Invalid: "request/invalid",
  File_NotFound: "file/not-found",
  File_TooLarge: "file/too-large",
  File_NameInvalid: "file/name-invalid",
  Folder_NotFound: "folder/not-found",
  Folder_ParentNotFound: "folder/parent-not-found",
  Folder_MoveIntoItself: "folder/move-into-itself",
  Name_AlreadyInUse: "name/already-in-use",
  Document_NotFound: "document/not-found",
  Socket_TextExpected: "socket/text-expected",
  Socket_MalformedJson: "socket/malformed-json",
  Socket_InvalidEvent: "socket/invalid-event",
} as const;
export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];

export interface ErrorDTO {
  code: ErrorCode;
}

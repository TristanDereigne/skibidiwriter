import { ErrorCode } from "skibidiwriter-shared";

const ERROR_MESSAGES: Record<ErrorCode, string> = {
  [ErrorCode.Auth_Unauthorized]: "Non autorisé",
  [ErrorCode.Request_Invalid]: "Requête invalide",
  [ErrorCode.File_NotFound]: "Fichier introuvable",
  [ErrorCode.File_TooLarge]: "Fichier trop volumineux",
  [ErrorCode.File_NameInvalid]: "Nom de fichier invalide",
  [ErrorCode.User_NotFound]: "Utilisateur introuvable",
  [ErrorCode.FileShare_SelfShare]:
    "Impossible de partager un fichier avec vous-même",
  [ErrorCode.Folder_NotFound]: "Dossier introuvable",
  [ErrorCode.Folder_ParentNotFound]: "Dossier parent introuvable",
  [ErrorCode.Folder_MoveIntoItself]:
    "Impossible de déplacer un dossier dans lui-même",
  [ErrorCode.Name_AlreadyInUse]: "Ce nom est déjà utilisé dans ce dossier",
  [ErrorCode.Document_NotFound]: "Document introuvable",
  [ErrorCode.Socket_TextExpected]: "Message texte attendu",
  [ErrorCode.Socket_MalformedJson]: "JSON malformé",
  [ErrorCode.Socket_InvalidEvent]: "Évènement invalide",
};

export function getErrorMessage(code: string | undefined, fallback: string) {
  if (code && code in ERROR_MESSAGES) return ERROR_MESSAGES[code as ErrorCode];

  return fallback;
}

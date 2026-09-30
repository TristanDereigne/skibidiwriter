import { ErrorCode } from "skibidiwriter-shared";

const ERROR_MESSAGES: Record<ErrorCode, string> = {
  [ErrorCode.Unauthorized]: "Non autorisé",
  [ErrorCode.InvalidRequest]: "Requête invalide",
  [ErrorCode.FileNotFound]: "Fichier introuvable",
  [ErrorCode.FileTooLarge]: "Fichier trop volumineux",
  [ErrorCode.FileNameInvalid]: "Nom de fichier invalide",
  [ErrorCode.FolderNotFound]: "Dossier introuvable",
  [ErrorCode.ParentFolderNotFound]: "Dossier parent introuvable",
  [ErrorCode.FolderMoveIntoItself]:
    "Impossible de déplacer un dossier dans lui-même",
  [ErrorCode.NameAlreadyInUse]: "Ce nom est déjà utilisé dans ce dossier",
  [ErrorCode.DocumentNotFound]: "Document introuvable",
  [ErrorCode.SocketTextExpected]: "Message texte attendu",
  [ErrorCode.SocketMalformedJson]: "JSON malformé",
  [ErrorCode.SocketInvalidEvent]: "Évènement invalide",
};

export function getErrorMessage(code: string | undefined, fallback: string) {
  if (code && code in ERROR_MESSAGES) return ERROR_MESSAGES[code as ErrorCode];

  return fallback;
}

import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
} from "@/components/ui/avatar";
import { useUserContext } from "@/context/UserContext.tsx";
import { useDocumentParticipants } from "../../../lib/document";
import { participantColor } from "../../../lib/participants";

interface Props {
  documentId: string;
}

const MAX_VISIBLE = 4;

export default function DocumentParticipants({ documentId }: Readonly<Props>) {
  const { user: me } = useUserContext();
  const users = useDocumentParticipants(documentId).filter(
    (user) => user.id !== me?.id,
  );

  if (users.length === 0) return null;

  const overflow = users.slice(MAX_VISIBLE);

  return (
    <AvatarGroup className="mr-2">
      {users.slice(0, MAX_VISIBLE).map((user) => (
        <Avatar key={user.id} size="sm" title={user.name}>
          <AvatarFallback
            className="text-white"
            style={{ backgroundColor: participantColor(user.id) }}
          >
            {user.name.slice(0, 1).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      ))}
      {overflow.length > 0 && (
        <AvatarGroupCount
          className="size-6 text-xs"
          title={overflow.map((user) => user.name).join(", ")}
        >
          +{overflow.length}
        </AvatarGroupCount>
      )}
    </AvatarGroup>
  );
}

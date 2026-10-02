import UserAvatar from "@/components/shared/user-avatar";
import { AvatarGroup, AvatarGroupCount } from "@/components/ui/avatar";
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
        <UserAvatar
          key={user.id}
          size="sm"
          title={user.name}
          name={user.name}
          fallbackClassName="text-white"
          fallbackStyle={{ backgroundColor: participantColor(user.id) }}
        />
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

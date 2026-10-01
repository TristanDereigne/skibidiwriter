import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUserContext } from "@/context/UserContext.tsx";

export const ProfileRounded = ({
  width,
  height,
  textSize,
}: {
  width: number;
  height: number;
  textSize: number;
}) => {
  const { user, username } = useUserContext();

  return (
    <Avatar style={{ width, height }} className="cursor-pointer">
      {user?.image && <AvatarImage src={user.image} alt={username ?? ""} />}
      <AvatarFallback
        style={{ fontSize: textSize }}
        className="bg-[#432DD7] text-white"
      >
        {username?.[0]?.toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
};

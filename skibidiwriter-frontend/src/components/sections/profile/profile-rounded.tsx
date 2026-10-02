import UserAvatar from "@/components/shared/user-avatar";
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
    <UserAvatar
      style={{ width, height }}
      className="cursor-pointer"
      name={username ?? ""}
      image={user?.image}
      fallbackStyle={{ fontSize: textSize }}
      fallbackClassName="bg-[#432DD7] text-white"
    />
  );
};

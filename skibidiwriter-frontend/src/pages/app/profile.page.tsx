import { useContext, useEffect } from "react";
import { HeaderContext } from "@/context/HeaderContext.tsx";
import { useUserContext } from "@/context/UserContext.tsx";
import { ProfileRounded } from "@/components/sections/profile/profile-rounded.tsx";
import { UserGroup } from "lucide-react";

export const ProfilePage = () => {
  const headerContext = useContext(HeaderContext);
  const userContext = useUserContext();

  const setHeaderChildren = headerContext?.setHeaderChildren;
  const setHeaderActions = headerContext?.setHeaderActions;

  useEffect(() => {
    if (userContext.username) {
      setHeaderChildren?.(
        <h2 className="font-semibold">{userContext.username}</h2>,
      );
    }
    return () => {
      setHeaderChildren?.(null);
      setHeaderActions?.(null);
    };
  }, [userContext.username, setHeaderChildren, setHeaderActions]);

  return (
    <div className={"flex items-center justify-center mt-8"}>
      <div className={"flex flex-col items-center justify-center gap-2"}>
        <ProfileRounded width={64} height={64} textSize={32} />
        <p className={"font-bold text-lg"}>{userContext.username}</p>
        <p className={""}>{userContext.email}</p>
        <div className={"flex flex-row gap-2"}>
          <UserGroup color={"#432DD7"} />
          <p>Membre depuis {userContext.userSince}</p>
        </div>
      </div>
    </div>
  );
};

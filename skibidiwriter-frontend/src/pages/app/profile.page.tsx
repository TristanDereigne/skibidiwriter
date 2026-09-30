import { useContext, useEffect } from "react";
import { HeaderContext } from "@/context/HeaderContext.tsx";
import { useUserContext } from "@/context/UserContext.tsx";
import { ProfileRounded } from "@/components/sections/profile/profile-rounded.tsx";
import { Pencil, UserGroup } from "lucide-react";
import {Separator} from "@/components/ui/separator.tsx";
import {Button} from "@/components/ui/button.tsx";
import {AuthContext} from "@/context/AuthContext.tsx";
import {useNavigate} from "react-router";


export const ProfilePage = () => {

  const navigate = useNavigate();

  const headerContext = useContext(HeaderContext);
  const authContext = useContext(AuthContext);
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

  const handleDisconnect = () => {
    console.log("Disconnecting...");
    authContext?.logout()
    navigate("/login")
  }

  return (
    <div className={"flex flex-col items-center justify-center mt-8 gap-12 flex-1 mb-8"}>
      <div className={"flex flex-col items-center justify-center gap-2"}>
        <ProfileRounded width={64} height={64} textSize={32} />
        <p className={"font-bold text-lg"}>{userContext.username}</p>
        <p className={""}>{userContext.email}</p>
        <div className={"flex flex-row gap-2"}>
          <UserGroup color={"#432DD7"} />
          <p>Membre depuis {userContext.userSince}</p>
        </div>
      </div>
      <div className={"w-10/12"}>
        <Separator />
      </div>
      <div className={"flex flex-col justify-between w-10/12 flex-1"}>
        <div className={"bg-gray-100 rounded-xl w-full h-64"}></div>
        <div className={"w-full flex justify-center items-center gap-2"}>
          <Button variant="outline" size="icon">
            <Pencil />
          </Button>
          <Button variant="destructive" className={"cursor-pointer"} onClick={()=> {
            handleDisconnect()
          }}>Se déconnecter</Button>
        </div>
      </div>
    </div>
  );
};
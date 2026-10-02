import { useContext, useEffect, useState, type SetStateAction } from "react";
import AppHeader from "@/layout/app-header.tsx";
import { useUserContext } from "@/context/UserContext.tsx";
import { ProfileRounded } from "@/components/sections/profile/profile-rounded.tsx";
import { Pencil, Save, UserGroup } from "lucide-react";
import { Separator } from "@/components/ui/separator.tsx";
import { Button } from "@/components/ui/button.tsx";
import { AuthContext } from "@/context/AuthContext.tsx";
import { useNavigate } from "react-router";
import { Input } from "@/components/ui/input.tsx";
import { z } from "zod";

import { ProfileSettingsContent } from "@/components/sections/profile/profile-settings-content.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { ProfileUserTable } from "@/components/sections/profile/profile-user-table.tsx";

export const ProfilePage = () => {
  const navigate = useNavigate();

  const authContext = useContext(AuthContext);
  const userContext = useUserContext();

  const [isEditing, setEditing] = useState(false);
  const [emailValue, setEmailValue] = useState("");
  const [isTimeout, setIsTimeout] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const [errors, setErrors] = useState<{
    email?: string;
  }>({});

  const emailSchema = z.object({
    email: z.email("Format d'email invalide"),
  });

  useEffect(() => {
    if (userContext.email) {
      setEmailValue(userContext.email);
    }
  }, [userContext.email]);

  useEffect(() => {
    if (authContext?.isAdmin) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [authContext?.isAdmin]);

  const handleDisconnect = () => {
    authContext?.logout();
    navigate("/login");
  };

  const onEdit = () => {
    if (userContext.email) setEmailValue(userContext.email);
    setEditing(true);
    setIsTimeout(false);
  };

  const onSave = () => {
    const result = emailSchema.safeParse({ email: emailValue });
    if (!result.success) {
      const fieldErrors = z.flattenError(result.error).fieldErrors;
      setErrors({
        email: fieldErrors.email?.[0],
      });
      setIsTimeout(true);
      setEditing(false);
      setTimeout(() => {
        setIsTimeout(false);
      }, 3000);
      return;
    }
    userContext.updateEmail(emailValue);
    setEditing(false);
  };

  const handleEmailChange = (e: {
    preventDefault: () => void;
    target: { value: SetStateAction<string> };
  }) => {
    e.preventDefault();
    setEmailValue(e.target.value);
  };

  return (
    <>
      <AppHeader>
        <h2 className="font-semibold">{userContext.username}</h2>
      </AppHeader>
      <div
        className={
          "flex flex-col items-center justify-center mt-8 gap-8 flex-1 mb-8"
        }
      >
        <div className={"flex flex-col items-center justify-center gap-2"}>
          <ProfileRounded width={64} height={64} textSize={32} />
          <p className={"font-bold text-lg"}>{userContext.username}</p>

          {isEditing ? (
            <Input value={emailValue} onChange={handleEmailChange} />
          ) : (
            <p className={""}>{userContext.email}</p>
          )}

          <div className={"flex flex-row gap-2"}>
            <UserGroup color={"#432DD7"} />
            <p>Membre depuis {userContext.userSince}</p>
          </div>

          <div className={"flex flex-row"}>
            {isAdmin ? (
              <Badge className="bg-purple-50 text-[#432DD7] dark:bg-[#432DD7] dark:text-purple-300">
                Admin
              </Badge>
            ) : (
              <Badge>Membre</Badge>
            )}
          </div>
        </div>
        <div className={"w-10/12"}>
          <Separator />
        </div>

        <div className={"w-10/12"}>
          <h2 className={"font-semibold mb-2"}>Membres</h2>
          <ProfileUserTable />
        </div>

        <div className={"flex flex-col w-10/12 flex-1"}>
          <h2 className={"font-semibold mb-2"}>Paramètres</h2>
          <div className={"flex flex-row items-center justify-between gap-4"}>
            <ProfileSettingsContent />
          </div>
        </div>
        <div
          className={
            "relative w-full flex justify-center items-center gap-2 mb-4"
          }
        >
          {isEditing ? (
            <Button variant="outline" size="icon" onClick={onSave}>
              <Save />
            </Button>
          ) : (
            <Button variant="outline" size="icon" onClick={onEdit}>
              <Pencil />
            </Button>
          )}
          {errors.email && isTimeout && (
            <p className={"absolute -top-13 mt-2 text-red-500"}>
              L'email est mal formaté
            </p>
          )}
          <Button
            variant="destructive"
            className={"cursor-pointer"}
            onClick={handleDisconnect}
          >
            Se déconnecter
          </Button>
        </div>
      </div>
    </>
  );
};

import { MoreHorizontalIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";

import type { UsersDto } from "skibidiwriter-shared";
import { useUserContext } from "@/context/UserContext.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { ProfileAddMembers } from "@/components/sections/profile/profile-add-members.tsx";
import { ProfileBanMembers } from "@/components/sections/profile/profile-ban-members.tsx";
import { ProfileUnbanMembers } from "@/components/sections/profile/profile-unban-members.tsx";

export const ProfileUserTable = () => {
  const userContext = useUserContext();

  const [userToBan, setUserToBan] = useState<{
    name: string;
    email: string;
  } | null>(null);
  const [userToDeban, setUserToDeban] = useState<{
    name: string;
    email: string;
  } | null>(null);

  const members = userContext.usersForAdmin ?? [];
  const me = members.find((member) => member.email === userContext.email);
  const users = me
    ? [me, ...members.filter((member) => member !== me)]
    : members;

  const handleUserDelete = async (email: string) => {
    await userContext.deleteUser(email);
  };

  return (
    <div className="max-h-72 overflow-y-auto border border-purple rounded-sm">
      <Table>
        <TableHeader className="sticky top-0 z-10 bg-background">
          <TableRow>
            <TableHead className={"text-[#432DD7]"}>Nom</TableHead>
            <TableHead className={"text-[#432DD7]"}>Email</TableHead>
            <TableHead className={"text-[#432DD7]"}>Rôle</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user: UsersDto) => (
            <TableRow key={user.email}>
              <TableCell className="font-medium">
                {user.name}{" "}
                {user.email == userContext.email && (
                  <Badge className="relative left-1 bg-purple-50 text-[#432DD7] dark:bg-[#432DD7] dark:text-purple-300">
                    Vous
                  </Badge>
                )}
                {user.banned && (
                  <Badge className="relative left-1 bg-purple-50 text-red-500 dark:bg-red-500 dark:text-white">
                    Bannis
                  </Badge>
                )}
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                {user.role === "admin" ? "Admin" : "Membre"}
              </TableCell>
              {user.email != userContext.email && (
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button variant="ghost" size="icon" className="size-8">
                          <MoreHorizontalIcon />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      }
                    />
                    <DropdownMenuContent align="end">
                      {user.banned ? (
                        <DropdownMenuItem
                          onClick={() =>
                            setUserToDeban({
                              name: user.name,
                              email: user.email,
                            })
                          }
                        >
                          Débannir
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem
                          onClick={() =>
                            setUserToBan({ name: user.name, email: user.email })
                          }
                        >
                          Bannir
                        </DropdownMenuItem>
                      )}

                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => handleUserDelete(user.email)}
                      >
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}></TableCell>
            <TableCell className="text-right">
              <ProfileAddMembers />
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
      <ProfileBanMembers
        username={userToBan?.name || null}
        email={userToBan?.email || ""}
        onClose={() => setUserToBan(null)}
      />
      <ProfileUnbanMembers
        username={userToDeban?.name || null}
        email={userToDeban?.email || ""}
        onClose={() => setUserToDeban(null)}
      />
    </div>
  );
};

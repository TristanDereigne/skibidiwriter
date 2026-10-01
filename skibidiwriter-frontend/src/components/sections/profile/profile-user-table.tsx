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
import { useEffect, useState } from "react";

import type { UsersDto } from "skibidiwriter-shared";
import { useUserContext } from "@/context/UserContext.tsx";
import {Badge} from "@/components/ui/badge.tsx";

export const ProfileUserTable = () => {
  const userContext = useUserContext();

  const [users, setUsers] = useState<UsersDto[]>([]);

  const addNewAccount = () => {

  }

  useEffect(() => {
    if (userContext.usersForAdmin) {
      let userMembers = userContext.usersForAdmin;
      if (userContext?.email) {
        const index = userMembers.findIndex(
          (member) => member.email === userContext.email,
        );
        console.log(index);
        if (index !== -1) {
          const [me] = userMembers.splice(index, 1);
          userMembers.unshift(me);
        }
      }
      setUsers(userContext.usersForAdmin);
    } else {
      setUsers([]);
    }
  }, [userContext.usersForAdmin]);

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
              <TableCell className="font-medium">{user.name} {(user.email==userContext.email)&&(<Badge className="relative left-1 bg-purple-50 text-[#432DD7] dark:bg-[#432DD7] dark:text-purple-300">
                Vous
              </Badge>)}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{(user.role === "admin") ? "Admin" : "Membre"}</TableCell>
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
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive">
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}></TableCell>
            <TableCell className="text-right">
              <Button variant="default" onclick={addNewAccount}>Ajouter un membre</Button>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

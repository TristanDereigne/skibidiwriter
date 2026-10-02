import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { Field } from "@/components/ui/field.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useState } from "react";
import { useUserContext } from "@/context/UserContext.tsx";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";

export const ProfileAddMembers = () => {
  const userContext = useUserContext();

  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [role, setRole] = useState<"user" | "admin" | undefined>("user");
  const [roleInput, setRoleInput] = useState("");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handlePasswordConfirmChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setPasswordConfirm(e.target.value);
  };

  const handleRoleChange = (role: string) => {
    setRoleInput(role);
    if (role === "Membre") {
      setRole("user");
    } else {
      setRole("admin");
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (role) {
      await userContext.createUser(email, password, name, role);
    }
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className="bg-[#432DD7] text-white rounded-lg p-2">
        Ajouter un membre
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <p className={"text-xl"}>Ajouter un membre</p>
          </DialogTitle>
          <DialogDescription>
            Créer le compte d'un nouveau membre
          </DialogDescription>
        </DialogHeader>
        <div className=" w-full flex justify-start ">
          <form
            onSubmit={handleAddMember}
            className={"flex flex-col items-end justify-between w-full gap-4"}
          >
            <Field>
              <p className={"text-sm"}>Email</p>
              <Input
                id="email"
                name="email"
                type="text"
                value={email}
                onChange={handleEmailChange}
                required
              />
            </Field>
            <Field>
              <p className={"text-sm"}>Nom</p>
              <Input
                id="nom"
                name="nom"
                type="text"
                value={name}
                onChange={handleNameChange}
                required
              />
            </Field>
            <Field>
              <p className={"text-sm"}>Mot de passe</p>
              <Input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={handlePasswordChange}
                required
              />
            </Field>
            <Field>
              <p className={"text-sm"}>Vérification du mot de passe</p>
              <Input
                id="passwordConfirm"
                name="passwordConfirm"
                type="password"
                value={passwordConfirm}
                onChange={handlePasswordConfirmChange}
                required
              />
            </Field>
            <Field>
              <p className={"text-sm"}>Rôle</p>
              <Select value={roleInput} onValueChange={handleRoleChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="membre">Membre</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <Button type="submit">Créer</Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

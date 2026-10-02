import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { Field } from "@/components/ui/field.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useState } from "react";
import { useUserContext } from "@/context/UserContext.tsx";

export const ProfileBanMembers = ({
  email,
  username,
  onClose,
}: {
  email: string;
  username: string | null;
  onClose: () => void;
}) => {
  const userContext = useUserContext();
  const [reason, setReason] = useState("");

  const handleReasonChange = (e) => {
    setReason(e.target.value);
  };

  const handleBanMember = async (e) => {
    e.preventDefault();
    await userContext.banUser(email, reason);
    setReason("");
    onClose();
  };

  return (
    <Dialog
      open={!!username}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <p className={"text-xl"}>Bannir {username}</p>
          </DialogTitle>
          <DialogDescription>
            Souhaitez-vous bannir cet utilisateur ? Vous pourrez toujours le
            débannir à tout moment...
          </DialogDescription>
        </DialogHeader>
        <div className=" w-full flex justify-start ">
          <form
            onSubmit={handleBanMember}
            className={"flex flex-col items-end justify-between w-full gap-4"}
          >
            <Field>
              <p className={"text-sm"}>Raison</p>
              <Input
                id="reason"
                name="reason"
                type="text"
                value={reason}
                onChange={handleReasonChange}
                required
              />
            </Field>
            <Button type="submit">Bannir</Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

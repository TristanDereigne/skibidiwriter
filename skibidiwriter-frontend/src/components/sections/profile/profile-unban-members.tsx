import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";

import { Button } from "@/components/ui/button.tsx";
import { useUserContext } from "@/context/UserContext.tsx";

export const ProfileUnbanMembers = ({
  email,
  username,
  onClose,
}: {
  email: string;
  username: string | null;
  onClose: () => void;
}) => {
  const userContext = useUserContext();

  const handleUnbanMember = async (e) => {
    e.preventDefault();
    await userContext.unbanUser(email);
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
            <p className={"text-xl"}>Débannir {username}</p>
          </DialogTitle>
          <DialogDescription>
            Souhaitez-vous débannir cet utilisateur ?
          </DialogDescription>
        </DialogHeader>
        <div className=" w-full flex justify-start ">
          <form
            onSubmit={handleUnbanMember}
            className={"flex flex-col items-end justify-between w-full gap-4"}
          >
            <Button type="submit">Débannir</Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

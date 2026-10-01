import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog.tsx";
import {Field} from "@/components/ui/field.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useState} from "react";

export const ProfileAddMembers = () => {

    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState("");

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    }

    const handleAddMember = (e) => {
        e.preventDefault();
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger>
                <Button>
                    Ajouter un membre
                </Button>
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
                                <p className={"text-sm"}>Nom</p>
                                <Input
                                    id="nom"
                                    name="nom"
                                    type="nom"
                                    value={name}
                                    onChange={handleNameChange}
                                    required
                                />
                            </Field>
                            <Button type="submit">Créer</Button>
                        </form>
                    </div>
            </DialogContent>
        </Dialog>
    )
}

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog.tsx";
import {Switch} from "@/components/ui/switch.tsx";
import {useEffect, useState} from "react";
import {Field} from "@/components/ui/field.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useAuthContext} from "@/context/AuthContext.tsx";

import QRCode from "react-qr-code";


export const Profile2faDialog = () => {

    const authContext = useAuthContext()

    const [is2FAToggle, setIs2FAToggle] = useState(false);
    const [password, setPassword] = useState("");
    const [qrCodeURI, setQrCodeURI] = useState("");
    const [OTP, setOTP] = useState("");
    const [is2FAEnabled, setIs2FAEnabled] = useState(false);


    useEffect(() => {

        // check if 2fa is enabled on user

        if(is2FAEnabled) {
            setIs2FAToggle(true);
        } else {
            setIs2FAToggle(false);
        }
    },[is2FAToggle])

    const toggle2FA = (checked: boolean) => {
        setIs2FAToggle(checked)
        if(is2FAToggle){
            //start 2fa enabling

        }
    }

    const handleChangePassword2FA = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    }

    const handleChangeOTP = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOTP(e.target.value);
    }

    const handle2FASubmit = async (e) => {
        e.preventDefault();
        const qrCodeUrl = await authContext.enable2FA(password)
        if(qrCodeUrl){
            setQrCodeURI(qrCodeUrl);
        }
    }

    const handle2FAVerif = async (e) => {
        e.preventDefault();
        const response = await authContext.verify2FA(OTP)
        if(response){
            setIs2FAEnabled(true)
            setIs2FAToggle(true)
        }
    }

    return (
        <Dialog>
            <DialogTrigger>
                <Switch id="switch-share-1"
                        checked={is2FAToggle}
                        onCheckedChange={toggle2FA}
                />
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        <p className={"text-xl"}>Authentification 2FA</p>
                    </DialogTitle>

                    <DialogDescription>
                        Activer l'authentification à double facteurs
                    </DialogDescription>
                </DialogHeader>
                    {
                        !qrCodeURI && !is2FAEnabled ?
                        (
                            <div className="h-20 w-full flex justify-start ">
                                <form onSubmit={handle2FASubmit} className={"flex flex-row items-end justify-between w-full gap-4"}>
                                    <Field>
                                        <p className={"text-sm"}>Mot de passe</p>
                                        <Input id="password"
                                               name="password"
                                               type="password"
                                               value={password}
                                               onChange={handleChangePassword2FA}
                                               required
                                        />
                                    </Field>
                                    <Button type="submit">Générer le QR Code</Button>
                                </form>
                            </div>

                        ) :
                        (
                            <div className="h-96 w-full flex flex-col justify-start ">
                                <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                                    <QRCode value={qrCodeURI || ""} />
                                    <p className={"italic"}>Scannez le QR Code avec votre app d'authentification</p>
                                </div>
                                <form onSubmit={handle2FAVerif} className={"flex flex-row items-end justify-between w-full gap-4"}>
                                    <Field>
                                        <p className={"text-sm mt-2"}>Code OTP</p>
                                        <Input id="otp"
                                               name="otp"
                                               type="otp"
                                               value={OTP}
                                               onChange={handleChangeOTP}
                                               required
                                        />
                                    </Field>
                                    <Button type="submit" className={"w-1/2"}>Vérifier</Button>
                                </form>
                            </div>
                        )
                    }
                {
                    is2FAEnabled &&
                    (
                        <div className={"flex flex-row items-center justify-between w-full gap-4"}>
                            <p>Désactiver la protection 2FA ?</p>
                            <Button variant="destructive">Désactiver</Button>
                        </div>
                    )
                }
            </DialogContent>
        </Dialog>
    )

}
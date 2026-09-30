import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { Switch } from "@/components/ui/switch.tsx";
import { useEffect, useState } from "react";
import { Field } from "@/components/ui/field.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useAuthContext } from "@/context/AuthContext.tsx";

import QRCode from "react-qr-code";

export const Profile2faDialog = () => {
  const authContext = useAuthContext();

  const [is2FAToggle, setIs2FAToggle] = useState(false);
  const [password, setPassword] = useState("");
  const [password2FA, setPassword2FA] = useState("");
  const [qrCodeURI, setQrCodeURI] = useState("");
  const [OTP, setOTP] = useState("");
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);

  useEffect(() => {
    if (authContext.is2FAEnabled) {
      setIs2FAEnabled(true);
      setIs2FAToggle(true);
    } else {
      setIs2FAEnabled(false);
      setIs2FAToggle(false);
    }
  }, [authContext.is2FAEnabled]);

  const toggle2FA = (checked: boolean) => {
    setIs2FAToggle(checked);
    if (authContext.is2FAEnabled) {
      setIs2FAToggle(true);
    } else {
      setIs2FAToggle(false);
    }
  };

  const handleChangePassword2FA = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleChangeOTP = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOTP(e.target.value);
  };

  const handleChangePassword2FADeactivate = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setPassword2FA(e.target.value);
  };

  const handle2FASubmit = async (e) => {
    e.preventDefault();
    const qrCodeUrl = await authContext.enable2FA(password);
    setPassword("");
    if (qrCodeUrl) {
      setQrCodeURI(qrCodeUrl);
    }
  };

  const handle2FAVerif = async (e) => {
    e.preventDefault();
    const isVerifSucceed = await authContext.verify2FA(OTP);
    if (isVerifSucceed) {
      setQrCodeURI("");
    }
    setOTP("");
  };

  const handle2FADeactivateSubmit = async (e) => {
    e.preventDefault();
    console.log("test");
    await authContext.deactivate2FA(password2FA);
    setPassword2FA("");
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Switch
          id="switch-share-1"
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
            {is2FAEnabled ? (
              <span className="text-[#432DD7] font-medium">
                Authentification à double facteurs activée
              </span>
            ) : (
              "Activer l'authentification à double facteurs"
            )}
          </DialogDescription>
        </DialogHeader>
        {!qrCodeURI && !is2FAEnabled && (
          <div className="h-20 w-full flex justify-start ">
            <form
              onSubmit={handle2FASubmit}
              className={"flex flex-row items-end justify-between w-full gap-4"}
            >
              <Field>
                <p className={"text-sm"}>Mot de passe</p>
                <Input
                  id="password"
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
        )}
        {qrCodeURI && !is2FAEnabled && (
          <div className="h-96 w-full flex flex-col justify-start ">
            <div className="w-full h-full flex flex-col items-center justify-center gap-4">
              <QRCode value={qrCodeURI || ""} />
              <p className={"italic"}>
                Scannez le QR Code avec votre app d'authentification
              </p>
            </div>
            <form
              onSubmit={handle2FAVerif}
              className={"flex flex-row items-end justify-between w-full gap-4"}
            >
              <Field>
                <p className={"text-sm mt-2"}>Code OTP</p>
                <Input
                  id="otp"
                  name="otp"
                  type="otp"
                  value={OTP}
                  onChange={handleChangeOTP}
                  required
                />
              </Field>
              <Button type="submit" className={"w-1/2"}>
                Vérifier
              </Button>
            </form>
          </div>
        )}
        {is2FAEnabled && (
          <form
            onSubmit={handle2FADeactivateSubmit}
            className={"flex flex-row items-end justify-between w-full gap-4"}
          >
            <Field>
              <p className={"text-sm"}>Mot de passe</p>
              <Input
                id="password2FA"
                name="password2FA"
                type="password"
                value={password2FA}
                onChange={handleChangePassword2FADeactivate}
                required
              />
            </Field>
            <Button type="submit" variant="destructive">
              Désactiver
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

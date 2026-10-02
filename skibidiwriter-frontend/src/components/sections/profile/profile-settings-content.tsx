import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field.tsx";
import { Profile2faDialog } from "@/components/sections/profile/profile-2fa-dialog.tsx";

export const ProfileSettingsContent = () => {
  return (
    <div className={"w-full grid grid-cols-1 lg:grid-cols-2 gap-4"}>
      <FieldLabel
        htmlFor="switch-share"
        className={
          "h-28 sm:h-28 lg:h-28 flex flex-col justify-center items-center"
        }
      >
        <Field orientation="horizontal" className={"w-full h-full"}>
          <FieldContent className={"min-w-0"}>
            <FieldTitle>Authentification 2FA</FieldTitle>
            <FieldDescription>
              Activer l'authentification double facteurs pour une meilleur
              protection de votre compte
            </FieldDescription>
          </FieldContent>
          <Profile2faDialog />
        </Field>
      </FieldLabel>
    </div>
  );
};

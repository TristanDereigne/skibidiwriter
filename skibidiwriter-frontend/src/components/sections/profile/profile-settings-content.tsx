import {Field, FieldContent, FieldDescription, FieldLabel, FieldTitle} from "@/components/ui/field.tsx";
import {Switch} from "@/components/ui/switch.tsx";
import {Profile2faDialog} from "@/components/sections/profile/profile-2fa-dialog.tsx";

export const ProfileSettingsContent = () => {

    return (
        <>
        <div className={"w-1/2 flex flex-col gap-4"}>
            <FieldLabel htmlFor="switch-share" className={"min-h-24 flex flex-col justify-center items-center"}>
                <Field orientation="horizontal">
                    <FieldContent>
                        <FieldTitle>Authentification 2FA</FieldTitle>
                        <FieldDescription>
                            Activer l'authentification double facteurs pour une meilleur protection de votre compte
                        </FieldDescription>
                    </FieldContent>
                   <Profile2faDialog />
                </Field>
            </FieldLabel>
            <FieldLabel htmlFor="switch-share" className={"min-h-24 flex flex-col justify-center items-center"}>
                <Field orientation="horizontal">
                    <FieldContent>
                        <FieldTitle>Share across devices</FieldTitle>
                        <FieldDescription>
                            Focus is shared across devices, and turns off when you leave the
                            app.
                        </FieldDescription>
                    </FieldContent>
                    <Switch id="switch-share-2" disabled />
                </Field>
            </FieldLabel>
        </div>

        <div className={"w-1/2 flex flex-col gap-4"}>
            <FieldLabel htmlFor="switch-share" className={"min-h-24 flex flex-col justify-center items-center"}>
                <Field orientation="horizontal">
                    <FieldContent>
                        <FieldTitle>Share across devices</FieldTitle>
                        <FieldDescription>
                            Focus is shared across devices, and turns off when you leave the
                            app.
                        </FieldDescription>
                    </FieldContent>
                    <Switch id="switch-share-3" disabled />
                </Field>
            </FieldLabel>
            <FieldLabel htmlFor="switch-share" className={"min-h-24 flex flex-col justify-center items-center"}>
                <Field orientation="horizontal">
                    <FieldContent>
                        <FieldTitle>Share across devices</FieldTitle>
                        <FieldDescription>
                            Focus is shared across devices, and turns off when you leave the
                            app.
                        </FieldDescription>
                    </FieldContent>
                    <Switch id="switch-share-4" disabled />
                </Field>
            </FieldLabel>
        </div>
        </>
    )
}
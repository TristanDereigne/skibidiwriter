import { useContext, useEffect } from "react";
import { HeaderContext } from "@/context/HeaderContext.tsx";

export const ProfilePage = () => {
    const headerContext = useContext(HeaderContext);
    const setHeaderChildren = headerContext?.setHeaderChildren;
    const setHeaderActions = headerContext?.setHeaderActions;

    useEffect(() => {
        setHeaderChildren?.(
            <h2 className="text-xl font-bold">My profile</h2>
        );

        return () => {
            setHeaderChildren?.(null);
            setHeaderActions?.(null);
        };
    }, [setHeaderChildren, setHeaderActions]);

    return (
        <div>
            <h2 className={"text-3xl text-red-500"}>Profile</h2>
        </div>
    );
};
import { useContext, useEffect } from "react";
import { HeaderContext } from "@/context/HeaderContext.tsx";

export const ProfilePage = () => {
    const headerContext = useContext(HeaderContext);

    useEffect(() => {
        headerContext?.setHeaderChildren(
            <h2 className="text-xl font-bold">My profile</h2>
        );

        return () => {
            headerContext?.setHeaderChildren(null);
            headerContext?.setHeaderActions(null);
        };
    }, [headerContext]);

    return (
        <div>
            <h2 className={"text-3xl text-red-500"}>Profile</h2>
        </div>
    );
};
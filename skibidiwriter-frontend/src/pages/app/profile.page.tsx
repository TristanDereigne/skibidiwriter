import { useContext, useEffect } from "react";
import { HeaderContext } from "@/context/HeaderContext.tsx";
import { useUserContext } from "@/context/UserContext.tsx";

export const ProfilePage = () => {
  const headerContext = useContext(HeaderContext);
  const userContext = useUserContext();

  const setHeaderChildren = headerContext?.setHeaderChildren;
  const setHeaderActions = headerContext?.setHeaderActions;

  useEffect(() => {
    if (userContext.username) {
      setHeaderChildren?.(
        <h2 className="font-semibold">{userContext.username}</h2>,
      );
    }
    return () => {
      setHeaderChildren?.(null);
      setHeaderActions?.(null);
    };
  }, [userContext.username, setHeaderChildren, setHeaderActions]);

  return (
    <div className={"w-full mx-16 flex flex-col justify-center"}>
      <h2 className={"text-3xl text-red-500"}>Profile</h2>
    </div>
  );
};

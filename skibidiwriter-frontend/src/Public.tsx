import Providers from "./components/providers";
import { Outlet, useNavigate } from "react-router";
import { useContext, useEffect } from "react";
import { AuthContext } from "@/context/AuthContext.tsx";
import { Toaster } from "@/components/ui/toast.tsx";

export default function Public() {
    const navigate = useNavigate();
    const authContext = useContext(AuthContext);

    useEffect(()=>{
        if(authContext?.isUserLoggedin()) {
            navigate("/explorer");
        }
    },[authContext?.isLoggedIn])

    return (
        <Providers>
            <Outlet />
            <Toaster />
        </Providers>
    );
}

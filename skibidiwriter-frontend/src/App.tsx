import {Outlet, useNavigate} from "react-router";
import Providers from "./components/providers";
import { Toaster } from "./components/ui/toast";
import {useContext, useEffect} from "react";
import {AuthContext} from "@/context/AuthContext.tsx";
import {HeaderContext} from "@/context/HeaderContext.tsx";
import AppHeader from "@/components/layout/app-header.tsx";

export default function App() {

    const navigate = useNavigate();
    const authContext = useContext(AuthContext);
    const headerContext = useContext(HeaderContext);

    useEffect(()=>{
        if(!authContext?.isUserLoggedin()) {
            navigate("/login");
        }
    },[authContext?.isLoggedIn])

    return (
        <Providers>
            <AppHeader actions={headerContext?.headerActions}>
                {headerContext?.headerChildren}
            </AppHeader>
            <Outlet />
            <Toaster />
        </Providers>
    );
}

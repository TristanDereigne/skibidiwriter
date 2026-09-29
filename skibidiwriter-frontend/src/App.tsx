import {Outlet, useNavigate} from "react-router";
import Providers from "./components/providers";
import { Toaster } from "./components/ui/toast";
import {useContext, useEffect} from "react";
import {AuthContext} from "@/context/AuthContext.tsx";

export default function App() {

    const navigate = useNavigate();
    const authContext = useContext(AuthContext);

    if(authContext?.isUserLoggedin()) {
        return (
            <Providers>
                <Outlet />
                <Toaster />
            </Providers>
        );

    }

    useEffect(()=>{
        if(!authContext?.isUserLoggedin()) {
            navigate("/login");
        }
    },[])


}

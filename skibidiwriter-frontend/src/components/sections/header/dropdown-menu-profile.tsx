import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {useNavigate} from "react-router";
import {useUserContext} from "@/context/UserContext.tsx";
import {useEffect, useState} from "react";

export function DropdownMenuProfile() {

    const navigate = useNavigate()
    const user = useUserContext()

    const [userFirstLetter, setUserFirstLetter] = useState<string | null>("")

    useEffect(()=>{

        if(user.username) {
            let userFirstLetter = user.username[0].toUpperCase()
            setUserFirstLetter(userFirstLetter)
        }

    }, [user.username])


    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                render={
                    <button className={"cursor-pointer w-8 h-8 rounded-full flex justify-center items-center bg-[#432DD7]"}>
                        <p className={"text-white"}>{userFirstLetter}</p>
                    </button>
                }
            />
            <DropdownMenuContent>
                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={()=>navigate("/")}>Explorer</DropdownMenuItem>
                    <DropdownMenuItem onClick={()=>navigate("/profile")}>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>GitHub</DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
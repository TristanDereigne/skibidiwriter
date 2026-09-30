import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {useNavigate} from "react-router";
import {ProfileRounded} from "@/components/sections/profile/profile-rounded.tsx";

export function DropdownMenuProfile() {

    const navigate = useNavigate()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                render={
                    <ProfileRounded width={32} height={32} textSize={16}/>
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
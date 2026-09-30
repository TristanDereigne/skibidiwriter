import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function DropdownMenuProfile() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                render={
                    <div className={"cursor-pointer w-8 h-8 rounded-full flex justify-center items-center bg-[#432DD7]"}>
                        <p className={"text-white"}>H</p>
                    </div>
                }
            />
            <DropdownMenuContent>
                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={()=>{}}>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>GitHub</DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
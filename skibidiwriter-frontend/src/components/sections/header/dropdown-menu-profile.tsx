import { ProfileRounded } from "@/components/sections/profile/profile-rounded.tsx";
import { useTheme } from "@/components/theme-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthContext } from "@/context/AuthContext.tsx";
import { LogOutIcon, MoonIcon, SunIcon } from "lucide-react";
import { useNavigate } from "react-router";

function useIsDarkTheme() {
  const { theme } = useTheme();

  return (
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  );
}

export function DropdownMenuProfile() {
  const navigate = useNavigate();
  const { logout } = useAuthContext();
  const { setTheme } = useTheme();
  const isDark = useIsDarkTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <ProfileRounded width={32} height={32} textSize={16} />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => navigate("/")}>
            Explorateur
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/profile")}>
            Profil
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme(isDark ? "light" : "dark")}>
            {isDark ? <SunIcon /> : <MoonIcon />}
            {isDark ? "Mode clair" : "Mode sombre"}
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={() => logout()}>
          <LogOutIcon />
          Déconnexion
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

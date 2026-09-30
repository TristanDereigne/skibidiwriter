import { Separator } from "@/components/ui/separator.tsx";


import { ModeToggle } from "../components/mode-toggle.tsx";
import {DropdownMenuProfile} from "@/components/sections/header/dropdown-menu-profile.tsx";

interface Props {
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export default function AppHeader({ children, actions }: Readonly<Props>) {
  return (
      <>
          <header className="mx-10 flex h-16 shrink-0 items-center justify-between px-6">
              {children}
              {actions && <div className="ml-auto flex items-center">{actions}</div>}
              <div className={"flex flex-row gap-4"}>
                  <ModeToggle />
                  <DropdownMenuProfile />
              </div>
          </header>
          <Separator />
      </>
  );
}



import { Separator } from "@/components/ui/separator.tsx";

import { DropdownMenuProfile } from "@/components/sections/header/dropdown-menu-profile.tsx";

interface Props {
  children?: React.ReactNode;
  actions?: React.ReactNode;
}

export default function AppHeader({ children, actions }: Readonly<Props>) {
  return (
    <>
      <header className="flex h-16 shrink-0 items-center justify-between gap-3 px-6">
        <div className="flex min-w-0 items-center gap-5">{children}</div>
        <div className="flex shrink-0 items-center gap-2">
          {actions}
          <DropdownMenuProfile />
        </div>
      </header>
      <Separator />
    </>
  );
}

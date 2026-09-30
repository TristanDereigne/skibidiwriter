import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "../mode-toggle";

interface Props {
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export default function AppHeader({ children, actions }: Readonly<Props>) {
  return (
      <>
          <header className="mx-10 flex h-16 shrink-0 items-center justify-between gap-2 px-6 ">
            {children}
            {actions && <div className="ml-auto flex items-center">{actions}</div>}
            <ModeToggle />
              <div className={"cursor-pointer w-8 h-8 rounded-full flex justify-center items-center bg-[#432DD7]"}>
                  <p className={"text-white"}>H</p>
              </div>
          </header>
          <Separator />
      </>
  );
}

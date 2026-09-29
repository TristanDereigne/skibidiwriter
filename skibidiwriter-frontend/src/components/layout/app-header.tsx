import { Separator } from "@/components/ui/separator";

interface Props {
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export default function AppHeader({ children, actions }: Readonly<Props>) {
  return (
    <>
      <header className="flex h-12 shrink-0 items-center gap-2 px-6">
        {children}
        {actions && <div className="ml-auto flex items-center">{actions}</div>}
      </header>
      <Separator />
    </>
  );
}

import SectionTabs from "@/components/sections/header/section-tabs";
import AppHeader from "@/layout/app-header";
import SharedContent from "./content/shared-content";

export default function Shared() {
  return (
    <>
      <AppHeader>
        <SectionTabs />
      </AppHeader>
      <main className="min-h-0 w-full flex-1 overflow-auto">
        <SharedContent />
      </main>
    </>
  );
}

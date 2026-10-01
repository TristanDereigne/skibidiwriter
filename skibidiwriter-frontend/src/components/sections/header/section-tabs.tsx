import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { explorerPath, sharedPath } from "@/lib/paths";
import { useMatch, useNavigate } from "react-router";

export default function SectionTabs() {
  const navigate = useNavigate();
  const isShared = useMatch(sharedPath()) !== null;

  return (
    <Tabs
      value={isShared ? "shared" : "explorer"}
      onValueChange={(next) =>
        navigate(next === "shared" ? sharedPath() : explorerPath(null))
      }
    >
      <TabsList>
        <TabsTrigger value="explorer">Mon drive</TabsTrigger>
        <TabsTrigger value="shared">Partagés avec moi</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}

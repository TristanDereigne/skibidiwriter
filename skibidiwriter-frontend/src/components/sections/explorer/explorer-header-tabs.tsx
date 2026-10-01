import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ExplorerHeaderTab = "self" | "shared";

const EXPLORER_HEADER_TAB_SPECS: {
  [Value in ExplorerHeaderTab]: { value: Value; label: string };
} = {
  self: { value: "self", label: "Mon drive" },
  shared: { value: "shared", label: "Partagés avec moi" },
};

export default function ExplorerHeaderTabs() {
  return (
    <Tabs>
      <TabsList>
        {Object.values(EXPLORER_HEADER_TAB_SPECS).map((spec) => (
          <TabsTrigger key={spec.value} value={spec.value}>
            {spec.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}

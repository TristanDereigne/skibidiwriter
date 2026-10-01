import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { parseExplorerHeaderTab, type ExplorerHeaderTab } from "./explorer-tab";

const EXPLORER_HEADER_TAB_SPECS: {
  [Value in ExplorerHeaderTab]: { value: Value; label: string };
} = {
  self: { value: "self", label: "Mon drive" },
  shared: { value: "shared", label: "Partagés avec moi" },
};

interface Props {
  value: ExplorerHeaderTab;
  onValueChange: (value: ExplorerHeaderTab) => void;
}

export default function ExplorerHeaderTabs({
  value,
  onValueChange,
}: Readonly<Props>) {
  return (
    <Tabs
      value={value}
      onValueChange={(next) => onValueChange(parseExplorerHeaderTab(next))}
    >
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

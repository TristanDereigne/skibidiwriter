export type ExplorerHeaderTab = "self" | "shared";

export function parseExplorerHeaderTab(
  value: string | null,
): ExplorerHeaderTab {
  return value === "shared" ? "shared" : "self";
}

const PARTICIPANT_COLORS = [
  "#dc2626",
  "#ea580c",
  "#ca8a04",
  "#16a34a",
  "#0d9488",
  "#0284c7",
  "#7c3aed",
  "#c026d3",
  "#db2777",
];

export function participantColor(userId: string) {
  let hash = 0;
  for (const char of userId) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;

  return PARTICIPANT_COLORS[hash % PARTICIPANT_COLORS.length]!;
}

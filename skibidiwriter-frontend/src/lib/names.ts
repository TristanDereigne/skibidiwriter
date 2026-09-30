export function uniqueName(base: string, taken: readonly string[]) {
  const used = new Set(taken.map((name) => name.toLowerCase()));

  let name = base;
  for (let n = 2; used.has(name.toLowerCase()); n++) name = `${base} (${n})`;

  return name;
}

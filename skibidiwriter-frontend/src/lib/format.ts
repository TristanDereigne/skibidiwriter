export const dateFormat = new Intl.DateTimeFormat(undefined, {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export const dateTimeFormat = new Intl.DateTimeFormat(undefined, {
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export function formatMonthYear(date: Date) {
  const text = date.toLocaleString("fr-FR", { month: "long", year: "numeric" });

  return text.charAt(0).toUpperCase() + text.slice(1);
}

const BYTE_UNITS = ["o", "Ko", "Mo", "Go"];

export function formatBytes(bytes: number) {
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < BYTE_UNITS.length - 1) {
    value /= 1024;
    unit++;
  }

  const digits = unit === 0 || value >= 10 ? 0 : 1;

  return `${value.toFixed(digits)} ${BYTE_UNITS[unit]}`;
}

import { MoonIcon, SunIcon } from "lucide-react";
import { useId, useState } from "react";
import { useTheme } from "./theme-provider";
import { Switch } from "./ui/switch";

export function ModeToggle() {
  const id = useId();

  const { theme, setTheme } = useTheme();
  const [checked, setChecked] = useState(theme === "dark");

  const toggleSwitch = () =>
    setChecked((prev) => {
      const newChecked = !prev;
      setTheme(newChecked ? "dark" : "light");

      return newChecked;
    });

  return (
    <div
      className="group inline-flex items-center gap-2"
      data-state={checked ? "checked" : "unchecked"}
    >
      <label
        id={`${id}-light`}
        className="group-data-checked:text-muted-foreground/70 text-left text-sm font-medium"
        aria-controls={id}
      >
        <SunIcon className="size-4" aria-hidden="true" />
      </label>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={toggleSwitch}
        aria-labelledby={`${id}-dark ${id}-light`}
        aria-label="Toggle between dark and light mode"
      />
      <span
        id={`${id}-dark`}
        className="group-data-unchecked:text-muted-foreground/70 text-right text-sm font-medium"
        aria-controls={id}
      >
        <MoonIcon className="size-4" aria-hidden="true" />
      </span>
    </div>
  );
}

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { ComponentProps, CSSProperties, ReactNode } from "react";

interface Props extends Omit<ComponentProps<typeof Avatar>, "children"> {
  name: string;
  image?: string | null;
  fallbackClassName?: string;
  fallbackStyle?: CSSProperties;
  children?: ReactNode;
}

export default function UserAvatar({
  name,
  image,
  fallbackClassName,
  fallbackStyle,
  children,
  ...props
}: Readonly<Props>) {
  return (
    <Avatar {...props}>
      {image && <AvatarImage src={image} alt={name} />}
      <AvatarFallback className={fallbackClassName} style={fallbackStyle}>
        {children ?? name.slice(0, 1).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}

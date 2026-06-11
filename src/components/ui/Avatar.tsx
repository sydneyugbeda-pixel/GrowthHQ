import { cn, getInitials } from "@/lib/utils";

interface AvatarProps {
  src?: string | null;
  name?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  ring?: boolean;
}

const sizes = {
  xs: "w-6 h-6 text-xs",
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
  xl: "w-16 h-16 text-lg",
};

export function Avatar({ src, name, size = "md", className, ring }: AvatarProps) {
  return (
    <div
      className={cn(
        "relative rounded-full overflow-hidden shrink-0 bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center font-semibold text-white",
        sizes[size],
        ring && "ring-2 ring-white dark:ring-slate-900",
        className
      )}
    >
      {src ? (
        <img src={src} alt={name || "avatar"} className="w-full h-full object-cover" />
      ) : (
        <span>{name ? getInitials(name) : "?"}</span>
      )}
    </div>
  );
}

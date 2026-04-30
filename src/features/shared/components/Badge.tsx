import { cn } from "@/lib/utils";

export default function Badge({
  children,
  styles,
}: {
  children: React.ReactNode;
  styles: string;
}) {
  return (
    <div
      className={cn(
        "rounded-full px-2 text-sm font-semibold whitespace-nowrap",
        styles,
      )}
    >
      {children}
    </div>
  );
}

import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type SpinnerProps = {
  size?: number;
  className?: string;
};

export default function Spinner({ size = 35, className }: SpinnerProps) {
  return (
    <LoaderCircle
      size={size}
      className={cn("animate-spin text-slate-500", className)}
    />
  );
}

import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      data-slot="input"
      type={type}
      className={cn(
        "w-full rounded-md border border-zinc-300 bg-white px-4 py-2 text-slate-700 transition-colors duration-300 placeholder:text-slate-500 focus:ring focus:ring-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export { Input };

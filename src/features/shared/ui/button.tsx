import Link from "next/link";
import * as React from "react";
import { Slot } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-1 rounded-md text-xs transition-colors duration-300 disabled:cursor-not-allowed disabled:border-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-sky-500 px-4 py-2 font-medium text-sky-50 hover:bg-sky-600",
        secondary:
          "border px-1.5 py-1 font-semibold text-gray-300 active:bg-gray-200 sm:p-1.5",
        outline:
          "border border-slate-200 bg-white px-4 py-2 font-medium text-slate-700 hover:bg-slate-50",
        filter: "p-1 !text-base",
        danger: "bg-red-500 px-4 py-2 font-medium text-red-50 hover:bg-red-600",
      },
      size: {
        default: "",
        "icon-sm": "size-8 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

type ButtonProps = Omit<React.ComponentProps<"button">, "type"> &
  VariantProps<typeof buttonVariants> & {
    buttonType?: "button" | "submit" | "reset";
    selected?: string;
    configStyles?: string;
    link?: string;
    asChild?: boolean;
  };

function Button({
  children,
  className,
  disabled,
  buttonType,
  variant = "primary",
  size = "default",
  selected,
  configStyles,
  link,
  asChild = false,
  ...props
}: ButtonProps) {
  const isSelected = typeof children === "string" && selected === children;
  const buttonClassName = cn(
    buttonVariants({ variant, size }),
    variant === "filter" &&
      (isSelected ? "font-medium text-zinc-200" : "text-zinc-400"),
    configStyles,
    className,
  );

  if (link) {
    return (
      <Link href={link} className={buttonClassName}>
        {children}
      </Link>
    );
  }

  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      type={buttonType}
      className={buttonClassName}
      disabled={disabled || isSelected}
      {...props}
    >
      {children}
    </Comp>
  );
}

export { Button, buttonVariants };

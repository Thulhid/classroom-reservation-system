import Link from "next/link";

type ButtonProps = {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  buttonType?: "button" | "submit" | "reset";
  variant: "primary" | "secondary" | "filter";

  selected?: string;
  configStyles?: string;
  link?: string;
};

function Button({
  children,
  disabled,
  onClick,
  buttonType,
  variant,
  selected,
  configStyles,
  link,
}: ButtonProps) {
  const base =
    "flex cursor-pointer items-center gap-1 rounded-md text-xs transition-colors duration-300 disabled:cursor-not-allowed disabled:border-none";
  const styles = {
    primary: base + " rounded-md bg-sky-500 px-4 py-2 font-medium text-sky-50",
    secondary:
      base +
      " border text-gray-300 font-semibold py-1 px-1.5 sm:p-1.5 active:bg-gray-200",
    filter:
      base +
      `  p-1 !text-base  ${
        selected === children ? " font-medium text-zinc-200" : " text-zinc-400"
      }`,
  };

  //border border-red-600
  return (
    <>
      {!link ? (
        <button
          type={buttonType}
          className={`${styles[variant]} ${configStyles}`}
          onClick={onClick}
          disabled={disabled || selected === children}
        >
          {children}
        </button>
      ) : (
        <Link href={link} className={`${styles[variant]} ${configStyles}`}>
          {children}
        </Link>
      )}
    </>
  );
}

export default Button;

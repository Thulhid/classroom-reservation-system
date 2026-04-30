export default function Badge({
  children,
  styles,
}: {
  children: React.ReactNode;
  styles: string;
}) {
  return (
    <div className={`text-sm px-2 font-semibold rounded-full ${styles}`}>
      {children}
    </div>
  );
}

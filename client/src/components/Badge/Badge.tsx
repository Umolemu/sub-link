export const Badge = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <span
    className={`inline-flex px-2 py-1 text-xs font-semibold rounded ${className}`}
  >
    {children}
  </span>
);

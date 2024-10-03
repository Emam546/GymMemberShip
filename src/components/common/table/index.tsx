import classNames from "classnames";

export function TH({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  return (
    <th className={classNames("border-bottom-0", className)}>
      <h6 className="mb-0 fw-semibold">{children}</h6>
    </th>
  );
}
export function E<T extends string[]>({
  val,
  heads,
  children,
}: {
  val: T[0];
  heads: T;
  children: React.ReactNode;
}) {
  if (!heads.includes(val)) return null;
  return <>{children}</>;
}

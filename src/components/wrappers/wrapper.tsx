import { useAppSelector } from "@src/store";
export const AllowableTypes: DataBase.Roles[] = ["admin", "creator"];

export function IsOwnerComp({
  teacherId,
  children,
}: {
  children: React.ReactNode;
  teacherId: string;
}) {
  const user = useAppSelector((state) => state.auth.user);
  if (teacherId != user?.id) return null;

  return <>{children}</>;
}
export function IsOwnerOrAdminComp({
  teacherId,
  children,
}: {
  children: React.ReactNode;
  teacherId: string;
}) {
  const user = useAppSelector((state) => state.auth.user);
  if (teacherId != user?.id && user?.type != "admin") return null;

  return <>{children}</>;
}
export function NotIsOwnerComp({
  teacherId,
  children,
}: {
  children: React.ReactNode;
  teacherId: string;
}) {
  const user = useAppSelector((state) => state.auth.user);
  if (teacherId == user?.id) return null;

  return <>{children}</>;
}
export function IsAdminComp({ children }: { children: React.ReactNode }) {
  const user = useAppSelector((state) => state.auth.user);
  if (user?.type != "admin") return null;
  return <>{children}</>;
}
export function IsCreatorComp({
  children,
  user,
}: {
  children: React.ReactNode;
  user?: DataBase["Teacher"];
}) {
  const DUser = useAppSelector((state) => {
    if (!user) return state.auth.user;
    return user;
  });
  if (DUser?.type != "creator" && DUser?.type != "admin") return null;
  return <>{children}</>;
}

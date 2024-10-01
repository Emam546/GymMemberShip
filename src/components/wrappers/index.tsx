import { useAuth } from "../UserProvider";

// export function IsOwnerComp({
//   teacherId,
//   children,
// }: {
//   children: React.ReactNode;
//   teacherId: string;
// }) {
//   const user = useAppSelector((state) => state.auth.user);
//   if (teacherId != user?.id) return null;

//   return <>{children}</>;
// }
// export function IsOwnerOrAdminComp({
//   teacherId,
//   children,
// }: {
//   children: React.ReactNode;
//   teacherId: string;
// }) {
//   const user = useAppSelector((state) => state.auth.user);
//   if (teacherId != user?.id && user?.type != "admin") return null;

//   return <>{children}</>;
// }
// export function NotIsOwnerComp({
//   teacherId,
//   children,
// }: {
//   children: React.ReactNode;
//   teacherId: string;
// }) {
//   const user = useAppSelector((state) => state.auth.user);
//   if (teacherId == user?.id) return null;

//   return <>{children}</>;
// }
export function IsAdminComp({ children }: { children: React.ReactNode }) {
  const user = useAuth();
  if (user?.type != "admin") return null;
  return <>{children}</>;
}
export function IsAssistantComp({ children }: { children: React.ReactNode }) {
  const user = useAuth();
  if (user?.type != "assistant") return null;
  return <>{children}</>;
}

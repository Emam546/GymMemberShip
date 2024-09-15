import { useAppSelector } from "@src/store";
import { useRouter } from "next/router";
import { useEffect } from "react";

export function RedirectIfState({
  children,
  href,
  state,
}: {
  children: React.ReactNode;
  href: string;
  state?: boolean;
}) {
  const router = useRouter();
  useEffect(() => {
    if (state) router.replace(href);
  }, [href]);
  if (state) return null;
  return children;
}
export function useRedirectIfState(href: string, state: boolean) {
  const router = useRouter();
  useEffect(() => {
    if (state) router.replace(href);
  }, [href]);
  return state;
}
export function useRedirectIfNotCreator(href: string) {
  const user = useAppSelector((state) => state.auth.user!);
  const state = !(user.type == "creator" || user.type == "admin");

  return useRedirectIfState(href, state);
}
export function RedirectIfNotCreator({
  children,
  href,
}: {
  children: React.ReactNode;
  href: string;
}) {
  const user = useAppSelector((state) => state.auth.user!);
  const state = !(user.type == "creator" || user.type == "admin");
  return (
    <RedirectIfState state={state} href={href}>
      {children}
    </RedirectIfState>
  );
}

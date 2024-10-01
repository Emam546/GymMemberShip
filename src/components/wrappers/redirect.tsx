import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAuth } from "../UserProvider";

export function RedirectIfState({
  children,
  href = "/",
  state,
}: {
  children: React.ReactNode;
  href?: string;
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
export function useRedirectIfNotAdmin(href = "/") {
  const user = useAuth();
  const state = user?.type != "admin";

  return useRedirectIfState(href, state);
}
export function RedirectIfNotAdmin({
  children,
  href,
}: {
  children: React.ReactNode;
  href?: string;
}) {
  const user = useAuth();

  const state = user?.type != "admin";
  return (
    <RedirectIfState state={state} href={href}>
      {children}
    </RedirectIfState>
  );
}

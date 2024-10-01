import SideBar from "@src/components/sidebar";
import { useEffect, useRef } from "react";
import Header from "@src/components/header";

import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { useAuth } from "./UserProvider";

function MainApp({ children: children }: { children: React.ReactNode }) {
  const mainWrapper = useRef<HTMLDivElement>(null);
  const { i18n } = useTranslation();
  const router = useRouter();
  const user = useAuth();
  useEffect(() => {
    function setSideBar() {
      const wrapper = mainWrapper.current;
      if (!wrapper) return;
      const width =
        window.innerWidth > 0 ? window.innerWidth : window.screen.width;
      if (width < 1199) {
        wrapper.setAttribute("data-sidebartype", "mini-sidebar");
        wrapper.classList.add("mini-sidebar");
      } else {
        wrapper.setAttribute("data-sidebartype", "full");
        wrapper.classList.remove("mini-sidebar");
      }
    }
    setSideBar();
    window.addEventListener("resize", setSideBar);
  }, [mainWrapper]);
  function onClose() {
    const wrapper = mainWrapper.current;
    if (!wrapper) return;
    wrapper.classList.add("mini-sidebar");
    wrapper.classList.remove("show-sidebar");
  }

  useEffect(() => {
    router.events.on("routeChangeComplete", onClose);
    return () => {
      router.events.off("routeChangeComplete", onClose);
    };
  }, []);
  useEffect(() => {
    document.body.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);
  useEffect(() => {
    if (!user) router.replace("/login");
  }, [user]);
  if (!user) return null;
  return (
    <>
      <div
        className="page-wrapper tw-flex tw-flex-1 tw-items-stretch tw-justify-stretch"
        id="main-wrapper"
        data-layout="vertical"
        data-navbarbg="skin6"
        data-sidebartype="full"
        data-sidebar-position="fixed"
        data-header-position="fixed"
        ref={mainWrapper}
      >
        <SideBar onClose={onClose} />
        <div className="body-wrapper tw-flex tw-flex-col tw-w-full">
          <Header
            OnOpen={() => {
              const wrapper = mainWrapper.current;
              if (!wrapper) return;
              wrapper.classList.remove("mini-sidebar");
              wrapper.classList.add("show-sidebar");
              wrapper.setAttribute("data-sidebartype", "full");
            }}
          />
          <div className="px-4 container-fluid tw-flex-1 tw-w-full tw-flex tw-flex-col tw-justify-stretch tw-items-stretch">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}

export default function MainWrapper({
  children: children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  if (router.pathname == "/login") return children;
  return <MainApp>{children}</MainApp>;
}

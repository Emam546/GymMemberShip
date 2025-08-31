import Header from "@src/components/sidebar";
import { useEffect, useRef } from "react";
// import Header from "@src/components/header"
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { useAuth } from "./UserProvider";
import ImagesBg from "./bg";
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
        className="tw-pb-5"
        ref={mainWrapper}
      >
        <Header />
        <div className="m-0 body-wrapper">
          <div className="tw-px-4 tw-py-10 container-fluid tw-bg-white/95">
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
  return <MainApp>{children}</MainApp>;
}

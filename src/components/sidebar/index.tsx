import classNames from "classnames";
import Link from "next/link";
import { useRouter } from "next/router";
import { ComponentProps, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import i18n from "@src/i18n";
import { IsAdminComp } from "../wrappers";
import UserIcon from "./icons/personal-information.png";
import GraphIcon from "./icons/graph.png";
import PlansIcon from "./icons/project-management.png";
import Logo from "@sources/src/logo.png";
import TrainersIcon from "./icons/personal.png";
import SettingsIcon from "./icons/settings.png";
import Whatsapp from "./icons/whatsapp.png";
import Products from "./icons/shopping-cart.png";
import logOutIcon from "./icons/switch.png";
import DashBoardIcon from "./icons/dashboard.png";
import { SelectLang } from "../common/selectLang";
import { useAuth, useLogUser } from "../UserProvider";
interface HeaderNavProps {
  title: string;
}
export function HeaderNav({ title }: HeaderNavProps) {
  return (
    <li className="nav-small-cap first:tw-mt-0">
      <i className="ti ti-dots nav-small-cap-icon fs-4" />
      <span className="hide-menu">{title}</span>
    </li>
  );
}
interface DropLinkElemProps extends OrgLinkElemProps {
  hrefs: {
    label: string;
    href: string;
  }[];
}
interface LinkElemProps extends OrgLinkElemProps {
  href: string;
}
interface OrgLinkElemProps extends ComponentProps<"li"> {
  title: string;
  icon: string;
  onClick?: () => void;
}
function OrgLinkElem({
  title,
  icon,
  children,
  onClick,
  "aria-selected": state,
  ...props
}: OrgLinkElemProps) {
  return (
    <li className="tw-relative tw-select-none" {...props}>
      <div
        className={classNames(
          "tw-flex tw-flex-col tw-items-stretch tw-min-w-[9rem] tw-group tw-cursor-pointer tw-gap-2"
        )}
        onClick={onClick}
      >
        <div className="tw-aspect-square tw-h-20 tw-flex tw-justify-center tw-items-center">
          <img
            src={icon}
            className="tw-pointer-events-none tw-h-full"
            alt="icon"
          />
        </div>
        <PText className="tw-mb-1" aria-selected={state}>
          {title}
        </PText>
      </div>
      {children}
    </li>
  );
}
function PText({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      className={classNames(
        "tw-py-1 tw-px-1 tw-bg-blue-800 tw-text-gray-200 tw-text-center group-hover:tw-bg-yellow-500 group-hover:tw-text-blue-900 hover:tw-bg-yellow-500 hover:tw-text-blue-900 tw-font-medium tw-border-0 tw-border-t-2 tw-border-white/30 tw-border-solid",
        "aria-selected:tw-bg-yellow-500 aria-selected:tw-text-blue-900",
        className
      )}
      {...props}
    />
  );
}
function DropLinksElem({ hrefs, children, ...props }: DropLinkElemProps) {
  const router = useRouter();
  const state = hrefs.some(({ href }) => href == router.pathname);
  const [opened, setOpened] = useState(false);
  useEffect(() => {
    const handleComplete = () => setOpened(false);
    router.events.on("routeChangeError", handleComplete);
    router.events.on("routeChangeComplete", handleComplete);
    return () => {
      router.events.off("routeChangeError", handleComplete);
      router.events.off("routeChangeComplete", handleComplete);
    };
  }, []);
  return (
    <OrgLinkElem
      {...props}
      aria-selected={state}
      onClick={() => {
        setOpened(!opened);
      }}
    >
      <div
        className={classNames(
          "tw-absolute tw-m-0 tw-left-0 tw-min-w-[15rem] tw-top-full tw-z-10 tw-bg-white/30",
          {
            "tw-hidden": !opened,
          }
        )}
      >
        <ul className="tw-z-20">
          {hrefs.map((val) => {
            return (
              <li key={val.href} className="tw-group">
                <Link href={val.href}>
                  <PText className="tw-mb-0.5">{val.label}</PText>
                </Link>
              </li>
            );
          })}
        </ul>
        <div>{children}</div>
      </div>
    </OrgLinkElem>
  );
}
function LinkElem({ href, ...props }: LinkElemProps) {
  const router = useRouter();
  const state = href == router.pathname;
  return (
    <Link href={href}>
      <OrgLinkElem {...props} aria-selected={state} />
    </Link>
  );
}
export interface Props {
  onClose?: (this: HTMLElement) => void;
}

function ManageUsersNavBar() {
  const user = useAuth();
  const { t } = useTranslation("sideBar");
  return (
    <>
      <DropLinksElem
        icon={UserIcon.src}
        hrefs={[
          { href: "/users/search", label: t("user./users/search") },
          { href: "/users/add", label: t("user./users/add") },
        ]}
        title={t("user.label")}
      />
      <LinkElem
        icon={Products.src}
        title={t("sell.label")}
        href="/products/sell"
      />
      <IsAdminComp>
        <LinkElem
          icon={GraphIcon.src}
          href="/payments"
          title={t("payments.label")}
        />
        <LinkElem icon={Whatsapp.src} href="/users/whatsapp" title={"Whatsapp"} />
        <LinkElem icon={PlansIcon.src} href="/plans" title={t("plans.label")} />
        <LinkElem
          icon={TrainersIcon.src}
          href="/trainers"
          title={t("trainers.label")}
        />
        <LinkElem
          icon={DashBoardIcon.src}
          href="/dashboard"
          title={t("dashboard.label")}
        />
      </IsAdminComp>
      <DropLinksElem
        icon={SettingsIcon.src}
        hrefs={
          user?.type == "admin"
            ? [
                { href: "/admins", label: t("setting./admins") },
                { href: "/products", label: t("setting./products") },
              ]
            : []
        }
        title={t("setting.label")}
      >
        <div className="tw-bg-white tw-rounded-lg">
          <SelectLang />
        </div>
      </DropLinksElem>
    </>
  );
}

export default function Header() {
  const logout = useLogUser();
  const { t } = useTranslation("sideBar");
  return (
    <header className="tw-px-2 header tw-pt-4" dir="ltr">
      <div className="tw-flex tw-justify-between">
        <div className="tw-flex tw-gap-5">
          <div className="tw-h-full">
            <Link
              href="/"
              className="hover:tw-bg-yellow-600/10 tw-block tw-p-3 tw-h-[7rem] tw-rounded"
            >
              <img src={Logo.src} className="tw-h-full" alt="Logo" />
            </Link>
          </div>
          <nav className="">
            <ul className="tw-flex tw-gap-2 tw-flex-wrap">
              <ManageUsersNavBar />
            </ul>
          </nav>
        </div>
        <ul>
          <OrgLinkElem
            title={t("logout.label")}
            icon={logOutIcon.src}
            aria-selected={false}
            onClick={() => logout.mutate(null)}
          />
        </ul>
      </div>
    </header>
  );
}

declare global {
  namespace I18ResourcesType {
    interface Resources {
      sideBar: {
        user: {
          label: "User";
          "/users/add": "Add User";
          "/users/search": "Search for User";
        };
        sell: { label: "Sell" };
        payments: { label: "Payments" };
        whatsapp: { label: "whatsapp" };
        dashboard: { label: "dashboard" };
        trainers: { label: "Trainers" };
        setting: {
          label: "Settings";
          "/admins": "Manage Admins";
          "/products": "Manage Products";
        };
        logout: {
          label: "LogOut";
        };
        plans: {
          label: "Plans";
          "/plans": "Manage Plans";
          "/plans/add": "Add Plan";
        };
      };
    }
  }
}
i18n.addLoadUrl("/components/sidebar", "sideBar");

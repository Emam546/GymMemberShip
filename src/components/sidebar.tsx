/* eslint-disable @next/next/no-img-element */
import { useAppSelector } from "@src/store";
import classNames from "classnames";
import Link from "next/link";
import { useRouter } from "next/router";
import SimpleBar from "simplebar-react";
import { IsAdminComp, IsCreatorComp } from "./wrappers/wrapper";

interface HeaderNavProps {
  title: string;
}
export function HeaderNav({ title }: HeaderNavProps) {
  return (
    <li className="nav-small-cap">
      <i className="ti ti-dots nav-small-cap-icon fs-4" />
      <span className="hide-menu">{title}</span>
    </li>
  );
}
interface LinkElemProps {
  href: string;
  title: string;
}

export function LinkElem({ href, title }: LinkElemProps) {
  const router = useRouter();
  const state = router.pathname == href;
  return (
    <li className={classNames("sidebar-item", { selected: state })}>
      <Link
        className={classNames("sidebar-link", {
          active: state,
        })}
        href={href}
        aria-expanded={state}
      >
        <span>
          <i className="ti ti-layout-dashboard" />
        </span>
        <span className="hide-menu">{title}</span>
      </Link>
    </li>
  );
}
export interface Props {
  onClose?: (this: HTMLElement) => any;
}
function AdminNavBar() {
  return (
    <>
      <HeaderNav title="Admin" />
      <LinkElem href="/admin/teachers" title="Teachers" />
    </>
  );
}
function CreatorNavBar() {
  return (
    <>
      <HeaderNav title="Creator" />
      <LinkElem href="/" title="Dashboard" />
      <LinkElem href="/plans" title="Manage Plans" />
      <LinkElem href="/users" title="Manage Users" />
    </>
  );
}
function AssistantNavBar() {
  return (
    <>
      <HeaderNav title="Assistant" />
      <LinkElem href="/assistant" title="Add Questions" />
      <LinkElem href="/assistant/users" title="Control Users" />
    </>
  );
}
export default function SideBar({ onClose: onToggle }: Props) {
  return (
    <aside className="left-sidebar">
      {/* Sidebar scroll*/}
      <div>
        <div className="brand-logo d-flex align-items-center justify-content-between">
          <Link href="/" className="text-nowrap logo-img">
            <img src="/images/logos/dark-logo.svg" width={180} alt="logo" />
          </Link>
          <button
            className="cursor-pointer close-btn d-xl-none d-block tw-border-none tw-bg-inherit"
            id="sidebarCollapse"
            onClick={(e) => {
              onToggle && onToggle.call(e.currentTarget);
            }}
          >
            <i className="ti ti-x fs-8" />
          </button>
        </div>
        {/* Sidebar navigation*/}
        <SimpleBar className="scroll-sidebar">
          <nav className="sidebar-nav">
            <ul id="sidebarnav">
              <AdminNavBar />

              <CreatorNavBar />

              <AssistantNavBar />
            </ul>
          </nav>
        </SimpleBar>
        {/* End Sidebar navigation */}
      </div>
      {/* End Sidebar scroll*/}
    </aside>
  );
}

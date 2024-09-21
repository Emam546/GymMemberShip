import classNames from "classnames";
import Link, { LinkProps } from "next/link";
import { useRouter } from "next/router";
import { ComponentProps } from "react";
import SimpleBar from "simplebar-react";

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
interface LinkElemProps extends ComponentProps<"div"> {
  href: string;
  title: string;
}

export function LinkElem({ href, title, children }: LinkElemProps) {
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
        <span>{children}</span>
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
      <LinkElem href="/" title="Dashboard">
        <i className="ti ti-layout-dashboard" />
      </LinkElem>
      <LinkElem href="/plans" title="Manage Plans">
        <i className="ti ti-calendar-plus"></i>
      </LinkElem>
      <LinkElem href="/users" title="Manage Users">
        <i className="ti ti-users"></i>
      </LinkElem>
      <LinkElem href="/users/add" title="Add User">
        <i className="ti ti-user-plus"></i>
      </LinkElem>
      <LinkElem href="/payments" title="Manage Payments">
        <i className="ti ti-credit-card"></i>
      </LinkElem>
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
              {/* <AdminNavBar /> */}
              <CreatorNavBar />
              {/* <AssistantNavBar /> */}
            </ul>
          </nav>
        </SimpleBar>
        {/* End Sidebar navigation */}
      </div>
      {/* End Sidebar scroll*/}
    </aside>
  );
}

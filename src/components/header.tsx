import { useRouter } from "next/router";
import Link from "next/link";
import SelectInput from "./common/inputs/select";
import { useTranslation } from "react-i18next";
import { ObjectEntries } from "@src/utils";
import i18n from "@src/i18n";
export interface Props {
  OnOpen?: () => any;
}
const langs: Record<I18ResourcesType.AvailableLang, string> = {
  ar: "العربيه",
  en: "English",
};
export default function Header({ OnOpen }: Props) {
  const { i18n, t } = useTranslation("header");
  const router = useRouter();
  return (
    <header className="app-header">
      <nav className="navbar navbar-expand-lg navbar-light">
        <ul className="navbar-nav">
          <li className="nav-item d-block d-xl-none">
            <button
              className="nav-link nav-icon-hover tw-bg-transparent tw-border-none"
              id="headerCollapse"
              onClick={(e) => {
                OnOpen && OnOpen();
              }}
            >
              <i className="ti ti-menu-2" />
            </button>
          </li>
          {/* <li className="nav-item">
            <button
              type="button"
              className="nav-link nav-icon-hover tw-bg-transparent tw-border-none"
              onClick={(e) => {
                e.preventDefault();
              }}
            >
              <i className="ti ti-bell-ringing" />
              <div className="notification bg-primary rounded-circle" />
            </button>
          </li> */}
        </ul>
        <div
          className="px-0 navbar-collapse justify-content-end"
          id="navbarNav"
        >
          <ul className="flex-row navbar-nav ms-auto align-items-center justify-content-end">
            <li className="nav-item dropdown">
              <span
                className="nav-link nav-icon-hover tw-cursor-pointer"
                id="drop2"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <div
                  className={
                    "tw-flex tw-items-center tw-justify-center tw-overflow-hidden tw-rounded-full tw-aspect-square tw-w-8"
                  }
                >
                  <img
                    src={"/images/profile/user-1.jpg"}
                    alt={"userImage"}
                    className="tw-object-cover tw-min-w-full tw-min-h-full"
                  />
                </div>
              </span>
              <div
                className="dropdown-menu dropdown-menu-end dropdown-menu-animate-up"
                aria-labelledby="drop2"
              >
                <div className="message-body">
                  <div className="tw-px-2 tw-mx-3">
                    <SelectInput
                      title={t("selectLang.label")}
                      onChange={async (e) => {
                        await i18n.changeLanguageAndLoad(e.currentTarget.value);
                        router.reload();
                      }}
                      id={"choose lang"}
                      value={i18n.language}
                    >
                      {ObjectEntries(langs).map(([key, label]) => {
                        return (
                          <option value={key} key={key}>
                            {label}
                          </option>
                        );
                      })}
                    </SelectInput>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}

declare global {
  namespace I18ResourcesType {
    interface Resources {
      header: {
        "selectLang.label": "Choose Language";
      };
    }
  }
}
i18n.addLoadUrl("/components/header", "header");

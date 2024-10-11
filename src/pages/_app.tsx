import "@src/setup";
import "@src/styles/styles.scss";
import "@src/styles/global.scss";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "simplebar-react/dist/simplebar.min.css";
import "react-phone-number-input/style.css";
import "@locales/common";

import { config } from "@fortawesome/fontawesome-svg-core";
import type { AppProps } from "next/app";
import { ReactElement, ReactNode, useEffect, useRef } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import MainWrapper from "@src/components/mainWrapper";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "@src/queryClient";
import { NextPage } from "next";
import { AppContext } from "next/app";
import LoadingBar from "@src/components/loadingBar";
import { Provider as ReduxProvider } from "react-redux";
import store from "@src/store";
import i18n from "@src/i18n";
import { ObjectEntries } from "@src/utils";
import { UserProvider } from "@src/components/UserProvider";
import { loadAuthData } from "@src/utils/loadAuth";
import { BarcodePrintProvider } from "@src/components/BarcodePrinter";
import { FrameProvider } from "@src/components/Frame/Frame";
import ImagesBg from "@src/components/bg";
config.autoAddCss = false;

export type NextPageWithLayout<P = Record<string, unknown>, IP = P> = NextPage<
  P,
  IP
> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};
export function Provider({ children }: { children: ReactNode }) {
  const ref = useRef(null);
  const dayWeek = new Date().getDay();

  const image = ImagesBg[dayWeek % ImagesBg.length];

  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        {/* <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_CLIENT_ID!}> */}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <FrameProvider>
            <BarcodePrintProvider>
              <div
                className="tw-w-full tw-h-screen tw-fixed tw-top-0 tw-left-0 tw-bg-contain -tw-z-10"
                style={{
                  backgroundImage: `url("${image}")`,
                }}
              />
              <LoadingBar>{children}</LoadingBar>
            </BarcodePrintProvider>
          </FrameProvider>
        </LocalizationProvider>
        {/* </GoogleOAuthProvider> */}
      </QueryClientProvider>
    </ReduxProvider>
  );
}
interface AppG extends AppPropsWithLayout {
  translations: { lang: [string, any][] };
  user: Express.User | null;
}

const App = function ({ Component, pageProps, translations, user }: AppG) {
  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  ObjectEntries(translations).map(([lng, val]) => {
    val.forEach(([ns, res]) => {
      if (res) i18n.addResourceBundle(lng, ns, res, true, true);
    });
  });

  return (
    <Provider>
      <UserProvider state={user}>
        {/* <ConnectedBar /> */}

        {Component.getLayout ? (
          Component.getLayout(<Component {...pageProps} />)
        ) : (
          <>
            <MainWrapper>{<Component {...pageProps} />}</MainWrapper>
          </>
        )}
      </UserProvider>
    </Provider>
  );
};

App.getInitialProps = async ({ Component, ctx }: AppContext) => {
  // Retrieve language from cookies on the server side
  const cookies = ctx.req?.headers.cookie || "";
  const langFromCookie =
    cookies
      .split("; ")
      .find((row) => row.startsWith("i18next="))
      ?.split("=")[1] ||
    i18n.language ||
    "en"; // Default to 'en' if not found
  await i18n.changeLanguage(langFromCookie);
  const appProps = Component.getInitialProps
    ? await Component.getInitialProps(ctx)
    : {};
  await i18n.loadR(langFromCookie);
  const user = await loadAuthData(ctx.req);
  const translations = ((i18n.options.ns as string[]) || []).map((key) => {
    return [key, i18n.getResourceBundle(langFromCookie, key)];
  });
  return {
    translations: {
      [langFromCookie]: translations,
    },
    user,
    ...appProps,
  };
};
export default App;

import "@src/setup";
import "@src/styles/styles.scss";
import "@src/styles/global.scss";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "simplebar-react/dist/simplebar.min.css";
import "@locales/common";
import { config } from "@fortawesome/fontawesome-svg-core";
import type { AppProps } from "next/app";
import { ReactElement, ReactNode, useEffect, useLayoutEffect } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import MainWrapper from "@src/components/mainWrapper";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "@src/queryClient";
import { NextPage } from "next";
import { AppContext } from "next/app";
import ConnectedBar from "@src/components/internetConnection";
import LoadingBar from "@src/components/loadingBar";
import { Provider as ReduxProvider } from "react-redux";
import store from "@src/store";
import i18n from "@src/i18n";
import { useRouter } from "next/router";

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
  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        {/* <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_CLIENT_ID!}> */}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          {children}
        </LocalizationProvider>
        {/* </GoogleOAuthProvider> */}
      </QueryClientProvider>
    </ReduxProvider>
  );
}
interface AppG extends AppPropsWithLayout {
  translations: [string, any][];
  lng: string;
}

const App = function ({ Component, pageProps, translations, lng }: AppG) {
  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  translations.forEach(([ns, res]) => {
    if (res) i18n.addResourceBundle(lng, ns, res, true, true);
  });

  return (
    <Provider>
      <ConnectedBar />
      <LoadingBar />
      {Component.getLayout ? (
        Component.getLayout(<Component {...pageProps} />)
      ) : (
        <>
          <MainWrapper>{<Component {...pageProps} />}</MainWrapper>
        </>
      )}
    </Provider>
  );
};
export function loadTranslation(lng: string, path: string) { }
App.getInitialProps = async ({ Component, ctx, router }: AppContext) => {
  // Retrieve language from cookies on the server side
  const cookies = ctx.req?.headers.cookie || "";
  const langFromCookie =
    cookies
      .split("; ")
      .find((row) => row.startsWith("i18next="))
      ?.split("=")[1] || i18n.language || "en"; // Default to 'en' if not found
  // Change i18next language
  await i18n.changeLanguage(langFromCookie);
  await i18n.loadR(langFromCookie);
  const translations = ((i18n.options.ns as string[]) || []).map((key) => {
    return [key, i18n.getResourceBundle(langFromCookie, key)];
  });
  const appProps = Component.getInitialProps
    ? await Component.getInitialProps(ctx)
    : {};
  return { ...appProps, lng: langFromCookie, translations };
};
export default App;

import "@src/styles/global.scss";
import "@src/styles/styles.scss";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "simplebar-react/dist/simplebar.min.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import type { AppProps } from "next/app";
import React, { ReactElement, ReactNode, useEffect } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import MainWrapper from "@src/components/mainWrapper";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "@src/queryClient";
import { NextPage } from "next";
import ConnectedBar from "@src/components/internetConnection";
import LoadingBar from "@src/components/loadingBar";
import { Provider as ReduxProvider } from "react-redux";
import store from "@src/store";
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
export default function App({ Component, pageProps }: AppPropsWithLayout) {
  useEffect(() => {
    window.ResizeObserver = ResizeObserver;
    require("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

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
}

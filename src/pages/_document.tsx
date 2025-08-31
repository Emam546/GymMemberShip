import { Html, Head, Main, NextScript } from "next/document";
import { useTranslation } from "react-i18next";

export default function Document() {
  const { i18n } = useTranslation();
  return (
    <Html lang={i18n.language}>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/images/app/app_icon" type="image/*" />
        <link
          rel="shortcut icon"
          type="image/png"
          href="/images/app/app_icon"
        />
      </Head>
      <body dir={i18n.language == "ar" ? "rtl" : "ltr"}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

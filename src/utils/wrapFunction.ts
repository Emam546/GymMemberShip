import i18n, { langs } from "@src/i18n";
import { GetStaticProps } from "next";

export function WrapFunction<T extends Record<string, any>>(
  f: GetStaticProps<T>
) {
  return (async (...props: Parameters<GetStaticProps<T>>) => {
    // Retrieve language from cookies on the server side
    const res = await f(...props);
    return {
      ...res,
      props: {
        ...(res as unknown as any).props,
        translations: Object.fromEntries(
          await Promise.all(
            langs.map(async (lng) => {
              await i18n.loadR(lng);
              const translations = ((i18n.options.ns as string[]) || []).map(
                (key) => {
                  return [key, i18n.getResourceBundle(lng, key)];
                }
              );
              return [lng, translations];
            })
          )
        ),
      },
    } as unknown as ReturnType<GetStaticProps<T>>;
  }) as GetStaticProps<T>;
}

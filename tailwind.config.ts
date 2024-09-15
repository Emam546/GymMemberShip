import type { Config } from "tailwindcss";

const config: Config = {
    content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
    theme: {
        extend: {
            screens: {
                print: { raw: "print" },
                screen: { raw: "screen" },
            },
        },
    },
    prefix: "tw-",
    corePlugins: {
        preflight: false,
    },
    plugins: [
        require("tailwindcss-counter")({
            counterName: "counter",
        }),
    ],
};
export default config;

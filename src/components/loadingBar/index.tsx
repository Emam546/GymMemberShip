import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import style from "./style.module.scss";
import classNames from "classnames";
export default function LoadingBar() {
    const router = useRouter();

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const handleStart = (url: string) =>
            url !== router.asPath && setLoading(true);
        const handleComplete = () => setLoading(false);

        router.events.on("routeChangeStart", handleStart);
        router.events.on("routeChangeComplete", handleComplete);
        router.events.on("routeChangeError", handleComplete);

        return () => {
            router.events.off("routeChangeStart", handleStart);
            router.events.off("routeChangeComplete", handleComplete);
            router.events.off("routeChangeError", handleComplete);
        };
    }, []);
    if (!loading) return null;
    return (
        <div
            className={classNames(
                style["loading-bar"],
                "tw-fixed tw-top-0 tw-left-0 tw-w-full tw-h-[4px] tw-z-[10000]"
            )}
        >
            <div className="tw-h-full"></div>
        </div>
    );
}

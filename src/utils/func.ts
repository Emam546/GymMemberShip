import { hasOwnProperty, objectValues } from ".";
import { isObject, isArray, isString } from "./types";

export function isErrormessage(
    val: unknown
): val is Record<string, [{ message: string }]> {
    return (
        isObject(val) &&
        objectValues(val).every((val) => {
            return (
                isArray(val) &&
                val.every(
                    (val) =>
                        hasOwnProperty(val, "message") && isString(val.message)
                )
            );
        })
    );
}

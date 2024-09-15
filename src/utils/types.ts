export function isObject<T>(value: unknown): value is Record<string, T> {
    return typeof value === "object" && !Array.isArray(value) && value !== null;
}
export function isAny<T>(
    value: unknown
): value is Record<string, T> | Array<T> {
    return typeof value === "object" && value !== null;
}
export function isString(value: unknown): value is string {
    return typeof value === "string" || value instanceof String;
}
export function isBool(value: unknown): value is boolean {
    return typeof value === "boolean" || value instanceof Boolean;
}
export function isArray<T>(value: unknown): value is Array<T> {
    return (
        value instanceof Array ||
        Object.prototype.toString.call(value) === "[object Array]"
    );
}
export function isPromise<T>(value: unknown): value is Promise<T> {
    return value instanceof Promise;
}
export function isNumber(value: unknown): value is number {
    return (
        (typeof value == "number" && !isNaN(value)) || value instanceof Number
    );
}
export function onlyDigits(str: string | boolean | number) {
    const num = Number(str);
    return !isNaN(num) && typeof str !== "boolean";
}
export function isNumeric(value: string | boolean | number): boolean {
    return onlyDigits(value) && !isArray(value);
}

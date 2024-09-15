import { v4 as _uuid } from "uuid";

export function assertIsNode(e: EventTarget | null): asserts e is Node {
    if (!e || !("nodeType" in e)) {
        throw new Error(`Node expected`);
    }
}
export function copyObject<T>(obj: T): T {
    return MakeItSerializable(obj);
}
export function hasOwnProperty<K extends PropertyKey, T>(
    obj: unknown,
    key: K
): obj is Record<K, T> {
    return Object.prototype.hasOwnProperty.call(obj, key);
}
export function MakeItSerializable<T>(val: T): T {
    return JSON.parse(JSON.stringify(val));
}
export function uuid() {
    return _uuid();
}
export function formateDate(date: Date, sep: string = "-") {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Month is zero-indexed, so we add 1
    const day = date.getDate().toString().padStart(2, "0");

    // Create the formatted date string
    return `${year}${sep}${month}${sep}${day}`;
}
export function formateDateClock(date: Date) {
    // Month is zero-indexed, so we add 1
    const hours = date.getHours().toString().padStart(2, "0");
    const seconds = date.getMinutes().toString().padStart(2, "0");

    // Create the formatted date string
    return `${hours}:${seconds}`;
}
export function ObjectEntries<T extends object | Array<unknown>>(
    val: T
): {
    [K in keyof T]: [K, T[K]];
}[keyof T][] {
    return Object.entries(val) as {
        [K in keyof T]: [K, T[K]];
    }[keyof T][];
}
export function objectKeys<T extends object>(val: T): Array<keyof T> {
    return Object.keys(val) as Array<keyof T>;
}
export function objectValues<T extends object>(val: T): Array<T[keyof T]> {
    return Object.values(val) as Array<T[keyof T]>;
}

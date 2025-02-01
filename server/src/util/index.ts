export function hasOwnProperty<K extends PropertyKey, T>(
  obj: unknown,
  key: K
): obj is Record<K, T> {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

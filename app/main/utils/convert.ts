

export function convertFunc<Key extends string, Pre extends string>(
  name: Key,
  preName: Pre
) {
  return `${preName}-${name}`;
}

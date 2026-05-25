import {
  useState,
  useEffect,
  useCallback,
  Dispatch,
  SetStateAction,
} from "react";
import { useSearchParams, useRouter } from "next/navigation";

type Options<T> = {
  defaultValues: T;
  parse?: (key: keyof T, value: string) => any; // custom parser
  serialize?: (key: keyof T, value: any) => string; // custom serializer
};

export function useQueryFilter<T extends Record<string, any>>(
  options: Options<T>
): [T, Dispatch<SetStateAction<T>>] {
  const { defaultValues, parse, serialize } = options;
  const searchParams = useSearchParams();
  const router = useRouter();

  const [filter, setFilter] = useState<T>(defaultValues);

  // Initialize from query params
  useEffect(() => {
    const entries = Object.entries(defaultValues).map(([key, defaultVal]) => {
      const paramVal = searchParams.get(key);
      if (paramVal !== null) {
        const parsed = parse ? parse(key as keyof T, paramVal) : paramVal;
        return [key, parsed];
      }
      return [key, defaultVal];
    });

    setFilter(Object.fromEntries(entries) as T);
  }, [searchParams]);

  // Sync filter to URL
  const updateFilter = useCallback(
    (newValues: Partial<T>) => {
      const updated = { ...filter, ...newValues };
      setFilter(updated);

      const params = new URLSearchParams();
      Object.entries(updated).forEach(([key, val]) => {
        const str = serialize ? serialize(key as keyof T, val) : String(val);
        params.set(key, str);
      });
      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [filter, router, serialize]
  );

  return [filter, updateFilter as Dispatch<SetStateAction<T>>];
}

import { useInfiniteQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
export const useInfinityQueryAdvanced = function useInfinityQueryAdvanced(
  ...params
) {
  const [placeholder, setPlaceholder] = useState<any>();
  const query = useInfiniteQuery({
    ...params[0],
    placeholderData: placeholder,
  });
  useEffect(() => {
    if (query.isSuccess) setPlaceholder(query.data);
  }, [query.data]);
  return query;
} as typeof useInfiniteQuery;

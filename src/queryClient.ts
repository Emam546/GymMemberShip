import { QueryClient } from "@tanstack/react-query";

const cacheTime = 30 * (60 * 1000);
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 10 * (60 * 1000), // 10 mins
            cacheTime: cacheTime + 5 * (60 * 1000),
        },
    },
});
export default queryClient;

import { queryOptions } from "@tanstack/react-query";
import { obtenerPMLYearly } from "./obtener-pml-anual";

export const pmlAnualQueryOptions = queryOptions({
    queryKey: ["pml-anual"],
    queryFn: () => obtenerPMLYearly(),
    // refetchOnWindowFocus: true, // Refetch when the window is focused
    // Refetch every 2 hours in milliseconds
    // staleTime: 2 * 60 * 60 * 1000,
    // refetchInterval: 2 * 60 * 60 * 1000, // Refetch every 2 hours
    refetchOnWindowFocus: false, // Prevents refetching when the tab is focused
    refetchOnReconnect: false, // Prevents refetching when the internet reconnects
    refetchOnMount: false, // Prevents refetching when the component mounts
});
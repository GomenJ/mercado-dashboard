import { queryOptions } from "@tanstack/react-query";
import { obtenerDiaActualDemanda } from "./obtener-dia-actual-demanda";

export const demandaQueryOptions = queryOptions({
	queryKey: ["demanda"],
	queryFn: () => obtenerDiaActualDemanda(),
	// 15 minutes in milliseconds
	staleTime: 15 * 60 * 1000,
	refetchInterval: 15 * 60 * 1000, // Refetch every 15 minutes
	// select: (data) => {
	// 	// Group by HoraOperacion
	// 	const grouped = Object.groupBy(data, item => item.HoraOperacion);
	// 	// Now create a new array with the grouped data
	// 	return Object.entries(grouped).map(([HoraOperacion, items]) => ({
	// 		HoraOperacion: HoraOperacion,
	// 		Demanda: items.reduce((sum, item) => sum + item.Demanda, 0), // Sum the Demanda values
	// 		Generacion: items.reduce((sum, item) => sum + item.Generacion, 0), // Sum the Generacion values
	// 		Pronostico: items.reduce((sum, item) => sum + item.Pronostico, 0), // Sum the Pronostico values
	// 	}));
	// },
});

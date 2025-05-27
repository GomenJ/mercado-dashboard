import type { DemandaData } from "../types/demanda-type";

export const obtenerDiaActualDemanda = async (): Promise<DemandaData[]> => {
    const url = `${import.meta.env.VITE_API_URL}/api/v1/demanda/current_day`;
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const data = await response.json();

        return data;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(`Error fetching current day: ${errorMessage}`);
        throw error; // Re-throw the error to be handled by the caller
    }
}
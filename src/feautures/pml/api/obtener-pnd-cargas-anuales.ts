import type { PNDData } from "../types/pnd-types";


export const obtenerPNDCargasAnuales = async (): Promise<PNDData> => {
    const url = `${import.meta.env.VITE_API_URL}/api/v1/mda_mtr/daily_average_pnd`;
    console.log(`Fetching current day data from: ${url}`);
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Data received:', data);
        if (!data || typeof data !== 'object') {
            throw new Error('Invalid data format received');
        }

        if (!data.currentYear || !data.currentYearData || !data.previousYear || !data.previousYearData) {
            throw new Error('Missing required fields in the data');
        }

        return data;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(`Error fetching current day: ${errorMessage}`);
        throw error; // Re-throw the error to be handled by the caller
    }
}

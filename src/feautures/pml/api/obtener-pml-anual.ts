import type { PMLYearlyData } from "../types/pml-anual-types";

export const obtenerPMLYearly = async (): Promise<PMLYearlyData> => {
    const url = `${import.meta.env.VITE_API_URL}/api/v1/mda_mtr/pml_yearly_comparison_data`;
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const data = await response.json() as PMLYearlyData;

        if (!data || typeof data !== 'object') {
            throw new Error('Invalid data format received');
        }

        if (!data.currentYearData || !data.currentYearRange || !data.previousYearData || !data.previousYearRange) {
            throw new Error('Missing required fields in the data');
        }

        return data;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(`Error fetching PML daily data: ${errorMessage}`);
        throw error; // Re-throw the error to be handled by the caller
    }
}
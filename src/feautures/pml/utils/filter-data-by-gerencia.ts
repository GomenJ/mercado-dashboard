import type { PMLYearData } from "../types/pml-anual-types"; // Ensure this includes NumReadings

export interface PMLDailyAverage { // This can remain as in your original code
    Fecha: string;
    AvgPML: number;
}

export const processPMLData = (
    data: PMLYearData[],
    gerencia?: string
): PMLYearData[] | PMLDailyAverage[] => {
    if (gerencia) {
        // Scenario 1: Filter by Gerencia (no change here)
        return data.filter(record => record.Gerencia === gerencia);
    } else {
        // Scenario 2: Calculate daily averages
        // The structure for dailyData needs to change to support weighted averages.
        const dailyAggregates: {
            [key: string]: { // Key is Fecha (string)
                sumOfProducts: number;     // Stores SUM(AvgPML * NumReadings)
                totalNumReadings: number;  // Stores SUM(NumReadings)

                // For fallback to simple average if weighted average isn't possible
                sumOfAvgPMLsForFallback: number;
                countOfRecordsForFallback: number;

                // Flag to track if all records contributing an AvgPML also have valid NumReadings
                allRecordsHaveValidNumReadings: boolean;
            };
        } = {};

        data.forEach(record => {
            if (!record.Fecha) return; // Basic guard

            if (!dailyAggregates[record.Fecha]) {
                dailyAggregates[record.Fecha] = {
                    sumOfProducts: 0,
                    totalNumReadings: 0,
                    sumOfAvgPMLsForFallback: 0,
                    countOfRecordsForFallback: 0,
                    allRecordsHaveValidNumReadings: true, // Assume true until a record proves otherwise
                };
            }

            const currentDay = dailyAggregates[record.Fecha];

            // Always collect data for simple average as a potential fallback
            // Assuming record.AvgPML is a valid number as per original function's direct usage.
            // If record.AvgPML can be null, you'll need to add checks.
            currentDay.sumOfAvgPMLsForFallback += record.AvgPML;
            currentDay.countOfRecordsForFallback++;

            // Check and accumulate for weighted average
            if (record.NumReadings !== undefined && record.NumReadings !== null && record.NumReadings > 0) {
                currentDay.sumOfProducts += record.AvgPML * record.NumReadings;
                currentDay.totalNumReadings += record.NumReadings;
            } else {
                // If this record has an AvgPML but lacks valid NumReadings,
                // a pure weighted average for the day (considering all points) might be compromised.
                // We mark the day as not having complete NumReadings for all its parts.
                currentDay.allRecordsHaveValidNumReadings = false;
            }
        });

        const result: PMLDailyAverage[] = [];
        for (const fecha in dailyAggregates) {
            if (dailyAggregates.hasOwnProperty(fecha)) {
                const dayData = dailyAggregates[fecha];
                let calculatedAvgPML: number;

                // Prefer weighted average if all records were suitable and we have total readings
                if (dayData.allRecordsHaveValidNumReadings && dayData.totalNumReadings > 0) {
                    calculatedAvgPML = dayData.sumOfProducts / dayData.totalNumReadings;
                }
                // Fallback to simple average of AvgPMLs if weighted average isn't fully applicable
                else if (dayData.countOfRecordsForFallback > 0) {
                    // This is the "average of averages" calculation.
                    // It's used if not all records had the necessary NumReadings for a weighted calculation.
                    console.warn(
                        `[${fecha}] Using simple average of AvgPMLs. ` +
                        `Reason: Not all records for this day had valid NumReadings for a full weighted average.`
                    );
                    calculatedAvgPML = dayData.sumOfAvgPMLsForFallback / dayData.countOfRecordsForFallback;
                } else {
                    // No records or no valid AvgPMLs for the day
                    calculatedAvgPML = 0; // Or NaN, or handle as per your app's requirements for no data.
                    // Your original DailyAverage interface has AvgPML: number.
                }

                result.push({
                    Fecha: fecha,
                    AvgPML: calculatedAvgPML,
                });
            }
        }
        // Optional: Sort results by date, as object key iteration order is not guaranteed.
        result.sort((a, b) => new Date(a.Fecha).getTime() - new Date(b.Fecha).getTime());
        return result;
    }
};
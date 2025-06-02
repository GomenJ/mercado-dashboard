export type Gerencias = 'CENTRAL' | 'NORESTE' | 'NOROESTE' | 'NORTE' | 'OCCIDENTAL' | 'ORIENTAL' | 'PENINSULAR'

export type PMLYearData = {
    AvgPML: number;
    Fecha: string;
    Gerencia: Gerencias;
    NumReadings?: number; // This will now be populated by your updated endpoint
}

export type PMLCurrentYearData = PMLYearData[]
export type PMLCurrentYearRange = { end: string; start: string }
export type PMLPreviousYearData = PMLYearData[]
export type PMLPreviousYearRange = { end: string; start: string }


export type PMLYearlyData = {
    currentYearData: PMLCurrentYearData;
    currentYearRange: PMLCurrentYearRange;
    previousYearData: PMLPreviousYearData;
    previousYearRange: PMLPreviousYearRange;
}

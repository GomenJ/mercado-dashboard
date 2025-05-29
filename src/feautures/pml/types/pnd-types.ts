export type YearData = {
    Fecha: string;
    average_PML: number;
}

export type CurrentYear = number;
export type CurrentYearData = YearData[];
export type PreviousYear = number;
export type PreviousYearData = YearData[];

export type PNDData = {
    currentYear: CurrentYear;
    currentYearData: CurrentYearData;
    previousYear: PreviousYear;
    previousYearData: PreviousYearData;
}
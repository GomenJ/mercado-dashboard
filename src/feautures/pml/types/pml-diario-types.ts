export type Gerencias = 'CENTRAL' | 'NORESTE' | 'NOROESTE' | 'NORTE' | 'OCCIDENTAL' | 'ORIENTAL' | 'PENINSULAR'

export type PMLDayData = {
    Fecha: string;
    Gerencia: Gerencias;
    Maximo_PML: number;
    Minimo_PML: number;
    Promedio_PML: number;
}

export type PMLLatestDate = string
export type PMLLatestDayData = PMLDayData[]
export type PMLPreviousWeekDate = string
export type PMLPreviousWeekDayData = PMLDayData[]


export type PMLDailyData = {
    latestDate: PMLLatestDate;
    latestDayData: PMLLatestDayData;
    previousWeekDate: PMLPreviousWeekDate;
    previousWeekDayData: PMLPreviousWeekDayData;
}


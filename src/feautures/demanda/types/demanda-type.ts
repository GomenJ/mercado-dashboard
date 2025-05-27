export type SistemaType = 'BCA' | 'SIN' | 'BCS'

export type DemandaData = {
    id: number;
    Demanda: number;
    Generacion: number;
    Pronostico: number;
    Gerencia: string;
    HoraOperacion: number;
    FechaCreacion: string;
    FechaModificacion: string;
    FechaOperacion: string;
    Enlace: number | null;
    Sistema: SistemaType

};

import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);
// Demanda: 1914
// Enlace: null | decimal
// FechaCreacion: "2025-05-26T01:15:00.783000"
// FechaModificacion: "2025-05-26T01:55:00.627000"
// FechaOperacion: "2025-05-26"
// Generacion: 1823
type SistemaType = 'BCA' | 'SIN' | 'BCS'

type DemandaData = {
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

// export const options = {
//     responsive: true,
//     plugins: {
//         legend: {
//             position: 'top' as const,
//         },
//         title: {
//             display: true,
//             text: 'Chart.js Line Chart',
//         },
//     },
// };


// export const data = {
//     labels,
//     datasets: [
//         {
//             label: 'Dataset 1',
//             data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
//             borderColor: 'rgb(255, 99, 132)',
//             backgroundColor: 'rgba(255, 99, 132, 0.5)',
//         },
//         {
//             label: 'Dataset 2',
//             data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
//             borderColor: 'rgb(53, 162, 235)',
//             backgroundColor: 'rgba(53, 162, 235, 0.5)',
//         },
//     ],
// };


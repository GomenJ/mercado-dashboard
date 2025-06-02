import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    type ChartType,
} from 'chart.js';

import { Line } from 'react-chartjs-2';
import type { DemandaData } from '../types/demanda-type';
import { useRef } from 'react';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

interface DemandaDataProps {
    demandaData: DemandaData[]
}

export const DemandaChart = ({ demandaData }: DemandaDataProps) => {
    const chartRef = useRef<any>(null);
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Demanda Actual',
                font: {
                    size: 30,
                    // family: 'Helvetica',
                    // weight: 'bold',
                    // style: 'italic',
                    // size: 50,
                }

            },
        },
        interaction: {
            mode: 'index' as const,
            intersect: false,
        },
        // onClick: (event: MouseEvent) => {
        //     const chart = chartRef.current;
        //     if (!chart) return;
        //     const points = chart.getElementsAtEventForMode(event, 'index', { intersect: false }, true);
        //     if (points.length) {
        //         chart.setActiveElements(points);
        //         chart.tooltip.setActiveElements(points, { x: event.offsetX, y: event.offsetY });
        //         chart.update();
        //     }
        // },
    }

    const labels = Array.from(new Set<number>(demandaData.map((data) => data.HoraOperacion)));
    const data = {
        labels,
        datasets: [
            {
                label: 'Demanda',
                data: labels.map((label) => {
                    const foundData = demandaData.find((data) => data.HoraOperacion === label);
                    return foundData ? foundData.Demanda : 0; // Default to 0 if not found
                }),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
                label: 'Generación',
                data: labels.map((label) => {
                    const foundData = demandaData.find((data) => data.HoraOperacion === label);
                    return foundData ? foundData.Generacion : 0; // Default to 0 if not found
                }),
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
            {
                label: 'Pronóstico',
                data: labels.map((label) => {
                    const foundData = demandaData.find((data) => data.HoraOperacion === label);
                    return foundData ? foundData.Pronostico : 0; // Default to 0 if not found
                }),
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
            }
        ]
    }

    return (
        <>
            <div>
                <Line ref={chartRef} options={options} data={data} />
            </div>
        </>
    )
}

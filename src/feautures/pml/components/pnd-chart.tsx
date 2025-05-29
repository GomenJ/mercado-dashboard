import { useRef, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    type ChartOptions,
    type ChartData,
} from 'chart.js';
import type { PNDData, YearData } from '../types/pnd-types';
// If you use a date adapter for Chart.js (e.g., chartjs-adapter-date-fns), import and register it.
// import 'chartjs-adapter-date-fns'; // or your preferred adapter

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

interface PNDChartProps {
    pndData: PNDData;
    xRange?: { min?: string; max?: string }; // Optional range
}

export const PNDChart = ({ pndData, xRange }: PNDChartProps) => {
    const chartRef = useRef<ChartJS<'line'>>(null);

    const options: ChartOptions<'line'> = {
        responsive: true,
        // maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom' as const,
            },
            title: {
                display: true,
                // Use the years from pndData directly
                text: `Comparativo PND SIN: Año ${pndData.previousYear} vs ${pndData.currentYear}`,
                font: {
                    size: 18,
                },
            },
            // tooltip: {
            //     mode: 'index' as const,
            //     intersect: false,
            // },
        },
        interaction: {
            mode: 'index' as const,
            intersect: false,
        },
        scales: {
            x: {
                // title: {
                //     display: true,
                //     text: 'Fecha (Mes-Día)',
                //     align: 'end',
                // },
                min: xRange?.min, // Optional min value
                max: xRange?.max, // Optional max value
            },
            y: {
                title: {
                    display: true,
                    text: 'PND Promedio',
                },
                beginAtZero: false,
            },
        },
    };

    const processedChartData = useMemo((): ChartData<'line'> => {
        // Destructure directly from pndData prop
        const { currentYearData, previousYearData, currentYear, previousYear } = pndData;

        const createDataMap = (data: YearData[]): Map<string, number> => {
            // Using 'number' as per your YearData type for average_PML
            return new Map(data.map(item => [item.Fecha.substring(5), item.average_PML]));
        };

        const currentYearMap = createDataMap(currentYearData);
        const previousYearMap = createDataMap(previousYearData);

        const allMonthDays = new Set<string>();
        currentYearData.forEach(item => allMonthDays.add(item.Fecha.substring(5)));
        previousYearData.forEach(item => allMonthDays.add(item.Fecha.substring(5)));

        const sortedLabels = Array.from(allMonthDays).sort((a, b) => {
            const [aMonth, aDay] = a.split('-').map(Number);
            const [bMonth, bDay] = b.split('-').map(Number);
            if (aMonth !== bMonth) return aMonth - bMonth;
            return aDay - bDay;
        });

        return {
            labels: sortedLabels,
            datasets: [
                {
                    label: `PML ${currentYear}`,
                    // For data points, if a label exists but there's no corresponding entry in the map,
                    // map.get() will return undefined. Chart.js handles 'undefined' by default as a gap.
                    // Using '?? null' makes it explicit that it should be treated as missing data.
                    data: sortedLabels.map(label => currentYearMap.get(label) ?? null),
                    borderColor: 'rgb(98, 98, 101)', // Blue
                    backgroundColor: 'rgba(98, 98, 101, 0.5)',
                    tension: 0.1,
                    spanGaps: true,
                },
                {
                    label: `PML ${previousYear}`,
                    data: sortedLabels.map(label => previousYearMap.get(label) ?? null),
                    borderColor: 'rgb(133, 170, 220)', // Red
                    backgroundColor: 'rgba(133, 170, 220, 0.5)',
                    tension: 0.1,
                    spanGaps: true,
                },
            ],
        };
    }, [pndData]);

    return (
        <Line ref={chartRef} options={options} data={processedChartData} />
    );
};

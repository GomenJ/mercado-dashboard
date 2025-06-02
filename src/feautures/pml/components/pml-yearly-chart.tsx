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
import type { PMLCurrentYearRange, PMLPreviousYearRange, PMLYearData } from '../types/pml-anual-types';
import type { PMLDailyAverage } from '../utils/filter-data-by-gerencia';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

interface PMLYearlyChartProps {
    pmlData: {
        currentYearRange: PMLCurrentYearRange;
        previousYearRange: PMLPreviousYearRange;
        currentYearData: PMLYearData[] | PMLDailyAverage[];
        previousYearData: PMLYearData[] | PMLDailyAverage[];
    }
    xRange?: { min?: string; max?: string }; // Optional range
}

export const PMLYearlyChart = ({ pmlData, xRange }: PMLYearlyChartProps) => {
    const chartRef = useRef<ChartJS<'line'>>(null);

    const currentYear = pmlData.currentYearRange.start.substring(0, 4); // Extract year for label
    const previousYear = pmlData.previousYearRange.start.substring(0, 4); // Extract year for label
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
                text: `PML promedio SIN: Año ${currentYear} vs ${previousYear}`,
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
                    text: 'PML Promedio',
                },
                beginAtZero: false,
            },
        },
    };

    const processedChartData = useMemo((): ChartData<'line'> => {
        const { currentYearData, previousYearData } = pmlData;

        const createDataMap = (data: PMLYearData[] | PMLDailyAverage[]): Map<string, number> => {
            // Using 'number' as per your YearData type for average_PML
            return new Map(data.map(item => [item.Fecha.substring(5), item.AvgPML]));
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
    }, [pmlData]);

    return (
        <div style={{ height: '400px', width: '100%' }}> {/* Adjust size as needed */}
            <Line ref={chartRef} options={options} data={processedChartData} />
        </div>
    );
};
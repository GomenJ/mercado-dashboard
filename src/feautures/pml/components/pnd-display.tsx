// Parent component (e.g., PNDChartContainer.tsx or PNDPage.tsx)
import { PNDChart } from './pnd-chart.tsx'; // Your main chart
import { BrushChart } from './brush-chart.tsx';       // The new brush chart
import { useState, useMemo, useEffect, useCallback } from 'react';
import type { PNDData } from '../types/pnd-types.ts';

interface ParentProps {
    pndDataFull: PNDData; // The complete dataset from API
}


export const PNDDisplay = ({ pndDataFull }: ParentProps) => {
    const [activeRange, setActiveRange] = useState<{ min?: string; max?: string }>({});
    // In Parent Component (e.g., PNDDisplay)
    const handleRangeChange = useCallback((newRange: { min?: string; max?: string }) => {
        setActiveRange(newRange); // setActiveRange is from useState, inherently stable
    }, []);
    // Extract all labels once for the brush chart and potentially for initial range
    const allSortedLabels = useMemo(() => {
        if (!pndDataFull) return [];
        const allMonthDays = new Set<string>();
        pndDataFull.currentYearData.forEach(item => allMonthDays.add(item.Fecha.substring(5)));
        pndDataFull.previousYearData.forEach(item => allMonthDays.add(item.Fecha.substring(5)));
        return Array.from(allMonthDays).sort((a, b) => {
            const [aMonth, aDay] = a.split('-').map(Number);
            const [bMonth, bDay] = b.split('-').map(Number);
            if (aMonth !== bMonth) return aMonth - bMonth;
            return aDay - bDay;
        })
    }, [pndDataFull]);

    // Set initial full range once labels are available
    useEffect(() => {
        if (allSortedLabels.length > 0) {
            setActiveRange({ min: allSortedLabels[0], max: allSortedLabels[allSortedLabels.length - 1] });
        }
    }, [allSortedLabels]);


    if (!pndDataFull || allSortedLabels.length === 0) {
        return <p></p>
    }

    return (
        <>
            <div className='mr-5 w-[30rem]'>
                <BrushChart
                    pndData={pndDataFull}
                    allLabels={allSortedLabels}
                    onRangeChange={handleRangeChange}
                    initialMinLabel={activeRange.min} // Pass current range back to potentially re-init brush
                    initialMaxLabel={activeRange.max}
                />
                <div style={{ marginTop: '20px' }}> {/* Your PNDChart original container */}
                    <PNDChart pndData={pndDataFull} xRange={activeRange} />
                </div>
            </div>
        </>
    );
};
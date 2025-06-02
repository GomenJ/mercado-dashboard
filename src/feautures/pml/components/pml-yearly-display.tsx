import { useState, useMemo, useEffect, useCallback } from 'react';
import type { PMLYearlyData } from '../types/pml-anual-types';
import { PMLYearlyChart } from './pml-yearly-chart';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { processPMLData } from '../utils/filter-data-by-gerencia';
import { PMLBrushChart } from './pml-brush-chart';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { SIN_GERENCIAS } from '@/routes/pml-mda';

interface ParentProps {
    pmlDataFull: PMLYearlyData; // The complete dataset from API
}

export const PMLYearlyDisplay = ({ pmlDataFull }: ParentProps) => {
    const navigate = useNavigate()

    const [activeRange, setActiveRange] = useState<{ min?: string; max?: string }>({});
    const handleRangeChange = useCallback((newRange: { min?: string; max?: string }) => {
        setActiveRange(newRange); // setActiveRange is from useState, inherently stable
    }, []);

    const { gerencia } = useSearch({
        from: '/pml-mda/',
    });

    const pmlFilterData = {
        currentYearRange: pmlDataFull.currentYearRange,
        previousYearRange: pmlDataFull.previousYearRange,
        currentYearData: processPMLData(pmlDataFull.currentYearData, gerencia),
        previousYearData: processPMLData(pmlDataFull.previousYearData, gerencia),
    }

    // Extract all labels once for the brush chart and potentially for initial range
    const allSortedLabels = useMemo(() => {
        if (!pmlFilterData) return [];
        const allMonthDays = new Set<string>();
        pmlFilterData.currentYearData.forEach(item => allMonthDays.add(item.Fecha.substring(5)));
        pmlFilterData.previousYearData.forEach(item => allMonthDays.add(item.Fecha.substring(5)));
        return Array.from(allMonthDays).sort((a, b) => {
            const [aMonth, aDay] = a.split('-').map(Number);
            const [bMonth, bDay] = b.split('-').map(Number);
            if (aMonth !== bMonth) return aMonth - bMonth;
            return aDay - bDay;
        })
    }, [gerencia]);

    // Set initial full range once labels are available
    useEffect(() => {
        if (allSortedLabels.length > 0) {
            setActiveRange({ min: allSortedLabels[0], max: allSortedLabels[allSortedLabels.length - 1] });
        }
    }, [allSortedLabels]);


    if (!pmlDataFull || allSortedLabels.length === 0) {
        return <p></p>
    }


    return (
        <>
            <div className='mr-5 w-[30rem]'>
                <PMLBrushChart
                    pmlData={pmlFilterData}
                    allLabels={allSortedLabels}
                    onRangeChange={handleRangeChange}
                    initialMinLabel={activeRange.min} // Pass current range back to potentially re-init brush
                    initialMaxLabel={activeRange.max}
                />
                <div style={{ marginTop: '20px' }}> {/* Your PNDChart original container */}
                    <Select value={undefined}
                        onValueChange={(value) => {
                            console.log("value", value)
                            const searchValue = value === 'undefined' ? undefined : value as typeof gerencia;
                            navigate({
                                to: '/pml-mda',
                                search: { gerencia: searchValue },
                                replace: true,
                            });
                        }}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Gerencias" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem
                                key={'undefined'}
                                value={'undefined'}
                            >
                                Todas las Gerencias
                            </SelectItem>
                            {
                                SIN_GERENCIAS.map((gerenciaOption) => (
                                    <SelectItem
                                        key={gerenciaOption}
                                        value={gerenciaOption}
                                    >
                                        {gerenciaOption}
                                    </SelectItem>
                                ))
                            }
                        </SelectContent>
                    </Select>
                    <PMLYearlyChart pmlData={pmlFilterData} xRange={activeRange} />
                </div>
            </div>
        </>
    );
}

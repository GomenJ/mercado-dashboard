import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, type ChartData, type ChartOptions } from 'chart.js';
import type { PMLCurrentYearRange, PMLPreviousYearRange, PMLYearData } from '../types/pml-anual-types';
import type { PMLDailyAverage } from '../utils/filter-data-by-gerencia';

interface BrushChartProps {
    pmlData: {
        currentYearRange: PMLCurrentYearRange;
        previousYearRange: PMLPreviousYearRange;
        currentYearData: PMLYearData[] | PMLDailyAverage[];
        previousYearData: PMLYearData[] | PMLDailyAverage[];
    }
    allLabels: string[];
    onRangeChange: (range: { min?: string; max?: string }) => void;
    initialMinLabel?: string;
    initialMaxLabel?: string;
}

const HANDLE_WIDTH_PX = 10;
const MIN_RANGE_DIFF = 0;

export const PMLBrushChart = ({ pmlData, allLabels, onRangeChange, initialMinLabel, initialMaxLabel }: BrushChartProps) => {
    const brushChartRef = useRef<ChartJS<'line'>>(null);
    const brushContainerRef = useRef<HTMLDivElement>(null);

    // Effect A (Prop Sync - user's version that depends on [allLabels])
    // This effect initializes/resets based on allLabels changing.
    // For live updates during drag, this effect being less reactive to initialMin/MaxLabel changes is helpful.
    useEffect(() => {
        if (draggingHandle || !allLabels.length) {
            // console.log('BRUSH EFFECT A (User Version): dragging or no labels, returning');
            return;
        }
        // console.log('BRUSH EFFECT A (User Version): Running due to allLabels change.');
        // This logic uses initialMinLabel/initialMaxLabel from closure of when allLabels last changed.
        // This is fine for initialization based on allLabels.
        let expectedStartIndex = 0;
        if (initialMinLabel) {
            const idx = allLabels.indexOf(initialMinLabel);
            if (idx !== -1) expectedStartIndex = idx;
        }
        let expectedEndIndex = allLabels.length > 0 ? allLabels.length - 1 : 0;
        if (initialMaxLabel) {
            const idx = allLabels.indexOf(initialMaxLabel);
            if (idx !== -1) expectedEndIndex = idx;
        }
        if (expectedStartIndex > expectedEndIndex && allLabels.length > 0) {
            expectedStartIndex = expectedEndIndex;
        } else if (allLabels.length === 0) {
            expectedStartIndex = 0; expectedEndIndex = 0;
        }
        if (expectedStartIndex !== startIndex) setStartIndex(expectedStartIndex);
        if (expectedEndIndex !== endIndex) setEndIndex(expectedEndIndex);
    }, [allLabels]); // User's dependency change

    // Initialize startIndex & endIndex based on props passed at mount,
    // falling back to full range if props are not initially available.
    const getInitialIdx = useCallback((label: string | undefined, fallbackSide: 'start' | 'end') => {
        if (!allLabels || allLabels.length === 0) return 0;
        if (label !== undefined) {
            const idx = allLabels.indexOf(label);
            if (idx !== -1) return idx;
        }
        return fallbackSide === 'start' ? 0 : allLabels.length - 1;
    }, [allLabels]);

    const [startIndex, setStartIndex] = useState<number>(() => getInitialIdx(initialMinLabel, 'start'));
    const [endIndex, setEndIndex] = useState<number>(() => getInitialIdx(initialMaxLabel, 'end'));
    const [draggingHandle, setDraggingHandle] = useState<'left' | 'right' | null>(null);

    // If parent changes initialMin/MaxLabel AFTER mount and NOT due to allLabels change,
    // and we are NOT dragging, we might want to respect that.
    // This is where the original Prop Sync effect was more comprehensive.
    // For now, we'll rely on the user's simpler Effect A and see if live updates work.
    // If full external control is needed later, Effect A would need its original dependencies back,
    // and the stability of live updates would need to be re-verified.

    // --- brushChartData & brushChartOptions useMemo hooks (same as your working version) ---
    const brushChartData: ChartData<'line'> = useMemo(() => {
        const { currentYearData } = pmlData;
        const currentYear = pmlData.currentYearRange.start.substring(0, 4); // Extract year for label

        const createDataMap = (data: PMLYearData[] | PMLDailyAverage[]): Map<string, number> =>
            new Map(data.map(item => [item.Fecha.substring(5), item.AvgPML]));
        const currentYearMap = createDataMap(currentYearData);
        return {
            labels: allLabels,
            datasets: [{
                label: `Overview ${currentYear}`,
                data: allLabels.map(label => currentYearMap.get(label) ?? null),
                borderColor: 'rgb(150, 150, 150)', backgroundColor: 'rgba(150, 150, 150, 0.1)',
                tension: 0.2, pointRadius: 0, borderWidth: 1, fill: true,
            }],
        };
    }, [pmlData, allLabels]);

    const brushChartOptions: ChartOptions<'line'> = useMemo(() => ({
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, title: { display: false }, tooltip: { enabled: false }, },
        scales: {
            x: { display: true, ticks: { display: true, autoSkip: true, maxTicksLimit: Math.max(2, Math.floor((allLabels?.length || 0) / 15)), font: { size: 8 } }, grid: { display: false }, },
            y: { display: false, grid: { display: false }, },
        },
        animation: { duration: 0 }, layout: { padding: { left: 0, right: 0, top: 5, bottom: 0 } }
    }), [allLabels?.length]);

    // --- getIndexFromMouseEvent & handleMouseDown (same as your working version) ---
    const getIndexFromMouseEvent = useCallback((event: MouseEvent): number => {
        if (!brushContainerRef.current || !brushChartRef.current || !allLabels?.length) return -1;
        const chart = brushChartRef.current;
        const canvasRect = brushContainerRef.current.getBoundingClientRect();
        const mouseX = event.clientX - canvasRect.left;
        const index = chart.scales.x.getValueForPixel(mouseX);
        if (typeof index === 'number') {
            return Math.max(0, Math.min(Math.round(index), allLabels.length - 1));
        }
        return -1;
    }, [allLabels?.length]);

    const handleMouseDown = useCallback((handle: 'left' | 'right') => {
        setDraggingHandle(handle);
    }, []);


    // Effect B: Handles dragging AND reports live changes
    useEffect(() => {
        const handleGlobalMouseMove = (event: MouseEvent) => {
            if (!draggingHandle || !allLabels || !allLabels.length) return;
            event.preventDefault();

            const potentialNewIndex = getIndexFromMouseEvent(event);
            if (potentialNewIndex === -1) return;

            let currentStartIndex = startIndex; // Use local vars for new values
            let currentEndIndex = endIndex;
            let rangeActuallyChanged = false;

            if (draggingHandle === 'left') {
                const proposedStartIndex = Math.max(0, Math.min(potentialNewIndex, endIndex - MIN_RANGE_DIFF));
                if (proposedStartIndex !== startIndex) {
                    setStartIndex(proposedStartIndex);
                    currentStartIndex = proposedStartIndex; // Update local var for this event cycle
                    rangeActuallyChanged = true;
                }
            } else if (draggingHandle === 'right') {
                const proposedEndIndex = Math.min(allLabels.length - 1, Math.max(potentialNewIndex, startIndex + MIN_RANGE_DIFF));
                if (proposedEndIndex !== endIndex) {
                    setEndIndex(proposedEndIndex);
                    currentEndIndex = proposedEndIndex; // Update local var for this event cycle
                    rangeActuallyChanged = true;
                }
            }

            // If the range was actually changed by this mouse move event
            if (rangeActuallyChanged && currentStartIndex <= currentEndIndex) {
                const minLabel = allLabels[currentStartIndex];
                const maxLabel = allLabels[currentEndIndex];
                if (minLabel !== undefined && maxLabel !== undefined) {
                    // Call onRangeChange for live update
                    onRangeChange({ min: minLabel, max: maxLabel });
                }
            }
        };

        const handleGlobalMouseUp = () => {
            if (draggingHandle) {
                setDraggingHandle(null);
                // The "Reporting Effect" (Effect C) will now run because draggingHandle changed.
                // It will perform the final check against initialMinLabel/initialMaxLabel.
            }
        };

        if (draggingHandle) {
            window.addEventListener('mousemove', handleGlobalMouseMove);
            window.addEventListener('mouseup', handleGlobalMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleGlobalMouseMove);
            window.removeEventListener('mouseup', handleGlobalMouseUp);
        };
    }, [draggingHandle, getIndexFromMouseEvent, startIndex, endIndex, allLabels, onRangeChange, MIN_RANGE_DIFF]);


    // Effect C: Reporting Effect (final check, handles non-drag updates if Effect A is simplified)
    useEffect(() => {
        // This effect runs when startIndex, endIndex, or draggingHandle changes.
        // Its main job is to report when dragging STOPS, or if startIndex/endIndex change programmatically
        // (e.g. by the simplified Effect A if allLabels re-populates).
        if (!draggingHandle && allLabels && allLabels.length > 0 && startIndex <= endIndex) {
            const minLabel = allLabels[startIndex];
            const maxLabel = allLabels[endIndex];

            // Only call onRangeChange if the derived range truly differs from what the parent knows.
            // This prevents an echo after a live update already synced the parent.
            if (minLabel !== undefined && maxLabel !== undefined &&
                (minLabel !== initialMinLabel || maxLabel !== initialMaxLabel)) {
                onRangeChange({ min: minLabel, max: maxLabel });
            }
        }
    }, [startIndex, endIndex, draggingHandle, allLabels, onRangeChange, initialMinLabel, initialMaxLabel]);


    // --- Rendering logic for handles and overlay (useMemo and JSX as in your working version) ---
    const rangeStartPct = useMemo(() => (allLabels && allLabels.length > 1 ? (startIndex / (allLabels.length - 1)) : 0) * 100, [startIndex, allLabels]);
    const rangeEndPct = useMemo(() => (allLabels && allLabels.length > 1 ? (endIndex / (allLabels.length - 1)) : 100) * 100, [endIndex, allLabels]);

    return (
        <div
            ref={brushContainerRef} // 1. Outermost Container
            style={{
                height: '40px', width: '80%', position: 'relative',
                left: '5%', margin: '0 auto', overflow: 'hidden',
                padding: `0 ${HANDLE_WIDTH_PX / 2}px`,
                boxSizing: 'border-box', userSelect: 'none',
            }}
        >
            {/* 2. The Actual Line Chart (Brush Overview) */}
            {allLabels && allLabels.length > 0 && (
                <Line ref={brushChartRef} options={brushChartOptions} data={brushChartData} />
            )}

            {/* 3. Selected Range Overlay */}
            <div
                style={{
                    position: 'absolute', left: `${rangeStartPct}%`,
                    width: `${rangeEndPct - rangeStartPct}%`,
                    top: `${brushChartRef.current?.chartArea?.top ?? 0}px`,
                    height: `${(brushChartRef.current?.chartArea?.height ?? (brushContainerRef.current?.clientHeight || 0))}px`,
                    background: 'rgba(53, 162, 235, 0.2)',
                    pointerEvents: 'none', zIndex: 1,
                }}
            />

            {/* 4. Left Draggable Handle */}
            <div
                style={{
                    position: 'absolute', left: `${rangeStartPct}%`,
                    transform: 'translateX(-50%)',
                    top: '0px', bottom: '0px', width: `${HANDLE_WIDTH_PX}px`,
                    background: 'rgba(0, 0, 0, 0.4)', cursor: 'ew-resize', zIndex: 2,
                }}
                onMouseDown={(e) => { e.preventDefault(); handleMouseDown('left'); }}
            />

            {/* 5. Right Draggable Handle */}
            <div
                style={{
                    position: 'absolute', left: `${rangeEndPct}%`,
                    transform: 'translateX(-50%)',
                    top: '0px', bottom: '0px', width: `${HANDLE_WIDTH_PX}px`,
                    background: 'rgba(0, 0, 0, 0.4)', cursor: 'ew-resize', zIndex: 2,
                }}
                onMouseDown={(e) => { e.preventDefault(); handleMouseDown('right'); }}
            />
        </div>
    );
};


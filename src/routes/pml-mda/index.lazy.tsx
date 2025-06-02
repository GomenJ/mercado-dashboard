import { createLazyFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from "@tanstack/react-query";

import { MexicoGerenciaSVGMap } from '@/components/mexico-gerencia-svg-map';
import { PNDDisplay } from '@/feautures/pml/components/pnd-display';
import { pmlAnualQueryOptions } from '@/feautures/pml/api/pml-anual-query-options';
import { pndQueryOptions } from '@/feautures/pml/api/pnd-query-options';
import { PMLYearlyDisplay } from '@/feautures/pml/components/pml-yearly-display';
import { pmlDiarioQueryOptions } from '@/feautures/pml/api/pml-diario-query-options';


export const Route = createLazyFileRoute('/pml-mda/')({
  component: RouteComponent,
  pendingComponent: () => <div >Loading...</div>,
  errorComponent: () => <div>Error loading data</div>,
})

function RouteComponent() {
  const { data: pndData } = useSuspenseQuery(pndQueryOptions);
  const { data: pmlYearlyData } = useSuspenseQuery(pmlAnualQueryOptions)
  const { data: pmlDailyData } = useSuspenseQuery(pmlDiarioQueryOptions)

  return (
    <>
      <h1>Hello "/pml-mda/"!</h1>
      <MexicoGerenciaSVGMap regionData={pmlDailyData} />
      <div className='flex gap-2 justify-center'>
        <PNDDisplay pndDataFull={pndData} />
        <PMLYearlyDisplay pmlDataFull={pmlYearlyData} />
      </div>
    </>
  )
}

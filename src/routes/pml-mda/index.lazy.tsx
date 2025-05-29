import { createLazyFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from "@tanstack/react-query";
import { pndQueryOptions } from '@/feautures/pml/api/pnd-query-options';
import { MexicoGerenciaSVGMap } from '@/components/mexico-gerencia-svg-map';
import { PNDDisplay } from '@/feautures/pml/components/pnd-display';

export const Route = createLazyFileRoute('/pml-mda/')({
  component: RouteComponent,
  pendingComponent: () => <div>Loading...</div>,
  errorComponent: () => <div>Error loading data</div>,
})

function RouteComponent() {
  const { data: pndData } = useSuspenseQuery(pndQueryOptions);

  return (

    <>
      <div>Hello "/pml-mda/"!</div>
      <MexicoGerenciaSVGMap />
      <PNDDisplay pndDataFull={pndData} />
    </>
  )
}

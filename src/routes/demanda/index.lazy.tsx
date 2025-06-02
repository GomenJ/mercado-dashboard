import { createLazyFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { demandaQueryOptions } from "@/feautures/demanda/api/demanda-query-options";
// import { DemandaChart } from "@/feautures/demanda/components/demanda-chart";
import { DemandaForm } from "@/feautures/demanda/components/demanda-form";

export const Route = createLazyFileRoute("/demanda/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { data } = useSuspenseQuery(demandaQueryOptions);
	return (
		<>
			<h1 className="text-2xl font-bold">Demanda Actual</h1>
			<div className="mt-4">
				{/* <pre className="bg-gray-100 p-4 rounded"> */}
				{/* <DemandaChart demandaData={data} /> */}
				<DemandaForm demandaData={data} />
				{/* </pre> */}
			</div>
		</>
	);
}

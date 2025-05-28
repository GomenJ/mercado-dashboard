import { MexicoGerenciaSVGMap } from "@/components/mexico-gerencia-svg-map";
import { createFileRoute } from "@tanstack/react-router";
// import { useEffect } from "react";

export const Route = createFileRoute("/pml-mda/")({
	component: RouteComponent,
});

function RouteComponent() {
	console.log("PML-MDA route loaded");
	return (
		<>
			<div>Hello "/pml-mda/"!</div>
			<div id="svgFile" className="w-72 h-80"></div>
			<MexicoGerenciaSVGMap />
		</>
	);
}

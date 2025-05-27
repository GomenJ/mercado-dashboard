import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/demanda-balance/")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/demanda-balance/"!</div>;
}

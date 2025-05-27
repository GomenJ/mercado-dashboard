import { demandaQueryOptions } from "@/feautures/demanda/api/demanda-query-options";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/demanda/")({
	loader: ({ context: { queryClient } }) => {
		return queryClient.ensureQueryData(demandaQueryOptions);
	},
	pendingComponent: () => <div>Loading...</div>,
});

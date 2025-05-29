import { pndQueryOptions } from "@/feautures/pml/api/pnd-query-options";
import { createFileRoute } from "@tanstack/react-router";
// import { useEffect } from "react";

export const Route = createFileRoute("/pml-mda/")({
	loader: ({ context: { queryClient } }) => {
		return queryClient.ensureQueryData(pndQueryOptions)
	},
});


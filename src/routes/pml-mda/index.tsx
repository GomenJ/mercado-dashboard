import { pmlAnualQueryOptions } from "@/feautures/pml/api/pml-anual-query-options";
import { pmlDiarioQueryOptions } from "@/feautures/pml/api/pml-diario-query-options";
import { pndQueryOptions } from "@/feautures/pml/api/pnd-query-options";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

export const SIN_GERENCIAS = [
	"CENTRAL",
	"NORESTE",
	"NOROESTE",
	"NORTE",
	"OCCIDENTAL",
	"ORIENTAL",
	"PENINSULAR",
] as const;


const pmlMdaSchema = z.object({
	gerencia: z.enum(SIN_GERENCIAS).optional()
})

export const Route = createFileRoute("/pml-mda/")({
	validateSearch: pmlMdaSchema,
	loader: ({ context: { queryClient } }) => {
		return Promise.all([
			queryClient.ensureQueryData(pmlAnualQueryOptions),
			queryClient.ensureQueryData(pndQueryOptions),
			queryClient.ensureQueryData(pmlDiarioQueryOptions)
		]);
	},
});


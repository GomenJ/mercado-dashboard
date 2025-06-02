import { demandaQueryOptions } from "@/feautures/demanda/api/demanda-query-options";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const SIN_GERENCIAS = [
	"Central",
	"Noreste",
	"Noroeste",
	"Norte",
	"Occidental",
	"Oriental",
	"Peninsular",
] as const;
const BCS_GERENCIAS = ["Baja California Sur"] as const;
const BCA_GERENCIAS = ["Baja California"] as const;

const demandaSchema = z.discriminatedUnion("sistema", [
	z.object({
		sistema: z.literal("SIN"),
		gerencia: z.enum(SIN_GERENCIAS).optional(),
	}),
	z.object({
		sistema: z.literal("BCS"),
		gerencia: z.enum(BCS_GERENCIAS).optional(),
	}),
	z.object({
		sistema: z.literal("BCA"),
		gerencia: z.enum(BCA_GERENCIAS).optional(),
	}),
]);

export const Route = createFileRoute("/demanda/")({
	validateSearch: (search) => {
		// If sistema is missing, default to "sin"
		return demandaSchema.parse({
			sistema: search.sistema ?? "SIN",
			gerencia: search.gerencia,
		});
	},
	loader: ({ context: { queryClient } }) => {
		return queryClient.ensureQueryData(demandaQueryOptions);
	},
	pendingComponent: () => <div>Loading...</div>,
});

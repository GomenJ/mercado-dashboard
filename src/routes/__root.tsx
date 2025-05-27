import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import type { QueryClient } from "@tanstack/react-query";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export const Route = createRootRouteWithContext<{
	queryClient: QueryClient; // Replace with your actual query client type
}>()({
	component: () => (
		<>
			<SidebarProvider>
				<div className="flex h-dvh w-full gap-2 overflow-hidden">
					<AppSidebar />
					<SidebarTrigger />
					<main className="hide-scrollbar flex-1 overflow-scroll md:mx-10">
						<Outlet />
						{/* <Toaster richColors position="top-center" /> */}
					</main>
				</div>
				<TanStackRouterDevtools />
			</SidebarProvider>
		</>
	),
});

import { createRootRouteWithContext, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import type { QueryClient } from '@tanstack/react-query'

export const Route = createRootRouteWithContext<{
    queryClient: QueryClient // Replace with your actual query client type
}>()({
    component: () => (
        <>
            <div className="p-2 flex gap-2">
                <Link to="/" className="[&.active]:font-bold">
                    Home
                </Link>{' '}
                <Link to="/about" className="[&.active]:font-bold">
                    About
                </Link>
                <Link to="/demanda" className="[&.active]:font-bold">
                    Demanda
                </Link>
            </div>
            <hr />
            <Outlet />
            <TanStackRouterDevtools />
        </>
    ),
})
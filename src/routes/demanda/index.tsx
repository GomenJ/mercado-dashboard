import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/demanda/')({
  // loader: ({ context: { queryClient } }) => {
  // },
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/demanda/demanda"!</div>
}

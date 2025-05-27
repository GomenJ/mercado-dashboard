import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/capacidad-transferencia/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/capacidad-transferencia/"!</div>
}

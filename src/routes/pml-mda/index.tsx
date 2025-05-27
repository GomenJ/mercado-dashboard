import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/pml-mda/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/pml-mda/"!</div>
}

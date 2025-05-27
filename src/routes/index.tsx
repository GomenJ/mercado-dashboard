import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: Index,
});

function Index() {
	// const navigation = useNavigate();

	// return (
	//    <Navigate to="/"/>
	// );
	return (
		<div className="p-2">
			<h3>Welcome Home!</h3>
		</div>
	);
}

import { Home, Scale, HousePlug } from "lucide-react";

import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import { Link, type LinkProps } from "@tanstack/react-router";

type toType = LinkProps["to"];

type extendedLinkProps = {
	title: string;
	to: toType;
	icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

// Menu items.
const links: extendedLinkProps[] = [
	{
		title: "Home",
		to: "/",
		icon: Home,
	},
	{
		title: "Demanda balance",
		to: "/demanda-balance",
		icon: Scale,
	},
	{
		title: "Demanda en tiempo real",
		to: "/demanda",
		icon: HousePlug,
	},
	{
		title: "PML MDA",
		to: "/pml-mda",
		icon: Scale,
	},
];

export function AppSidebar() {
	const { state } = useSidebar();
	console.log("AppSidebar state", state);
	return (
		<Sidebar collapsible="icon">
			<SidebarHeader>{/* <p>Content</p> */}</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Consulta de datos</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{links.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild tooltip={item.title}>
										<Link to={item.to} className="py-6">
											<item.icon />
											<span>{item.title}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	);
}

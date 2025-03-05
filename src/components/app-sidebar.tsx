import * as React from "react";
import {Box, Command, SquareTerminal, WifiIcon} from "lucide-react";

import {NavMain} from "@/components/nav-main";
import {NavUser} from "@/components/nav-user";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Client, getClient} from "@/services/client/client-service.ts";

const data = {
    navMain: [
        {
            title: "Dashboard",
            url: "#",
            icon: SquareTerminal,
            isActive: true,
            items: [
                {
                    title: "Overview",
                    url: "/dashboard",
                },
            ],
        },
        {
            title: "Library",
            url: "#",
            icon: Box,
            items: [
                {
                    title: "Clients",
                    url: "/dashboard/clients",
                },
                {
                    title: "Departments",
                    url: "/dashboard/departments",
                },
                {
                    title: "Users",
                    url: "/dashboard/users",
                },
                {
                    title: "Locations",
                    url: "/dashboard/locations",
                },
                {
                    title: "Readers",
                    url: "/dashboard/readers",
                },
            ],
        },{
            title: "Interactions",
            url: "#",
            icon: WifiIcon,
            items: [
                {
                    title: "Interactions Log",
                    url: "/dashboard/logs",
                },
                {
                    title: "Active Sessions",
                    url: "/dashboard/active-sessions",
                },
                {
                    title: "Sessions",
                    url: "/dashboard/sessions",
                }
            ],
        },
    ],
};

export function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
    const [client, setClient] = useState<{
        name: string,
        email: string,
        avatar: string,
    }>({
        name: "shadcn",
        email: "me@example.com",
        avatar: "/avatars/shadcn.jpg",
    })

    const navigate = useNavigate();
    const userIdFromStorage = localStorage.getItem("logged-in-user");

    useEffect(() => {
        const fetchAndSetUser = async () => {
            if (!userIdFromStorage) return;

            const fetchedUser: Client | null = await getClient(userIdFromStorage);
            if (fetchedUser) {
                const newClient = {
                    name: `${fetchedUser.firstName} ${fetchedUser.lastName}`,
                    email: "no.email@gmail.com",
                    avatar: "No Avatar"
                }

                setClient(newClient);
            } else {
                navigate("/login")
            }

        };

        fetchAndSetUser();
    }, []);

    return (
        <Sidebar
            className="top-[--header-height] !h-[calc(100svh-var(--header-height))]"
            {...props}
        >
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <a href="#">
                                <div
                                    className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                    <Command className="size-4"/>
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-bold text-lg">VAULTS</span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain}/>
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={client}/>
            </SidebarFooter>
        </Sidebar>
    );
}

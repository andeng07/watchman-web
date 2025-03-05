import {AppSidebar} from "@/components/app-sidebar.tsx"
import {SiteHeader} from "@/components/site-header.tsx"
import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar.tsx"
import {Outlet, useLocation} from "react-router-dom";
import {useMemo} from "react";

export default function DashboardPage() {
    const location = useLocation();

    const breadcrumbItems = useMemo(() => {
        const paths = location.pathname.split("/").filter(Boolean);
        let accumulatedPath = "";

        return paths.map((path, index) => {
            accumulatedPath += `/${path}`;
            return {
                label: path.charAt(0).toUpperCase() + path.slice(1),
                href: index < paths.length - 1 ? accumulatedPath : undefined,
            };
        });
    }, [location.pathname]);

    return (
        <div className="[--header-height:calc(theme(spacing.14))] flex flex-col h-screen">
            <SidebarProvider className="flex flex-col flex-1">
                <SiteHeader items={breadcrumbItems} />
                <div className="flex flex-1">
                    <AppSidebar />
                    <SidebarInset className="flex flex-1">
                        <div className="pt-[--header-height]">
                            <Outlet />
                        </div>
                    </SidebarInset>
                </div>
            </SidebarProvider>
        </div>
    );

}

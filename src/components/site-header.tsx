import { Menu } from "lucide-react" // SidebarIcon isn't a valid Lucide icon

import { SearchForm } from "@/components/search-form"
import {
  Breadcrumb,
  BreadcrumbItem as BreadcrumbItemComponent,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useSidebar } from "@/components/ui/sidebar"

interface BreadcrumbItemData {
  label: string;
  href?: string;
}

interface BreadcrumbItems {
  items: BreadcrumbItemData[];
}

export function SiteHeader({ items }: BreadcrumbItems) {
  const { toggleSidebar } = useSidebar()

  return (
      <header className="flex fixed top-0 z-50 w-full items-center border-b bg-background">
        <div className="flex h-[--header-height] w-full items-center gap-2 px-4">
          <Button
              className="h-8 w-8"
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
          >
            <Menu />
          </Button>
          <Separator orientation="vertical" className="mr-2 h-4" />
          {/* Dynamic Breadcrumb */}
          <Breadcrumb className="hidden sm:block">
            <BreadcrumbList>
              {items.map((item, index) => (
                  <BreadcrumbItemComponent key={index}>
                    {item.href ? (
                        <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
                    ) : (
                        <BreadcrumbPage className="font-bold">{item.label}</BreadcrumbPage>
                    )}
                    {index < items.length - 1 && <BreadcrumbSeparator />}
                  </BreadcrumbItemComponent>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
  )
}


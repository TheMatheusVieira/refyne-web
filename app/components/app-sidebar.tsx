import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  CodeXmlIcon,
  ListChecksIcon,
  HistoryIcon,
  SlidersHorizontalIcon,
  BookOpenIcon,
} from "lucide-react";

const navItems = [
  { label: "Editor", icon: CodeXmlIcon },
  { label: "Results", icon: ListChecksIcon },
  { label: "History", icon: HistoryIcon },
  { label: "Rules", icon: SlidersHorizontalIcon },
  { label: "Documentation", icon: BookOpenIcon },
];

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="bg-[#181C22]">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="m-2 gap-4">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-green-500" />
                <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="text-sm font-semibold text-gray-100">
                    PROJECT ALPHA
                  </span>
                  <span className="text-xs text-gray-500">ANALYSIS ACTIVE</span>
                </div>
              </div>
              {navItems.map((item) => (
                <SidebarMenuItem className="text-[#94A3B8]" key={item.label}>
                  <SidebarMenuButton asChild>
                    <button>
                      <item.icon className="size-4 text-[#94A3B8]" />
                      <span>{item.label}</span>
                    </button>
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

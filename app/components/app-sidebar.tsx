import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
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
  LogOut,
} from "lucide-react";

const navItems = [
  { label: "Editor", icon: CodeXmlIcon, route: '/' },
  { label: "Results", icon: ListChecksIcon, route: '/results' },
  { label: "History", icon: HistoryIcon, route: '/history' },
  { label: "Rules", icon: SlidersHorizontalIcon, route: '/rules' },
];

const navItems2 = [
 { label: "Documentation", icon: BookOpenIcon, route: '/documentation' },
 { label: "Logout", icon: LogOut, route: '/logout' },
]

export function AppSidebar() {
  return (
    <Sidebar collapsible="none">
      <SidebarContent className="bg-[#181C22]">
        <SidebarGroup>
          <SidebarGroupContent>

            <SidebarMenu className="m-2 gap-6">

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
                  <SidebarMenuButton asChild className="text-[16px] font-medium hover:bg-[#1C2026] rounded-none hover:h-10 hover:text-[#9ECAFF] hover:border-l-4 hover:border-l-[#00E475] [&:hover_svg]:text-[#9ECAFF]">
                    <button onClick={() => (window.location.href = item.route)}>
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
      <SidebarFooter className="bg-[#181C22]">
        <SidebarMenu className="m-2 gap-6">
          {navItems2.map((item) => (
            <SidebarMenuItem className="text-[#94A3B8]" key={item.label}>
              <SidebarMenuButton asChild className="text-[16px] font-medium hover:bg-[#1C2026] rounded-none hover:h-10 hover:text-[#9ECAFF] hover:border-l-4 hover:border-l-[#00E475] [&:hover_svg]:text-[#9ECAFF]">
                <button onClick={() => (window.location.href = item.route)}>
                  <item.icon className="size-4 text-[#94A3B8]" />
                  <span>{item.label}</span>
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

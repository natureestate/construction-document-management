import * as React from "react"
import {
  Users,
  HardHat,
  FileText,
  Package,
  Receipt,
  ClipboardCheck,
  LayoutDashboard,
  Settings,
  HelpCircle,
  Building2,
  Wrench
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "ผู้ดูแลระบบ",
    email: "admin@construction.com",
    avatar: "",
  },
  navMain: [
    {
      title: "แดชบอร์ด",
      url: "/",
      icon: LayoutDashboard,
    },
    {
      title: "จัดการลูกค้า",
      url: "/customers",
      icon: Users,
    },
    {
      title: "จัดการช่างรับเหมา",
      url: "/contractors", 
      icon: HardHat,
      items: [
        {
          title: "รายการช่างรับเหมา",
          url: "/contractors",
        },
        {
          title: "เพิ่มช่างรับเหมา",
          url: "/contractors/new",
        },
      ],
    },
    {
      title: "สัญญาจ้างช่าง",
      url: "/contractor-contracts",
      icon: FileText,
      items: [
        {
          title: "รายการสัญญา",
          url: "/contractor-contracts",
        },
        {
          title: "สร้างสัญญาใหม่",
          url: "/contractor-contracts/new",
        },
      ],
    },
    {
      title: "จัดการวัสดุ",
      url: "/materials",
      icon: Package,
    },
    {
      title: "ส่วนต่างวัสดุ",
      url: "/material-differences",
      icon: Wrench,
      items: [
        {
          title: "รายการส่วนต่าง",
          url: "/material-differences",
        },
        {
          title: "บันทึกใหม่",
          url: "/material-differences/new",
        },
      ],
    },
    {
      title: "การจ่ายเงินช่าง",
      url: "/contractor-payments",
      icon: Receipt,
      items: [
        {
          title: "รายการจ่ายเงิน",
          url: "/contractor-payments",
        },
        {
          title: "บันทึกการจ่าย",
          url: "/contractor-payments/new",
        },
      ],
    },
  ],
  navTemplates: [
    {
      title: "เทมเพลตเอกสาร",
      url: "/templates",
      icon: ClipboardCheck,
      items: [
        {
          title: "รายการเทมเพลต",
          url: "/templates",
        },
        {
          title: "สร้างเทมเพลต",
          url: "/templates/new",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "ตั้งค่าระบบ",
      url: "/settings",
      icon: Settings,
    },
    {
      title: "ช่วยเหลือ",
      url: "/help",
      icon: HelpCircle,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/">
                <Building2 className="!size-5" />
                <span className="text-base font-semibold">ระบบจัดการเอกสาร</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavMain items={data.navTemplates} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}

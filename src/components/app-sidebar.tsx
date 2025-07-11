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
  Building2,
  Wrench,
  Calculator,
  FileBarChart
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// ข้อมูลตัวอย่างสำหรับระบบจัดการเอกสารก่อสร้าง
const data = {
  user: {
    name: "ผู้ดูแลระบบ",
    email: "admin@construction.com",
    avatar: "",
  },
  teams: [
    {
      name: "บริษัท ก่อสร้าง จำกัด",
      logo: Building2,
      plan: "Enterprise",
    },
    {
      name: "สำนักงานใหญ่",
      logo: Building2,
      plan: "Pro",
    },
    {
      name: "สาขาภูเก็ต",
      logo: Building2,
      plan: "Starter",
    },
  ],
  navMain: [
    {
      title: "แดชบอร์ด",
      url: "/",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "จัดการลูกค้า",
      url: "/customers",
      icon: Users,
      items: [
        {
          title: "รายการลูกค้า",
          url: "/customers",
        },
        {
          title: "เพิ่มลูกค้าใหม่",
          url: "/customers/new",
        },
      ],
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
      items: [
        {
          title: "รายการวัสดุ",
          url: "/materials",
        },
        {
          title: "เพิ่มวัสดุใหม่",
          url: "/materials/new",
        },
      ],
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
  projects: [
    {
      name: "เทมเพลตเอกสาร",
      url: "/templates",
      icon: ClipboardCheck,
    },
    {
      name: "รายงานการเงิน",
      url: "/reports",
      icon: FileBarChart,
    },
    {
      name: "คำนวณต้นทุน",
      url: "/calculator",
      icon: Calculator,
    },
    {
      name: "ตั้งค่าระบบ",
      url: "/settings",
      icon: Settings,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

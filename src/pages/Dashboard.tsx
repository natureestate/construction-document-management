import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Users, 
  HardHat, 
  FileText, 
  DollarSign,
  Building2,
  ClipboardCheck,
  Package,
  Receipt
} from 'lucide-react'

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">แดชบอร์ด</h1>
        <p className="text-muted-foreground mt-2">
          ระบบบริหารจัดการเอกสารสำหรับธุรกิจก่อสร้าง
        </p>
      </div>

      {/* สถิติรวม */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ลูกค้าทั้งหมด</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              +0% จากเดือนที่แล้ว
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ช่างรับเหมา</CardTitle>
            <HardHat className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              ช่างที่พร้อมทำงาน
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">สัญญาที่ดำเนินการ</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              สัญญาที่ยังไม่เสร็จสิ้น
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">มูลค่าโครงการ</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">฿0</div>
            <p className="text-xs text-muted-foreground">
              มูลค่ารวมทั้งหมด
            </p>
          </CardContent>
        </Card>
      </div>

      {/* เมนูหลัก */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Users className="h-8 w-8 text-blue-500" />
              <div>
                <CardTitle>จัดการลูกค้า</CardTitle>
                <CardDescription>
                  เพิ่ม แก้ไข และดูข้อมูลลูกค้า
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <HardHat className="h-8 w-8 text-orange-500" />
              <div>
                <CardTitle>จัดการช่างรับเหมา</CardTitle>
                <CardDescription>
                  ข้อมูลช่างและความเชี่ยวชาญ
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <FileText className="h-8 w-8 text-green-500" />
              <div>
                <CardTitle>สัญญาจ้างช่าง</CardTitle>
                <CardDescription>
                  สร้างและจัดการสัญญาจ้างงาน
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Package className="h-8 w-8 text-purple-500" />
              <div>
                <CardTitle>ส่วนต่างวัสดุ</CardTitle>
                <CardDescription>
                  บันทึกวัสดุเพิ่มเติมนอกเหนือมาตรฐาน
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Receipt className="h-8 w-8 text-red-500" />
              <div>
                <CardTitle>การจ่ายเงินช่าง</CardTitle>
                <CardDescription>
                  บันทึกการจ่ายเงินและติดตาม
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <ClipboardCheck className="h-8 w-8 text-teal-500" />
              <div>
                <CardTitle>เทมเพลตเอกสาร</CardTitle>
                <CardDescription>
                  จัดการแม่แบบเอกสารต่างๆ
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* รายการเอกสารล่าสุด */}
      <Card>
        <CardHeader>
          <CardTitle>เอกสารล่าสุด</CardTitle>
          <CardDescription>
            เอกสารที่สร้างหรือแก้ไขล่าสุด
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            ยังไม่มีเอกสารในระบบ
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
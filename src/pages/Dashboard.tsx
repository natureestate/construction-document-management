import { Link } from 'react-router-dom'
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
import { useCustomers } from '@/hooks/use-customers'
import { useContractors } from '@/hooks/use-contractors'
import { useContractorContracts } from '@/hooks/use-contractor-contracts'

export default function Dashboard() {
  const { customers, loading: customersLoading } = useCustomers()
  const { getContractorStats, loading: contractorsLoading } = useContractors()
  const { getContractStats, loading: contractsLoading } = useContractorContracts()

  // สถิติจากข้อมูลลูกค้า
  const customerStats = {
    total: customers.length,
    individual: customers.filter(c => c.type === 'individual').length,
    corporate: customers.filter(c => c.type === 'corporate').length
  }

  // สถิติจากข้อมูลช่างรับเหมา
  const contractorStats = getContractorStats()

  // สถิติจากข้อมูลสัญญาช่าง
  const contractStats = getContractStats()

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
            <div className="text-2xl font-bold">
              {customersLoading ? '...' : customerStats.total}
            </div>
            <p className="text-xs text-muted-foreground">
              {customersLoading ? 'กำลังโหลด...' : `${customerStats.individual} บุคคล, ${customerStats.corporate} นิติบุคคล`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ช่างรับเหมา</CardTitle>
            <HardHat className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {contractorsLoading ? '...' : contractorStats.active}
            </div>
            <p className="text-xs text-muted-foreground">
              {contractorsLoading ? 'กำลังโหลด...' : `${contractorStats.active} พร้อมทำงาน, ${contractorStats.inactive} หยุดรับงาน`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">สัญญาที่ดำเนินการ</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {contractsLoading ? '...' : contractStats.inProgress}
            </div>
            <p className="text-xs text-muted-foreground">
              {contractsLoading ? 'กำลังโหลด...' : `${contractStats.pending} รออนุมัติ, ${contractStats.approved} อนุมัติแล้ว`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">มูลค่าโครงการ</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {contractsLoading ? '...' : new Intl.NumberFormat('th-TH', {
                style: 'currency',
                currency: 'THB',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              }).format(contractStats.totalValue)}
            </div>
            <p className="text-xs text-muted-foreground">
              {contractsLoading ? 'กำลังโหลด...' : `เสร็จแล้ว ${new Intl.NumberFormat('th-TH', {
                style: 'currency',
                currency: 'THB',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              }).format(contractStats.completedValue)}`}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* เมนูหลัก */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link to="/customers">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Users className="h-8 w-8 text-blue-500" />
                <div>
                  <CardTitle>จัดการลูกค้า</CardTitle>
                  <CardDescription>
                    เพิ่ม แก้ไข และดูข้อมูลลูกค้า ({customerStats.total} รายการ)
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </Link>

        <Link to="/contractors">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <HardHat className="h-8 w-8 text-orange-500" />
                <div>
                  <CardTitle>จัดการช่างรับเหมา</CardTitle>
                  <CardDescription>
                    ข้อมูลช่างและความเชี่ยวชาญ ({contractorStats.total} รายการ)
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </Link>

        <Link to="/contractor-contracts">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <FileText className="h-8 w-8 text-green-500" />
                <div>
                  <CardTitle>สัญญาจ้างช่าง</CardTitle>
                  <CardDescription>
                    สร้างและจัดการสัญญาจ้างงาน ({contractStats.total} รายการ)
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </Link>

        <Link to="/material-differences">
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
        </Link>

        <Link to="/contractor-payments">
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
        </Link>

        <Link to="/templates">
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
        </Link>
      </div>

      {/* รายการลูกค้าล่าสุด */}
      <Card>
        <CardHeader>
          <CardTitle>ลูกค้าล่าสุด</CardTitle>
          <CardDescription>
            ลูกค้าที่เพิ่มเข้าสู่ระบบล่าสุด
          </CardDescription>
        </CardHeader>
        <CardContent>
          {customersLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              กำลังโหลดข้อมูล...
            </div>
          ) : customers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              ยังไม่มีลูกค้าในระบบ
              <div className="mt-4">
                <Link 
                  to="/customers/new" 
                  className="text-primary hover:underline"
                >
                  เพิ่มลูกค้าแรก
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {customers
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, 5)
                .map((customer) => (
                  <div 
                    key={customer.id} 
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                        customer.type === 'corporate' 
                          ? 'bg-blue-100 text-blue-600' 
                          : 'bg-green-100 text-green-600'
                      }`}>
                        {customer.type === 'corporate' ? (
                          <Building2 className="h-5 w-5" />
                        ) : (
                          <Users className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{customer.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {customer.type === 'corporate' ? 'นิติบุคคล' : 'บุคคลธรรมดา'}
                          {customer.phone && ` • ${customer.phone}`}
                        </div>
                      </div>
                    </div>
                    <Link 
                      to={`/customers/${customer.id}/edit`}
                      className="text-sm text-primary hover:underline"
                    >
                      ดูรายละเอียด
                    </Link>
                  </div>
                ))
              }
              {customers.length > 5 && (
                <div className="text-center pt-4">
                  <Link 
                    to="/customers" 
                    className="text-primary hover:underline"
                  >
                    ดูลูกค้าทั้งหมด ({customers.length} รายการ)
                  </Link>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 
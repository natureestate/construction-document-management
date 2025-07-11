import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Users } from 'lucide-react'

export default function CustomerList() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">จัดการลูกค้า</h1>
          <p className="text-muted-foreground mt-2">
            รายการลูกค้าทั้งหมดในระบบ
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          เพิ่มลูกค้าใหม่
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <CardTitle>รายการลูกค้า</CardTitle>
          </div>
          <CardDescription>
            ข้อมูลลูกค้าทั้งหมดที่ลงทะเบียนในระบบ
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            ยังไม่มีข้อมูลลูกค้าในระบบ
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
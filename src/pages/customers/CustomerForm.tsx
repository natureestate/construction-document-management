import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function CustomerForm() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">เพิ่ม/แก้ไขลูกค้า</h1>
        <p className="text-muted-foreground mt-2">
          ข้อมูลลูกค้า
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>ข้อมูลลูกค้า</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            ฟอร์มลูกค้า (ยังไม่ได้พัฒนา)
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
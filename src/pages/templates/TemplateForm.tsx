import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TemplateForm() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">เพิ่ม/แก้ไขเทมเพลต</h1>
        <p className="text-muted-foreground mt-2">
          สร้างและจัดการเทมเพลตเอกสาร
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>ข้อมูลเทมเพลต</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            ฟอร์มเทมเพลต (ยังไม่ได้พัฒนา)
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
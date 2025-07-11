import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ContractorForm() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">เพิ่ม/แก้ไขช่างรับเหมา</h1>
        <p className="text-muted-foreground mt-2">
          ข้อมูลช่างรับเหมา
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>ข้อมูลช่างรับเหมา</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            ฟอร์มช่างรับเหมา (ยังไม่ได้พัฒนา)
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
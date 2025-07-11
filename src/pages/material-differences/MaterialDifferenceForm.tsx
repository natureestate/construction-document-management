import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function MaterialDifferenceForm() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">เพิ่ม/แก้ไขส่วนต่างวัสดุ</h1>
        <p className="text-muted-foreground mt-2">
          บันทึกวัสดุเพิ่มเติมนอกเหนือมาตรฐาน
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>ข้อมูลส่วนต่างวัสดุ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            ฟอร์มส่วนต่างวัสดุ (ยังไม่ได้พัฒนา)
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
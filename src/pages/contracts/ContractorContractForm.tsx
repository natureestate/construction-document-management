import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ContractorContractForm() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">เพิ่ม/แก้ไขสัญญาจ้างช่าง</h1>
        <p className="text-muted-foreground mt-2">
          ข้อมูลสัญญาจ้างช่างรับเหมา
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>ข้อมูลสัญญา</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            ฟอร์มสัญญาจ้างช่าง (ยังไม่ได้พัฒนา)
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
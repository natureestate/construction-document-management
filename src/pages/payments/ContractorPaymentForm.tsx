import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ContractorPaymentForm() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">บันทึกการจ่ายเงินช่าง</h1>
        <p className="text-muted-foreground mt-2">
          บันทึกรายละเอียดการจ่ายเงินให้ช่างรับเหมา
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>ข้อมูลการจ่ายเงิน</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            ฟอร์มการจ่ายเงิน (ยังไม่ได้พัฒนา)
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
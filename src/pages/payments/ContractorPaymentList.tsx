import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Receipt } from 'lucide-react'

export default function ContractorPaymentList() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">การจ่ายเงินช่างรับเหมา</h1>
          <p className="text-muted-foreground mt-2">
            รายการการจ่ายเงินและติดตามการชำระ
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          บันทึกการจ่ายใหม่
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Receipt className="h-5 w-5" />
            <CardTitle>รายการการจ่ายเงิน</CardTitle>
          </div>
          <CardDescription>
            ประวัติการจ่ายเงินให้ช่างรับเหมา
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            ยังไม่มีการบันทึกการจ่ายเงิน
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
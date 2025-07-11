import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, HardHat } from 'lucide-react'

export default function ContractorList() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">จัดการช่างรับเหมา</h1>
          <p className="text-muted-foreground mt-2">
            รายการช่างรับเหมาทั้งหมดในระบบ
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          เพิ่มช่างรับเหมาใหม่
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <HardHat className="h-5 w-5" />
            <CardTitle>รายการช่างรับเหมา</CardTitle>
          </div>
          <CardDescription>
            ข้อมูลช่างรับเหมาและความเชี่ยวชาญ
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            ยังไม่มีข้อมูลช่างรับเหมาในระบบ
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Package } from 'lucide-react'

export default function MaterialDifferenceList() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">ส่วนต่างวัสดุ</h1>
          <p className="text-muted-foreground mt-2">
            รายการส่วนต่างวัสดุนอกเหนือมาตรฐาน
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          บันทึกส่วนต่างใหม่
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Package className="h-5 w-5" />
            <CardTitle>รายการส่วนต่างวัสดุ</CardTitle>
          </div>
          <CardDescription>
            วัสดุเพิ่มเติมนอกเหนือจากมาตรฐาน
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            ยังไม่มีข้อมูลส่วนต่างวัสดุ
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
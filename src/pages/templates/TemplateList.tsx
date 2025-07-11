import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, ClipboardCheck } from 'lucide-react'

export default function TemplateList() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">เทมเพลตเอกสาร</h1>
          <p className="text-muted-foreground mt-2">
            รายการเทมเพลตเอกสารทั้งหมดในระบบ
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          สร้างเทมเพลตใหม่
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <ClipboardCheck className="h-5 w-5" />
            <CardTitle>รายการเทมเพลต</CardTitle>
          </div>
          <CardDescription>
            แม่แบบเอกสารสำหรับการสร้างเอกสารต่างๆ
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            ยังไม่มีเทมเพลตในระบบ
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, FileText } from 'lucide-react'

export default function ContractorContractList() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">สัญญาจ้างช่างรับเหมา</h1>
          <p className="text-muted-foreground mt-2">
            รายการสัญญาจ้างช่างทั้งหมดในระบบ
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          สร้างสัญญาใหม่
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <CardTitle>รายการสัญญา</CardTitle>
          </div>
          <CardDescription>
            สัญญาจ้างช่างรับเหมาทั้งหมด
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            ยังไม่มีสัญญาในระบบ
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
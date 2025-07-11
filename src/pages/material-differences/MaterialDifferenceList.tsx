import { useState } from 'react'
import { Plus, Search, Eye, Edit, Trash2, Wrench, Check, X, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useMaterialDifferences } from '@/hooks/use-material-differences'
import { useCustomers } from '@/hooks/use-customers'
import { useContractorContracts } from '@/hooks/use-contractor-contracts'
import { MaterialDifference } from '@/types'
import { format } from 'date-fns'
import { th } from 'date-fns/locale'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

export function MaterialDifferenceList() {
  const { 
    materialDifferences, 
    loading, 
    deleteMaterialDifference,
    approveMaterialDifference,
    getMaterialDifferencesByStatus,
    getPendingTotalAmount 
  } = useMaterialDifferences()
  
  const { customers } = useCustomers()
  const { contracts } = useContractorContracts()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<MaterialDifference['status'] | 'all'>('all')

  // ฟิลเตอร์ข้อมูล
  const filteredDifferences = (() => {
    let filtered = materialDifferences

    // กรองตามคำค้นหา
    if (searchQuery.trim()) {
      filtered = filtered.filter(diff => 
        diff.notes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customers.find((c) => c.id === diff.customerId)?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contracts.find((c) => c.id === diff.contractId)?.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // กรองตามสถานะ
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(diff => diff.status === selectedStatus)
    }

    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  })()

  // หาข้อมูลลูกค้าและสัญญา
  const getCustomerName = (customerId: string) => {
    return customers.find(c => c.id === customerId)?.name || 'ไม่พบข้อมูล'
  }

  const getContractTitle = (contractId: string) => {
    return contracts.find((c) => c.id === contractId)?.title || 'ไม่พบข้อมูล'
  }

  // อนุมัติ/ปฏิเสธ
  const handleApprove = (id: string, approved: boolean) => {
    approveMaterialDifference(id, approved, 'ผู้ดูแลระบบ')
  }

  // ลบรายการ
  const handleDelete = (id: string) => {
    deleteMaterialDifference(id)
  }

  // สีตามสถานะ
  const getStatusColor = (status: MaterialDifference['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'approved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: MaterialDifference['status']) => {
    switch (status) {
      case 'pending': return <Clock className="h-3 w-3" />
      case 'approved': return <Check className="h-3 w-3" />
      case 'rejected': return <X className="h-3 w-3" />
      default: return null
    }
  }

  const getStatusText = (status: MaterialDifference['status']) => {
    switch (status) {
      case 'pending': return 'รออนุมัติ'
      case 'approved': return 'อนุมัติแล้ว'
      case 'rejected': return 'ปฏิเสธ'
      default: return status
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">บันทึกส่วนต่างวัสดุ</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Wrench className="h-6 w-6" />
            บันทึกส่วนต่างวัสดุ
          </h1>
          <p className="text-muted-foreground">
            จัดการบันทึกวัสดุเพิ่มเติมที่เกินกว่าที่กำหนดในสัญญา
          </p>
        </div>
        <Button className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          บันทึกส่วนต่างใหม่
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{materialDifferences.length}</div>
            <div className="text-sm text-muted-foreground">รายการทั้งหมด</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {getMaterialDifferencesByStatus('pending').length}
            </div>
            <div className="text-sm text-muted-foreground">รออนุมัติ</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {getMaterialDifferencesByStatus('approved').length}
            </div>
            <div className="text-sm text-muted-foreground">อนุมัติแล้ว</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">
              ฿{getPendingTotalAmount().toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">มูลค่ารออนุมัติ</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="ค้นหา (ลูกค้า, สัญญา, หมายเหตุ)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="ทุกสถานะ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทุกสถานะ</SelectItem>
                  <SelectItem value="pending">รออนุมัติ</SelectItem>
                  <SelectItem value="approved">อนุมัติแล้ว</SelectItem>
                  <SelectItem value="rejected">ปฏิเสธ</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Material Differences List */}
      {filteredDifferences.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Wrench className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">ไม่พบรายการ</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || selectedStatus !== 'all' 
                ? 'ไม่พบรายการที่ตรงกับเงื่อนไขการค้นหา' 
                : 'ยังไม่มีบันทึกส่วนต่างวัสดุ'}
            </p>
            {!searchQuery && selectedStatus === 'all' && (
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                บันทึกรายการแรก
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredDifferences.map((difference) => (
            <Card key={difference.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">
                        {getCustomerName(difference.customerId)}
                      </CardTitle>
                      <Badge className={`text-xs ${getStatusColor(difference.status)}`}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(difference.status)}
                          {getStatusText(difference.status)}
                        </div>
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      สัญญา: {getContractTitle(difference.contractId)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(difference.createdAt), 'PPP', { locale: th })}
                    </p>
                  </div>
                  
                                     <div className="flex items-center gap-1 flex-wrap sm:flex-nowrap">
                     {difference.status === 'pending' && (
                       <>
                         <Button
                           variant="ghost"
                           size="sm"
                           onClick={() => handleApprove(difference.id, true)}
                           className="text-green-600 hover:text-green-700 h-8 w-8 p-0"
                           title="อนุมัติ"
                         >
                           <Check className="h-4 w-4" />
                         </Button>
                         <Button
                           variant="ghost"
                           size="sm"
                           onClick={() => handleApprove(difference.id, false)}
                           className="text-red-600 hover:text-red-700 h-8 w-8 p-0"
                           title="ปฏิเสธ"
                         >
                           <X className="h-4 w-4" />
                         </Button>
                       </>
                     )}
                     <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="ดูรายละเอียด">
                       <Eye className="h-4 w-4" />
                     </Button>
                    <AlertDialog>
                                             <AlertDialogTrigger asChild>
                         <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="ลบ">
                           <Trash2 className="h-4 w-4" />
                         </Button>
                       </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>ยืนยันการลบ</AlertDialogTitle>
                          <AlertDialogDescription>
                            คุณต้องการลบบันทึกส่วนต่างวัสดุนี้หรือไม่? 
                            การดำเนินการนี้ไม่สามารถย้อนกลับได้
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(difference.id)}>
                            ลบ
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
              <Separator />
              <CardContent className="pt-4">
                <div className="space-y-4">
                  {/* รายการวัสดุ */}
                  <div>
                    <h4 className="font-medium mb-2">รายการวัสดุเพิ่มเติม:</h4>
                    <div className="space-y-2">
                      {difference.materials.map((material, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                          <div>
                            <span className="font-medium">{material.materialName}</span>
                            <span className="text-sm text-muted-foreground ml-2">
                              {material.quantity} {material.unit}
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">
                              ฿{material.totalPrice.toLocaleString()}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              @ ฿{material.pricePerUnit.toLocaleString()}/{material.unit}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ยอดรวม */}
                  <div className="flex justify-between items-center p-3 bg-muted rounded-md">
                    <span className="font-semibold">ยอดรวม:</span>
                    <span className="text-lg font-bold text-orange-600">
                      ฿{difference.totalAmount.toLocaleString()}
                    </span>
                  </div>

                  {/* หมายเหตุ */}
                  {difference.notes && (
                    <div>
                      <h4 className="font-medium mb-1">หมายเหตุ:</h4>
                      <p className="text-sm text-muted-foreground">{difference.notes}</p>
                    </div>
                  )}

                  {/* ข้อมูลการอนุมัติ */}
                  {difference.status !== 'pending' && (
                    <div className="pt-2 border-t">
                      <div className="flex justify-between text-sm">
                        <span>อนุมัติโดย:</span>
                        <span>{difference.approvedBy || '-'}</span>
                      </div>
                      {difference.approvedDate && (
                        <div className="flex justify-between text-sm">
                          <span>วันที่อนุมัติ:</span>
                          <span>{format(new Date(difference.approvedDate), 'PPp', { locale: th })}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

// Export default เพื่อให้ import ได้เป็น default
export default MaterialDifferenceList
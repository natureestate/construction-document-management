import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  Plus, 
  FileText, 
  Search, 
  Filter,
  Edit,
  Trash2,
  Eye,
  Calendar,
  DollarSign,
  MapPin,
  User,
  HardHat,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'
import { format } from 'date-fns'
import { th } from 'date-fns/locale'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'

import { useContractorContracts } from '@/hooks/use-contractor-contracts'
import { useCustomers } from '@/hooks/use-customers'
import { useContractors } from '@/hooks/use-contractors'
import { ContractorContract } from '@/types'
import { cn } from '@/lib/utils'
import { 
  getContractStatusLabel, 
  getContractStatusColor, 
  getPaymentTypeLabel,
  formatCurrency,
  CONTRACT_STATUSES
} from '@/lib/validations/contractor-contract'

const ITEMS_PER_PAGE = 10

export default function ContractorContractList() {
  const navigate = useNavigate()
  const { 
    contracts, 
    loading, 
    error, 
    deleteContract, 
    searchContracts, 
    getContractStats,
    clearError 
  } = useContractorContracts()

  const { getCustomer } = useCustomers()
  const { getContractor } = useContractors()

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [contractToDelete, setContractToDelete] = useState<ContractorContract | null>(null)

  const stats = getContractStats()

  // ค้นหาและกรองข้อมูล
  const filteredContracts = useMemo(() => {
    let result = searchQuery ? searchContracts(searchQuery) : contracts

    if (statusFilter !== 'all') {
      result = result.filter(contract => contract.status === statusFilter)
    }

    return result.sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
  }, [contracts, searchQuery, statusFilter, searchContracts])

  // Pagination
  const totalPages = Math.ceil(filteredContracts.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentContracts = filteredContracts.slice(startIndex, endIndex)

  // ลบสัญญา
  const handleDeleteContract = async () => {
    if (!contractToDelete) return

    try {
      await deleteContract(contractToDelete.id)
      toast.success(`ลบสัญญา "${contractToDelete.title}" เรียบร้อยแล้ว`)
      setContractToDelete(null)
      
      // ปรับ page ถ้าหน้าปัจจุบันไม่มีข้อมูลแล้ว
      const newTotalPages = Math.ceil((filteredContracts.length - 1) / ITEMS_PER_PAGE)
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages)
      }
    } catch (err) {
      toast.error('ไม่สามารถลบสัญญาได้')
    }
  }

  // รีเซ็ตการค้นหาและกรอง
  const handleResetFilters = () => {
    setSearchQuery('')
    setStatusFilter('all')
    setCurrentPage(1)
  }

  // ฟังก์ชันสำหรับดูรายละเอียดสัญญา
  const handleViewContract = (contractId: string) => {
    navigate(`/contractor-contracts/${contractId}`)
  }

  // แสดง loading skeleton
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64 mt-2" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // แสดง error
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">สัญญาจ้างช่างรับเหมา</h1>
            <p className="text-muted-foreground mt-2">
              รายการสัญญาจ้างช่างทั้งหมดในระบบ
            </p>
          </div>
          <Button asChild>
            <Link to="/contractor-contracts/new">
              <Plus className="h-4 w-4 mr-2" />
              สร้างสัญญาใหม่
            </Link>
          </Button>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8">
              <p className="text-destructive mb-4">{error}</p>
              <Button onClick={clearError} variant="outline">
                ลองใหม่
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">สัญญาจ้างช่างรับเหมา</h1>
          <p className="text-muted-foreground mt-2">
            รายการสัญญาจ้างช่างทั้งหมดในระบบ ({filteredContracts.length} รายการ)
          </p>
        </div>
        <Button asChild>
          <Link to="/contractor-contracts/new">
            <Plus className="h-4 w-4 mr-2" />
            สร้างสัญญาใหม่
          </Link>
        </Button>
      </div>

      {/* สถิติรวม */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">สัญญาทั้งหมด</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              รายการทั้งหมดในระบบ
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">กำลังดำเนินการ</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.inProgress}</div>
            <p className="text-xs text-muted-foreground">
              สัญญาที่กำลังทำงาน
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">เสร็จสิ้นแล้ว</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">
              สัญญาที่สำเร็จแล้ว
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">มูลค่ารวม</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalValue)}</div>
            <p className="text-xs text-muted-foreground">
              มูลค่าสัญญาทั้งหมด
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ช่องค้นหาและกรอง */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ค้นหาสัญญา (ชื่อ, รายละเอียด, สถานที่ทำงาน)"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select
                value={statusFilter}
                onValueChange={(value: string) => {
                  setStatusFilter(value)
                  setCurrentPage(1)
                }}
              >
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="สถานะ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทุกสถานะ</SelectItem>
                  {CONTRACT_STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {getContractStatusLabel(status)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button variant="outline" onClick={handleResetFilters}>
                รีเซ็ต
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ตารางข้อมูลสัญญา */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <CardTitle>รายการสัญญาจ้างช่าง</CardTitle>
          </div>
          <CardDescription>
            ข้อมูลสัญญาจ้างช่างรับเหมาและสถานะการดำเนินการ
          </CardDescription>
        </CardHeader>
        <CardContent>
          {currentContracts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery || statusFilter !== 'all'
                ? 'ไม่พบข้อมูลสัญญาที่ตรงกับการค้นหา' 
                : 'ยังไม่มีข้อมูลสัญญาในระบบ'
              }
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>สัญญา</TableHead>
                      <TableHead>ลูกค้า / ช่าง</TableHead>
                      <TableHead>ระยะเวลา</TableHead>
                      <TableHead>มูลค่า</TableHead>
                      <TableHead>สถานะ</TableHead>
                      <TableHead>วันที่สร้าง</TableHead>
                      <TableHead className="text-right">จัดการ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentContracts.map((contract) => {
                      const customer = getCustomer(contract.customerId)
                      const contractor = getContractor(contract.contractorId)
                      
                      return (
                        <TableRow key={contract.id}>
                          <TableCell>
                            <div className="flex items-start space-x-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                                <FileText className="h-5 w-5" />
                              </div>
                              <div className="max-w-xs">
                                <div className="font-medium truncate">{contract.title}</div>
                                {contract.description && (
                                  <div className="text-sm text-muted-foreground truncate">
                                    {contract.description}
                                  </div>
                                )}
                                <div className="flex items-center text-sm text-muted-foreground mt-1">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  <span className="truncate">{contract.workLocation}</span>
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-2">
                              {customer && (
                                <div className="flex items-center text-sm">
                                  <User className="h-3 w-3 mr-1" />
                                  <span className="truncate">{customer.name}</span>
                                </div>
                              )}
                              {contractor && (
                                <div className="flex items-center text-sm">
                                  <HardHat className="h-3 w-3 mr-1" />
                                  <span className="truncate">{contractor.name}</span>
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center text-sm">
                                <Calendar className="h-3 w-3 mr-1" />
                                {format(contract.startDate, 'd MMM', { locale: th })} - {format(contract.endDate, 'd MMM yyyy', { locale: th })}
                              </div>
                              {contract.estimatedDays && (
                                <div className="text-xs text-muted-foreground">
                                  {contract.estimatedDays} วัน
                                </div>
                              )}
                              <div className="text-xs text-muted-foreground">
                                {getPaymentTypeLabel(contract.paymentType)}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="font-medium">
                                {formatCurrency(contract.totalCost)}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                ค่าแรง: {formatCurrency(contract.laborCost)}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                วัสดุ: {formatCurrency(contract.materialCost)}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant="secondary"
                              className={cn("text-xs", getContractStatusColor(contract.status))}
                            >
                              {getContractStatusLabel(contract.status)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {format(contract.createdAt, 'd MMM yyyy', { locale: th })}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewContract(contract.id)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                asChild
                              >
                                <Link to={`/contractor-contracts/${contract.id}/edit`}>
                                  <Edit className="h-4 w-4" />
                                </Link>
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setContractToDelete(contract)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>ยืนยันการลบ</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      คุณแน่ใจหรือไม่ที่จะลบสัญญา "{contract.title}"? 
                                      การกระทำนี้ไม่สามารถยกเลิกได้
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={handleDeleteContract}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      ลบ
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    แสดง {startIndex + 1}-{Math.min(endIndex, filteredContracts.length)} จาก {filteredContracts.length} รายการ
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      ก่อนหน้า
                    </Button>
                    {[...Array(totalPages)].map((_, i) => {
                      const page = i + 1
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                          >
                            {page}
                          </Button>
                        )
                      } else if (page === currentPage - 2 || page === currentPage + 2) {
                        return <span key={page}>...</span>
                      }
                      return null
                    })}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      ถัดไป
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 
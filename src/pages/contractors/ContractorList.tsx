import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  Plus, 
  HardHat, 
  Search, 
  Filter,
  Edit,
  Trash2,
  Phone,
  MapPin,
  CreditCard,
  FileText,
  CheckCircle,
  XCircle
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

import { useContractors } from '@/hooks/use-contractors'
import { Contractor } from '@/types'
import { cn } from '@/lib/utils'
import { getSpecialtyColor, CONTRACTOR_SPECIALTIES } from '@/lib/validations/contractor'

const ITEMS_PER_PAGE = 10

export default function ContractorList() {
  const navigate = useNavigate()
  const { 
    contractors, 
    loading, 
    error, 
    deleteContractor, 
    searchContractors, 
    getContractorStats,
    clearError 
  } = useContractors()

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [specialtyFilter, setSpecialtyFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [contractorToDelete, setContractorToDelete] = useState<Contractor | null>(null)

  const stats = getContractorStats()

  // ค้นหาและกรองข้อมูล
  const filteredContractors = useMemo(() => {
    let result = searchQuery ? searchContractors(searchQuery) : contractors

    if (statusFilter !== 'all') {
      result = result.filter(contractor => contractor.status === statusFilter)
    }

    if (specialtyFilter !== 'all') {
      result = result.filter(contractor => 
        contractor.specialty.includes(specialtyFilter)
      )
    }

    return result.sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
  }, [contractors, searchQuery, statusFilter, specialtyFilter, searchContractors])

  // Pagination
  const totalPages = Math.ceil(filteredContractors.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentContractors = filteredContractors.slice(startIndex, endIndex)

  // ลบช่างรับเหมา
  const handleDeleteContractor = async () => {
    if (!contractorToDelete) return

    try {
      await deleteContractor(contractorToDelete.id)
      toast.success(`ลบข้อมูลช่างรับเหมา "${contractorToDelete.name}" เรียบร้อยแล้ว`)
      setContractorToDelete(null)
      
      // ปรับ page ถ้าหน้าปัจจุบันไม่มีข้อมูลแล้ว
      const newTotalPages = Math.ceil((filteredContractors.length - 1) / ITEMS_PER_PAGE)
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages)
      }
    } catch (err) {
      toast.error('ไม่สามารถลบข้อมูลช่างรับเหมาได้')
    }
  }

  // รีเซ็ตการค้นหาและกรอง
  const handleResetFilters = () => {
    setSearchQuery('')
    setStatusFilter('all')
    setSpecialtyFilter('all')
    setCurrentPage(1)
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
            <h1 className="text-3xl font-bold">จัดการช่างรับเหมา</h1>
            <p className="text-muted-foreground mt-2">
              รายการช่างรับเหมาทั้งหมดในระบบ
            </p>
          </div>
          <Button asChild>
            <Link to="/contractors/new">
              <Plus className="h-4 w-4 mr-2" />
              เพิ่มช่างรับเหมาใหม่
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
          <h1 className="text-3xl font-bold">จัดการช่างรับเหมา</h1>
          <p className="text-muted-foreground mt-2">
            รายการช่างรับเหมาทั้งหมดในระบบ ({filteredContractors.length} รายการ)
          </p>
        </div>
        <Button asChild>
          <Link to="/contractors/new">
            <Plus className="h-4 w-4 mr-2" />
            เพิ่มช่างรับเหมาใหม่
          </Link>
        </Button>
      </div>

      {/* สถิติรวม */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ช่างทั้งหมด</CardTitle>
            <HardHat className="h-4 w-4 text-muted-foreground" />
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
            <CardTitle className="text-sm font-medium">ช่างที่ใช้งานได้</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <p className="text-xs text-muted-foreground">
              พร้อมรับงาน
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ช่างไม่ใช้งาน</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.inactive}</div>
            <p className="text-xs text-muted-foreground">
              หยุดรับงานชั่วคราว
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ความเชี่ยวชาญ</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.topSpecialties.length}</div>
            <p className="text-xs text-muted-foreground">
              ประเภทงานที่มี
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
                placeholder="ค้นหาช่างรับเหมา (ชื่อ, เบอร์โทร, ที่อยู่, ความเชี่ยวชาญ)"
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
                onValueChange={(value: 'all' | 'active' | 'inactive') => {
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
                  <SelectItem value="active">ใช้งานได้</SelectItem>
                  <SelectItem value="inactive">ไม่ใช้งาน</SelectItem>
                </SelectContent>
              </Select>
              
              <Select
                value={specialtyFilter}
                onValueChange={(value: string) => {
                  setSpecialtyFilter(value)
                  setCurrentPage(1)
                }}
              >
                <SelectTrigger className="w-40">
                  <HardHat className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="ความเชี่ยวชาญ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทุกประเภท</SelectItem>
                  {CONTRACTOR_SPECIALTIES.map((specialty) => (
                    <SelectItem key={specialty} value={specialty}>
                      {specialty}
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

      {/* ตารางข้อมูลช่างรับเหมา */}
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
          {currentContractors.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery || statusFilter !== 'all' || specialtyFilter !== 'all'
                ? 'ไม่พบข้อมูลช่างรับเหมาที่ตรงกับการค้นหา' 
                : 'ยังไม่มีข้อมูลช่างรับเหมาในระบบ'
              }
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ช่างรับเหมา</TableHead>
                      <TableHead>ความเชี่ยวชาญ</TableHead>
                      <TableHead>ติดต่อ</TableHead>
                      <TableHead>ที่อยู่</TableHead>
                      <TableHead>สถานะ</TableHead>
                      <TableHead>วันที่สร้าง</TableHead>
                      <TableHead className="text-right">จัดการ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentContractors.map((contractor) => (
                      <TableRow key={contractor.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                              <HardHat className="h-5 w-5" />
                            </div>
                            <div>
                              <div className="font-medium">{contractor.name}</div>
                              {contractor.taxId && (
                                <div className="text-sm text-muted-foreground">
                                  เลขภาษี: {contractor.taxId}
                                </div>
                              )}
                              {contractor.bankAccount && (
                                <div className="text-sm text-muted-foreground flex items-center">
                                  <CreditCard className="h-3 w-3 mr-1" />
                                  {contractor.bankAccount}
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {contractor.specialty.slice(0, 3).map((spec) => (
                              <Badge 
                                key={spec} 
                                variant="secondary"
                                className={cn("text-xs", getSpecialtyColor(spec))}
                              >
                                {spec}
                              </Badge>
                            ))}
                            {contractor.specialty.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{contractor.specialty.length - 3}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {contractor.phone && (
                              <div className="flex items-center text-sm">
                                <Phone className="h-3 w-3 mr-1" />
                                {contractor.phone}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs">
                          {contractor.address && (
                            <div className="flex items-start text-sm">
                              <MapPin className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                              <span className="truncate">{contractor.address}</span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={contractor.status === 'active' ? 'default' : 'secondary'}
                            className={contractor.status === 'active' 
                              ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                            }
                          >
                            {contractor.status === 'active' ? 'ใช้งานได้' : 'ไม่ใช้งาน'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {format(contractor.createdAt, 'd MMM yyyy', { locale: th })}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              asChild
                            >
                              <Link to={`/contractors/${contractor.id}/edit`}>
                                <Edit className="h-4 w-4" />
                              </Link>
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setContractorToDelete(contractor)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>ยืนยันการลบ</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    คุณแน่ใจหรือไม่ที่จะลบข้อมูลช่างรับเหมา "{contractor.name}"? 
                                    การกระทำนี้ไม่สามารถยกเลิกได้
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={handleDeleteContractor}
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
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    แสดง {startIndex + 1}-{Math.min(endIndex, filteredContractors.length)} จาก {filteredContractors.length} รายการ
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
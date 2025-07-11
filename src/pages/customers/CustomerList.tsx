import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  Plus, 
  Users, 
  Search, 
  Filter,
  Edit,
  Trash2,
  Building2,
  User,
  Phone,
  Mail,
  MapPin,
  FileText
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

import { useCustomers } from '@/hooks/use-customers'
import { Customer } from '@/types'
import { cn } from '@/lib/utils'

const ITEMS_PER_PAGE = 10

export default function CustomerList() {
  const navigate = useNavigate()
  const { 
    customers, 
    loading, 
    error, 
    deleteCustomer, 
    searchCustomers, 
    clearError 
  } = useCustomers()

  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | 'individual' | 'corporate'>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null)

  // ค้นหาและกรองข้อมูล
  const filteredCustomers = useMemo(() => {
    let result = searchQuery ? searchCustomers(searchQuery) : customers

    if (typeFilter !== 'all') {
      result = result.filter(customer => customer.type === typeFilter)
    }

    return result.sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
  }, [customers, searchQuery, typeFilter, searchCustomers])

  // Pagination
  const totalPages = Math.ceil(filteredCustomers.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentCustomers = filteredCustomers.slice(startIndex, endIndex)

  // ลบลูกค้า
  const handleDeleteCustomer = async () => {
    if (!customerToDelete) return

    try {
      await deleteCustomer(customerToDelete.id)
      toast.success(`ลบข้อมูลลูกค้า "${customerToDelete.name}" เรียบร้อยแล้ว`)
      setCustomerToDelete(null)
      
      // ปรับ page ถ้าหน้าปัจจุบันไม่มีข้อมูลแล้ว
      const newTotalPages = Math.ceil((filteredCustomers.length - 1) / ITEMS_PER_PAGE)
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages)
      }
    } catch (err) {
      toast.error('ไม่สามารถลบข้อมูลลูกค้าได้')
    }
  }

  // รีเซ็ตการค้นหาและกรอง
  const handleResetFilters = () => {
    setSearchQuery('')
    setTypeFilter('all')
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
          <Skeleton className="h-10 w-32" />
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
            <h1 className="text-3xl font-bold">จัดการลูกค้า</h1>
            <p className="text-muted-foreground mt-2">
              รายการลูกค้าทั้งหมดในระบบ
            </p>
          </div>
          <Button asChild>
            <Link to="/customers/new">
              <Plus className="h-4 w-4 mr-2" />
              เพิ่มลูกค้าใหม่
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
          <h1 className="text-3xl font-bold">จัดการลูกค้า</h1>
          <p className="text-muted-foreground mt-2">
            รายการลูกค้าทั้งหมดในระบบ ({filteredCustomers.length} รายการ)
          </p>
        </div>
        <Button asChild>
          <Link to="/customers/new">
            <Plus className="h-4 w-4 mr-2" />
            เพิ่มลูกค้าใหม่
          </Link>
        </Button>
      </div>

      {/* ช่องค้นหาและกรอง */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ค้นหาลูกค้า (ชื่อ, อีเมล, เบอร์โทร, ที่อยู่)"
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
                value={typeFilter}
                onValueChange={(value: 'all' | 'individual' | 'corporate') => {
                  setTypeFilter(value)
                  setCurrentPage(1)
                }}
              >
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="ประเภท" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทุกประเภท</SelectItem>
                  <SelectItem value="individual">บุคคลธรรมดา</SelectItem>
                  <SelectItem value="corporate">นิติบุคคล</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={handleResetFilters}>
                รีเซ็ต
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ตารางข้อมูลลูกค้า */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <CardTitle>รายการลูกค้า</CardTitle>
          </div>
          <CardDescription>
            ข้อมูลลูกค้าทั้งหมดที่ลงทะเบียนในระบบ
          </CardDescription>
        </CardHeader>
        <CardContent>
          {currentCustomers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery || typeFilter !== 'all' 
                ? 'ไม่พบข้อมูลลูกค้าที่ตรงกับการค้นหา' 
                : 'ยังไม่มีข้อมูลลูกค้าในระบบ'
              }
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ลูกค้า</TableHead>
                      <TableHead>ประเภท</TableHead>
                      <TableHead>ติดต่อ</TableHead>
                      <TableHead>ที่อยู่</TableHead>
                      <TableHead>วันที่สร้าง</TableHead>
                      <TableHead className="text-right">จัดการ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentCustomers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className={cn(
                              "flex h-10 w-10 items-center justify-center rounded-full",
                              customer.type === 'corporate' 
                                ? "bg-blue-100 text-blue-600" 
                                : "bg-green-100 text-green-600"
                            )}>
                              {customer.type === 'corporate' ? (
                                <Building2 className="h-5 w-5" />
                              ) : (
                                <User className="h-5 w-5" />
                              )}
                            </div>
                            <div>
                              <div className="font-medium">{customer.name}</div>
                              {customer.type === 'corporate' && customer.contactPerson && (
                                <div className="text-sm text-muted-foreground">
                                  ผู้ติดต่อ: {customer.contactPerson}
                                </div>
                              )}
                              {customer.taxId && (
                                <div className="text-sm text-muted-foreground">
                                  เลขภาษี: {customer.taxId}
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={customer.type === 'corporate' ? 'default' : 'secondary'}>
                            {customer.type === 'corporate' ? 'นิติบุคคล' : 'บุคคลธรรมดา'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {customer.phone && (
                              <div className="flex items-center text-sm">
                                <Phone className="h-3 w-3 mr-1" />
                                {customer.phone}
                              </div>
                            )}
                            {customer.email && (
                              <div className="flex items-center text-sm">
                                <Mail className="h-3 w-3 mr-1" />
                                {customer.email}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs">
                          {customer.address && (
                            <div className="flex items-start text-sm">
                              <MapPin className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                              <span className="truncate">{customer.address}</span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {format(customer.createdAt, 'd MMM yyyy', { locale: th })}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              asChild
                            >
                              <Link to={`/customers/${customer.id}/edit`}>
                                <Edit className="h-4 w-4" />
                              </Link>
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setCustomerToDelete(customer)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>ยืนยันการลบ</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    คุณแน่ใจหรือไม่ที่จะลบข้อมูลลูกค้า "{customer.name}"? 
                                    การกระทำนี้ไม่สามารถยกเลิกได้
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={handleDeleteCustomer}
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
                    แสดง {startIndex + 1}-{Math.min(endIndex, filteredCustomers.length)} จาก {filteredCustomers.length} รายการ
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
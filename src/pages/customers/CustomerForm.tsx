import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { 
  ArrowLeft, 
  Save, 
  User, 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  FileText, 
  AlertCircle 
} from 'lucide-react'
import { toast } from 'sonner'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'

import { useCustomers } from '@/hooks/use-customers'
import { 
  customerFormSchema, 
  corporateCustomerSchema,
  type CustomerFormData,
  formatPhoneNumber,
  formatTaxId,
  validateThaiPhoneNumber,
  validateThaiTaxId
} from '@/lib/validations/customer'

export default function CustomerForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = Boolean(id)
  
  const { 
    customers, 
    loading, 
    error, 
    addCustomer, 
    updateCustomer, 
    getCustomer,
    clearError 
  } = useCustomers()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [customerType, setCustomerType] = useState<'individual' | 'corporate'>('individual')

  // ฟอร์ม validation schema ที่เปลี่ยนตามประเภทลูกค้า
  const validationSchema = customerType === 'corporate' ? corporateCustomerSchema : customerFormSchema

  const form = useForm<CustomerFormData>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      type: 'individual',
      taxId: '',
      contactPerson: ''
    }
  })

  // โหลดข้อมูลลูกค้าสำหรับการแก้ไข
  useEffect(() => {
    if (isEditing && id && !loading) {
      const customer = getCustomer(id)
      if (customer) {
        form.reset({
          name: customer.name,
          email: customer.email || '',
          phone: customer.phone || '',
          address: customer.address || '',
          type: customer.type,
          taxId: customer.taxId || '',
          contactPerson: customer.contactPerson || ''
        })
        setCustomerType(customer.type)
      } else {
        toast.error('ไม่พบข้อมูลลูกค้า')
        navigate('/customers')
      }
    }
  }, [isEditing, id, getCustomer, loading, form, navigate])

  // ติดตาม customer type เพื่อ validation
  const watchedType = form.watch('type')
  useEffect(() => {
    if (watchedType !== customerType) {
      setCustomerType(watchedType)
      // รีเซ็ต taxId และ contactPerson เมื่อเปลี่ยนประเภท
      if (watchedType === 'individual') {
        form.setValue('taxId', '')
        form.setValue('contactPerson', '')
      }
    }
  }, [watchedType, customerType, form])

  // ส่งฟอร์ม
  const onSubmit = async (data: CustomerFormData) => {
    try {
      setIsSubmitting(true)

      // Validate เบอร์โทรไทยถ้ามี
      if (data.phone && !validateThaiPhoneNumber(data.phone)) {
        form.setError('phone', { 
          type: 'manual', 
          message: 'รูปแบบเบอร์โทรไทยไม่ถูกต้อง' 
        })
        return
      }

      // Validate เลขประจำตัวผู้เสียภาษีไทยถ้ามี
      if (data.taxId && !validateThaiTaxId(data.taxId)) {
        form.setError('taxId', { 
          type: 'manual', 
          message: 'เลขประจำตัวผู้เสียภาษีไทยไม่ถูกต้อง' 
        })
        return
      }

      // จัดรูปแบบข้อมูลก่อนบันทึก
      const formattedData = {
        ...data,
        phone: data.phone ? formatPhoneNumber(data.phone) : undefined,
        taxId: data.taxId ? data.taxId.replace(/[^\d]/g, '') : undefined, // เก็บเฉพาะตัวเลข
        email: data.email || undefined,
        address: data.address || undefined,
        contactPerson: data.contactPerson || undefined
      }

      if (isEditing && id) {
        await updateCustomer(id, formattedData)
        toast.success('อัปเดตข้อมูลลูกค้าเรียบร้อยแล้ว')
      } else {
        await addCustomer(formattedData)
        toast.success('เพิ่มลูกค้าใหม่เรียบร้อยแล้ว')
      }

      navigate('/customers')
    } catch (err) {
      console.error('Error saving customer:', err)
      toast.error(isEditing ? 'ไม่สามารถอัปเดตข้อมูลลูกค้าได้' : 'ไม่สามารถเพิ่มลูกค้าได้')
    } finally {
      setIsSubmitting(false)
    }
  }

  // แสดง loading skeleton
  if (loading && isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-10 w-10" />
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64 mt-2" />
          </div>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  // แสดง error
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" asChild>
            <Link to="/customers">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">เพิ่ม/แก้ไขลูกค้า</h1>
            <p className="text-muted-foreground mt-2">ข้อมูลลูกค้า</p>
          </div>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>

        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8">
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
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="icon" asChild>
          <Link to="/customers">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">
            {isEditing ? 'แก้ไขข้อมูลลูกค้า' : 'เพิ่มลูกค้าใหม่'}
          </h1>
          <p className="text-muted-foreground mt-2">
            {isEditing ? 'แก้ไขข้อมูลลูกค้าในระบบ' : 'เพิ่มข้อมูลลูกค้าใหม่เข้าสู่ระบบ'}
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* ข้อมูลพื้นฐาน */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <CardTitle>ข้อมูลพื้นฐาน</CardTitle>
              </div>
              <CardDescription>
                ข้อมูลพื้นฐานของลูกค้า
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* ชื่อลูกค้า */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ชื่อลูกค้า *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="ระบุชื่อลูกค้า"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* ประเภทลูกค้า */}
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ประเภทลูกค้า *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="เลือกประเภทลูกค้า" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="individual">
                            <div className="flex items-center space-x-2">
                              <User className="h-4 w-4" />
                              <span>บุคคลธรรมดา</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="corporate">
                            <div className="flex items-center space-x-2">
                              <Building2 className="h-4 w-4" />
                              <span>นิติบุคคล</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* เลขประจำตัวผู้เสียภาษี - แสดงเฉพาะลูกค้าองค์กร */}
              {customerType === 'corporate' && (
                <FormField
                  control={form.control}
                  name="taxId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>เลขประจำตัวผู้เสียภาษี *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="ระบุเลขประจำตัวผู้เสียภาษี 13 หลัก"
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^\d]/g, '')
                            field.onChange(value)
                          }}
                          maxLength={13}
                        />
                      </FormControl>
                      <FormDescription>
                        เลขประจำตัวผู้เสียภาษี 13 หลัก (ตัวเลขเท่านั้น)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* ผู้ติดต่อ - แสดงเฉพาะลูกค้าองค์กร */}
              {customerType === 'corporate' && (
                <FormField
                  control={form.control}
                  name="contactPerson"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ผู้ติดต่อ</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="ชื่อผู้ติดต่อหลัก"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </CardContent>
          </Card>

          {/* ข้อมูลติดต่อ */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Phone className="h-5 w-5" />
                <CardTitle>ข้อมูลติดต่อ</CardTitle>
              </div>
              <CardDescription>
                ช่องทางติดต่อลูกค้า
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* เบอร์โทรศัพท์ */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>เบอร์โทรศัพท์</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="08X-XXX-XXXX หรือ 02-XXX-XXXX"
                          {...field}
                          onChange={(e) => {
                            // อนุญาตเฉพาะตัวเลขและเครื่องหมาย
                            const value = e.target.value.replace(/[^0-9\-\s\+\(\)]/g, '')
                            field.onChange(value)
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        รูปแบบเบอร์โทรไทย
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* อีเมล */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>อีเมล</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="example@email.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* ที่อยู่ */}
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ที่อยู่</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="ระบุที่อยู่ของลูกค้า"
                        className="resize-none"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* ปุ่มบันทึก */}
          <div className="flex items-center justify-end space-x-4">
            <Button type="button" variant="outline" asChild>
              <Link to="/customers">ยกเลิก</Link>
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting 
                ? (isEditing ? 'กำลังอัปเดต...' : 'กำลังบันทึก...') 
                : (isEditing ? 'อัปเดต' : 'บันทึก')
              }
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
} 
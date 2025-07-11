import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { 
  ArrowLeft, 
  Save, 
  HardHat, 
  Phone, 
  MapPin, 
  CreditCard, 
  FileText, 
  AlertCircle,
  X,
  Plus
} from 'lucide-react'
import { toast } from 'sonner'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
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
import { Badge } from '@/components/ui/badge'

import { useContractors } from '@/hooks/use-contractors'
import { 
  contractorFormSchema,
  type ContractorFormData,
  CONTRACTOR_SPECIALTIES,
  formatPhoneNumber,
  validateThaiPhoneNumber,
  validateThaiTaxId,
  getSpecialtyColor
} from '@/lib/validations/contractor'
import { cn } from '@/lib/utils'

export default function ContractorForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = Boolean(id)
  
  const { 
    contractors, 
    loading, 
    error, 
    addContractor, 
    updateContractor, 
    getContractor,
    clearError 
  } = useContractors()

  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<ContractorFormData>({
    resolver: zodResolver(contractorFormSchema),
    defaultValues: {
      name: '',
      phone: '',
      specialty: [],
      address: '',
      taxId: '',
      bankAccount: '',
      status: 'active'
    }
  })

  // โหลดข้อมูลช่างรับเหมาสำหรับการแก้ไข
  useEffect(() => {
    if (isEditing && id && !loading) {
      const contractor = getContractor(id)
      if (contractor) {
        form.reset({
          name: contractor.name,
          phone: contractor.phone || '',
          specialty: contractor.specialty,
          address: contractor.address || '',
          taxId: contractor.taxId || '',
          bankAccount: contractor.bankAccount || '',
          status: contractor.status as 'active' | 'inactive'
        })
      } else {
        toast.error('ไม่พบข้อมูลช่างรับเหมา')
        navigate('/contractors')
      }
    }
  }, [isEditing, id, getContractor, loading, form, navigate])

  // ส่งฟอร์ม
  const onSubmit = async (data: ContractorFormData) => {
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
        address: data.address || undefined,
        bankAccount: data.bankAccount || undefined
      }

      if (isEditing && id) {
        await updateContractor(id, formattedData)
        toast.success('อัปเดตข้อมูลช่างรับเหมาเรียบร้อยแล้ว')
      } else {
        await addContractor(formattedData)
        toast.success('เพิ่มช่างรับเหมาใหม่เรียบร้อยแล้ว')
      }

      navigate('/contractors')
    } catch (err) {
      console.error('Error saving contractor:', err)
      toast.error(isEditing ? 'ไม่สามารถอัปเดตข้อมูลช่างรับเหมาได้' : 'ไม่สามารถเพิ่มช่างรับเหมาได้')
    } finally {
      setIsSubmitting(false)
    }
  }

  // จัดการเลือกความเชี่ยวชาญ
  const handleSpecialtyChange = (specialty: string, checked: boolean) => {
    const currentSpecialties = form.getValues('specialty')
    if (checked) {
      form.setValue('specialty', [...currentSpecialties, specialty])
    } else {
      form.setValue('specialty', currentSpecialties.filter(s => s !== specialty))
    }
  }

  // ลบความเชี่ยวชาญ
  const handleRemoveSpecialty = (specialty: string) => {
    const currentSpecialties = form.getValues('specialty')
    form.setValue('specialty', currentSpecialties.filter(s => s !== specialty))
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
            <Link to="/contractors">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">เพิ่ม/แก้ไขช่างรับเหมา</h1>
            <p className="text-muted-foreground mt-2">ข้อมูลช่างรับเหมา</p>
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

  const selectedSpecialties = form.watch('specialty')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="icon" asChild>
          <Link to="/contractors">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">
            {isEditing ? 'แก้ไขข้อมูลช่างรับเหมา' : 'เพิ่มช่างรับเหมาใหม่'}
          </h1>
          <p className="text-muted-foreground mt-2">
            {isEditing ? 'แก้ไขข้อมูลช่างรับเหมาในระบบ' : 'เพิ่มข้อมูลช่างรับเหมาใหม่เข้าสู่ระบบ'}
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* ข้อมูลพื้นฐาน */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <HardHat className="h-5 w-5" />
                <CardTitle>ข้อมูลพื้นฐาน</CardTitle>
              </div>
              <CardDescription>
                ข้อมูลพื้นฐานและความเชี่ยวชาญของช่างรับเหมา
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* ชื่อช่างรับเหมา */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ชื่อช่างรับเหมา *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="ระบุชื่อช่างรับเหมา"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* สถานะ */}
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>สถานะ *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="เลือกสถานะ" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">ใช้งานได้</SelectItem>
                          <SelectItem value="inactive">ไม่ใช้งาน</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* ความเชี่ยวชาญ */}
              <FormField
                control={form.control}
                name="specialty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ความเชี่ยวชาญ *</FormLabel>
                    <FormDescription>
                      เลือกประเภทงานที่ช่างรับเหมาสามารถทำได้
                    </FormDescription>
                    
                    {/* แสดงความเชี่ยวชาญที่เลือกแล้ว */}
                    {selectedSpecialties.length > 0 && (
                      <div className="flex flex-wrap gap-2 p-3 border rounded-md bg-muted/50">
                        {selectedSpecialties.map((specialty) => (
                          <Badge
                            key={specialty}
                            variant="secondary"
                            className={cn("cursor-pointer", getSpecialtyColor(specialty))}
                            onClick={() => handleRemoveSpecialty(specialty)}
                          >
                            {specialty}
                            <X className="h-3 w-3 ml-1" />
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* ตัวเลือกความเชี่ยวชาญ */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-3 border rounded-md">
                      {CONTRACTOR_SPECIALTIES.map((specialty) => (
                        <div key={specialty} className="flex items-center space-x-2">
                          <Checkbox
                            id={specialty}
                            checked={selectedSpecialties.includes(specialty)}
                            onCheckedChange={(checked) => 
                              handleSpecialtyChange(specialty, !!checked)
                            }
                          />
                          <Label 
                            htmlFor={specialty}
                            className="text-sm font-normal cursor-pointer"
                          >
                            {specialty}
                          </Label>
                        </div>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                ช่องทางติดต่อและที่อยู่ของช่างรับเหมา
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
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

              {/* ที่อยู่ */}
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ที่อยู่</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="ระบุที่อยู่ของช่างรับเหมา"
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

                     {/* ข้อมูลทางการเงิน */}
           <Card>
             <CardHeader>
               <div className="flex items-center space-x-2">
                 <CreditCard className="h-5 w-5" />
                 <CardTitle>ข้อมูลทางการเงิน</CardTitle>
               </div>
              <CardDescription>
                ข้อมูลสำหรับการชำระเงินและเอกสารทางการเงิน
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* เลขประจำตัวผู้เสียภาษี */}
                <FormField
                  control={form.control}
                  name="taxId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>เลขประจำตัวผู้เสียภาษี</FormLabel>
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

                {/* เลขบัญชีธนาคาร */}
                <FormField
                  control={form.control}
                  name="bankAccount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>เลขบัญชีธนาคาร</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="เลขบัญชี ธนาคาร (เช่น 123-456-7890 ธนาคารกรุงเทพ)"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        ข้อมูลสำหรับการโอนเงิน
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* ปุ่มบันทึก */}
          <div className="flex items-center justify-end space-x-4">
            <Button type="button" variant="outline" asChild>
              <Link to="/contractors">ยกเลิก</Link>
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
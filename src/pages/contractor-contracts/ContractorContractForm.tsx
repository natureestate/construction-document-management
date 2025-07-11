import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { 
  ArrowLeft, 
  Save, 
  FileText, 
  User, 
  HardHat, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Package,
  Plus,
  Minus,
  Calculator,
  AlertCircle,
  Clock
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
import { Badge } from '@/components/ui/badge'
import { DatePicker } from '@/components/ui/date-picker'

import { useContractorContracts } from '@/hooks/use-contractor-contracts'
import { useCustomers } from '@/hooks/use-customers'
import { useContractors } from '@/hooks/use-contractors'
import { 
  contractorContractFormSchema,
  type ContractorContractFormData,
  type ContractMaterialData,
  PAYMENT_TYPES,
  MATERIAL_UNITS,
  getPaymentTypeLabel,
  calculateMaterialTotal,
  calculateContractTotal,
  calculateWorkingDays,
  formatCurrency
} from '@/lib/validations/contractor-contract'
import { cn } from '@/lib/utils'

export default function ContractorContractForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = Boolean(id)
  
  const { 
    contracts, 
    loading, 
    error, 
    addContract, 
    updateContract, 
    getContract,
    clearError 
  } = useContractorContracts()

  const { customers, loading: customersLoading } = useCustomers()
  const { contractors, loading: contractorsLoading } = useContractors()

  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<ContractorContractFormData>({
    resolver: zodResolver(contractorContractFormSchema),
    defaultValues: {
      title: '',
      description: '',
      customerId: '',
      contractorId: '',
      workLocation: '',
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 วันจากวันนี้
      paymentType: 'fixed',
      laborCost: 0,
      materials: [],
      workSpecification: '',
      terms: '',
      status: 'draft',
      notes: ''
    }
  })

  // จัดการรายการวัสดุ
  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "materials"
  })

  // โหลดข้อมูลสัญญาสำหรับการแก้ไข
  useEffect(() => {
    if (isEditing && id && !loading) {
      const contract = getContract(id)
      if (contract) {
        form.reset({
          title: contract.title,
          description: contract.description || '',
          customerId: contract.customerId,
          contractorId: contract.contractorId,
          workLocation: contract.workLocation,
          startDate: contract.startDate,
          endDate: contract.endDate,
          estimatedDays: contract.estimatedDays,
          paymentType: contract.paymentType,
          laborCost: contract.laborCost,
          materials: contract.materials || [],
          workSpecification: contract.workSpecification || '',
          terms: contract.terms || '',
          status: contract.status,
          notes: contract.notes || ''
        })
      } else {
        toast.error('ไม่พบข้อมูลสัญญา')
        navigate('/contractor-contracts')
      }
    }
  }, [isEditing, id, getContract, loading, form, navigate])

  // คำนวณราคาและวันทำงานอัตโนมัติ
  const watchedValues = form.watch(['materials', 'laborCost', 'startDate', 'endDate'])
  
  useEffect(() => {
    const [materials, laborCost, startDate, endDate] = watchedValues
    
    // คำนวณค่าวัสดุ
    const materialCost = calculateMaterialTotal(materials || [])
    
    // คำนวณราคารวม
    const totalCost = calculateContractTotal(laborCost || 0, materialCost)
    
    // คำนวณจำนวนวันทำงาน
    if (startDate && endDate && endDate > startDate) {
      const workingDays = calculateWorkingDays(startDate, endDate)
      form.setValue('estimatedDays', workingDays, { shouldValidate: false })
    }
    
    // อัปเดตค่าที่คำนวณได้
    form.setValue('materialCost', materialCost, { shouldValidate: false })
    form.setValue('totalCost', totalCost, { shouldValidate: false })
  }, [watchedValues, form])

  // ส่งฟอร์ม
  const onSubmit = async (data: ContractorContractFormData) => {
    try {
      setIsSubmitting(true)

      if (isEditing && id) {
        await updateContract(id, data)
        toast.success('อัปเดตสัญญาเรียบร้อยแล้ว')
      } else {
        await addContract(data)
        toast.success('สร้างสัญญาใหม่เรียบร้อยแล้ว')
      }

      navigate('/contractor-contracts')
    } catch (err) {
      console.error('Error saving contract:', err)
      toast.error(isEditing ? 'ไม่สามารถอัปเดตสัญญาได้' : 'ไม่สามารถสร้างสัญญาได้')
    } finally {
      setIsSubmitting(false)
    }
  }

  // เพิ่มวัสดุใหม่
  const addMaterial = () => {
    append({
      name: '',
      quantity: 1,
      unit: 'ชิ้น',
      unitPrice: 0,
      totalPrice: 0,
      note: ''
    })
  }

  // อัปเดตราคารวมของวัสดุเมื่อเปลี่ยนจำนวนหรือราคา
  const updateMaterialTotal = (index: number, quantity: number, unitPrice: number) => {
    const totalPrice = quantity * unitPrice
    update(index, {
      ...fields[index],
      quantity,
      unitPrice,
      totalPrice
    })
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
            <Link to="/contractor-contracts">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">สร้าง/แก้ไขสัญญาจ้างช่าง</h1>
            <p className="text-muted-foreground mt-2">ข้อมูลสัญญาจ้างช่างรับเหมา</p>
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

  const estimatedDays = form.watch('estimatedDays')
  const materialCost = form.watch('materialCost') || 0
  const laborCost = form.watch('laborCost') || 0
  const totalCost = form.watch('totalCost') || 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="icon" asChild>
          <Link to="/contractor-contracts">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">
            {isEditing ? 'แก้ไขสัญญาจ้างช่าง' : 'สร้างสัญญาจ้างช่างใหม่'}
          </h1>
          <p className="text-muted-foreground mt-2">
            {isEditing ? 'แก้ไขข้อมูลสัญญาจ้างช่างในระบบ' : 'สร้างสัญญาจ้างช่างรับเหมาใหม่'}
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* ข้อมูลพื้นฐาน */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <CardTitle>ข้อมูลพื้นฐาน</CardTitle>
              </div>
              <CardDescription>
                ข้อมูลหลักของสัญญาจ้างช่างรับเหมา
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* ชื่อสัญญา */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ชื่อสัญญา *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="เช่น สัญญาติดตั้งหลังคาบ้านคุณสมชาย"
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
                          <SelectItem value="draft">ฉบับร่าง</SelectItem>
                          <SelectItem value="pending">รอดำเนินการ</SelectItem>
                          <SelectItem value="approved">อนุมัติแล้ว</SelectItem>
                          <SelectItem value="in_progress">กำลังดำเนินการ</SelectItem>
                          <SelectItem value="completed">เสร็จสิ้น</SelectItem>
                          <SelectItem value="cancelled">ยกเลิก</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* รายละเอียดสัญญา */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>รายละเอียดสัญญา</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="อธิบายรายละเอียดงานที่จะทำ..."
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

          {/* ข้อมูลลูกค้าและช่าง */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <CardTitle>ลูกค้าและช่างรับเหมา</CardTitle>
              </div>
              <CardDescription>
                เลือกลูกค้าและช่างรับเหมาสำหรับสัญญานี้
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* ลูกค้า */}
                <FormField
                  control={form.control}
                  name="customerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ลูกค้า *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="เลือกลูกค้า" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {customersLoading ? (
                            <SelectItem value="" disabled>กำลังโหลดข้อมูลลูกค้า...</SelectItem>
                          ) : customers.length === 0 ? (
                            <SelectItem value="" disabled>ไม่มีข้อมูลลูกค้า</SelectItem>
                          ) : (
                            customers.map((customer) => (
                              <SelectItem key={customer.id} value={customer.id}>
                                <div className="flex items-center space-x-2">
                                  <span>{customer.name}</span>
                                  <Badge variant="outline" className="text-xs">
                                    {customer.type === 'individual' ? 'บุคคล' : 'นิติบุคคล'}
                                  </Badge>
                                </div>
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* ช่างรับเหมา */}
                <FormField
                  control={form.control}
                  name="contractorId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ช่างรับเหมา *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="เลือกช่างรับเหมา" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {contractorsLoading ? (
                            <SelectItem value="" disabled>กำลังโหลดข้อมูลช่าง...</SelectItem>
                          ) : contractors.filter(c => c.status === 'active').length === 0 ? (
                            <SelectItem value="" disabled>ไม่มีช่างที่ใช้งานได้</SelectItem>
                          ) : (
                            contractors
                              .filter(c => c.status === 'active')
                              .map((contractor) => (
                                <SelectItem key={contractor.id} value={contractor.id}>
                                  <div className="flex items-center space-x-2">
                                    <span>{contractor.name}</span>
                                    <div className="flex space-x-1">
                                      {contractor.specialty.slice(0, 2).map(spec => (
                                        <Badge key={spec} variant="outline" className="text-xs">
                                          {spec}
                                        </Badge>
                                      ))}
                                      {contractor.specialty.length > 2 && (
                                        <Badge variant="outline" className="text-xs">
                                          +{contractor.specialty.length - 2}
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </SelectItem>
                              ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* ข้อมูลการทำงาน */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <CardTitle>ข้อมูลการทำงาน</CardTitle>
              </div>
              <CardDescription>
                รายละเอียดเกี่ยวกับการทำงานและระยะเวลา
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* สถานที่ทำงาน */}
              <FormField
                control={form.control}
                name="workLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>สถานที่ทำงาน *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="ระบุที่อยู่และรายละเอียดสถานที่ทำงาน"
                        className="resize-none"
                        rows={2}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* วันที่เริ่มงาน */}
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>วันที่เริ่มงาน *</FormLabel>
                      <DatePicker
                        date={field.value}
                        onDateChange={field.onChange}
                        placeholder="เลือกวันที่เริ่มงาน"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* วันที่สิ้นสุดงาน */}
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>วันที่สิ้นสุดงาน *</FormLabel>
                      <DatePicker
                        date={field.value}
                        onDateChange={field.onChange}
                        placeholder="เลือกวันที่สิ้นสุดงาน"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* จำนวนวันที่คาดว่าจะแล้วเสร็จ */}
                <FormField
                  control={form.control}
                  name="estimatedDays"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>จำนวนวัน</FormLabel>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <Input
                            type="number"
                            min="1"
                            max="365"
                            value={estimatedDays || ''}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                            placeholder="0"
                            className="text-center"
                          />
                          <span className="text-sm text-muted-foreground">วัน</span>
                        </div>
                      </FormControl>
                      <FormDescription>
                        คำนวณอัตโนมัติจากวันที่เริ่มและสิ้นสุด
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* ข้อมูลการจ่ายเงิน */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5" />
                <CardTitle>ข้อมูลการจ่ายเงิน</CardTitle>
              </div>
              <CardDescription>
                ประเภทการจ่ายเงินและค่าใช้จ่ายต่างๆ
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* ประเภทการจ่ายเงิน */}
                <FormField
                  control={form.control}
                  name="paymentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ประเภทการจ่ายเงิน *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="เลือกประเภทการจ่ายเงิน" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {PAYMENT_TYPES.map((type) => (
                            <SelectItem key={type} value={type}>
                              {getPaymentTypeLabel(type)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* ค่าแรง */}
                <FormField
                  control={form.control}
                  name="laborCost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ค่าแรง *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
                            บาท
                          </span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* แสดงสรุปราคา */}
              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <div className="flex items-center space-x-2">
                  <Calculator className="h-4 w-4" />
                  <span className="font-medium">สรุปค่าใช้จ่าย</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span>ค่าแรง:</span>
                    <span className="font-medium">{formatCurrency(laborCost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ค่าวัสดุ:</span>
                    <span className="font-medium">{formatCurrency(materialCost)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>รวมทั้งสิ้น:</span>
                    <span className="text-primary">{formatCurrency(totalCost)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* รายการวัสดุ */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Package className="h-5 w-5" />
                  <div>
                    <CardTitle>รายการวัสดุ</CardTitle>
                    <CardDescription>
                      วัสดุที่ใช้ในการทำงาน (ค่าวัสดุจะคำนวณอัตโนมัติ)
                    </CardDescription>
                  </div>
                </div>
                <Button type="button" variant="outline" onClick={addMaterial}>
                  <Plus className="h-4 w-4 mr-2" />
                  เพิ่มวัสดุ
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {fields.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>ยังไม่มีรายการวัสดุ</p>
                  <Button type="button" variant="outline" onClick={addMaterial} className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    เพิ่มวัสดุแรก
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="border rounded-lg p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">วัสดุที่ {index + 1}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => remove(index)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        {/* ชื่อวัสดุ */}
                        <FormField
                          control={form.control}
                          name={`materials.${index}.name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>ชื่อวัสดุ *</FormLabel>
                              <FormControl>
                                <Input placeholder="เช่น เมทัลชีท" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* จำนวน */}
                        <FormField
                          control={form.control}
                          name={`materials.${index}.quantity`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>จำนวน *</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min="0.01"
                                  step="0.01"
                                  placeholder="1"
                                  {...field}
                                  onChange={(e) => {
                                    const quantity = parseFloat(e.target.value) || 0
                                    field.onChange(quantity)
                                    updateMaterialTotal(index, quantity, form.getValues(`materials.${index}.unitPrice`))
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* หน่วย */}
                        <FormField
                          control={form.control}
                          name={`materials.${index}.unit`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>หน่วย *</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="เลือกหน่วย" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {MATERIAL_UNITS.map((unit) => (
                                    <SelectItem key={unit} value={unit}>
                                      {unit}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* ราคาต่อหน่วย */}
                        <FormField
                          control={form.control}
                          name={`materials.${index}.unitPrice`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>ราคาต่อหน่วย *</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  placeholder="0.00"
                                  {...field}
                                  onChange={(e) => {
                                    const unitPrice = parseFloat(e.target.value) || 0
                                    field.onChange(unitPrice)
                                    updateMaterialTotal(index, form.getValues(`materials.${index}.quantity`), unitPrice)
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* ราคารวม */}
                        <FormField
                          control={form.control}
                          name={`materials.${index}.totalPrice`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>ราคารวม</FormLabel>
                              <FormControl>
                                <Input
                                  readOnly
                                  value={formatCurrency(field.value || 0)}
                                  className="bg-muted/50"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* หมายเหตุ */}
                      <FormField
                        control={form.control}
                        name={`materials.${index}.note`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>หมายเหตุ</FormLabel>
                            <FormControl>
                              <Input placeholder="รายละเอียดเพิ่มเติมของวัสดุ..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* ข้อกำหนดและเงื่อนไข */}
          <Card>
            <CardHeader>
              <CardTitle>ข้อกำหนดและเงื่อนไข</CardTitle>
              <CardDescription>
                รายละเอียดการทำงานและเงื่อนไขการจ่ายเงิน
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* ข้อกำหนดงาน */}
              <FormField
                control={form.control}
                name="workSpecification"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ข้อกำหนดงาน</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="ระบุรายละเอียดการทำงาน วิธีการปฏิบัติ และมาตรฐานที่ต้องการ..."
                        className="resize-none"
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* เงื่อนไขการจ่ายเงิน */}
              <FormField
                control={form.control}
                name="terms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>เงื่อนไขการจ่ายเงิน</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="เช่น จ่ายเงินงวดแรก 50% เมื่อเริ่มงาน จ่ายส่วนที่เหลือเมื่องานเสร็จสิ้น..."
                        className="resize-none"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* หมายเหตุ */}
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>หมายเหตุ</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="หมายเหตุเพิ่มเติม..."
                        className="resize-none"
                        rows={2}
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
              <Link to="/contractor-contracts">ยกเลิก</Link>
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
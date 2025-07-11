import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, Save, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useMaterials } from '@/hooks/use-materials'
import { Material } from '@/types'
import { toast } from 'sonner'

// Validation schema
const materialSchema = z.object({
  name: z.string().min(1, 'กรุณาระบุชื่อวัสดุ'),
  unit: z.string().min(1, 'กรุณาระบุหน่วย'),
  standardPrice: z.number().optional(),
  brand: z.string().optional(),
  model: z.string().optional(),
  specification: z.string().optional(),
  category: z.string().min(1, 'กรุณาเลือกหมวดหมู่'),
})

type MaterialFormData = z.infer<typeof materialSchema>

interface MaterialFormProps {
  material?: Material | null
  onClose: () => void
}

// หมวดหมู่วัสดุที่กำหนดไว้ล่วงหน้า
const MATERIAL_CATEGORIES = [
  'วัสดุหลัก',
  'วัสดุก่อสร้าง', 
  'โครงสร้าง',
  'วัสดุตกแต่ง',
  'อุปกรณ์',
  'เครื่องมือ',
  'อื่นๆ'
]

// หน่วยที่ใช้บ่อย
const COMMON_UNITS = [
  'ชิ้น', 'เส้น', 'แผ่น', 'ถุง', 'กิโลกรัม', 
  'ตัวเมตร', 'ตารางเมตร', 'ลูกบาศก์เมตร',
  'ลิตร', 'กล่อง', 'มัด', 'ก้อน', 'แผง'
]

export function MaterialForm({ material, onClose }: MaterialFormProps) {
  const { addMaterial, updateMaterial } = useMaterials()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const isEdit = !!material
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<MaterialFormData>({
    resolver: zodResolver(materialSchema),
    defaultValues: {
      name: material?.name || '',
      unit: material?.unit || '',
      standardPrice: material?.standardPrice || undefined,
      brand: material?.brand || '',
      model: material?.model || '',
      specification: material?.specification || '',
      category: material?.category || '',
    }
  })

  // Reset form เมื่อ material เปลี่ยน
  useEffect(() => {
    if (material) {
      reset({
        name: material.name,
        unit: material.unit,
        standardPrice: material.standardPrice || undefined,
        brand: material.brand || '',
        model: material.model || '',
        specification: material.specification || '',
        category: material.category,
      })
    }
  }, [material, reset])

  // บันทึกข้อมูล
  const onSubmit = async (data: MaterialFormData) => {
    try {
      setIsSubmitting(true)
      
      if (isEdit && material) {
        updateMaterial(material.id, data)
        toast.success('อัปเดตข้อมูลวัสดุสำเร็จ')
      } else {
        addMaterial(data)
        toast.success('เพิ่มวัสดุใหม่สำเร็จ')
      }
      
      onClose()
    } catch (error) {
      toast.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล')
      console.error('Save material error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // คำนวณราคาต่อหน่วยถ้ามีการกรอกข้อมูล
  const watchedPrice = watch('standardPrice')
  const watchedUnit = watch('unit')

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onClose} size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            กลับ
          </Button>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Package className="h-6 w-6" />
              {isEdit ? 'แก้ไขวัสดุ' : 'เพิ่มวัสดุใหม่'}
            </h1>
            <p className="text-muted-foreground">
              {isEdit ? 'แก้ไขข้อมูลวัสดุและอุปกรณ์' : 'เพิ่มวัสดุและอุปกรณ์ใหม่เข้าสู่ระบบ'}
            </p>
          </div>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>ข้อมูลวัสดุ</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* ชื่อวัสดุ */}
              <div className="space-y-2">
                <Label htmlFor="name">
                  ชื่อวัสดุ <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="เช่น ปูนซีเมนต์, อิฐแดง"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              {/* หน่วยและราคา */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="unit">
                    หน่วย <span className="text-red-500">*</span>
                  </Label>
                  <Select 
                    value={watch('unit')} 
                    onValueChange={(value) => setValue('unit', value)}
                  >
                    <SelectTrigger className={errors.unit ? 'border-red-500' : ''}>
                      <SelectValue placeholder="เลือกหน่วย" />
                    </SelectTrigger>
                    <SelectContent>
                      {COMMON_UNITS.map(unit => (
                        <SelectItem key={unit} value={unit}>
                          {unit}
                        </SelectItem>
                      ))}
                      <SelectItem value="custom">กำหนดเอง...</SelectItem>
                    </SelectContent>
                  </Select>
                  {watch('unit') === 'custom' && (
                    <Input
                      placeholder="ระบุหน่วยที่ต้องการ"
                      onChange={(e) => setValue('unit', e.target.value)}
                    />
                  )}
                  {errors.unit && (
                    <p className="text-sm text-red-500">{errors.unit.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="standardPrice">ราคามาตรฐาน (บาท)</Label>
                  <Input
                    id="standardPrice"
                    type="number"
                    step="0.01"
                    {...register('standardPrice', { valueAsNumber: true })}
                    placeholder="0.00"
                  />
                                     {watchedPrice && watchedUnit && (
                     <p className="text-xs text-muted-foreground">
                       ฿{Number(watchedPrice).toLocaleString()} ต่อ {watchedUnit}
                     </p>
                   )}
                </div>
              </div>

              {/* หมวดหมู่ */}
              <div className="space-y-2">
                <Label htmlFor="category">
                  หมวดหมู่ <span className="text-red-500">*</span>
                </Label>
                <Select 
                  value={watch('category')} 
                  onValueChange={(value) => setValue('category', value)}
                >
                  <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                    <SelectValue placeholder="เลือกหมวดหมู่" />
                  </SelectTrigger>
                  <SelectContent>
                    {MATERIAL_CATEGORIES.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-red-500">{errors.category.message}</p>
                )}
              </div>

              {/* ยี่ห้อและรุ่น */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brand">ยี่ห้อ</Label>
                  <Input
                    id="brand"
                    {...register('brand')}
                    placeholder="เช่น ตราเช้า, เหล็กสยาม"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="model">รุ่น/ประเภท</Label>
                  <Input
                    id="model"
                    {...register('model')}
                    placeholder="เช่น RB6, คลาสสิค"
                  />
                </div>
              </div>

              {/* ข้อมูลจำเพาะ */}
              <div className="space-y-2">
                <Label htmlFor="specification">ข้อมูลจำเพาะ</Label>
                <Textarea
                  id="specification"
                  {...register('specification')}
                  placeholder="รายละเอียดเพิ่มเติม เช่น ขนาด น้ำหนัก คุณสมบัติพิเศษ"
                  rows={3}
                />
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="sm:order-2"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSubmitting ? 'กำลังบันทึก...' : 'บันทึก'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onClose}
                  className="sm:order-1"
                >
                  ยกเลิก
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Preview Card (ถ้ามีข้อมูลการกรอก) */}
        {(watch('name') || watch('unit') || watch('standardPrice')) && (
          <Card>
            <CardHeader>
              <CardTitle>ตัวอย่าง</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">ชื่อ:</span>
                  <span>{watch('name') || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">หน่วย:</span>
                  <span>{watch('unit') || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">ราคา:</span>
                                     <span className="text-green-600 font-semibold">
                     {watch('standardPrice') 
                       ? `฿${Number(watch('standardPrice')).toLocaleString()}` 
                       : '-'
                     }
                   </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">หมวดหมู่:</span>
                  <span>{watch('category') || '-'}</span>
                </div>
                {watch('brand') && (
                  <div className="flex justify-between">
                    <span className="font-medium">ยี่ห้อ:</span>
                    <span>{watch('brand')}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
} 
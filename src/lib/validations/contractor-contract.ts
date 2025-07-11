import { z } from 'zod'

// สถานะของสัญญา
export const CONTRACT_STATUSES = [
  'draft',      // ฉบับร่าง
  'pending',    // รอดำเนินการ
  'approved',   // อนุมัติแล้ว
  'in_progress', // กำลังดำเนินการ
  'completed',  // เสร็จสิ้น
  'cancelled'   // ยกเลิก
] as const

// ประเภทการจ่ายเงิน
export const PAYMENT_TYPES = [
  'fixed',      // จ่ายเหมาจ่าย
  'hourly',     // จ่ายรายชั่วโมง
  'daily',      // จ่ายรายวัน
  'piece_work'  // จ่ายรายชิ้น
] as const

// หน่วยของวัสดุ
export const MATERIAL_UNITS = [
  'ชิ้น',
  'เมตร',
  'ตารางเมตร',
  'ลูกบาศก์เมตร',
  'กิโลกรัม',
  'ตัน',
  'ถุง',
  'กล่อง',
  'แผ่น',
  'ม้วน',
  'ชุด',
  'อัน',
  'แกลลอน',
  'ลิตร'
] as const

// Schema สำหรับวัสดุในสัญญา
export const contractMaterialSchema = z.object({
  id: z.string().optional(), // สำหรับการแก้ไข
  name: z
    .string()
    .min(1, 'กรุณากรอกชื่อวัสดุ')
    .min(2, 'ชื่อวัสดุต้องมีอย่างน้อย 2 ตัวอักษร')
    .max(200, 'ชื่อวัสดุต้องไม่เกิน 200 ตัวอักษร'),
  
  quantity: z
    .number()
    .min(0.01, 'จำนวนต้องมากกว่า 0')
    .max(999999, 'จำนวนต้องไม่เกิน 999,999'),
  
  unit: z
    .string()
    .min(1, 'กรุณาเลือกหน่วย')
    .refine((val) => MATERIAL_UNITS.includes(val as any), {
      message: 'หน่วยไม่ถูกต้อง'
    }),
  
  unitPrice: z
    .number()
    .min(0, 'ราคาต่อหน่วยต้องไม่ติดลบ')
    .max(999999, 'ราคาต่อหน่วยต้องไม่เกิน 999,999'),
  
  totalPrice: z
    .number()
    .min(0, 'ราคารวมต้องไม่ติดลบ')
    .optional(), // คำนวณอัตโนมัติ
  
  note: z
    .string()
    .max(500, 'หมายเหตุต้องไม่เกิน 500 ตัวอักษร')
    .optional()
})

// Schema สำหรับข้อมูลสัญญาจ้างช่าง
export const contractorContractFormSchema = z.object({
  // ข้อมูลพื้นฐาน
  title: z
    .string()
    .min(1, 'กรุณากรอกชื่อสัญญา')
    .min(5, 'ชื่อสัญญาต้องมีอย่างน้อย 5 ตัวอักษร')
    .max(200, 'ชื่อสัญญาต้องไม่เกิน 200 ตัวอักษร'),
  
  description: z
    .string()
    .max(1000, 'รายละเอียดต้องไม่เกิน 1,000 ตัวอักษร')
    .optional(),
  
  // ข้อมูลลูกค้าและช่าง
  customerId: z
    .string()
    .min(1, 'กรุณาเลือกลูกค้า'),
  
  contractorId: z
    .string()
    .min(1, 'กรุณาเลือกช่างรับเหมา'),
  
  // ข้อมูลการทำงาน
  workLocation: z
    .string()
    .min(1, 'กรุณากรอกสถานที่ทำงาน')
    .max(500, 'สถานที่ทำงานต้องไม่เกิน 500 ตัวอักษร'),
  
  startDate: z
    .date({
      required_error: 'กรุณาเลือกวันที่เริ่มงาน',
      invalid_type_error: 'รูปแบบวันที่ไม่ถูกต้อง'
    }),
  
  endDate: z
    .date({
      required_error: 'กรุณาเลือกวันที่สิ้นสุดงาน',
      invalid_type_error: 'รูปแบบวันที่ไม่ถูกต้อง'
    }),
  
  estimatedDays: z
    .number()
    .min(1, 'จำนวนวันที่คาดว่าจะแล้วเสร็จต้องอย่างน้อย 1 วัน')
    .max(365, 'จำนวนวันที่คาดว่าจะแล้วเสร็จต้องไม่เกิน 365 วัน')
    .optional(),
  
  // ข้อมูลการจ่ายเงิน
  paymentType: z
    .enum(PAYMENT_TYPES, {
      required_error: 'กรุณาเลือกประเภทการจ่ายเงิน',
      invalid_type_error: 'ประเภทการจ่ายเงินไม่ถูกต้อง'
    }),
  
  laborCost: z
    .number()
    .min(0, 'ค่าแรงต้องไม่ติดลบ')
    .max(9999999, 'ค่าแรงต้องไม่เกิน 9,999,999'),
  
  materialCost: z
    .number()
    .min(0, 'ค่าวัสดุต้องไม่ติดลบ')
    .max(9999999, 'ค่าวัสดุต้องไม่เกิน 9,999,999')
    .optional()
    .default(0),
  
  totalCost: z
    .number()
    .min(0, 'ราคารวมต้องไม่ติดลบ')
    .optional(), // คำนวณอัตโนมัติ
  
  // วัสดุ
  materials: z
    .array(contractMaterialSchema)
    .optional()
    .default([]),
  
  // ข้อกำหนดและเงื่อนไข
  workSpecification: z
    .string()
    .max(2000, 'ข้อกำหนดงานต้องไม่เกิน 2,000 ตัวอักษร')
    .optional(),
  
  terms: z
    .string()
    .max(2000, 'เงื่อนไขการจ่ายเงินต้องไม่เกิน 2,000 ตัวอักษร')
    .optional(),
  
  // สถานะและการอนุมัติ
  status: z.enum(CONTRACT_STATUSES, {
    required_error: 'กรุณาเลือกสถานะ',
    invalid_type_error: 'สถานะไม่ถูกต้อง'
  }),
  
  notes: z
    .string()
    .max(1000, 'หมายเหตุต้องไม่เกิน 1,000 ตัวอักษร')
    .optional()
}).refine((data) => {
  // ตรวจสอบว่าวันที่สิ้นสุดต้องมากกว่าวันที่เริ่ม
  return data.endDate > data.startDate
}, {
  message: 'วันที่สิ้นสุดต้องมากกว่าวันที่เริ่มงาน',
  path: ['endDate']
})

// Type สำหรับ form data
export type ContractorContractFormData = z.infer<typeof contractorContractFormSchema>
export type ContractMaterialData = z.infer<typeof contractMaterialSchema>

// ฟังก์ชันสำหรับคำนวณราคารวมของวัสดุ
export function calculateMaterialTotal(materials: ContractMaterialData[]): number {
  return materials.reduce((total, material) => {
    return total + (material.quantity * material.unitPrice)
  }, 0)
}

// ฟังก์ชันสำหรับคำนวณราคารวมของสัญญา
export function calculateContractTotal(laborCost: number, materialCost: number): number {
  return laborCost + materialCost
}

// ฟังก์ชันสำหรับคำนวณจำนวนวันทำงาน
export function calculateWorkingDays(startDate: Date, endDate: Date): number {
  const timeDiff = endDate.getTime() - startDate.getTime()
  return Math.ceil(timeDiff / (1000 * 3600 * 24))
}

// ฟังก์ชันสำหรับแปลงสถานะเป็นภาษาไทย
export function getContractStatusLabel(status: typeof CONTRACT_STATUSES[number]): string {
  const statusLabels = {
    draft: 'ฉบับร่าง',
    pending: 'รอดำเนินการ',
    approved: 'อนุมัติแล้ว',
    in_progress: 'กำลังดำเนินการ',
    completed: 'เสร็จสิ้น',
    cancelled: 'ยกเลิก'
  }
  return statusLabels[status] || status
}

// ฟังก์ชันสำหรับแปลงประเภทการจ่ายเงินเป็นภาษาไทย
export function getPaymentTypeLabel(paymentType: typeof PAYMENT_TYPES[number]): string {
  const paymentTypeLabels = {
    fixed: 'จ่ายเหมาจ่าย',
    hourly: 'จ่ายรายชั่วโมง',
    daily: 'จ่ายรายวัน',
    piece_work: 'จ่ายรายชิ้น'
  }
  return paymentTypeLabels[paymentType] || paymentType
}

// ฟังก์ชันสำหรับสร้างสี badge ตามสถานะ
export function getContractStatusColor(status: typeof CONTRACT_STATUSES[number]): string {
  const statusColors = {
    draft: 'bg-gray-100 text-gray-800',
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-blue-100 text-blue-800',
    in_progress: 'bg-orange-100 text-orange-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  }
  return statusColors[status] || 'bg-gray-100 text-gray-800'
}

// ฟังก์ชันสำหรับจัดรูปแบบตัวเลขเป็นเงิน
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount)
}

// ฟังก์ชันสำหรับจัดรูปแบบตัวเลขด้วยคอมม่า
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('th-TH').format(num)
} 
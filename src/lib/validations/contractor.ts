import { z } from 'zod'

// รายการความเชี่ยวชาญของช่าง
export const CONTRACTOR_SPECIALTIES = [
  'หลังคา',
  'ทาสี', 
  'กระเบื้อง',
  'สุขภัณฑ์',
  'ประตู/หน้าต่าง',
  'ไฟฟ้า',
  'ฝ้าเพดาน',
  'ปูน/ฉาบ',
  'เหล็กดัด',
  'เชื่อม',
  'ปรับพื้นที่',
  'ระบบน้ำ',
  'แอร์',
  'รั้ว',
  'พื้น',
  'อื่นๆ'
] as const

// Schema สำหรับ validation ข้อมูลช่างรับเหมา
export const contractorFormSchema = z.object({
  name: z
    .string()
    .min(1, 'กรุณากรอกชื่อช่างรับเหมา')
    .min(2, 'ชื่อช่างรับเหมาต้องมีอย่างน้อย 2 ตัวอักษร')
    .max(100, 'ชื่อช่างรับเหมาต้องไม่เกิน 100 ตัวอักษร'),
  
  phone: z
    .string()
    .optional()
    .refine((val) => !val || /^[0-9\-\s\+\(\)]+$/.test(val), {
      message: 'เบอร์โทรศัพท์ต้องเป็นตัวเลขเท่านั้น'
    })
    .refine((val) => !val || val.replace(/[^\d]/g, '').length >= 9, {
      message: 'เบอร์โทรศัพท์ต้องมีอย่างน้อย 9 หลัก'
    }),
  
  specialty: z
    .array(z.string())
    .min(1, 'กรุณาเลือกความเชี่ยวชาญอย่างน้อย 1 รายการ')
    .refine((val) => val.every(spec => CONTRACTOR_SPECIALTIES.includes(spec as any)), {
      message: 'ความเชี่ยวชาญไม่ถูกต้อง'
    }),
  
  address: z
    .string()
    .optional()
    .refine((val) => !val || val.length <= 500, {
      message: 'ที่อยู่ต้องไม่เกิน 500 ตัวอักษร'
    }),
  
  taxId: z
    .string()
    .optional()
    .refine((val) => !val || /^[0-9]+$/.test(val), {
      message: 'เลขประจำตัวผู้เสียภาษีต้องเป็นตัวเลขเท่านั้น'
    })
    .refine((val) => !val || val.length === 13, {
      message: 'เลขประจำตัวผู้เสียภาษีต้องมี 13 หลัก'
    }),
  
  bankAccount: z
    .string()
    .optional()
    .refine((val) => !val || val.length <= 50, {
      message: 'เลขบัญชีธนาคารต้องไม่เกิน 50 ตัวอักษร'
    }),
  
  status: z.enum(['active', 'inactive'], {
    required_error: 'กรุณาเลือกสถานะ',
    invalid_type_error: 'สถานะไม่ถูกต้อง'
  })
})

// Type สำหรับ form data
export type ContractorFormData = z.infer<typeof contractorFormSchema>

// ฟังก์ชันสำหรับ validate เบอร์โทรไทย (ใช้ร่วมกับ customer validation)
export function validateThaiPhoneNumber(phone: string): boolean {
  const cleanPhone = phone.replace(/[^\d]/g, '')
  
  // มือถือ: 08X, 09X (10 หลัก)
  if (/^0[89][0-9]{8}$/.test(cleanPhone)) return true
  
  // บ้าน กทม: 02 (9 หลัก)
  if (/^02[0-9]{7}$/.test(cleanPhone)) return true
  
  // บ้าน ต่างจังหวัด: 03X, 04X, 05X, 07X (9 หลัก)
  if (/^0[34567][0-9]{7}$/.test(cleanPhone)) return true
  
  return false
}

// ฟังก์ชันสำหรับ validate เลขประจำตัวผู้เสียภาษีไทย
export function validateThaiTaxId(taxId: string): boolean {
  if (!/^[0-9]{13}$/.test(taxId)) return false
  
  const digits = taxId.split('').map(Number)
  const checkDigit = digits[12]
  
  let sum = 0
  for (let i = 0; i < 12; i++) {
    sum += digits[i] * (13 - i)
  }
  
  const remainder = sum % 11
  const calculatedCheckDigit = remainder < 2 ? remainder : 11 - remainder
  
  return checkDigit === calculatedCheckDigit
}

// ฟังก์ชันสำหรับจัดรูปแบบเบอร์โทร
export function formatPhoneNumber(phone: string): string {
  const cleanPhone = phone.replace(/[^\d]/g, '')
  
  if (cleanPhone.length === 10 && cleanPhone.startsWith('0')) {
    // มือถือ: 08X-XXX-XXXX
    if (cleanPhone.startsWith('08') || cleanPhone.startsWith('09')) {
      return `${cleanPhone.slice(0, 3)}-${cleanPhone.slice(3, 6)}-${cleanPhone.slice(6)}`
    }
  }
  
  if (cleanPhone.length === 9 && cleanPhone.startsWith('02')) {
    // บ้าน กทม: 02-XXX-XXXX
    return `${cleanPhone.slice(0, 2)}-${cleanPhone.slice(2, 5)}-${cleanPhone.slice(5)}`
  }
  
  if (cleanPhone.length === 9 && /^0[34567]/.test(cleanPhone)) {
    // บ้าน ต่างจังหวัด: 0XX-XXX-XXX
    return `${cleanPhone.slice(0, 3)}-${cleanPhone.slice(3, 6)}-${cleanPhone.slice(6)}`
  }
  
  return phone
}

// ฟังก์ชันสำหรับสร้างสี background ตามความเชี่ยวชาญ
export function getSpecialtyColor(specialty: string): string {
  const colors = [
    'bg-blue-100 text-blue-800',
    'bg-green-100 text-green-800', 
    'bg-yellow-100 text-yellow-800',
    'bg-red-100 text-red-800',
    'bg-purple-100 text-purple-800',
    'bg-indigo-100 text-indigo-800',
    'bg-pink-100 text-pink-800',
    'bg-gray-100 text-gray-800'
  ]
  
  // สร้าง hash จากชื่อความเชี่ยวชาญ
  let hash = 0
  for (let i = 0; i < specialty.length; i++) {
    hash = specialty.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  return colors[Math.abs(hash) % colors.length]
} 
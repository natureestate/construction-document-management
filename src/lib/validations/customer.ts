import { z } from 'zod'

// Schema สำหรับ validation ข้อมูลลูกค้า
export const customerFormSchema = z.object({
  name: z
    .string()
    .min(1, 'กรุณากรอกชื่อลูกค้า')
    .min(2, 'ชื่อลูกค้าต้องมีอย่างน้อย 2 ตัวอักษร')
    .max(100, 'ชื่อลูกค้าต้องไม่เกิน 100 ตัวอักษร'),
  
  email: z
    .string()
    .optional()
    .refine((val) => !val || z.string().email().safeParse(val).success, {
      message: 'รูปแบบอีเมลไม่ถูกต้อง'
    }),
  
  phone: z
    .string()
    .optional()
    .refine((val) => !val || /^[0-9\-\s\+\(\)]+$/.test(val), {
      message: 'เบอร์โทรศัพท์ต้องเป็นตัวเลขเท่านั้น'
    })
    .refine((val) => !val || val.replace(/[^\d]/g, '').length >= 9, {
      message: 'เบอร์โทรศัพท์ต้องมีอย่างน้อย 9 หลัก'
    }),
  
  address: z
    .string()
    .optional()
    .refine((val) => !val || val.length <= 500, {
      message: 'ที่อยู่ต้องไม่เกิน 500 ตัวอักษร'
    }),
  
  type: z.enum(['individual', 'corporate'], {
    required_error: 'กรุณาเลือกประเภทลูกค้า',
    invalid_type_error: 'ประเภทลูกค้าไม่ถูกต้อง'
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
  
  contactPerson: z
    .string()
    .optional()
    .refine((val) => !val || val.length <= 100, {
      message: 'ชื่อผู้ติดต่อต้องไม่เกิน 100 ตัวอักษร'
    })
})

// สำหรับการ validate เฉพาะ taxId ของลูกค้าองค์กร
export const corporateCustomerSchema = customerFormSchema.refine(
  (data) => {
    if (data.type === 'corporate') {
      return data.taxId && data.taxId.length === 13
    }
    return true
  },
  {
    message: 'ลูกค้าองค์กรต้องระบุเลขประจำตัวผู้เสียภาษี 13 หลัก',
    path: ['taxId']
  }
)

// Type สำหรับ form data
export type CustomerFormData = z.infer<typeof customerFormSchema>

// ฟังก์ชันสำหรับ validate เบอร์โทรไทย
export function validateThaiPhoneNumber(phone: string): boolean {
  // รูปแบบเบอร์โทรไทย: 0X-XXXX-XXXX, 02-XXX-XXXX
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
  
  // วิธีการตรวจสอบ check digit ของเลขประจำตัวผู้เสียภาษีไทย
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
  
  return phone // คืนค่าเดิมถ้าไม่ตรงรูปแบบ
}

// ฟังก์ชันสำหรับจัดรูปแบบเลขประจำตัวผู้เสียภาษี
export function formatTaxId(taxId: string): string {
  const cleanTaxId = taxId.replace(/[^\d]/g, '')
  
  if (cleanTaxId.length === 13) {
    // รูปแบบ: X-XXXX-XXXXX-XX-X
    return `${cleanTaxId.slice(0, 1)}-${cleanTaxId.slice(1, 5)}-${cleanTaxId.slice(5, 10)}-${cleanTaxId.slice(10, 12)}-${cleanTaxId.slice(12)}`
  }
  
  return taxId // คืนค่าเดิมถ้าไม่ครบ 13 หลัก
} 
import { z } from 'zod'

// ประเภทเทมเพลต
export const TEMPLATE_CATEGORIES = [
  'contract',      // สัญญา
  'payment',       // การจ่ายเงิน
  'delivery',      // ใบส่งของ
  'completion',    // ใบส่งงาน
  'progress',      // ใบเบิกงวด
  'memo',          // บันทึกข้อความ
  'invoice',       // ใบแจ้งหนี้
  'receipt',       // ใบเสร็จ
  'quotation',     // ใบเสนอราคา
  'other'          // อื่นๆ
] as const

// ประเภทตัวแปรในเทมเพลต
export const VARIABLE_TYPES = [
  'text',          // ข้อความ
  'number',        // ตัวเลข
  'date',          // วันที่
  'currency',      // เงิน
  'boolean',       // true/false
  'image',         // รูปภาพ
  'table',         // ตาราง
  'signature',     // ลายเซ็น
  'barcode',       // บาร์โค้ด
  'qrcode'         // QR Code
] as const

// Schema สำหรับตัวแปรในเทมเพลต
export const templateVariableSchema = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .min(1, 'กรุณากรอกชื่อตัวแปร')
    .regex(/^[a-zA-Z][a-zA-Z0-9_]*$/, 'ชื่อตัวแปรต้องเริ่มด้วยตัวอักษร และมีเฉพาะตัวอักษร ตัวเลข และ _'),
  
  label: z
    .string()
    .min(1, 'กรุณากรอกป้ายชื่อตัวแปร')
    .max(100, 'ป้ายชื่อตัวแปรต้องไม่เกิน 100 ตัวอักษร'),
  
  type: z.enum(VARIABLE_TYPES, {
    required_error: 'กรุณาเลือกประเภทตัวแปร',
    invalid_type_error: 'ประเภทตัวแปรไม่ถูกต้อง'
  }),
  
  required: z.boolean().default(false),
  
  defaultValue: z.any().optional(),
  
  options: z
    .array(z.string())
    .optional(), // สำหรับ select options
  
  validation: z.object({
    minLength: z.number().optional(),
    maxLength: z.number().optional(),
    min: z.number().optional(),
    max: z.number().optional(),
    pattern: z.string().optional(),
    format: z.string().optional() // เช่น 'email', 'phone', 'url'
  }).optional(),
  
  description: z
    .string()
    .max(500, 'คำอธิบายต้องไม่เกิน 500 ตัวอักษร')
    .optional()
})

// Schema สำหรับเทมเพลตเอกสาร
export const documentTemplateFormSchema = z.object({
  name: z
    .string()
    .min(1, 'กรุณากรอกชื่อเทมเพลต')
    .min(2, 'ชื่อเทมเพลตต้องมีอย่างน้อย 2 ตัวอักษร')
    .max(200, 'ชื่อเทมเพลตต้องไม่เกิน 200 ตัวอักษร'),
  
  description: z
    .string()
    .max(1000, 'คำอธิบายต้องไม่เกิน 1,000 ตัวอักษร')
    .optional(),
  
  category: z.enum(TEMPLATE_CATEGORIES, {
    required_error: 'กรุณาเลือกประเภทเทมเพลต',
    invalid_type_error: 'ประเภทเทมเพลตไม่ถูกต้อง'
  }),
  
  // PDFme template data
  pdfmeTemplate: z.object({
    basePdf: z.string().optional(), // Base64 encoded PDF
    schemas: z.array(z.any()).default([]), // PDFme schemas
    sampleData: z.record(z.any()).optional() // ข้อมูลตัวอย่าง
  }).optional(),
  
  // ตัวแปรที่ใช้ในเทมเพลต
  variables: z
    .array(templateVariableSchema)
    .default([]),
  
  // การตั้งค่าเทมเพลต
  settings: z.object({
    pageSize: z.enum(['A4', 'A3', 'Letter', 'Legal']).default('A4'),
    orientation: z.enum(['portrait', 'landscape']).default('portrait'),
    margins: z.object({
      top: z.number().min(0).max(100).default(20),
      right: z.number().min(0).max(100).default(20),
      bottom: z.number().min(0).max(100).default(20),
      left: z.number().min(0).max(100).default(20)
    }).default({
      top: 20,
      right: 20,
      bottom: 20,
      left: 20
    }),
    fontSize: z.number().min(8).max(72).default(12),
    fontFamily: z.string().default('NotoSansThai'),
    watermark: z.object({
      enabled: z.boolean().default(false),
      text: z.string().optional(),
      opacity: z.number().min(0).max(1).default(0.3),
      rotation: z.number().min(-180).max(180).default(-45)
    }).optional()
  }).default({
    pageSize: 'A4',
    orientation: 'portrait',
    margins: { top: 20, right: 20, bottom: 20, left: 20 },
    fontSize: 12,
    fontFamily: 'NotoSansThai'
  }),
  
  isActive: z.boolean().default(true),
  
  tags: z
    .array(z.string())
    .default([]),
  
  notes: z
    .string()
    .max(1000, 'หมายเหตุต้องไม่เกิน 1,000 ตัวอักษร')
    .optional()
})

// Type สำหรับ form data
export type DocumentTemplateFormData = z.infer<typeof documentTemplateFormSchema>
export type TemplateVariableData = z.infer<typeof templateVariableSchema>

// ฟังก์ชันสำหรับแปลงประเภทเทมเพลตเป็นภาษาไทย
export function getTemplateCategoryLabel(category: typeof TEMPLATE_CATEGORIES[number]): string {
  const categoryLabels = {
    contract: 'สัญญา',
    payment: 'การจ่ายเงิน',
    delivery: 'ใบส่งของ',
    completion: 'ใบส่งงาน',
    progress: 'ใบเบิกงวด',
    memo: 'บันทึกข้อความ',
    invoice: 'ใบแจ้งหนี้',
    receipt: 'ใบเสร็จ',
    quotation: 'ใบเสนอราคา',
    other: 'อื่นๆ'
  }
  return categoryLabels[category] || category
}

// ฟังก์ชันสำหรับแปลงประเภทตัวแปรเป็นภาษาไทย
export function getVariableTypeLabel(type: typeof VARIABLE_TYPES[number]): string {
  const typeLabels = {
    text: 'ข้อความ',
    number: 'ตัวเลข',
    date: 'วันที่',
    currency: 'เงิน',
    boolean: 'ใช่/ไม่ใช่',
    image: 'รูปภาพ',
    table: 'ตาราง',
    signature: 'ลายเซ็น',
    barcode: 'บาร์โค้ด',
    qrcode: 'QR Code'
  }
  return typeLabels[type] || type
}

// ฟังก์ชันสำหรับสร้างสี badge ตามประเภทเทมเพลต
export function getTemplateCategoryColor(category: typeof TEMPLATE_CATEGORIES[number]): string {
  const categoryColors = {
    contract: 'bg-blue-100 text-blue-800',
    payment: 'bg-green-100 text-green-800',
    delivery: 'bg-orange-100 text-orange-800',
    completion: 'bg-purple-100 text-purple-800',
    progress: 'bg-yellow-100 text-yellow-800',
    memo: 'bg-gray-100 text-gray-800',
    invoice: 'bg-red-100 text-red-800',
    receipt: 'bg-emerald-100 text-emerald-800',
    quotation: 'bg-indigo-100 text-indigo-800',
    other: 'bg-slate-100 text-slate-800'
  }
  return categoryColors[category] || 'bg-gray-100 text-gray-800'
}

// ฟังก์ชันสำหรับสร้างสี badge ตามประเภทตัวแปร
export function getVariableTypeColor(type: typeof VARIABLE_TYPES[number]): string {
  const typeColors = {
    text: 'bg-blue-100 text-blue-800',
    number: 'bg-green-100 text-green-800',
    date: 'bg-purple-100 text-purple-800',
    currency: 'bg-yellow-100 text-yellow-800',
    boolean: 'bg-gray-100 text-gray-800',
    image: 'bg-pink-100 text-pink-800',
    table: 'bg-indigo-100 text-indigo-800',
    signature: 'bg-orange-100 text-orange-800',
    barcode: 'bg-red-100 text-red-800',
    qrcode: 'bg-cyan-100 text-cyan-800'
  }
  return typeColors[type] || 'bg-gray-100 text-gray-800'
}

// ฟังก์ชันสำหรับ validate ตัวแปรซ้ำ
export function validateUniqueVariableNames(variables: TemplateVariableData[]): boolean {
  const names = variables.map(v => v.name.toLowerCase())
  return names.length === new Set(names).size
}

// ฟังก์ชันสำหรับสร้างข้อมูลตัวอย่างจากตัวแปร
export function generateSampleDataFromVariables(variables: TemplateVariableData[]): Record<string, any> {
  const sampleData: Record<string, any> = {}
  
  variables.forEach(variable => {
    switch (variable.type) {
      case 'text':
        sampleData[variable.name] = variable.defaultValue || `ตัวอย่าง${variable.label}`
        break
      case 'number':
        sampleData[variable.name] = variable.defaultValue || 123
        break
      case 'date':
        sampleData[variable.name] = variable.defaultValue || new Date().toISOString().split('T')[0]
        break
      case 'currency':
        sampleData[variable.name] = variable.defaultValue || 1000.00
        break
      case 'boolean':
        sampleData[variable.name] = variable.defaultValue ?? true
        break
      case 'image':
        sampleData[variable.name] = variable.defaultValue || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=='
        break
      case 'table':
        sampleData[variable.name] = variable.defaultValue || [
          { column1: 'แถว 1 คอลัมน์ 1', column2: 'แถว 1 คอลัมน์ 2' },
          { column1: 'แถว 2 คอลัมน์ 1', column2: 'แถว 2 คอลัมน์ 2' }
        ]
        break
      case 'signature':
        sampleData[variable.name] = variable.defaultValue || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=='
        break
      case 'barcode':
      case 'qrcode':
        sampleData[variable.name] = variable.defaultValue || '1234567890'
        break
      default:
        sampleData[variable.name] = variable.defaultValue || ''
    }
  })
  
  return sampleData
}

// ฟังก์ชันสำหรับ format ค่าตามประเภทตัวแปร
export function formatVariableValue(value: any, type: typeof VARIABLE_TYPES[number]): string {
  if (value === null || value === undefined) return ''
  
  switch (type) {
    case 'currency':
      return new Intl.NumberFormat('th-TH', {
        style: 'currency',
        currency: 'THB'
      }).format(Number(value) || 0)
    
    case 'number':
      return new Intl.NumberFormat('th-TH').format(Number(value) || 0)
    
    case 'date':
      try {
        return new Intl.DateTimeFormat('th-TH', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }).format(new Date(value))
      } catch {
        return String(value)
      }
    
    case 'boolean':
      return value ? 'ใช่' : 'ไม่ใช่'
    
    default:
      return String(value)
  }
} 
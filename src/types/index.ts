// ประเภทสถานะทั่วไป
export type Status = 'active' | 'inactive' | 'pending' | 'completed' | 'cancelled'

// ข้อมูลลูกค้า
export interface Customer {
  id: string
  name: string
  email?: string
  phone?: string
  address?: string
  type: 'individual' | 'corporate' // บุคคลธรรมดา หรือ นิติบุคคล
  taxId?: string // เลขประจำตัวผู้เสียภาษี
  contactPerson?: string // ผู้ติดต่อ (สำหรับลูกค้าองค์กร)
  createdAt: Date
  updatedAt: Date
}

// โครงการ (Project) สำหรับลูกค้าองค์กร
export interface Project {
  id: string
  customerId: string
  name: string
  description?: string
  location: string
  startDate?: Date
  endDate?: Date
  estimatedValue?: number
  status: Status
  createdAt: Date
  updatedAt: Date
}

// ช่างรับเหมา
export interface Contractor {
  id: string
  name: string
  phone?: string
  specialty: string[] // ความเชี่ยวชาญ เช่น ["หลังคา", "ทาสี", "กระเบื้อง"]
  address?: string
  taxId?: string
  bankAccount?: string
  status: Status
  createdAt: Date
  updatedAt: Date
}

// ข้อมูลวัสดุ/รายการสินค้า
export interface Material {
  id: string
  name: string
  unit: string // หน่วย เช่น ตร.ม., ชิ้น, ถุง
  standardPrice?: number
  brand?: string
  model?: string
  specification?: string
  category: string
  createdAt: Date
  updatedAt: Date
}

// เทมเพลตเอกสาร
export interface DocumentTemplate {
  id: string
  name: string
  description?: string
  category: 'contract' | 'payment' | 'delivery' | 'completion' | 'progress' | 'memo' | 'invoice' | 'receipt' | 'quotation' | 'other'
  content: string // HTML template content
  variables: TemplateVariable[] // ตัวแปรที่ใช้ในเทมเพลต
  // PDFme template data
  pdfmeTemplate?: {
    basePdf?: string // Base64 encoded PDF
    schemas: any[] // PDFme schemas
    sampleData?: Record<string, any> // ข้อมูลตัวอย่าง
  }
  // การตั้งค่าเทมเพลต
  settings?: {
    pageSize: 'A4' | 'A3' | 'Letter' | 'Legal'
    orientation: 'portrait' | 'landscape'
    margins: {
      top: number
      right: number
      bottom: number
      left: number
    }
    fontSize: number
    fontFamily: string
    watermark?: {
      enabled: boolean
      text?: string
      opacity: number
      rotation: number
    }
  }
  isActive: boolean
  tags?: string[]
  notes?: string
  createdAt: Date
  updatedAt: Date
}

// ตัวแปรในเทมเพลต
export interface TemplateVariable {
  id?: string
  name: string
  label: string
  type: 'text' | 'number' | 'date' | 'currency' | 'boolean' | 'image' | 'table' | 'signature' | 'barcode' | 'qrcode'
  required: boolean
  defaultValue?: any
  options?: string[] // สำหรับ select options
  validation?: {
    minLength?: number
    maxLength?: number
    min?: number
    max?: number
    pattern?: string
    format?: string // เช่น 'email', 'phone', 'url'
  }
  description?: string
}

// สัญญาจ้างช่างรับเหมา
export interface ContractorContract {
  id: string
  title: string
  description?: string
  customerId: string
  projectId?: string
  contractorId: string
  workLocation: string
  startDate: Date
  endDate: Date
  estimatedDays?: number
  paymentType: 'fixed' | 'hourly' | 'daily' | 'piece_work'
  laborCost: number
  materialCost: number
  totalCost: number
  materials: ContractMaterial[]
  workSpecification?: string
  terms?: string
  status: 'draft' | 'pending' | 'approved' | 'in_progress' | 'completed' | 'cancelled'
  notes?: string
  templateId?: string
  createdAt: Date
  updatedAt: Date
}

// วัสดุในสัญญา
export interface ContractMaterial {
  id?: string
  name: string
  quantity: number
  unit: string
  unitPrice: number
  totalPrice?: number
  note?: string
}

// บันทึกส่วนต่างวัสดุ
export interface MaterialDifference {
  id: string
  contractId: string
  customerId: string
  projectId?: string
  materials: MaterialDifferenceItem[]
  totalAmount: number
  approvedBy?: string
  approvedDate?: Date
  status: 'pending' | 'approved' | 'rejected'
  notes?: string
  createdAt: Date
  updatedAt: Date
}

// รายการวัสดุส่วนต่าง
export interface MaterialDifferenceItem {
  materialId: string
  materialName: string
  quantity: number
  unit: string
  pricePerUnit: number
  totalPrice: number
  reason: string // เหตุผลที่ต้องเพิ่มวัสดุ
}

// สัญญาก่อสร้างหลัก (ลูกค้า กับ บริษัท)
export interface MainContract {
  id: string
  contractNumber: string
  customerId: string
  projectId?: string
  projectName: string
  projectLocation: string
  contractValue: number
  startDate: Date
  endDate: Date
  paymentSchedule: PaymentSchedule[]
  workScope: string
  materials: ContractMaterial[]
  terms: string
  status: 'draft' | 'active' | 'completed' | 'cancelled'
  templateId?: string
  createdAt: Date
  updatedAt: Date
}

// ตารางการชำระเงิน
export interface PaymentSchedule {
  id: string
  description: string
  percentage: number
  amount: number
  dueDate?: Date
  condition?: string // เงื่อนไขการจ่าย
  isPaid: boolean
  paidDate?: Date
  paidAmount?: number
}

// บันทึกการจ่ายเงินช่าง
export interface ContractorPayment {
  id: string
  contractorId: string
  contractorName: string
  customerId: string
  projectId?: string
  contractId?: string
  workDescription: string
  amount: number
  paymentDate: Date
  paymentMethod: 'cash' | 'transfer' | 'check'
  referenceNumber?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

// ใบส่งงาน
export interface WorkCompletion {
  id: string
  workCompletionNumber: string
  contractId: string
  customerId: string
  projectId?: string
  workDescription: string
  completionDate: Date
  completedBy: string
  approvedBy?: string
  approvedDate?: Date
  notes?: string
  attachments?: string[] // ไฟล์แนบ เช่น รูปภาพ
  status: 'submitted' | 'approved' | 'rejected'
  templateId?: string
  createdAt: Date
  updatedAt: Date
}

// ใบส่งงวด
export interface ProgressClaim {
  id: string
  claimNumber: string
  contractId: string
  customerId: string
  projectId?: string
  claimDate: Date
  workProgress: number // เปอร์เซ็นต์ความคืบหน้า
  claimAmount: number
  cumulativeAmount: number // ยอดสะสม
  description: string
  attachments?: string[]
  status: 'draft' | 'submitted' | 'approved' | 'paid'
  templateId?: string
  createdAt: Date
  updatedAt: Date
}

// ใบส่งของ
export interface DeliveryNote {
  id: string
  deliveryNumber: string
  contractId?: string
  customerId: string
  projectId?: string
  deliveryDate: Date
  deliveryLocation: string
  items: DeliveryItem[]
  deliveredBy: string
  receivedBy?: string
  receivedDate?: Date
  status: 'delivered' | 'received' | 'partial'
  notes?: string
  templateId?: string
  createdAt: Date
  updatedAt: Date
}

// รายการสินค้าในใบส่งของ
export interface DeliveryItem {
  materialId: string
  materialName: string
  quantity: number
  unit: string
  condition?: string // สภาพสินค้า
  notes?: string
}

// บันทึกข้อความ (Memo)
export interface Memo {
  id: string
  memoNumber: string
  title: string
  content: string
  fromUser: string
  toUser?: string
  customerId?: string
  projectId?: string
  contractId?: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'draft' | 'sent' | 'read' | 'archived'
  dueDate?: Date
  attachments?: string[]
  templateId?: string
  createdAt: Date
  updatedAt: Date
}

// ผู้ใช้งาน
export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'manager' | 'staff'
  phone?: string
  department?: string
  isActive: boolean
  lastLogin?: Date
  createdAt: Date
  updatedAt: Date
}

// การตั้งค่าระบบ
export interface SystemSettings {
  id: string
  companyName: string
  companyAddress: string
  companyPhone: string
  companyEmail: string
  companyTaxId: string
  companyLogo?: string
  defaultCurrency: string
  dateFormat: string
  numberFormat: string
  createdAt: Date
  updatedAt: Date
} 
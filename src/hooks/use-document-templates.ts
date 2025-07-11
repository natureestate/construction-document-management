import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { DocumentTemplate } from '@/types'
import {
  getLocalStorageItem,
  addToLocalStorageArray,
  updateLocalStorageArrayItem,
  removeFromLocalStorageArray
} from '@/lib/local-storage'

const DOCUMENT_TEMPLATES_KEY = 'construction_document_templates'

// สร้างข้อมูลตัวอย่างเพื่อการทดสอบ
const mockDocumentTemplates: DocumentTemplate[] = [
  {
    id: '1',
    name: 'สัญญาจ้างช่างรับเหมาทั่วไป',
    description: 'เทมเพลตสัญญาจ้างช่างรับเหมาสำหรับงานก่อสร้างทั่วไป',
    category: 'contract',
    content: `
      <div style="font-family: 'Sarabun', sans-serif; padding: 20px;">
        <h1 style="text-align: center; margin-bottom: 30px;">สัญญาจ้างช่างรับเหมา</h1>
        
        <p style="margin-bottom: 20px;">
          สัญญาฉบับนี้ทำขึ้นเมื่อวันที่ {{contractDate}} ระหว่าง
        </p>
        
        <table style="width: 100%; margin-bottom: 20px;">
          <tr>
            <td style="width: 50%; vertical-align: top; padding-right: 20px;">
              <h3>ผู้ว่าจ้าง (ลูกค้า)</h3>
              <p><strong>ชื่อ:</strong> {{customerName}}</p>
              <p><strong>ที่อยู่:</strong> {{customerAddress}}</p>
              <p><strong>โทรศัพท์:</strong> {{customerPhone}}</p>
            </td>
            <td style="width: 50%; vertical-align: top; padding-left: 20px;">
              <h3>ผู้รับจ้าง (ช่างรับเหมา)</h3>
              <p><strong>ชื่อ:</strong> {{contractorName}}</p>
              <p><strong>ที่อยู่:</strong> {{contractorAddress}}</p>
              <p><strong>โทรศัพท์:</strong> {{contractorPhone}}</p>
            </td>
          </tr>
        </table>
        
        <h3>รายละเอียดงาน</h3>
        <p><strong>ชื่องาน:</strong> {{workTitle}}</p>
        <p><strong>สถานที่ทำงาน:</strong> {{workLocation}}</p>
        <p><strong>รายละเอียดงาน:</strong> {{workDescription}}</p>
        
        <h3>ระยะเวลาการทำงาน</h3>
        <p><strong>วันที่เริ่มงาน:</strong> {{startDate}}</p>
        <p><strong>วันที่สิ้นสุดงาน:</strong> {{endDate}}</p>
        <p><strong>จำนวนวันทำงาน:</strong> {{workDays}} วัน</p>
        
        <h3>ค่าตอบแทนและการจ่ายเงิน</h3>
        <p><strong>ค่าแรง:</strong> {{laborCost}} บาท</p>
        <p><strong>ค่าวัสดุ:</strong> {{materialCost}} บาท</p>
        <p><strong>ราคารวมทั้งสิ้น:</strong> {{totalCost}} บาท</p>
        <p><strong>ประเภทการจ่ายเงิน:</strong> {{paymentType}}</p>
        <p><strong>เงื่อนไขการจ่ายเงิน:</strong> {{paymentTerms}}</p>
        
        <h3>เงื่อนไขอื่นๆ</h3>
        <p>{{additionalTerms}}</p>
        
        <div style="margin-top: 50px;">
          <table style="width: 100%;">
            <tr>
              <td style="width: 50%; text-align: center;">
                <p>ลงชื่อ ................................</p>
                <p>({{customerName}})</p>
                <p>ผู้ว่าจ้าง</p>
                <p>วันที่ ................................</p>
              </td>
              <td style="width: 50%; text-align: center;">
                <p>ลงชื่อ ................................</p>
                <p>({{contractorName}})</p>
                <p>ผู้รับจ้าง</p>
                <p>วันที่ ................................</p>
              </td>
            </tr>
          </table>
        </div>
      </div>
    `,
    variables: [
      {
        name: 'contractDate',
        label: 'วันที่ทำสัญญา',
        type: 'date',
        required: true,
        defaultValue: new Date().toISOString().split('T')[0]
      },
      {
        name: 'customerName',
        label: 'ชื่อลูกค้า',
        type: 'text',
        required: true,
        defaultValue: ''
      },
      {
        name: 'customerAddress',
        label: 'ที่อยู่ลูกค้า',
        type: 'text',
        required: false,
        defaultValue: ''
      },
      {
        name: 'customerPhone',
        label: 'โทรศัพท์ลูกค้า',
        type: 'text',
        required: false,
        defaultValue: ''
      },
      {
        name: 'contractorName',
        label: 'ชื่อช่างรับเหมา',
        type: 'text',
        required: true,
        defaultValue: ''
      },
      {
        name: 'contractorAddress',
        label: 'ที่อยู่ช่างรับเหมา',
        type: 'text',
        required: false,
        defaultValue: ''
      },
      {
        name: 'contractorPhone',
        label: 'โทรศัพท์ช่างรับเหมา',
        type: 'text',
        required: false,
        defaultValue: ''
      },
      {
        name: 'workTitle',
        label: 'ชื่องาน',
        type: 'text',
        required: true,
        defaultValue: ''
      },
      {
        name: 'workLocation',
        label: 'สถานที่ทำงาน',
        type: 'text',
        required: true,
        defaultValue: ''
      },
      {
        name: 'workDescription',
        label: 'รายละเอียดงาน',
        type: 'text',
        required: true,
        defaultValue: ''
      },
      {
        name: 'startDate',
        label: 'วันที่เริ่มงาน',
        type: 'date',
        required: true,
        defaultValue: ''
      },
      {
        name: 'endDate',
        label: 'วันที่สิ้นสุดงาน',
        type: 'date',
        required: true,
        defaultValue: ''
      },
      {
        name: 'workDays',
        label: 'จำนวนวันทำงาน',
        type: 'number',
        required: false,
        defaultValue: 0
      },
      {
        name: 'laborCost',
        label: 'ค่าแรง',
        type: 'currency',
        required: true,
        defaultValue: 0
      },
      {
        name: 'materialCost',
        label: 'ค่าวัสดุ',
        type: 'currency',
        required: true,
        defaultValue: 0
      },
      {
        name: 'totalCost',
        label: 'ราคารวม',
        type: 'currency',
        required: true,
        defaultValue: 0
      },
      {
        name: 'paymentType',
        label: 'ประเภทการจ่ายเงิน',
        type: 'text',
        required: true,
        defaultValue: 'จ่ายเหมาจ่าย'
      },
      {
        name: 'paymentTerms',
        label: 'เงื่อนไขการจ่ายเงิน',
        type: 'text',
        required: false,
        defaultValue: ''
      },
      {
        name: 'additionalTerms',
        label: 'เงื่อนไขเพิ่มเติม',
        type: 'text',
        required: false,
        defaultValue: ''
      }
    ],
    isActive: true,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01')
  },
  {
    id: '2',
    name: 'ใบเสร็จรับเงิน',
    description: 'เทมเพลตใบเสร็จรับเงินสำหรับการรับชำระค่าจ้างช่าง',
    category: 'receipt',
    content: `
      <div style="font-family: 'Sarabun', sans-serif; padding: 20px;">
        <h1 style="text-align: center; margin-bottom: 30px;">ใบเสร็จรับเงิน</h1>
        
        <div style="text-align: right; margin-bottom: 20px;">
          <p><strong>เลขที่:</strong> {{receiptNumber}}</p>
          <p><strong>วันที่:</strong> {{receiptDate}}</p>
        </div>
        
        <p style="margin-bottom: 20px;">
          ได้รับเงินจาก <strong>{{customerName}}</strong>
        </p>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr style="border-bottom: 1px solid #000;">
            <th style="text-align: left; padding: 10px;">รายการ</th>
            <th style="text-align: right; padding: 10px;">จำนวนเงิน</th>
          </tr>
          <tr>
            <td style="padding: 10px;">{{workDescription}}</td>
            <td style="text-align: right; padding: 10px;">{{amount}} บาท</td>
          </tr>
          <tr style="border-top: 1px solid #000;">
            <td style="text-align: right; padding: 10px;"><strong>รวมทั้งสิ้น</strong></td>
            <td style="text-align: right; padding: 10px;"><strong>{{amount}} บาท</strong></td>
          </tr>
        </table>
        
        <p><strong>จำนวนเงิน (ตัวอักษร):</strong> {{amountInWords}}</p>
        <p><strong>วิธีการชำระ:</strong> {{paymentMethod}}</p>
        
        <div style="text-align: right; margin-top: 50px;">
          <p>ลงชื่อ ................................</p>
          <p>({{receiverName}})</p>
          <p>ผู้รับเงิน</p>
        </div>
      </div>
    `,
    variables: [
      {
        name: 'receiptNumber',
        label: 'เลขที่ใบเสร็จ',
        type: 'text',
        required: true,
        defaultValue: ''
      },
      {
        name: 'receiptDate',
        label: 'วันที่ออกใบเสร็จ',
        type: 'date',
        required: true,
        defaultValue: new Date().toISOString().split('T')[0]
      },
      {
        name: 'customerName',
        label: 'ชื่อผู้จ่ายเงิน',
        type: 'text',
        required: true,
        defaultValue: ''
      },
      {
        name: 'workDescription',
        label: 'รายละเอียดงาน',
        type: 'text',
        required: true,
        defaultValue: ''
      },
      {
        name: 'amount',
        label: 'จำนวนเงิน',
        type: 'currency',
        required: true,
        defaultValue: 0
      },
      {
        name: 'amountInWords',
        label: 'จำนวนเงิน (ตัวอักษร)',
        type: 'text',
        required: true,
        defaultValue: ''
      },
      {
        name: 'paymentMethod',
        label: 'วิธีการชำระเงิน',
        type: 'text',
        required: true,
        defaultValue: 'เงินสด'
      },
      {
        name: 'receiverName',
        label: 'ชื่อผู้รับเงิน',
        type: 'text',
        required: true,
        defaultValue: ''
      }
    ],
    isActive: true,
    createdAt: new Date('2024-02-05'),
    updatedAt: new Date('2024-02-05')
  },
  {
    id: '3',
    name: 'ใบส่งงาน',
    description: 'เทมเพลตใบส่งงานสำหรับแจ้งความคืบหน้าและส่งมอบงาน',
    category: 'completion',
    content: `
      <div style="font-family: 'Sarabun', sans-serif; padding: 20px;">
        <h1 style="text-align: center; margin-bottom: 30px;">ใบส่งงาน</h1>
        
        <div style="text-align: right; margin-bottom: 20px;">
          <p><strong>เลขที่:</strong> {{deliveryNumber}}</p>
          <p><strong>วันที่:</strong> {{deliveryDate}}</p>
        </div>
        
        <table style="width: 100%; margin-bottom: 20px;">
          <tr>
            <td style="width: 50%; vertical-align: top; padding-right: 20px;">
              <h3>ผู้ส่งงาน</h3>
              <p><strong>ชื่อ:</strong> {{contractorName}}</p>
              <p><strong>โทรศัพท์:</strong> {{contractorPhone}}</p>
            </td>
            <td style="width: 50%; vertical-align: top; padding-left: 20px;">
              <h3>ผู้รับงาน</h3>
              <p><strong>ชื่อ:</strong> {{customerName}}</p>
              <p><strong>โทรศัพท์:</strong> {{customerPhone}}</p>
            </td>
          </tr>
        </table>
        
        <h3>รายละเอียดงาน</h3>
        <p><strong>ชื่องาน:</strong> {{workTitle}}</p>
        <p><strong>สถานที่ทำงาน:</strong> {{workLocation}}</p>
        <p><strong>วันที่เริ่มงาน:</strong> {{startDate}}</p>
        <p><strong>วันที่ส่งงาน:</strong> {{completionDate}}</p>
        
        <h3>สถานะงาน</h3>
        <p><strong>ความคืบหน้า:</strong> {{progressPercentage}}%</p>
        <p><strong>สถานะ:</strong> {{status}}</p>
        
        <h3>รายละเอียดงานที่ส่งมอบ</h3>
        <p>{{deliveryDetails}}</p>
        
        <h3>หมายเหตุ</h3>
        <p>{{notes}}</p>
        
        <div style="margin-top: 50px;">
          <table style="width: 100%;">
            <tr>
              <td style="width: 50%; text-align: center;">
                <p>ลงชื่อ ................................</p>
                <p>({{contractorName}})</p>
                <p>ผู้ส่งงาน</p>
                <p>วันที่ ................................</p>
              </td>
              <td style="width: 50%; text-align: center;">
                <p>ลงชื่อ ................................</p>
                <p>({{customerName}})</p>
                <p>ผู้รับงาน</p>
                <p>วันที่ ................................</p>
              </td>
            </tr>
          </table>
        </div>
      </div>
    `,
    variables: [
      {
        name: 'deliveryNumber',
        label: 'เลขที่ใบส่งงาน',
        type: 'text',
        required: true,
        defaultValue: ''
      },
      {
        name: 'deliveryDate',
        label: 'วันที่ส่งงาน',
        type: 'date',
        required: true,
        defaultValue: new Date().toISOString().split('T')[0]
      },
      {
        name: 'contractorName',
        label: 'ชื่อผู้ส่งงาน',
        type: 'text',
        required: true,
        defaultValue: ''
      },
      {
        name: 'contractorPhone',
        label: 'โทรศัพท์ผู้ส่งงาน',
        type: 'text',
        required: false,
        defaultValue: ''
      },
      {
        name: 'customerName',
        label: 'ชื่อผู้รับงาน',
        type: 'text',
        required: true,
        defaultValue: ''
      },
      {
        name: 'customerPhone',
        label: 'โทรศัพท์ผู้รับงาน',
        type: 'text',
        required: false,
        defaultValue: ''
      },
      {
        name: 'workTitle',
        label: 'ชื่องาน',
        type: 'text',
        required: true,
        defaultValue: ''
      },
      {
        name: 'workLocation',
        label: 'สถานที่ทำงาน',
        type: 'text',
        required: true,
        defaultValue: ''
      },
      {
        name: 'startDate',
        label: 'วันที่เริ่มงาน',
        type: 'date',
        required: true,
        defaultValue: ''
      },
      {
        name: 'completionDate',
        label: 'วันที่เสร็จงาน',
        type: 'date',
        required: true,
        defaultValue: ''
      },
      {
        name: 'progressPercentage',
        label: 'เปอร์เซ็นต์ความคืบหน้า',
        type: 'number',
        required: true,
        defaultValue: 100
      },
      {
        name: 'status',
        label: 'สถานะงาน',
        type: 'text',
        required: true,
        defaultValue: 'เสร็จสิ้น'
      },
      {
        name: 'deliveryDetails',
        label: 'รายละเอียดงานที่ส่งมอบ',
        type: 'text',
        required: true,
        defaultValue: ''
      },
      {
        name: 'notes',
        label: 'หมายเหตุ',
        type: 'text',
        required: false,
        defaultValue: ''
      }
    ],
    isActive: true,
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-10')
  }
]

export function useDocumentTemplates() {
  const [templates, setTemplates] = useState<DocumentTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // โหลดข้อมูลเทมเพลตเมื่อ component mount
  useEffect(() => {
    try {
      setLoading(true)
      const savedTemplates = getLocalStorageItem<DocumentTemplate[]>(DOCUMENT_TEMPLATES_KEY, [])
      
      // ถ้าไม่มีข้อมูลใน localStorage ให้ใช้ข้อมูลตัวอย่าง
      if (savedTemplates.length === 0) {
        setTemplates(mockDocumentTemplates)
        // บันทึกข้อมูลตัวอย่างลง localStorage
        localStorage.setItem(DOCUMENT_TEMPLATES_KEY, JSON.stringify(mockDocumentTemplates))
      } else {
        // แปลง string dates กลับเป็น Date objects
        const templatesWithDates = savedTemplates.map(template => ({
          ...template,
          createdAt: new Date(template.createdAt),
          updatedAt: new Date(template.updatedAt)
        }))
        setTemplates(templatesWithDates)
      }
    } catch (err) {
      setError('ไม่สามารถโหลดข้อมูลเทมเพลตได้')
      console.error('Error loading templates:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // เพิ่มเทมเพลตใหม่
  const addTemplate = (templateData: Omit<DocumentTemplate, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newTemplate: DocumentTemplate = {
        ...templateData,
        id: uuidv4(),
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const updatedTemplates = addToLocalStorageArray(DOCUMENT_TEMPLATES_KEY, newTemplate)
      setTemplates(updatedTemplates)
      return newTemplate
    } catch (err) {
      setError('ไม่สามารถเพิ่มเทมเพลตได้')
      console.error('Error adding template:', err)
      throw err
    }
  }

  // แก้ไขเทมเพลต
  const updateTemplate = (id: string, templateData: Omit<DocumentTemplate, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const existingTemplate = templates.find(t => t.id === id)
      if (!existingTemplate) {
        throw new Error('ไม่พบข้อมูลเทมเพลต')
      }

      const updatedTemplate: DocumentTemplate = {
        ...templateData,
        id,
        createdAt: existingTemplate.createdAt,
        updatedAt: new Date()
      }

      const updatedTemplates = updateLocalStorageArrayItem(DOCUMENT_TEMPLATES_KEY, id, updatedTemplate)
      setTemplates(updatedTemplates)
      return updatedTemplate
    } catch (err) {
      setError('ไม่สามารถแก้ไขเทมเพลตได้')
      console.error('Error updating template:', err)
      throw err
    }
  }

  // ลบเทมเพลต
  const deleteTemplate = (id: string) => {
    try {
      const updatedTemplates = removeFromLocalStorageArray<DocumentTemplate>(DOCUMENT_TEMPLATES_KEY, id)
      setTemplates(updatedTemplates)
    } catch (err) {
      setError('ไม่สามารถลบเทมเพลตได้')
      console.error('Error deleting template:', err)
      throw err
    }
  }

  // ค้นหาเทมเพลตตาม ID
  const getTemplate = (id: string): DocumentTemplate | undefined => {
    return templates.find(template => template.id === id)
  }

  // ค้นหาเทมเพลต
  const searchTemplates = (query: string): DocumentTemplate[] => {
    if (!query.trim()) return templates
    
    const lowercaseQuery = query.toLowerCase()
    return templates.filter(template => 
      template.name.toLowerCase().includes(lowercaseQuery) ||
      template.description?.toLowerCase().includes(lowercaseQuery) ||
      template.category.toLowerCase().includes(lowercaseQuery)
    )
  }

  // ค้นหาเทมเพลตตามประเภท
  const getTemplatesByCategory = (category: DocumentTemplate['category']): DocumentTemplate[] => {
    return templates.filter(template => template.category === category && template.isActive)
  }

  // ค้นหาเทมเพลตที่ใช้งานได้
  const getActiveTemplates = (): DocumentTemplate[] => {
    return templates.filter(template => template.isActive)
  }

  // สถิติเทมเพลต
  const getTemplateStats = () => {
    const total = templates.length
    const active = templates.filter(t => t.isActive).length
    const inactive = templates.filter(t => !t.isActive).length
    
    // นับตามประเภท
    const categoryCount: Record<string, number> = {}
    templates.forEach(template => {
      categoryCount[template.category] = (categoryCount[template.category] || 0) + 1
    })
    
    const topCategories = Object.entries(categoryCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([category, count]) => ({ category, count }))

    return {
      total,
      active,
      inactive,
      topCategories
    }
  }

  // แปลงข้อมูลสัญญาเป็นข้อมูลเทมเพลต
  const generateTemplateDataFromContract = (contract: any, customer: any, contractor: any): Record<string, any> => {
    return {
      contractDate: new Date().toLocaleDateString('th-TH'),
      customerName: customer?.name || '',
      customerAddress: customer?.address || '',
      customerPhone: customer?.phone || '',
      contractorName: contractor?.name || '',
      contractorAddress: contractor?.address || '',
      contractorPhone: contractor?.phone || '',
      workTitle: contract?.title || '',
      workLocation: contract?.workLocation || '',
      workDescription: contract?.description || '',
      startDate: contract?.startDate ? new Date(contract.startDate).toLocaleDateString('th-TH') : '',
      endDate: contract?.endDate ? new Date(contract.endDate).toLocaleDateString('th-TH') : '',
      workDays: contract?.estimatedDays || 0,
      laborCost: contract?.laborCost || 0,
      materialCost: contract?.materialCost || 0,
      totalCost: contract?.totalCost || 0,
      paymentType: contract?.paymentType || '',
      paymentTerms: contract?.terms || '',
      additionalTerms: contract?.workSpecification || ''
    }
  }

  // แปลงเทมเพลต HTML เป็น PDF (เตรียมไว้สำหรับ PDFme)
  const generatePDFFromTemplate = async (templateId: string, data: Record<string, any>): Promise<string> => {
    const template = getTemplate(templateId)
    if (!template) {
      throw new Error('ไม่พบเทมเพลต')
    }

    // แทนที่ตัวแปรใน template content
    let processedContent = template.content
    
    // แทนที่ตัวแปรทั้งหมด
    template.variables.forEach(variable => {
      const placeholder = `{{${variable.name}}}`
      const value = data[variable.name] || variable.defaultValue || ''
      
      // Format ค่าตามประเภท
      let formattedValue = value
      switch (variable.type) {
        case 'currency':
          formattedValue = new Intl.NumberFormat('th-TH', {
            style: 'currency',
            currency: 'THB'
          }).format(Number(value) || 0)
          break
        case 'number':
          formattedValue = new Intl.NumberFormat('th-TH').format(Number(value) || 0)
          break
        case 'date':
          if (value) {
            try {
              formattedValue = new Date(value).toLocaleDateString('th-TH')
            } catch {
              formattedValue = value
            }
          }
          break
        case 'boolean':
          formattedValue = value ? 'ใช่' : 'ไม่ใช่'
          break
      }
      
      processedContent = processedContent.replace(new RegExp(placeholder, 'g'), formattedValue)
    })

    // ในอนาคตจะใช้ PDFme สำหรับแปลง HTML เป็น PDF
    // สำหรับตอนนี้ return processed HTML
    return processedContent
  }

  // ล้าง error
  const clearError = () => {
    setError(null)
  }

  return {
    templates,
    loading,
    error,
    addTemplate,
    updateTemplate,
    deleteTemplate,
    getTemplate,
    searchTemplates,
    getTemplatesByCategory,
    getActiveTemplates,
    getTemplateStats,
    generateTemplateDataFromContract,
    generatePDFFromTemplate,
    clearError
  }
} 
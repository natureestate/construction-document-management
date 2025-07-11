import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Download, Eye, Edit, Printer, FileText } from 'lucide-react'
import { DocumentTemplate } from '@/types'
import { Skeleton } from '@/components/ui/skeleton'

interface PdfPreviewProps {
  template: DocumentTemplate
  data: Record<string, any>
  onEdit?: () => void
  onDownload?: () => void
  onPrint?: () => void
  className?: string
}

export function PdfPreview({ 
  template, 
  data, 
  onEdit, 
  onDownload, 
  onPrint, 
  className 
}: PdfPreviewProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null)
  const [error, setError] = useState<string | null>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // สร้าง PDF จากเทมเพลตและข้อมูล
  useEffect(() => {
    generatePdfPreview()
  }, [template, data])

  const generatePdfPreview = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // ใช้ PDFme หรือ jsPDF สร้าง PDF
      // สำหรับตอนนี้ใช้วิธีง่ายๆ ด้วย HTML to PDF
      const pdfContent = generatePdfContent()
      
      // ใช้ browser print API สำหรับ demo
      const blob = new Blob([pdfContent], { type: 'application/pdf' })
      setPdfBlob(blob)
      
      // แสดงใน iframe
      if (iframeRef.current) {
        const url = URL.createObjectURL(blob)
        iframeRef.current.src = url
      }

    } catch (err) {
      setError('เกิดข้อผิดพลาดในการสร้าง PDF')
      console.error('PDF generation error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // สร้างเนื้อหา PDF จากเทมเพลตและข้อมูล
  const generatePdfContent = () => {
    let content = template.content
    
    // แทนที่ตัวแปรในเทมเพลตด้วยข้อมูลจริง
    template.variables.forEach(variable => {
      const value = data[variable.name] || variable.defaultValue || ''
      const placeholder = `{{${variable.name}}}`
      content = content.replace(new RegExp(placeholder, 'g'), String(value))
    })

    // สร้าง HTML สำหรับ PDF
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${template.name}</title>
          <style>
            body {
              font-family: 'Sarabun', Arial, sans-serif;
              margin: 20px;
              line-height: 1.6;
              color: #333;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #333;
              padding-bottom: 20px;
            }
            .content {
              margin: 20px 0;
            }
            .signature-section {
              margin-top: 50px;
              display: flex;
              justify-content: space-between;
            }
            .signature-box {
              text-align: center;
              width: 200px;
              border-top: 1px solid #333;
              padding-top: 10px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f2f2f2;
            }
            .text-center { text-align: center; }
            .text-right { text-align: right; }
            .font-bold { font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${template.name}</h1>
            <p>วันที่: ${new Date().toLocaleDateString('th-TH')}</p>
          </div>
          <div class="content">
            ${content}
          </div>
          ${template.category !== 'memo' ? `
            <div class="signature-section">
              <div class="signature-box">
                <p>ลงชื่อ ผู้ทำสัญญา</p>
                <p>(...............................)</p>
              </div>
              <div class="signature-box">
                <p>ลงชื่อ พยาน</p>
                <p>(...............................)</p>
              </div>
            </div>
          ` : ''}
        </body>
      </html>
    `
  }

  // ดาวน์โหลด PDF
  const handleDownload = () => {
    if (pdfBlob) {
      const url = URL.createObjectURL(pdfBlob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${template.name}_${new Date().toISOString().split('T')[0]}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
    onDownload?.()
  }

  // พิมพ์ PDF
  const handlePrint = () => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow?.print()
    }
    onPrint?.()
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              ตัวอย่าง {template.name}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{template.category}</Badge>
              <span className="text-sm text-muted-foreground">
                {template.settings?.pageSize || 'A4'} | {template.settings?.orientation || 'portrait'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onEdit && (
              <Button variant="outline" size="sm" onClick={onEdit}>
                <Edit className="h-4 w-4 mr-2" />
                แก้ไข
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={handlePrint} disabled={isLoading}>
              <Printer className="h-4 w-4 mr-2" />
              พิมพ์
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload} disabled={isLoading}>
              <Download className="h-4 w-4 mr-2" />
              ดาวน์โหลด
            </Button>
          </div>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="p-0">
        <div className="relative h-[600px] bg-gray-50">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
              <div className="space-y-4 text-center">
                <Skeleton className="h-8 w-32 mx-auto" />
                <Skeleton className="h-4 w-48 mx-auto" />
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              </div>
            </div>
          )}
          
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
              <div className="text-center space-y-2">
                <div className="text-red-600 font-medium">เกิดข้อผิดพลาด</div>
                <div className="text-sm text-gray-600">{error}</div>
                <Button variant="outline" size="sm" onClick={generatePdfPreview}>
                  ลองใหม่
                </Button>
              </div>
            </div>
          )}

          <iframe
            ref={iframeRef}
            className="w-full h-full border-0"
            title="PDF Preview"
            style={{ 
              display: isLoading || error ? 'none' : 'block',
              backgroundColor: 'white'
            }}
          />
        </div>
      </CardContent>
    </Card>
  )
}

// คอมโพเนนต์ย่อยสำหรับแสดงรายการตัวแปรที่ใช้ในเทมเพลต
interface TemplateVariablesProps {
  variables: DocumentTemplate['variables']
  data: Record<string, any>
  onChange: (data: Record<string, any>) => void
}

export function TemplateVariables({ variables, data, onChange }: TemplateVariablesProps) {
  const handleChange = (name: string, value: any) => {
    onChange({ ...data, [name]: value })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>ข้อมูลเอกสาร</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {variables.map((variable) => (
            <div key={variable.id || variable.name} className="space-y-2">
              <label className="text-sm font-medium">
                {variable.label}
                {variable.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              
              {variable.type === 'text' && (
                <input
                  type="text"
                  value={data[variable.name] || variable.defaultValue || ''}
                  onChange={(e) => handleChange(variable.name, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={variable.description}
                />
              )}
              
              {variable.type === 'number' && (
                <input
                  type="number"
                  value={data[variable.name] || variable.defaultValue || ''}
                  onChange={(e) => handleChange(variable.name, Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={variable.description}
                />
              )}
              
              {variable.type === 'date' && (
                <input
                  type="date"
                  value={data[variable.name] || variable.defaultValue || ''}
                  onChange={(e) => handleChange(variable.name, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}
              
              {variable.description && (
                <p className="text-xs text-gray-500">{variable.description}</p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 
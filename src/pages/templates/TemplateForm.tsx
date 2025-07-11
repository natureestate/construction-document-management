import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Plus, Trash2, Save, FileText, Settings, Eye, Code, Download } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

import { useDocumentTemplates } from '@/hooks/use-document-templates'
import {
  documentTemplateFormSchema,
  type DocumentTemplateFormData,
  TEMPLATE_CATEGORIES,
  VARIABLE_TYPES,
  getTemplateCategoryLabel,
  getVariableTypeLabel,
  getVariableTypeColor,
  generateSampleDataFromVariables
} from '@/lib/validations/template'

export default function TemplateForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)

  const {
    templates,
    addTemplate,
    updateTemplate,
    getTemplate,
    generatePDFFromTemplate
  } = useDocumentTemplates()

  const [activeTab, setActiveTab] = useState('basic')
  const [previewHtml, setPreviewHtml] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm({
    resolver: zodResolver(documentTemplateFormSchema),
    defaultValues: {
      name: '',
      description: '',
      category: 'contract' as const,
      variables: [],
      settings: {
        pageSize: 'A4' as const,
        orientation: 'portrait' as const,
        margins: { top: 20, right: 20, bottom: 20, left: 20 },
        fontSize: 12,
        fontFamily: 'NotoSansThai'
      },
      isActive: true,
      tags: [],
      notes: ''
    }
  })

  const { fields: variableFields, append: appendVariable, remove: removeVariable } = useFieldArray({
    control: form.control,
    name: 'variables'
  })

  // โหลดข้อมูลสำหรับการแก้ไข
  useEffect(() => {
    if (isEdit && id) {
      const template = getTemplate(id)
      if (template) {
        // แปลงข้อมูลเทมเพลตให้ตรงกับ form schema
        const formData: DocumentTemplateFormData = {
          name: template.name,
          description: template.description || '',
          category: template.category,
          variables: template.variables,
          settings: template.settings || {
            pageSize: 'A4',
            orientation: 'portrait',
            margins: { top: 20, right: 20, bottom: 20, left: 20 },
            fontSize: 12,
            fontFamily: 'NotoSansThai'
          },
          isActive: template.isActive,
          tags: template.tags || [],
          notes: template.notes || ''
        }
        
        // Reset form ด้วยข้อมูลที่โหลดมา
        form.reset(formData)
      } else {
        navigate('/templates')
      }
    }
  }, [isEdit, id, getTemplate, form, navigate])

  // เพิ่มตัวแปรใหม่
  const handleAddVariable = () => {
    appendVariable({
      name: '',
      label: '',
      type: 'text' as const,
      required: false,
      defaultValue: ''
    })
  }

  // ลบตัวแปร
  const handleRemoveVariable = (index: number) => {
    removeVariable(index)
  }

  // สร้างตัวอย่างเทมเพลต HTML
  const generatePreview = async () => {
    const formData = form.getValues()
    const sampleData = generateSampleDataFromVariables(formData.variables)
    
    // สร้าง HTML content พื้นฐาน
    let htmlContent = `
      <div style="font-family: '${formData.settings?.fontFamily || 'NotoSansThai'}', sans-serif; 
                  font-size: ${formData.settings?.fontSize || 12}px; 
                  padding: ${formData.settings?.margins?.top || 20}px ${formData.settings?.margins?.right || 20}px ${formData.settings?.margins?.bottom || 20}px ${formData.settings?.margins?.left || 20}px;">
        <h1 style="text-align: center; margin-bottom: 30px;">${formData.name}</h1>
        
        <div style="margin-bottom: 20px;">
          <p><strong>ประเภท:</strong> ${getTemplateCategoryLabel(formData.category)}</p>
          ${formData.description ? `<p><strong>คำอธิบาย:</strong> ${formData.description}</p>` : ''}
        </div>
        
        <h3>ตัวแปรในเทมเพลต:</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr style="border-bottom: 1px solid #ccc;">
            <th style="text-align: left; padding: 8px;">ชื่อตัวแปร</th>
            <th style="text-align: left; padding: 8px;">ป้ายชื่อ</th>
            <th style="text-align: left; padding: 8px;">ค่าตัวอย่าง</th>
          </tr>
    `
    
    (formData.variables || []).forEach(variable => {
      const value = sampleData[variable.name] || variable.defaultValue || '-'
      htmlContent += `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">{{${variable.name}}}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${variable.label}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${value}</td>
        </tr>
      `
    })
    
    htmlContent += `
        </table>
        
        <p style="margin-top: 30px; text-align: center; color: #666;">
          ตัวอย่างเทมเพลต - สร้างเมื่อ ${new Date().toLocaleDateString('th-TH')}
        </p>
      </div>
    `
    
    setPreviewHtml(htmlContent)
  }

  // บันทึกเทมเพลต
  const handleSubmit = async (formData: DocumentTemplateFormData) => {
    try {
      setIsLoading(true)

      // สร้าง content พื้นฐานถ้ายังไม่มี
      const templateData = {
        ...formData,
        content: previewHtml || `
          <div style="font-family: 'NotoSansThai', sans-serif; padding: 20px;">
            <h1 style="text-align: center;">${formData.name}</h1>
            ${formData.variables.map(variable => `
              <p><strong>${variable.label}:</strong> {{${variable.name}}}</p>
            `).join('')}
          </div>
        `
      }

      if (isEdit && id) {
        updateTemplate(id, templateData)
      } else {
        addTemplate(templateData)
      }

      navigate('/templates')
    } catch (error) {
      console.error('Error saving template:', error)
      alert('ไม่สามารถบันทึกเทมเพลตได้ กรุณาลองใหม่อีกครั้ง')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/templates')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          กลับ
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEdit ? 'แก้ไขเทมเพลต' : 'สร้างเทมเพลตใหม่'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEdit ? 'แก้ไขข้อมูลเทมเพลตเอกสาร' : 'สร้างเทมเพลตเอกสารสำหรับระบบ'}
          </p>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              ข้อมูลพื้นฐาน
            </TabsTrigger>
            <TabsTrigger value="variables" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              ตัวแปร
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              การตั้งค่า
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              ตัวอย่าง
            </TabsTrigger>
          </TabsList>

          {/* แท็บข้อมูลพื้นฐาน */}
          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>ข้อมูลเทมเพลต</CardTitle>
                <CardDescription>
                  กรอกข้อมูลพื้นฐานของเทมเพลตเอกสาร
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">ชื่อเทมเพลต *</Label>
                    <Input
                      id="name"
                      {...form.register('name')}
                      placeholder="เช่น สัญญาจ้างช่างรับเหมา"
                    />
                    {form.formState.errors.name && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">ประเภทเทมเพลต *</Label>
                    <Select 
                      value={form.watch('category')} 
                      onValueChange={(value) => form.setValue('category', value as any)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="เลือกประเภทเทมเพลต" />
                      </SelectTrigger>
                      <SelectContent>
                        {TEMPLATE_CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {getTemplateCategoryLabel(category)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {form.formState.errors.category && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.category.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">คำอธิบาย</Label>
                  <Textarea
                    id="description"
                    {...form.register('description')}
                    placeholder="อธิบายรายละเอียดของเทมเพลต"
                    rows={3}
                  />
                  {form.formState.errors.description && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.description.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">หมายเหตุ</Label>
                  <Textarea
                    id="notes"
                    {...form.register('notes')}
                    placeholder="หมายเหตุเพิ่มเติม"
                    rows={2}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isActive"
                    checked={form.watch('isActive')}
                    onCheckedChange={(checked) => form.setValue('isActive', Boolean(checked))}
                  />
                  <Label htmlFor="isActive">เปิดใช้งานเทมเพลต</Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* แท็บตัวแปร */}
          <TabsContent value="variables" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>ตัวแปรในเทมเพลต</CardTitle>
                    <CardDescription>
                      กำหนดตัวแปรที่จะใช้ในเทมเพลต เช่น ชื่อลูกค้า วันที่ ราคา
                    </CardDescription>
                  </div>
                  <Button type="button" onClick={handleAddVariable}>
                    <Plus className="h-4 w-4 mr-2" />
                    เพิ่มตัวแปร
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {variableFields.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Code className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p>ยังไม่มีตัวแปรในเทมเพลต</p>
                    <p className="text-sm mt-1">เริ่มต้นด้วยการเพิ่มตัวแปรแรก</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {variableFields.map((field, index) => (
                      <Card key={field.id} className="p-4">
                        <div className="flex items-start justify-between mb-4">
                          <h4 className="font-medium">ตัวแปรที่ {index + 1}</h4>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveVariable(index)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label>ชื่อตัวแปร *</Label>
                            <Input
                              {...form.register(`variables.${index}.name`)}
                              placeholder="customerName"
                            />
                            {form.formState.errors.variables?.[index]?.name && (
                              <p className="text-sm text-red-500">
                                {form.formState.errors.variables[index]?.name?.message}
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label>ป้ายชื่อ *</Label>
                            <Input
                              {...form.register(`variables.${index}.label`)}
                              placeholder="ชื่อลูกค้า"
                            />
                            {form.formState.errors.variables?.[index]?.label && (
                              <p className="text-sm text-red-500">
                                {form.formState.errors.variables[index]?.label?.message}
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label>ประเภท *</Label>
                            <Select
                              value={form.watch(`variables.${index}.type`)}
                              onValueChange={(value) => 
                                form.setValue(`variables.${index}.type`, value as any)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {VARIABLE_TYPES.map((type) => (
                                  <SelectItem key={type} value={type}>
                                    <div className="flex items-center gap-2">
                                      <Badge 
                                        variant="secondary" 
                                        className={getVariableTypeColor(type)}
                                      >
                                        {getVariableTypeLabel(type)}
                                      </Badge>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <div className="space-y-2">
                            <Label>ค่าเริ่มต้น</Label>
                            <Input
                              {...form.register(`variables.${index}.defaultValue`)}
                              placeholder="ค่าเริ่มต้น (ถ้ามี)"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>คำอธิบาย</Label>
                            <Input
                              {...form.register(`variables.${index}.description`)}
                              placeholder="คำอธิบายตัวแปร"
                            />
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 mt-4">
                          <Checkbox
                            checked={form.watch(`variables.${index}.required`)}
                            onCheckedChange={(checked) => 
                              form.setValue(`variables.${index}.required`, Boolean(checked))
                            }
                          />
                          <Label>บังคับกรอก</Label>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* แท็บการตั้งค่า */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>การตั้งค่าเทมเพลต</CardTitle>
                <CardDescription>
                  กำหนดค่าต่างๆ สำหรับการสร้าง PDF และรูปแบบเอกสาร
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>ขนาดกระดาษ</Label>
                    <Select
                      value={form.watch('settings.pageSize')}
                      onValueChange={(value) => 
                        form.setValue('settings.pageSize', value as any)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A4">A4</SelectItem>
                        <SelectItem value="A3">A3</SelectItem>
                        <SelectItem value="Letter">Letter</SelectItem>
                        <SelectItem value="Legal">Legal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>การวางแนว</Label>
                    <Select
                      value={form.watch('settings.orientation')}
                      onValueChange={(value) => 
                        form.setValue('settings.orientation', value as any)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="portrait">แนวตั้ง</SelectItem>
                        <SelectItem value="landscape">แนวนอน</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-4">ระยะขอบกระดาษ (มม.)</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label>ขอบบน</Label>
                      <Input
                        type="number"
                        {...form.register('settings.margins.top', { valueAsNumber: true })}
                        min={0}
                        max={100}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>ขอบขวา</Label>
                      <Input
                        type="number"
                        {...form.register('settings.margins.right', { valueAsNumber: true })}
                        min={0}
                        max={100}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>ขอบล่าง</Label>
                      <Input
                        type="number"
                        {...form.register('settings.margins.bottom', { valueAsNumber: true })}
                        min={0}
                        max={100}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>ขอบซ้าย</Label>
                      <Input
                        type="number"
                        {...form.register('settings.margins.left', { valueAsNumber: true })}
                        min={0}
                        max={100}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>ขนาดตัวอักษร</Label>
                    <Input
                      type="number"
                      {...form.register('settings.fontSize', { valueAsNumber: true })}
                      min={8}
                      max={72}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>แบบอักษร</Label>
                    <Select
                      value={form.watch('settings.fontFamily')}
                      onValueChange={(value) => 
                        form.setValue('settings.fontFamily', value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NotoSansThai">Noto Sans Thai</SelectItem>
                        <SelectItem value="Sarabun">Sarabun</SelectItem>
                        <SelectItem value="Kanit">Kanit</SelectItem>
                        <SelectItem value="Prompt">Prompt</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* แท็บตัวอย่าง */}
          <TabsContent value="preview" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>ตัวอย่างเทมเพลต</CardTitle>
                    <CardDescription>
                      ดูตัวอย่างเทมเพลตก่อนบันทึก
                    </CardDescription>
                  </div>
                  <Button type="button" onClick={generatePreview} variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    สร้างตัวอย่าง
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {previewHtml ? (
                  <div 
                    className="border rounded-lg p-6 bg-white"
                    dangerouslySetInnerHTML={{ __html: previewHtml }}
                  />
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p>กดปุ่ม "สร้างตัวอย่าง" เพื่อดูตัวอย่างเทมเพลต</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* ปุ่มบันทึก */}
        <div className="flex justify-end gap-4 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/templates')}
          >
            ยกเลิก
          </Button>
          <Button type="submit" disabled={isLoading}>
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? 'กำลังบันทึก...' : (isEdit ? 'อัปเดต' : 'บันทึก')}
          </Button>
        </div>
      </form>
    </div>
  )
} 
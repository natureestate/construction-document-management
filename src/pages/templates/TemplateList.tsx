import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Filter, Eye, Edit, Trash2, Copy, FileText, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useDocumentTemplates } from '@/hooks/use-document-templates'
import {
  TEMPLATE_CATEGORIES,
  getTemplateCategoryLabel,
  getTemplateCategoryColor
} from '@/lib/validations/template'

export default function TemplateList() {
  const {
    templates,
    loading,
    error,
    deleteTemplate,
    getTemplateStats,
    searchTemplates,
    getTemplatesByCategory,
    getActiveTemplates
  } = useDocumentTemplates()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // ข้อมูลสถิติ
  const stats = getTemplateStats()

  // กรองและค้นหาเทมเพลต
  const getFilteredTemplates = () => {
    let filtered = templates

    // กรองตามสถานะ
    if (statusFilter === 'active') {
      filtered = filtered.filter(t => t.isActive)
    } else if (statusFilter === 'inactive') {
      filtered = filtered.filter(t => !t.isActive)
    }

    // กรองตามประเภท
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(t => t.category === selectedCategory)
    }

    // ค้นหา
    if (searchQuery.trim()) {
      const lowercaseQuery = searchQuery.toLowerCase()
      filtered = filtered.filter(template => 
        template.name.toLowerCase().includes(lowercaseQuery) ||
        template.description?.toLowerCase().includes(lowercaseQuery) ||
        getTemplateCategoryLabel(template.category).toLowerCase().includes(lowercaseQuery)
      )
    }

    return filtered.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
  }

  const filteredTemplates = getFilteredTemplates()

  // ฟังก์ชันลบเทมเพลต
  const handleDeleteTemplate = async (id: string, name: string) => {
    if (window.confirm(`คุณต้องการลบเทมเพลต "${name}" หรือไม่?`)) {
      try {
        deleteTemplate(id)
      } catch (error) {
        console.error('Error deleting template:', error)
        alert('ไม่สามารถลบเทมเพลตได้')
      }
    }
  }

  // ฟังก์ชันคัดลอกเทมเพลต
  const handleCopyTemplate = (template: any) => {
    // ในอนาคตจะทำระบบคัดลอกเทมเพลต
    alert('ฟีเจอร์คัดลอกเทมเพลตจะพร้อมในเร็วๆ นี้')
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">จัดการเทมเพลตเอกสาร</h1>
          <Button disabled>
            <Plus className="mr-2 h-4 w-4" />
            เพิ่มเทมเพลต
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">จัดการเทมเพลตเอกสาร</h1>
          <Link to="/templates/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              เพิ่มเทมเพลต
            </Button>
          </Link>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">จัดการเทมเพลตเอกสาร</h1>
          <p className="text-gray-600 mt-1">
            สร้างและจัดการเทมเพลตเอกสารสำหรับการออกใบสัญญา ใบเสร็จ และเอกสารต่างๆ
          </p>
        </div>
        <Link to="/templates/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            เพิ่มเทมเพลต
          </Button>
        </Link>
      </div>

      {/* สถิติ */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              เทมเพลตทั้งหมด
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              ใช้งานได้
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              ปิดใช้งาน
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.inactive}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              ประเภทยอดนิยม
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              {stats.topCategories.length > 0 ? (
                <span className="font-medium">
                  {getTemplateCategoryLabel(stats.topCategories[0].category as any)} 
                  ({stats.topCategories[0].count})
                </span>
              ) : (
                'ไม่มีข้อมูล'
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ตัวกรองและค้นหา */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">ค้นหาและกรองเทมเพลต</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="ค้นหาเทมเพลต..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="ประเภทเทมเพลต" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทุกประเภท</SelectItem>
                {TEMPLATE_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {getTemplateCategoryLabel(category)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue placeholder="สถานะ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทั้งหมด</SelectItem>
                <SelectItem value="active">ใช้งานได้</SelectItem>
                <SelectItem value="inactive">ปิดใช้งาน</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* รายการเทมเพลต */}
      <div className="space-y-4">
        {filteredTemplates.length === 0 ? (
          <Card>
            <CardContent className="py-8">
              <div className="text-center">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">ไม่พบเทมเพลต</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchQuery || selectedCategory !== 'all' || statusFilter !== 'all'
                    ? 'ลองเปลี่ยนเงื่อนไขการค้นหาหรือกรอง'
                    : 'เริ่มต้นด้วยการสร้างเทมเพลตใหม่'}
                </p>
                {(!searchQuery && selectedCategory === 'all' && statusFilter === 'all') && (
                                     <div className="mt-6">
                     <Link to="/templates/new">
                       <Button>
                         <Plus className="mr-2 h-4 w-4" />
                         เพิ่มเทมเพลตแรก
                       </Button>
                     </Link>
                   </div>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <CardTitle className="text-lg leading-none">
                        {template.name}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="secondary" 
                          className={getTemplateCategoryColor(template.category)}
                        >
                          {getTemplateCategoryLabel(template.category)}
                        </Badge>
                        <Badge 
                          variant={template.isActive ? 'default' : 'secondary'}
                          className={template.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                        >
                          {template.isActive ? 'ใช้งานได้' : 'ปิดใช้งาน'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  {template.description && (
                    <CardDescription className="text-sm">
                      {template.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="mr-1 h-4 w-4" />
                      แก้ไขล่าสุด: {template.updatedAt.toLocaleDateString('th-TH')}
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      ตัวแปร: {template.variables.length} ตัว
                    </div>
                    
                                         <div className="flex items-center gap-2 pt-2">
                       <Link to={`/templates/${template.id}/preview`}>
                         <Button
                           size="sm"
                           variant="outline"
                         >
                           <Eye className="mr-1 h-4 w-4" />
                           ดูตัวอย่าง
                         </Button>
                       </Link>
                       <Link to={`/templates/${template.id}/edit`}>
                         <Button
                           size="sm"
                           variant="outline"
                         >
                           <Edit className="mr-1 h-4 w-4" />
                           แก้ไข
                         </Button>
                       </Link>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCopyTemplate(template)}
                      >
                        <Copy className="mr-1 h-4 w-4" />
                        คัดลอก
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteTemplate(template.id, template.name)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* ข้อมูลสรุป */}
      {filteredTemplates.length > 0 && (
        <div className="text-sm text-gray-500 text-center">
          แสดง {filteredTemplates.length} จาก {templates.length} เทมเพลต
        </div>
      )}
    </div>
  )
} 
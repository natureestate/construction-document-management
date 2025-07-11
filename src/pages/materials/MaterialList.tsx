import { useState } from 'react'
import { Plus, Search, Edit, Trash2, Package, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useMaterials } from '@/hooks/use-materials'
import { Material } from '@/types'
// import { MaterialForm } from './MaterialForm'  // TODO: implement MaterialForm
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

export function MaterialList() {
  const { 
    materials, 
    loading, 
    deleteMaterial, 
    searchMaterials, 
    getMaterialsByCategory 
  } = useMaterials()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [showForm, setShowForm] = useState(false)
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null)

  // ฟิลเตอร์วัสดุ
  const filteredMaterials = (() => {
    let filtered = materials

    // กรองตามคำค้นหา
    if (searchQuery.trim()) {
      filtered = searchMaterials(searchQuery)
    }

    // กรองตามหมวดหมู่
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(material => material.category === selectedCategory)
    }

    return filtered
  })()

  // หมวดหมู่ทั้งหมด
  const categories = Array.from(new Set(materials.map(m => m.category)))

  // เปิดฟอร์มเพิ่มวัสดุใหม่
  const handleAddMaterial = () => {
    setEditingMaterial(null)
    setShowForm(true)
  }

  // เปิดฟอร์มแก้ไขวัสดุ
  const handleEditMaterial = (material: Material) => {
    setEditingMaterial(material)
    setShowForm(true)
  }

  // ลบวัสดุ
  const handleDeleteMaterial = (id: string) => {
    deleteMaterial(id)
  }

  // ปิดฟอร์ม
  const handleFormClose = () => {
    setShowForm(false)
    setEditingMaterial(null)
  }

  // กรองวัสดุตามราคา
  const getPriceColor = (price?: number) => {
    if (!price) return 'text-gray-500'
    if (price < 100) return 'text-green-600'
    if (price < 500) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (loading) {
    return (
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">จัดการวัสดุ</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (showForm) {
    // TODO: implement MaterialForm component
    return (
      <div className="container mx-auto p-4">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">
            {editingMaterial ? 'แก้ไขวัสดุ' : 'เพิ่มวัสดุใหม่'}
          </h2>
          <p className="text-muted-foreground mb-4">
            ฟอร์มจัดการวัสดุอยู่ระหว่างการพัฒนา
          </p>
          <Button onClick={handleFormClose}>
            กลับไปรายการวัสดุ
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Package className="h-6 w-6" />
            จัดการวัสดุ
          </h1>
          <p className="text-muted-foreground">
            จัดการข้อมูลวัสดุและอุปกรณ์ก่อสร้าง
          </p>
        </div>
        <Button onClick={handleAddMaterial} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          เพิ่มวัสดุใหม่
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="ค้นหาวัสดุ (ชื่อ, ยี่ห้อ, หมวดหมู่)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder="ทุกหมวดหมู่" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทุกหมวดหมู่</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{materials.length}</div>
            <div className="text-sm text-muted-foreground">วัสดุทั้งหมด</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{categories.length}</div>
            <div className="text-sm text-muted-foreground">หมวดหมู่</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{filteredMaterials.length}</div>
            <div className="text-sm text-muted-foreground">รายการที่แสดง</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              ฿{materials.reduce((sum, m) => sum + (m.standardPrice || 0), 0).toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">มูลค่ารวม</div>
          </CardContent>
        </Card>
      </div>

      {/* Materials Grid - Responsive */}
      {filteredMaterials.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">ไม่พบวัสดุ</h3>
            <p className="text-muted-foreground mb-4 text-sm sm:text-base">
              {searchQuery || selectedCategory !== 'all' 
                ? 'ไม่พบวัสดุที่ตรงกับเงื่อนไขการค้นหา' 
                : 'ยังไม่มีข้อมูลวัสดุ'}
            </p>
            {!searchQuery && selectedCategory === 'all' && (
              <Button onClick={handleAddMaterial} className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                เพิ่มวัสดุแรก
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredMaterials.map((material) => (
            <Card key={material.id} className="group hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg line-clamp-2">
                      {material.name}
                    </CardTitle>
                    <Badge variant="secondary" className="text-xs">
                      {material.category}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditMaterial(material)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>ยืนยันการลบ</AlertDialogTitle>
                          <AlertDialogDescription>
                            คุณต้องการลบวัสดุ "{material.name}" หรือไม่? 
                            การดำเนินการนี้ไม่สามารถย้อนกลับได้
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteMaterial(material.id)}>
                            ลบ
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
              <Separator />
              <CardContent className="pt-3">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">ราคา:</span>
                    <span className={`font-semibold ${getPriceColor(material.standardPrice)}`}>
                      {material.standardPrice 
                        ? `฿${material.standardPrice.toLocaleString()} / ${material.unit}`
                        : 'ไม่ระบุราคา'
                      }
                    </span>
                  </div>
                  
                  {material.brand && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">ยี่ห้อ:</span>
                      <span className="text-sm font-medium">{material.brand}</span>
                    </div>
                  )}
                  
                  {material.model && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">รุ่น:</span>
                      <span className="text-sm">{material.model}</span>
                    </div>
                  )}
                  
                  {material.specification && (
                    <div className="mt-3 p-2 bg-muted rounded-md">
                      <p className="text-xs text-muted-foreground">ข้อมูลจำเพาะ:</p>
                      <p className="text-sm">{material.specification}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
} 
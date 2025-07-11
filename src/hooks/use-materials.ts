import { useState, useEffect } from 'react'
import { Material } from '@/types'
import { getLocalStorageItem, setLocalStorageItem } from '@/lib/local-storage'

// ข้อมูลวัสดุตัวอย่าง
const defaultMaterials: Material[] = [
  {
    id: '1',
    name: 'ปูนซีเมนต์',
    unit: 'ถุง',
    standardPrice: 120,
    brand: 'ตราเช้า',
    model: 'ปูนซีเมนต์โครงสร้าง',
    specification: 'ถุง 40 กก.',
    category: 'วัสดุหลัก',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'อิฐแดง',
    unit: 'ก้อน',
    standardPrice: 3.5,
    brand: 'โรงอิฐสุขุมวิท',
    model: 'อิฐแดงธรรมดา',
    specification: '6x11x22 ซม.',
    category: 'วัสดุก่อสร้าง',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    name: 'เหล็กเส้น',
    unit: 'เส้น',
    standardPrice: 450,
    brand: 'เหล็กสยาม',
    model: 'RB6',
    specification: 'เส้นผ่าศูนย์กลาง 6 มม. ยาว 12 ม.',
    category: 'โครงสร้าง',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    name: 'กระเบื้องเคลือบ',
    unit: 'ตร.ม.',
    standardPrice: 180,
    brand: 'ชาวเฟลด์',
    model: 'กระเบื้องคลาสสิค',
    specification: '30x30 ซม.',
    category: 'วัสดุตกแต่ง',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

export function useMaterials() {
  const [materials, setMaterials] = useState<Material[]>([])
  const [loading, setLoading] = useState(true)

  // โหลดข้อมูลวัสดุจาก localStorage
  useEffect(() => {
    const savedMaterials = getLocalStorageItem<Material[]>('materials', [])
    if (savedMaterials && savedMaterials.length > 0) {
      setMaterials(savedMaterials)
    } else {
      setMaterials(defaultMaterials)
      setLocalStorageItem('materials', defaultMaterials)
    }
    setLoading(false)
  }, [])

  // เพิ่มวัสดุใหม่
  const addMaterial = (material: Omit<Material, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newMaterial: Material = {
      ...material,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    const updatedMaterials = [...materials, newMaterial]
    setMaterials(updatedMaterials)
    setLocalStorageItem('materials', updatedMaterials)
    return newMaterial
  }

  // อัปเดตวัสดุ
  const updateMaterial = (id: string, updates: Partial<Material>) => {
    const updatedMaterials = materials.map(material =>
      material.id === id
        ? { ...material, ...updates, updatedAt: new Date() }
        : material
    )
    setMaterials(updatedMaterials)
    setLocalStorageItem('materials', updatedMaterials)
  }

  // ลบวัสดุ
  const deleteMaterial = (id: string) => {
    const updatedMaterials = materials.filter(material => material.id !== id)
    setMaterials(updatedMaterials)
    setLocalStorageItem('materials', updatedMaterials)
  }

  // ค้นหาวัสดุ
  const searchMaterials = (query: string) => {
    return materials.filter(material =>
      material.name.toLowerCase().includes(query.toLowerCase()) ||
      material.brand?.toLowerCase().includes(query.toLowerCase()) ||
      material.category.toLowerCase().includes(query.toLowerCase())
    )
  }

  // จัดกลุ่มวัสดุตามหมวดหมู่
  const getMaterialsByCategory = () => {
    return materials.reduce((acc, material) => {
      const category = material.category
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(material)
      return acc
    }, {} as Record<string, Material[]>)
  }

  return {
    materials,
    loading,
    addMaterial,
    updateMaterial,
    deleteMaterial,
    searchMaterials,
    getMaterialsByCategory,
  }
} 
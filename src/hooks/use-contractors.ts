import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Contractor } from '@/types'
import {
  getLocalStorageItem,
  addToLocalStorageArray,
  updateLocalStorageArrayItem,
  removeFromLocalStorageArray,
  getLocalStorageArrayItem
} from '@/lib/local-storage'

const CONTRACTORS_KEY = 'construction_contractors'

// สร้างข้อมูลตัวอย่างเพื่อการทดสอบ
const mockContractors: Contractor[] = [
  {
    id: '1',
    name: 'นายสมพงษ์ ช่างหลังคา',
    phone: '081-234-5678',
    specialty: ['หลังคา', 'กระเบื้อง'],
    address: '45/12 ซอยลาดพร้าว 45 แขวงลาดพร้าว เขตลาดพร้าว กรุงเทพฯ 10230',
    taxId: '1234567890123',
    bankAccount: '123-456-7890 ธนาคารกรุงเทพ',
    status: 'active',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10')
  },
  {
    id: '2',
    name: 'นายวิชัย ช่างสี',
    phone: '089-987-6543',
    specialty: ['ทาสี', 'ปูน/ฉาบ'],
    address: '78/9 ถนนพหลโยธิน แขวงสามเสนใน เขตพญาไท กรุงเทพฯ 10400',
    status: 'active',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: '3',
    name: 'บริษัท ช่างไฟฟ้าโปร จำกัด',
    phone: '02-555-1234',
    specialty: ['ไฟฟ้า', 'แอร์'],
    address: '99/1 ถนนรัชดาภิเษก แขวงดินแดง เขตดินแดง กรุงเทพฯ 10400',
    taxId: '0105555012345',
    bankAccount: '987-654-3210 ธนาคารกสิกรไทย',
    status: 'active',
    createdAt: new Date('2024-02-05'),
    updatedAt: new Date('2024-02-05')
  },
  {
    id: '4',
    name: 'นายเจริญ ช่างประปา',
    phone: '084-111-2222',
    specialty: ['ระบบน้ำ', 'สุขภัณฑ์'],
    address: '33/7 ซอยรามคำแหง 24 แขวงหัวหมาก เขตบางกะปิ กรุงเทพฯ 10240',
    status: 'inactive',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '5',
    name: 'นายประดิษฐ์ ช่างเหล็ก',
    phone: '085-777-8888',
    specialty: ['เหล็กดัด', 'เชื่อม', 'รั้ว'],
    address: '156/23 ถนนเพชรบุรีตัดใหม่ แขวงมักกะสัน เขตราชเทวี กรุงเทพฯ 10400',
    taxId: '1987654321098',
    bankAccount: '555-123-4567 ธนาคารไทยพาณิชย์',
    status: 'active',
    createdAt: new Date('2024-02-12'),
    updatedAt: new Date('2024-02-12')
  }
]

export function useContractors() {
  const [contractors, setContractors] = useState<Contractor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // โหลดข้อมูลช่างรับเหมาเมื่อ component mount
  useEffect(() => {
    try {
      setLoading(true)
      const savedContractors = getLocalStorageItem<Contractor[]>(CONTRACTORS_KEY, [])
      
      // ถ้าไม่มีข้อมูลใน localStorage ให้ใช้ข้อมูลตัวอย่าง
      if (savedContractors.length === 0) {
        setContractors(mockContractors)
        // บันทึกข้อมูลตัวอย่างลง localStorage
        localStorage.setItem(CONTRACTORS_KEY, JSON.stringify(mockContractors))
      } else {
        // แปลง string dates กลับเป็น Date objects
        const contractorsWithDates = savedContractors.map(contractor => ({
          ...contractor,
          createdAt: new Date(contractor.createdAt),
          updatedAt: new Date(contractor.updatedAt)
        }))
        setContractors(contractorsWithDates)
      }
    } catch (err) {
      setError('ไม่สามารถโหลดข้อมูลช่างรับเหมาได้')
      console.error('Error loading contractors:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // เพิ่มช่างรับเหมาใหม่
  const addContractor = (contractorData: Omit<Contractor, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newContractor: Contractor = {
        ...contractorData,
        id: uuidv4(),
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const updatedContractors = addToLocalStorageArray(CONTRACTORS_KEY, newContractor)
      setContractors(updatedContractors)
      return newContractor
    } catch (err) {
      setError('ไม่สามารถเพิ่มช่างรับเหมาได้')
      console.error('Error adding contractor:', err)
      throw err
    }
  }

  // แก้ไขข้อมูลช่างรับเหมา
  const updateContractor = (id: string, contractorData: Omit<Contractor, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const existingContractor = contractors.find(c => c.id === id)
      if (!existingContractor) {
        throw new Error('ไม่พบข้อมูลช่างรับเหมา')
      }

      const updatedContractor: Contractor = {
        ...contractorData,
        id,
        createdAt: existingContractor.createdAt,
        updatedAt: new Date()
      }

      const updatedContractors = updateLocalStorageArrayItem(CONTRACTORS_KEY, id, updatedContractor)
      setContractors(updatedContractors)
      return updatedContractor
    } catch (err) {
      setError('ไม่สามารถแก้ไขข้อมูลช่างรับเหมาได้')
      console.error('Error updating contractor:', err)
      throw err
    }
  }

  // ลบช่างรับเหมา
  const deleteContractor = (id: string) => {
    try {
      const updatedContractors = removeFromLocalStorageArray<Contractor>(CONTRACTORS_KEY, id)
      setContractors(updatedContractors)
    } catch (err) {
      setError('ไม่สามารถลบช่างรับเหมาได้')
      console.error('Error deleting contractor:', err)
      throw err
    }
  }

  // ค้นหาช่างรับเหมาตาม ID
  const getContractor = (id: string): Contractor | undefined => {
    return contractors.find(contractor => contractor.id === id)
  }

  // ค้นหาช่างรับเหมา
  const searchContractors = (query: string): Contractor[] => {
    if (!query.trim()) return contractors
    
    const lowercaseQuery = query.toLowerCase()
    return contractors.filter(contractor => 
      contractor.name.toLowerCase().includes(lowercaseQuery) ||
      contractor.phone?.includes(query) ||
      contractor.address?.toLowerCase().includes(lowercaseQuery) ||
      contractor.taxId?.includes(query) ||
      contractor.bankAccount?.toLowerCase().includes(lowercaseQuery) ||
      contractor.specialty.some(spec => spec.toLowerCase().includes(lowercaseQuery))
    )
  }

  // ค้นหาช่างรับเหมาตามความเชี่ยวชาญ
  const getContractorsBySpecialty = (specialty: string): Contractor[] => {
    return contractors.filter(contractor => 
      contractor.specialty.includes(specialty) && contractor.status === 'active'
    )
  }

  // ค้นหาช่างรับเหมาที่ใช้งานได้
  const getActiveContractors = (): Contractor[] => {
    return contractors.filter(contractor => contractor.status === 'active')
  }

  // สถิติช่างรับเหมา
  const getContractorStats = () => {
    const active = contractors.filter(c => c.status === 'active').length
    const inactive = contractors.filter(c => c.status === 'inactive').length
    
    // นับความเชี่ยวชาญที่นิยม
    const specialtyCount: Record<string, number> = {}
    contractors.forEach(contractor => {
      contractor.specialty.forEach(spec => {
        specialtyCount[spec] = (specialtyCount[spec] || 0) + 1
      })
    })
    
    const topSpecialties = Object.entries(specialtyCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([specialty, count]) => ({ specialty, count }))

    return {
      total: contractors.length,
      active,
      inactive,
      topSpecialties
    }
  }

  // ล้าง error
  const clearError = () => {
    setError(null)
  }

  return {
    contractors,
    loading,
    error,
    addContractor,
    updateContractor,
    deleteContractor,
    getContractor,
    searchContractors,
    getContractorsBySpecialty,
    getActiveContractors,
    getContractorStats,
    clearError
  }
} 
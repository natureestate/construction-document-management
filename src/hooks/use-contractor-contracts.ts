import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { ContractorContract } from '@/types'
import {
  getLocalStorageItem,
  addToLocalStorageArray,
  updateLocalStorageArrayItem,
  removeFromLocalStorageArray
} from '@/lib/local-storage'
import { calculateMaterialTotal, calculateContractTotal } from '@/lib/validations/contractor-contract'

const CONTRACTOR_CONTRACTS_KEY = 'construction_contractor_contracts'

// สร้างข้อมูลตัวอย่างเพื่อการทดสอบ
const mockContractorContracts: ContractorContract[] = [
  {
    id: '1',
    title: 'สัญญาติดตั้งหลังคาบ้านคุณสมชาย',
    description: 'งานติดตั้งหลังคาเมทัลชีท บ้านเดี่ยว 2 ชั้น',
    customerId: '1', // นายสมชาย ใจดี
    contractorId: '1', // นายสมพงษ์ ช่างหลังคา
    workLocation: '45/12 ซอยลาดพร้าว 45 แขวงลาดพร้าว เขตลาดพร้าว กรุงเทพฯ 10230',
    startDate: new Date('2024-03-15'),
    endDate: new Date('2024-03-20'),
    estimatedDays: 5,
    paymentType: 'fixed',
    laborCost: 25000,
    materialCost: 45000,
    totalCost: 70000,
    materials: [
      {
        id: '1',
        name: 'เมทัลชีท 0.5 มม.',
        quantity: 50,
        unit: 'แผ่น',
        unitPrice: 450,
        totalPrice: 22500,
        note: 'สีเขียวใส'
      },
      {
        id: '2', 
        name: 'รางน้ำ PVC',
        quantity: 20,
        unit: 'เมตร',
        unitPrice: 180,
        totalPrice: 3600,
        note: 'ขนาด 4 นิ้ว'
      },
      {
        id: '3',
        name: 'สกรูยึดหลังคา',
        quantity: 200,
        unit: 'ชิ้น', 
        unitPrice: 8,
        totalPrice: 1600
      },
      {
        id: '4',
        name: 'ฟิล์มกันซึม',
        quantity: 80,
        unit: 'ตารางเมตร',
        unitPrice: 220,
        totalPrice: 17600
      }
    ],
    workSpecification: 'ถอดหลังคาเก่า ติดตั้งหลังคาใหม่พร้อมฟิล์มกันซึม ติดตั้งรางน้ำและท่อลง',
    terms: 'จ่ายเงินงวดแรก 50% เมื่อเริ่มงาน จ่ายส่วนที่เหลือเมื่องานเสร็จสิ้น',
    status: 'in_progress',
    notes: 'ลูกค้าต้องการเริ่มงานเร็วที่สุด',
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-03-10')
  },
  {
    id: '2',
    title: 'สัญญาทาสีภายในบ้านบริษัท ABC',
    description: 'งานทาสีภายในอาคารสำนักงาน 3 ชั้น',
    customerId: '3', // บริษัท ABC จำกัด
    contractorId: '2', // นายวิชัย ช่างสี
    workLocation: '789 ถนนสุขุมวิท แขวงคลองตัน เขตคลองตัน กรุงเทพฯ 10110',
    startDate: new Date('2024-03-18'),
    endDate: new Date('2024-03-25'),
    estimatedDays: 7,
    paymentType: 'daily',
    laborCost: 35000,
    materialCost: 18000,
    totalCost: 53000,
    materials: [
      {
        id: '1',
        name: 'สีน้ำพลาสติก',
        quantity: 15,
        unit: 'แกลลอน',
        unitPrice: 800,
        totalPrice: 12000,
        note: 'สีขาวด้าน'
      },
      {
        id: '2',
        name: 'รองพื้น',
        quantity: 8,
        unit: 'แกลลอน', 
        unitPrice: 600,
        totalPrice: 4800,
        note: 'รองพื้นกันซึม'
      },
      {
        id: '3',
        name: 'อุปกรณ์ทาสี',
        quantity: 1,
        unit: 'ชุด',
        unitPrice: 1200,
        totalPrice: 1200,
        note: 'แปรง โรลเลอร์ ถาด'
      }
    ],
    workSpecification: 'ขัดผิวเก่า ทารองพื้น ทาสีใหม่ 2 เที่ยว',
    terms: 'จ่ายเงินรายวัน 5,000 บาท/วัน',
    status: 'approved',
    createdAt: new Date('2024-03-12'),
    updatedAt: new Date('2024-03-14')
  },
  {
    id: '3',
    title: 'สัญญาติดตั้งระบบไฟฟ้าโรงงาน',
    description: 'งานติดตั้งระบบไฟฟ้าโรงงานใหม่',
    customerId: '4', // บริษัท XYZ อุตสาหกรรม จำกัด  
    contractorId: '3', // บริษัท ช่างไฟฟ้าโปร จำกัด
    workLocation: '555 ถนนบางนา-ตราด กม.10 แขวงบางนา เขตบางนา กรุงเทพฯ 10260',
    startDate: new Date('2024-04-01'),
    endDate: new Date('2024-04-15'),
    estimatedDays: 14,
    paymentType: 'fixed',
    laborCost: 180000,
    materialCost: 120000,
    totalCost: 300000,
    materials: [
      {
        id: '1',
        name: 'สายไฟ THW 16 sq.mm',
        quantity: 500,
        unit: 'เมตร',
        unitPrice: 45,
        totalPrice: 22500,
        note: 'สายไฟทองแดง'
      },
      {
        id: '2',
        name: 'เบรกเกอร์ 3 เฟส',
        quantity: 8,
        unit: 'ชิ้น',
        unitPrice: 2500,
        totalPrice: 20000,
        note: '100A'
      },
      {
        id: '3',
        name: 'ตู้แผงไฟฟ้าหลัก',
        quantity: 2,
        unit: 'ชิ้น',
        unitPrice: 25000,
        totalPrice: 50000,
        note: 'ตู้เหล็กกันน้ำ IP65'
      }
    ],
    workSpecification: 'ติดตั้งระบบไฟฟ้าสำหรับโรงงานพร้อมระบบกราวด์',
    terms: 'จ่ายเงิน 3 งวด งวดแรก 40% เมื่อเริ่มงาน งวดที่ 2 40% เมื่องานครึ่งหนึ่ง งวดสุดท้าย 20% เมื่องานเสร็จ',
    status: 'pending',
    createdAt: new Date('2024-03-20'),
    updatedAt: new Date('2024-03-20')
  },
  {
    id: '4',
    title: 'สัญญาซ่อมแซมระบบประปา',
    description: 'งานซ่อมแซมระบบประปาและเปลี่ยนท่อใหม่',
    customerId: '2', // นางสาวณิชา ประกอบการ
    contractorId: '4', // นายเจริญ ช่างประปา (inactive)
    workLocation: '333 ซอยเอกมัย แขวงคลองตันเหนือ เขตวัฒนา กรุงเทพฯ 10110',
    startDate: new Date('2024-02-20'),
    endDate: new Date('2024-02-22'),
    estimatedDays: 2,
    paymentType: 'fixed',
    laborCost: 8000,
    materialCost: 5500,
    totalCost: 13500,
    materials: [
      {
        id: '1',
        name: 'ท่อ PVC 4 นิ้ว',
        quantity: 10,
        unit: 'เมตร',
        unitPrice: 250,
        totalPrice: 2500
      },
      {
        id: '2',
        name: 'ข้อต่อ PVC',
        quantity: 8,
        unit: 'ชิ้น',
        unitPrice: 150,
        totalPrice: 1200
      },
      {
        id: '3',
        name: 'วาล์วน้ำ',
        quantity: 2,
        unit: 'ชิ้น',
        unitPrice: 900,
        totalPrice: 1800
      }
    ],
    workSpecification: 'เปลี่ยนท่อประปาที่รั่ว ติดตั้งวาล์วใหม่',
    terms: 'จ่ายเงินเมื่องานเสร็จสิ้น',
    status: 'completed',
    notes: 'งานเสร็จเรียบร้อยแล้ว ลูกค้าพอใจ',
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-22')
  }
]

export function useContractorContracts() {
  const [contracts, setContracts] = useState<ContractorContract[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // โหลดข้อมูลสัญญาเมื่อ component mount
  useEffect(() => {
    try {
      setLoading(true)
      const savedContracts = getLocalStorageItem<ContractorContract[]>(CONTRACTOR_CONTRACTS_KEY, [])
      
      // ถ้าไม่มีข้อมูลใน localStorage ให้ใช้ข้อมูลตัวอย่าง
      if (savedContracts.length === 0) {
        setContracts(mockContractorContracts)
        // บันทึกข้อมูลตัวอย่างลง localStorage
        localStorage.setItem(CONTRACTOR_CONTRACTS_KEY, JSON.stringify(mockContractorContracts))
      } else {
        // แปลง string dates กลับเป็น Date objects
        const contractsWithDates = savedContracts.map(contract => ({
          ...contract,
          startDate: new Date(contract.startDate),
          endDate: new Date(contract.endDate),
          createdAt: new Date(contract.createdAt),
          updatedAt: new Date(contract.updatedAt)
        }))
        setContracts(contractsWithDates)
      }
    } catch (err) {
      setError('ไม่สามารถโหลดข้อมูลสัญญาได้')
      console.error('Error loading contractor contracts:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // เพิ่มสัญญาใหม่
  const addContract = (contractData: Omit<ContractorContract, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      // คำนวณราคารวม
      const materialCost = calculateMaterialTotal(contractData.materials || [])
      const totalCost = calculateContractTotal(contractData.laborCost, materialCost)

      const newContract: ContractorContract = {
        ...contractData,
        id: uuidv4(),
        materialCost,
        totalCost,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const updatedContracts = addToLocalStorageArray(CONTRACTOR_CONTRACTS_KEY, newContract)
      setContracts(updatedContracts)
      return newContract
    } catch (err) {
      setError('ไม่สามารถเพิ่มสัญญาได้')
      console.error('Error adding contract:', err)
      throw err
    }
  }

  // แก้ไขสัญญา
  const updateContract = (id: string, contractData: Omit<ContractorContract, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const existingContract = contracts.find(c => c.id === id)
      if (!existingContract) {
        throw new Error('ไม่พบข้อมูลสัญญา')
      }

      // คำนวณราคารวม
      const materialCost = calculateMaterialTotal(contractData.materials || [])
      const totalCost = calculateContractTotal(contractData.laborCost, materialCost)

      const updatedContract: ContractorContract = {
        ...contractData,
        id,
        materialCost,
        totalCost,
        createdAt: existingContract.createdAt,
        updatedAt: new Date()
      }

      const updatedContracts = updateLocalStorageArrayItem(CONTRACTOR_CONTRACTS_KEY, id, updatedContract)
      setContracts(updatedContracts)
      return updatedContract
    } catch (err) {
      setError('ไม่สามารถแก้ไขสัญญาได้')
      console.error('Error updating contract:', err)
      throw err
    }
  }

  // ลบสัญญา
  const deleteContract = (id: string) => {
    try {
      const updatedContracts = removeFromLocalStorageArray<ContractorContract>(CONTRACTOR_CONTRACTS_KEY, id)
      setContracts(updatedContracts)
    } catch (err) {
      setError('ไม่สามารถลบสัญญาได้')
      console.error('Error deleting contract:', err)
      throw err
    }
  }

  // ค้นหาสัญญาตาม ID
  const getContract = (id: string): ContractorContract | undefined => {
    return contracts.find(contract => contract.id === id)
  }

  // ค้นหาสัญญา
  const searchContracts = (query: string): ContractorContract[] => {
    if (!query.trim()) return contracts
    
    const lowercaseQuery = query.toLowerCase()
    return contracts.filter(contract => 
      contract.title.toLowerCase().includes(lowercaseQuery) ||
      contract.description?.toLowerCase().includes(lowercaseQuery) ||
      contract.workLocation.toLowerCase().includes(lowercaseQuery) ||
      contract.notes?.toLowerCase().includes(lowercaseQuery)
    )
  }

  // ค้นหาสัญญาตามลูกค้า
  const getContractsByCustomer = (customerId: string): ContractorContract[] => {
    return contracts.filter(contract => contract.customerId === customerId)
  }

  // ค้นหาสัญญาตามช่าง
  const getContractsByContractor = (contractorId: string): ContractorContract[] => {
    return contracts.filter(contract => contract.contractorId === contractorId)
  }

  // ค้นหาสัญญาตามสถานะ
  const getContractsByStatus = (status: ContractorContract['status']): ContractorContract[] => {
    return contracts.filter(contract => contract.status === status)
  }

  // สถิติสัญญา
  const getContractStats = () => {
    const total = contracts.length
    const draft = contracts.filter(c => c.status === 'draft').length
    const pending = contracts.filter(c => c.status === 'pending').length
    const approved = contracts.filter(c => c.status === 'approved').length
    const inProgress = contracts.filter(c => c.status === 'in_progress').length
    const completed = contracts.filter(c => c.status === 'completed').length
    const cancelled = contracts.filter(c => c.status === 'cancelled').length

    // คำนวณมูลค่ารวม
    const totalValue = contracts.reduce((sum, contract) => sum + (contract.totalCost || 0), 0)
    const completedValue = contracts
      .filter(c => c.status === 'completed')
      .reduce((sum, contract) => sum + (contract.totalCost || 0), 0)
    const pendingValue = contracts
      .filter(c => c.status === 'in_progress' || c.status === 'approved' || c.status === 'pending')
      .reduce((sum, contract) => sum + (contract.totalCost || 0), 0)

    // ค้นหาช่างที่มีงานมากที่สุด
    const contractorWorkCount: Record<string, number> = {}
    contracts.forEach(contract => {
      contractorWorkCount[contract.contractorId] = (contractorWorkCount[contract.contractorId] || 0) + 1
    })

    const topContractors = Object.entries(contractorWorkCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([contractorId, count]) => ({ contractorId, count }))

    return {
      total,
      draft,
      pending,
      approved,
      inProgress,
      completed,
      cancelled,
      totalValue,
      completedValue,
      pendingValue,
      topContractors
    }
  }

  // ล้าง error
  const clearError = () => {
    setError(null)
  }

  return {
    contracts,
    loading,
    error,
    addContract,
    updateContract,
    deleteContract,
    getContract,
    searchContracts,
    getContractsByCustomer,
    getContractsByContractor,
    getContractsByStatus,
    getContractStats,
    clearError
  }
} 
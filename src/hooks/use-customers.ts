import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Customer } from '@/types'
import {
  getLocalStorageItem,
  addToLocalStorageArray,
  updateLocalStorageArrayItem,
  removeFromLocalStorageArray,
  getLocalStorageArrayItem
} from '@/lib/local-storage'

const CUSTOMERS_KEY = 'construction_customers'

// สร้างข้อมูลตัวอย่างเพื่อการทดสอบ
const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'บริษัท สยามเซเมนต์ จำกัด',
    email: 'contact@siamcement.com',
    phone: '02-586-1234',
    address: '1 ถนนรัชดาภิเษก แขวงดินแดง เขตดินแดง กรุงเทพฯ 10400',
    type: 'corporate',
    taxId: '0107537000012',
    contactPerson: 'คุณสมชาย วิชาการ',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2', 
    name: 'นายสมศักดิ์ ใจดี',
    email: 'somsak.jaidee@gmail.com',
    phone: '089-123-4567',
    address: '123/45 หมู่บ้านสวนลิ้นจี่ ซอยลาดพร้าว 71 แขวงวังทองหลาง เขตวังทองหลาง กรุงเทพฯ 10310',
    type: 'individual',
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-02-20')
  },
  {
    id: '3',
    name: 'นางสาวปรียา สวยงาม', 
    email: 'priya.beautiful@hotmail.com',
    phone: '081-987-6543',
    address: '67/8 ซอยสุขุมวิท 39 แขวงคลองตันเหนือ เขตวัฒนา กรุงเทพฯ 10110',
    type: 'individual',
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-03-10')
  }
]

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // โหลดข้อมูลลูกค้าเมื่อ component mount
  useEffect(() => {
    try {
      setLoading(true)
      const savedCustomers = getLocalStorageItem<Customer[]>(CUSTOMERS_KEY, [])
      
      // ถ้าไม่มีข้อมูลใน localStorage ให้ใช้ข้อมูลตัวอย่าง
      if (savedCustomers.length === 0) {
        setCustomers(mockCustomers)
        // บันทึกข้อมูลตัวอย่างลง localStorage
        localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(mockCustomers))
      } else {
        // แปลง string dates กลับเป็น Date objects
        const customersWithDates = savedCustomers.map(customer => ({
          ...customer,
          createdAt: new Date(customer.createdAt),
          updatedAt: new Date(customer.updatedAt)
        }))
        setCustomers(customersWithDates)
      }
    } catch (err) {
      setError('ไม่สามารถโหลดข้อมูลลูกค้าได้')
      console.error('Error loading customers:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // เพิ่มลูกค้าใหม่
  const addCustomer = (customerData: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newCustomer: Customer = {
        ...customerData,
        id: uuidv4(),
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const updatedCustomers = addToLocalStorageArray(CUSTOMERS_KEY, newCustomer)
      setCustomers(updatedCustomers)
      return newCustomer
    } catch (err) {
      setError('ไม่สามารถเพิ่มลูกค้าได้')
      console.error('Error adding customer:', err)
      throw err
    }
  }

  // แก้ไขข้อมูลลูกค้า
  const updateCustomer = (id: string, customerData: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const existingCustomer = customers.find(c => c.id === id)
      if (!existingCustomer) {
        throw new Error('ไม่พบข้อมูลลูกค้า')
      }

      const updatedCustomer: Customer = {
        ...customerData,
        id,
        createdAt: existingCustomer.createdAt,
        updatedAt: new Date()
      }

      const updatedCustomers = updateLocalStorageArrayItem(CUSTOMERS_KEY, id, updatedCustomer)
      setCustomers(updatedCustomers)
      return updatedCustomer
    } catch (err) {
      setError('ไม่สามารถแก้ไขข้อมูลลูกค้าได้')
      console.error('Error updating customer:', err)
      throw err
    }
  }

  // ลบลูกค้า
  const deleteCustomer = (id: string) => {
    try {
      const updatedCustomers = removeFromLocalStorageArray<Customer>(CUSTOMERS_KEY, id)
      setCustomers(updatedCustomers)
    } catch (err) {
      setError('ไม่สามารถลบลูกค้าได้')
      console.error('Error deleting customer:', err)
      throw err
    }
  }

  // ค้นหาลูกค้าตาม ID
  const getCustomer = (id: string): Customer | undefined => {
    return customers.find(customer => customer.id === id)
  }

  // ค้นหาลูกค้า
  const searchCustomers = (query: string): Customer[] => {
    if (!query.trim()) return customers
    
    const lowercaseQuery = query.toLowerCase()
    return customers.filter(customer => 
      customer.name.toLowerCase().includes(lowercaseQuery) ||
      customer.email?.toLowerCase().includes(lowercaseQuery) ||
      customer.phone?.includes(query) ||
      customer.address?.toLowerCase().includes(lowercaseQuery) ||
      customer.taxId?.includes(query) ||
      customer.contactPerson?.toLowerCase().includes(lowercaseQuery)
    )
  }

  // ล้าง error
  const clearError = () => {
    setError(null)
  }

  return {
    customers,
    loading,
    error,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    getCustomer,
    searchCustomers,
    clearError
  }
} 
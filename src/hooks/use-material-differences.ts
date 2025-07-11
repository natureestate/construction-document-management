import { useState, useEffect } from 'react'
import { MaterialDifference } from '@/types'
import { getLocalStorageItem, setLocalStorageItem } from '@/lib/local-storage'

export function useMaterialDifferences() {
  const [materialDifferences, setMaterialDifferences] = useState<MaterialDifference[]>([])
  const [loading, setLoading] = useState(true)

  // โหลดข้อมูลบันทึกส่วนต่างวัสดุจาก localStorage
  useEffect(() => {
    const savedDifferences = getLocalStorageItem<MaterialDifference[]>('materialDifferences', [])
    setMaterialDifferences(savedDifferences)
    setLoading(false)
  }, [])

  // เพิ่มบันทึกส่วนต่างวัสดุใหม่
  const addMaterialDifference = (difference: Omit<MaterialDifference, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newDifference: MaterialDifference = {
      ...difference,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    const updatedDifferences = [...materialDifferences, newDifference]
    setMaterialDifferences(updatedDifferences)
    setLocalStorageItem('materialDifferences', updatedDifferences)
    return newDifference
  }

  // อัปเดตบันทึกส่วนต่างวัสดุ
  const updateMaterialDifference = (id: string, updates: Partial<MaterialDifference>) => {
    const updatedDifferences = materialDifferences.map(difference =>
      difference.id === id
        ? { ...difference, ...updates, updatedAt: new Date() }
        : difference
    )
    setMaterialDifferences(updatedDifferences)
    setLocalStorageItem('materialDifferences', updatedDifferences)
  }

  // ลบบันทึกส่วนต่างวัสดุ
  const deleteMaterialDifference = (id: string) => {
    const updatedDifferences = materialDifferences.filter(difference => difference.id !== id)
    setMaterialDifferences(updatedDifferences)
    setLocalStorageItem('materialDifferences', updatedDifferences)
  }

  // อนุมัติหรือปฏิเสธบันทึกส่วนต่างวัสดุ
  const approveMaterialDifference = (id: string, approved: boolean, approvedBy: string) => {
    updateMaterialDifference(id, {
      status: approved ? 'approved' : 'rejected',
      approvedBy,
      approvedDate: new Date(),
    })
  }

  // ค้นหาบันทึกส่วนต่างวัสดุตาม contract ID
  const getMaterialDifferencesByContract = (contractId: string) => {
    return materialDifferences.filter(difference => difference.contractId === contractId)
  }

  // ค้นหาบันทึกส่วนต่างวัสดุตาม customer ID
  const getMaterialDifferencesByCustomer = (customerId: string) => {
    return materialDifferences.filter(difference => difference.customerId === customerId)
  }

  // ดึงบันทึกส่วนต่างวัสดุตามสถานะ
  const getMaterialDifferencesByStatus = (status: MaterialDifference['status']) => {
    return materialDifferences.filter(difference => difference.status === status)
  }

  // คำนวณยอดรวมที่รออนุมัติ
  const getPendingTotalAmount = () => {
    return materialDifferences
      .filter(difference => difference.status === 'pending')
      .reduce((total, difference) => total + difference.totalAmount, 0)
  }

  return {
    materialDifferences,
    loading,
    addMaterialDifference,
    updateMaterialDifference,
    deleteMaterialDifference,
    approveMaterialDifference,
    getMaterialDifferencesByContract,
    getMaterialDifferencesByCustomer,
    getMaterialDifferencesByStatus,
    getPendingTotalAmount,
  }
} 
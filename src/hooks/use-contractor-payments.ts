import { useState, useEffect } from 'react'
import { ContractorPayment } from '@/types'
import { getLocalStorageItem, setLocalStorageItem } from '@/lib/local-storage'

export function useContractorPayments() {
  const [contractorPayments, setContractorPayments] = useState<ContractorPayment[]>([])
  const [loading, setLoading] = useState(true)

  // โหลดข้อมูลการจ่ายเงินช่างจาก localStorage
  useEffect(() => {
    const savedPayments = getLocalStorageItem<ContractorPayment[]>('contractorPayments', [])
    setContractorPayments(savedPayments)
    setLoading(false)
  }, [])

  // เพิ่มการจ่ายเงินช่างใหม่
  const addContractorPayment = (payment: Omit<ContractorPayment, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newPayment: ContractorPayment = {
      ...payment,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    const updatedPayments = [...contractorPayments, newPayment]
    setContractorPayments(updatedPayments)
    setLocalStorageItem('contractorPayments', updatedPayments)
    return newPayment
  }

  // อัปเดตการจ่ายเงินช่าง
  const updateContractorPayment = (id: string, updates: Partial<ContractorPayment>) => {
    const updatedPayments = contractorPayments.map(payment =>
      payment.id === id
        ? { ...payment, ...updates, updatedAt: new Date() }
        : payment
    )
    setContractorPayments(updatedPayments)
    setLocalStorageItem('contractorPayments', updatedPayments)
  }

  // ลบการจ่ายเงินช่าง
  const deleteContractorPayment = (id: string) => {
    const updatedPayments = contractorPayments.filter(payment => payment.id !== id)
    setContractorPayments(updatedPayments)
    setLocalStorageItem('contractorPayments', updatedPayments)
  }

  // ค้นหาการจ่ายเงินตาม contractor ID
  const getPaymentsByContractor = (contractorId: string) => {
    return contractorPayments.filter(payment => payment.contractorId === contractorId)
  }

  // ค้นหาการจ่ายเงินตาม customer ID
  const getPaymentsByCustomer = (customerId: string) => {
    return contractorPayments.filter(payment => payment.customerId === customerId)
  }

  // ค้นหาการจ่ายเงินตาม contract ID
  const getPaymentsByContract = (contractId: string) => {
    return contractorPayments.filter(payment => payment.contractId === contractId)
  }

  // คำนวณยอดรวมการจ่ายเงินของช่างคนหนึ่ง
  const getTotalPaymentsByContractor = (contractorId: string) => {
    return contractorPayments
      .filter(payment => payment.contractorId === contractorId)
      .reduce((total, payment) => total + payment.amount, 0)
  }

  // คำนวณยอดรวมการจ่ายเงินตามช่วงวันที่
  const getPaymentsByDateRange = (startDate: Date, endDate: Date) => {
    return contractorPayments.filter(payment => {
      const paymentDate = new Date(payment.paymentDate)
      return paymentDate >= startDate && paymentDate <= endDate
    })
  }

  // คำนวณยอดรวมการจ่ายเงินตามวิธีการจ่าย
  const getPaymentsByMethod = (method: ContractorPayment['paymentMethod']) => {
    return contractorPayments.filter(payment => payment.paymentMethod === method)
  }

  // สถิติการจ่ายเงิน
  const getPaymentStats = () => {
    const totalAmount = contractorPayments.reduce((total, payment) => total + payment.amount, 0)
    const averageAmount = contractorPayments.length > 0 ? totalAmount / contractorPayments.length : 0
    
    const methodStats = {
      cash: contractorPayments.filter(p => p.paymentMethod === 'cash').length,
      transfer: contractorPayments.filter(p => p.paymentMethod === 'transfer').length,
      check: contractorPayments.filter(p => p.paymentMethod === 'check').length,
    }

    return {
      totalAmount,
      averageAmount,
      totalPayments: contractorPayments.length,
      methodStats,
    }
  }

  return {
    contractorPayments,
    loading,
    addContractorPayment,
    updateContractorPayment,
    deleteContractorPayment,
    getPaymentsByContractor,
    getPaymentsByCustomer,
    getPaymentsByContract,
    getTotalPaymentsByContractor,
    getPaymentsByDateRange,
    getPaymentsByMethod,
    getPaymentStats,
  }
} 
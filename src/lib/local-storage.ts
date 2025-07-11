// ฟังก์ชันสำหรับจัดการข้อมูลใน localStorage
// ใช้ LocalStorage เป็น database ชั่วคราว ก่อนที่จะเชื่อมต่อกับ Firebase

export function getLocalStorageItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key)
    if (item === null) {
      return defaultValue
    }
    return JSON.parse(item)
  } catch (error) {
    console.error(`Error getting localStorage item ${key}:`, error)
    return defaultValue
  }
}

export function setLocalStorageItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Error setting localStorage item ${key}:`, error)
  }
}

export function removeLocalStorageItem(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error(`Error removing localStorage item ${key}:`, error)
  }
}

// ฟังก์ชันสำหรับจัดการ array ใน localStorage
export function addToLocalStorageArray<T extends { id: string }>(
  key: string, 
  item: T
): T[] {
  const items = getLocalStorageItem<T[]>(key, [])
  const newItems = [...items, item]
  setLocalStorageItem(key, newItems)
  return newItems
}

export function updateLocalStorageArrayItem<T extends { id: string }>(
  key: string, 
  id: string, 
  updatedItem: T
): T[] {
  const items = getLocalStorageItem<T[]>(key, [])
  const newItems = items.map(item => item.id === id ? updatedItem : item)
  setLocalStorageItem(key, newItems)
  return newItems
}

export function removeFromLocalStorageArray<T extends { id: string }>(
  key: string, 
  id: string
): T[] {
  const items = getLocalStorageItem<T[]>(key, [])
  const newItems = items.filter(item => item.id !== id)
  setLocalStorageItem(key, newItems)
  return newItems
}

export function getLocalStorageArrayItem<T extends { id: string }>(
  key: string, 
  id: string
): T | undefined {
  const items = getLocalStorageItem<T[]>(key, [])
  return items.find(item => item.id === id)
} 
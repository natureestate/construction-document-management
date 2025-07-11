# ระบบจัดการสินค้าพรีคาสต์ (Precast Inventory Management System)

ระบบบริหารจัดการสินค้าพรีคาสต์ที่พัฒนาด้วย React + TypeScript + Vite สำหรับบริษัทผลิตภัณฑ์คอนกรีตพรีคาสต์

## ฟีเจอร์หลัก

- 📋 ระบบจัดการลูกค้า (Customer Management)
- 📦 ระบบจัดการวัสดุและสินค้าคงคลัง (Material Management)
- 📊 ระบบบันทึกส่วนต่างวัสดุ (Material Difference Tracking)
- 💰 ระบบจ่ายเงินผู้รับเหมา (Contractor Payment System)
- 📄 ระบบพิมพ์และส่งออกเอกสาร PDF (PDF Export System)
- 📱 Responsive Design สำหรับการใช้งานบนมือถือ

## เทคโนโลยีที่ใช้

- **Frontend**: React 18 + TypeScript
- **UI Framework**: Tailwind CSS + shadcn/ui
- **Build Tool**: Vite
- **Form Management**: React Hook Form + Zod
- **PDF Generation**: @pdfme/generator, jsPDF, html2canvas
- **Icons**: Lucide React, Tabler Icons
- **State Management**: React Hooks + Local Storage

## การติดตั้งและเริ่มใช้งาน

### ข้อกำหนดระบบ
- Node.js 18+ 
- npm

### การติดตั้ง

```bash
# Clone โปรเจกต์
git clone <repository-url>
cd docapp

# ติดตั้ง dependencies
npm install

# เริ่มเซิร์ฟเวอร์พัฒนา (development server)
npm run dev

# เข้าใช้งานที่ http://localhost:3800
```

### คำสั่งสำคัญ

```bash
# พัฒนา (Development)
npm run dev

# สร้างโปรเจกต์สำหรับ production
npm run build

# ตรวจสอบโค้ด (Linting)
npm run lint

# ดูตัวอย่าง production build
npm run preview
```

## โครงสร้างโปรเจกต์

```
src/
├── components/     # UI Components ที่ใช้ร่วมกัน
├── hooks/         # Custom React Hooks
├── lib/           # Utilities และ Helper functions
├── pages/         # หน้าต่างๆ ของแอปพลิเคชัน
├── types/         # TypeScript Type Definitions
└── routes.tsx     # การตั้งค่า Routing
```

## การพัฒนา

โปรเจกต์นี้ใช้:
- **TypeScript** สำหรับ type safety
- **ESLint** สำหรับ code quality
- **Tailwind CSS** สำหรับ styling
- **Vite** สำหรับ fast development และ building

สำหรับข้อมูลเพิ่มเติมเกี่ยวกับการตั้งค่า ESLint และการพัฒนา โปรดดูเอกสารของ [Vite](https://vitejs.dev/) และ [React](https://react.dev/)

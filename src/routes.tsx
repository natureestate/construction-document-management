import { createBrowserRouter } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Dashboard from './pages/Dashboard'
import CustomerList from './pages/customers/CustomerList'
import CustomerForm from './pages/customers/CustomerForm'
import ContractorList from './pages/contractors/ContractorList'
import ContractorForm from './pages/contractors/ContractorForm'
import ContractorContractList from './pages/contracts/ContractorContractList'
import ContractorContractForm from './pages/contracts/ContractorContractForm'
import MaterialDifferenceList from './pages/material-differences/MaterialDifferenceList'
import MaterialDifferenceForm from './pages/material-differences/MaterialDifferenceForm'
import TemplateList from './pages/templates/TemplateList'
import TemplateForm from './pages/templates/TemplateForm'
import ContractorPaymentList from './pages/payments/ContractorPaymentList'
import ContractorPaymentForm from './pages/payments/ContractorPaymentForm'
import { MaterialList } from './pages/materials/MaterialList'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />
      },
      // ลูกค้า
      {
        path: 'customers',
        element: <CustomerList />
      },
      {
        path: 'customers/new',
        element: <CustomerForm />
      },
      {
        path: 'customers/:id/edit',
        element: <CustomerForm />
      },
      // ช่างรับเหมา
      {
        path: 'contractors',
        element: <ContractorList />
      },
      {
        path: 'contractors/new',
        element: <ContractorForm />
      },
      {
        path: 'contractors/:id/edit',
        element: <ContractorForm />
      },
      // สัญญาจ้างช่าง
      {
        path: 'contractor-contracts',
        element: <ContractorContractList />
      },
      {
        path: 'contractor-contracts/new',
        element: <ContractorContractForm />
      },
      {
        path: 'contractor-contracts/:id/edit',
        element: <ContractorContractForm />
      },
      // ส่วนต่างวัสดุ
      {
        path: 'material-differences',
        element: <MaterialDifferenceList />
      },
      {
        path: 'material-differences/new',
        element: <MaterialDifferenceForm />
      },
      {
        path: 'material-differences/:id/edit',
        element: <MaterialDifferenceForm />
      },
      // วัสดุ
      {
        path: 'materials',
        element: <MaterialList />
      },
      // เทมเพลต
              {
          path: 'templates',
          element: <TemplateList />
        },
        {
          path: 'templates/new',
          element: <TemplateForm />
        },
        {
          path: 'templates/:id/edit',
          element: <TemplateForm />
        },
      {
        path: 'templates/:id/edit',
        element: <TemplateForm />
      },
      // การจ่ายเงินช่าง
      {
        path: 'contractor-payments',
        element: <ContractorPaymentList />
      },
      {
        path: 'contractor-payments/new',
        element: <ContractorPaymentForm />
      },
      {
        path: 'contractor-payments/:id/edit',
        element: <ContractorPaymentForm />
      }
    ]
  }
]) 
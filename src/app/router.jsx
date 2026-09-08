import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

// Layouts
import { PublicLayout } from '../components/layout/PublicLayout.jsx';
import { AuthLayout } from '../components/layout/AuthLayout.jsx';
import { AppLayout } from '../components/layout/AppLayout.jsx';

// Route Guards
import { PublicRoute } from '../routes/PublicRoute.jsx';
import { ProtectedRoute } from '../routes/ProtectedRoute.jsx';
import { RoleProtectedRoute } from '../routes/RoleProtectedRoute.jsx';

// Public Pages (17 Complete Pages)
import { HomePage } from '../pages/public/HomePage.jsx';
import { AboutPage } from '../pages/AboutPage.jsx';
import { SolutionsPage } from '../pages/SolutionsPage.jsx';
import { FarmerPublicPage } from '../pages/public/FarmerPublicPage.jsx';
import { GovernmentPublicPage } from '../pages/public/GovernmentPublicPage.jsx';
import { PartnerPublicPage } from '../pages/public/PartnerPublicPage.jsx';
import { LandPublicPage } from '../pages/public/LandPublicPage.jsx';
import { SoilPublicPage } from '../pages/public/SoilPublicPage.jsx';
import { InsurancePublicPage } from '../pages/public/InsurancePublicPage.jsx';
import { MarketplacePublicPage } from '../pages/public/MarketplacePublicPage.jsx';
import { ProjectsPublicPage } from '../pages/public/ProjectsPublicPage.jsx';
import { CarbonPublicPage } from '../pages/public/CarbonPublicPage.jsx';
import { SchemesPublicPage } from '../pages/public/SchemesPublicPage.jsx';
import { FaqPage } from '../pages/FaqPage.jsx';
import { ContactPage } from '../pages/ContactPage.jsx';
import { TermsPage } from '../pages/public/TermsPage.jsx';
import { PrivacyPolicyPage } from '../pages/public/PrivacyPolicyPage.jsx';
import { NotFoundPage } from '../pages/NotFoundPage.jsx';
import { UnauthorizedPage } from '../pages/UnauthorizedPage.jsx';

// Auth Flow Pages
import { RoleSelectPage } from '../features/auth/pages/RoleSelectPage.jsx';
import { LoginPage } from '../features/auth/pages/LoginPage.jsx';
import { RegisterPage } from '../features/auth/pages/RegisterPage.jsx';
import { OtpVerifyPage } from '../features/auth/pages/OtpVerifyPage.jsx';
import { VerificationPendingPage } from '../features/auth/pages/VerificationPendingPage.jsx';
import { QueryCorrectionPage } from '../features/auth/pages/QueryCorrectionPage.jsx';
import { SessionExpiredPage } from '../features/auth/pages/SessionExpiredPage.jsx';

// Role Dashboards & Portals
import { FarmerDashboardPage } from '../features/farmer/pages/FarmerDashboardPage.jsx';
import { FarmerOnboardingPage } from '../features/farmer/pages/FarmerOnboardingPage.jsx';
import { FarmerProfilePage } from '../features/farmer/pages/FarmerProfilePage.jsx';
import { FarmerReportsInvoicesPage } from '../features/farmer/pages/FarmerReportsInvoicesPage.jsx';

// Land & GIS Pages
import { LandListPage } from '../features/land/pages/LandListPage.jsx';
import { AddLandPage } from '../features/land/pages/AddLandPage.jsx';
import { LandDetailPage } from '../features/land/pages/LandDetailPage.jsx';
import { LandApplicationStatusPage } from '../features/land/pages/LandApplicationStatusPage.jsx';

// Insurance Pages
import { InsuranceCatalogPage } from '../features/insurance/pages/InsuranceCatalogPage.jsx';
import { InsuranceApplyPage } from '../features/insurance/pages/InsuranceApplyPage.jsx';
import { PolicyDetailPage } from '../features/insurance/pages/PolicyDetailPage.jsx';
import { RaiseClaimPage } from '../features/insurance/pages/RaiseClaimPage.jsx';
import { ClaimsListPage } from '../features/insurance/pages/ClaimsListPage.jsx';

// Soil Health Pages
import { SoilDashboardPage } from '../features/soil/pages/SoilDashboardPage.jsx';
import { BookSoilTestPage } from '../features/soil/pages/BookSoilTestPage.jsx';
import { SoilReportDetailPage } from '../features/soil/pages/SoilReportDetailPage.jsx';

// Marketplace, Cart & Orders Pages
import { MarketplacePage } from '../features/marketplace/pages/MarketplacePage.jsx';
import { ProductDetailPage } from '../features/marketplace/pages/ProductDetailPage.jsx';
import { CartPage } from '../features/marketplace/pages/CartPage.jsx';
import { CheckoutPage } from '../features/marketplace/pages/CheckoutPage.jsx';
import { OrderSuccessPage } from '../features/marketplace/pages/OrderSuccessPage.jsx';
import { OrdersListPage } from '../features/marketplace/pages/OrdersListPage.jsx';

// Sustainability Projects & Carbon
import { ProjectsListPage } from '../features/projects/pages/ProjectsListPage.jsx';
import { ProjectDetailPage } from '../features/projects/pages/ProjectDetailPage.jsx';
import { CarbonOpportunitiesPage } from '../features/carbon/pages/CarbonOpportunitiesPage.jsx';
import { RequestCarbonAuditPage } from '../features/carbon/pages/RequestCarbonAuditPage.jsx';

// Wallet, Rewards, Schemes & Documents
import { WalletPage } from '../features/wallet/pages/WalletPage.jsx';
import { RewardsReferralPage } from '../features/wallet/pages/RewardsReferralPage.jsx';
import { SchemesListPage } from '../features/schemes/pages/SchemesListPage.jsx';
import { DocumentCenterPage } from '../features/documents/pages/DocumentCenterPage.jsx';

// Government Portal Pages
import { GovernmentDashboardPage } from '../features/government/pages/GovernmentDashboardPage.jsx';
import { PublicAssetsPage } from '../features/government/pages/PublicAssetsPage.jsx';
import { FarmersInAreaPage } from '../features/government/pages/FarmersInAreaPage.jsx';
import { CampaignsPage } from '../features/government/pages/CampaignsPage.jsx';
import { AreaProjectsPage } from '../features/government/pages/AreaProjectsPage.jsx';
import { GovernmentInsurancePage } from '../features/government/pages/GovernmentInsurancePage.jsx';
import { GovernmentSoilPage } from '../features/government/pages/GovernmentSoilPage.jsx';

// Enterprise Partner Portal Pages
import { PartnerDashboardPage } from '../features/partner/pages/PartnerDashboardPage.jsx';
import { AssignedTasksPage } from '../features/partner/pages/AssignedTasksPage.jsx';
import { FieldVisitsPage } from '../features/partner/pages/FieldVisitsPage.jsx';
import { InspectionsQueuePage } from '../features/partner/pages/InspectionsQueuePage.jsx';
import { LabSampleQueuePage } from '../features/partner/pages/LabSampleQueuePage.jsx';
import { ReportsUploadPage } from '../features/partner/pages/ReportsUploadPage.jsx';
import { PartnerInvoicesPage } from '../features/partner/pages/PartnerInvoicesPage.jsx';

// Super Admin & Staff Control Center Pages
import { AdminDashboardPage } from '../features/admin/pages/AdminDashboardPage.jsx';
import { ApprovalsQueuePage } from '../features/admin/pages/ApprovalsQueuePage.jsx';
import { AdminLandsPage } from '../features/admin/pages/AdminLandsPage.jsx';
import { AdminInsurancePage } from '../features/admin/pages/AdminInsurancePage.jsx';
import { AdminSoilPage } from '../features/admin/pages/AdminSoilPage.jsx';
import { AdminMarketplacePage } from '../features/admin/pages/AdminMarketplacePage.jsx';
import { AdminProjectsPage } from '../features/admin/pages/AdminProjectsPage.jsx';
import { AdminCarbonPage } from '../features/admin/pages/AdminCarbonPage.jsx';
import { AdminFinancePage } from '../features/admin/pages/AdminFinancePage.jsx';
import { AdminAuditLogsPage } from '../features/admin/pages/AdminAuditLogsPage.jsx';
import { AdminSettingsPage } from '../features/admin/pages/AdminSettingsPage.jsx';

// Dedicated Bhumitra AI Full Page
import { BhumitraAiPage } from '../features/ai/pages/BhumitraAiPage.jsx';

// Constants
import { ROLES } from '../constants/roles.js';

export const router = createBrowserRouter([
  // Public Website Pages Suite
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/about', element: <AboutPage /> },
      { path: '/solutions', element: <SolutionsPage /> },
      { path: '/farmer', element: <FarmerPublicPage /> },
      { path: '/government', element: <GovernmentPublicPage /> },
      { path: '/partner', element: <PartnerPublicPage /> },
      { path: '/land', element: <LandPublicPage /> },
      { path: '/soil-testing', element: <SoilPublicPage /> },
      { path: '/tree-insurance', element: <InsurancePublicPage /> },
      { path: '/marketplace-overview', element: <MarketplacePublicPage /> },
      { path: '/projects-overview', element: <ProjectsPublicPage /> },
      { path: '/carbon-overview', element: <CarbonPublicPage /> },
      { path: '/schemes-overview', element: <SchemesPublicPage /> },
      { path: '/faq', element: <FaqPage /> },
      { path: '/contact', element: <ContactPage /> },
      { path: '/terms', element: <TermsPage /> },
      { path: '/privacy', element: <PrivacyPolicyPage /> },
      { path: '/unauthorized', element: <UnauthorizedPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },

  // Auth Routes (Role Select, Login, Register, OTP, Pending, Query, Session Expired)
  {
    element: <AuthLayout />,
    children: [
      { path: '/role-select', element: <RoleSelectPage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      { path: '/onboarding', element: <RegisterPage /> },
      { path: '/otp-verify', element: <OtpVerifyPage /> },
      { path: '/verification-pending', element: <VerificationPendingPage /> },
      { path: '/query-correction', element: <QueryCorrectionPage /> },
      { path: '/session-expired', element: <SessionExpiredPage /> },
    ],
  },

  // Protected Role Portals & Dedicated AI Assistant
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          // Dedicated Full Page Bhumitra AI
          { path: '/bhumitra-ai', element: <BhumitraAiPage /> },

          // Farmer Portal Suite
          {
            element: <RoleProtectedRoute allowedRoles={[ROLES.FARMER]} />,
            children: [
              { path: '/farmer/dashboard', element: <FarmerDashboardPage /> },
              { path: '/farmer/invoices', element: <FarmerReportsInvoicesPage /> },
              { path: '/farmer/reports', element: <FarmerReportsInvoicesPage /> },
              { path: '/farmer/onboarding', element: <FarmerOnboardingPage /> },
              { path: '/farmer/profile', element: <FarmerProfilePage /> },

              // Land & GIS
              { path: '/farmer/lands', element: <LandListPage /> },
              { path: '/farmer/lands/add', element: <AddLandPage /> },
              { path: '/farmer/lands/:id', element: <LandDetailPage /> },
              { path: '/farmer/application-status/:applicationId', element: <LandApplicationStatusPage /> },

              // Insurance & Claims
              { path: '/farmer/insurance', element: <InsuranceCatalogPage /> },
              { path: '/farmer/insurance/catalog', element: <InsuranceCatalogPage /> },
              { path: '/farmer/insurance/apply', element: <InsuranceApplyPage /> },
              { path: '/farmer/insurance/claims', element: <ClaimsListPage /> },
              { path: '/farmer/insurance/raise-claim', element: <RaiseClaimPage /> },
              { path: '/farmer/insurance/:id', element: <PolicyDetailPage /> },

              // Soil Testing
              { path: '/farmer/soil', element: <SoilDashboardPage /> },
              { path: '/farmer/soil/book', element: <BookSoilTestPage /> },
              { path: '/farmer/soil/report/:id', element: <SoilReportDetailPage /> },

              // Projects & Carbon
              { path: '/farmer/projects', element: <ProjectsListPage /> },
              { path: '/farmer/projects/:id', element: <ProjectDetailPage /> },
              { path: '/farmer/carbon', element: <CarbonOpportunitiesPage /> },
              { path: '/farmer/carbon/request-audit', element: <RequestCarbonAuditPage /> },
              { path: '/farmer/wallet', element: <WalletPage /> },
            ],
          },

          // Government Portal
          {
            element: <RoleProtectedRoute allowedRoles={[ROLES.GOVERNMENT]} />,
            children: [
              { path: '/government/dashboard', element: <GovernmentDashboardPage /> },
              { path: '/government/assets', element: <PublicAssetsPage /> },
              { path: '/government/farmers', element: <FarmersInAreaPage /> },
              { path: '/government/campaigns', element: <CampaignsPage /> },
              { path: '/government/projects', element: <AreaProjectsPage /> },
              { path: '/government/insurance', element: <GovernmentInsurancePage /> },
              { path: '/government/soil', element: <GovernmentSoilPage /> },
            ],
          },

          // Enterprise Partner Portal
          {
            element: <RoleProtectedRoute allowedRoles={[ROLES.PARTNER]} />,
            children: [
              { path: '/partner/dashboard', element: <PartnerDashboardPage /> },
              { path: '/partner/tasks', element: <AssignedTasksPage /> },
              { path: '/partner/visits', element: <FieldVisitsPage /> },
              { path: '/partner/inspections', element: <InspectionsQueuePage /> },
              { path: '/partner/lab', element: <LabSampleQueuePage /> },
              { path: '/partner/reports', element: <ReportsUploadPage /> },
              { path: '/partner/invoices', element: <PartnerInvoicesPage /> },
            ],
          },

          // Super Admin Portal
          {
            element: <RoleProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN_STAFF]} />,
            children: [
              { path: '/admin/dashboard', element: <AdminDashboardPage /> },
              { path: '/admin/approvals', element: <ApprovalsQueuePage /> },
              { path: '/admin/lands', element: <AdminLandsPage /> },
              { path: '/admin/insurance', element: <AdminInsurancePage /> },
              { path: '/admin/soil', element: <AdminSoilPage /> },
              { path: '/admin/marketplace', element: <AdminMarketplacePage /> },
              { path: '/admin/projects', element: <AdminProjectsPage /> },
              { path: '/admin/carbon', element: <AdminCarbonPage /> },
              { path: '/admin/finance', element: <AdminFinancePage /> },
              { path: '/admin/audit', element: <AdminAuditLogsPage /> },
              { path: '/admin/settings', element: <AdminSettingsPage /> },
            ],
          },

          // Common / Shared Modules across roles
          { path: '/marketplace', element: <MarketplacePage /> },
          { path: '/marketplace/product/:id', element: <ProductDetailPage /> },
          { path: '/marketplace/cart', element: <CartPage /> },
          { path: '/marketplace/checkout', element: <CheckoutPage /> },
          { path: '/marketplace/order-success', element: <OrderSuccessPage /> },
          { path: '/marketplace/orders', element: <OrdersListPage /> },

          { path: '/schemes', element: <SchemesListPage /> },
          { path: '/carbon', element: <CarbonOpportunitiesPage /> },
          { path: '/wallet', element: <WalletPage /> },
          { path: '/rewards', element: <RewardsReferralPage /> },
          { path: '/documents', element: <DocumentCenterPage /> },
          { path: '/support', element: <ContactPage /> },
          { path: '/profile', element: <FarmerProfilePage /> },
        ],
      },
    ],
  },
]);

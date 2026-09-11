import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Sliders,
  Shield,
  Bell,
  Key,
  Users,
  Save,
  CheckCircle,
  Database,
  Lock,
  Globe,
  Smartphone,
  Mail,
  AlertTriangle,
  RefreshCw,
  Copy,
  Eye,
  EyeOff,
  DollarSign,
  FileText,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '../../../components/ui/Card.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { StatusBadge } from '../../../components/ui/StatusBadge.jsx';
import { FormInput } from '../../../components/forms/FormInput.jsx';
import { FormSelect } from '../../../components/forms/FormSelect.jsx';
import { fetchSystemSettings, saveSystemSettings } from '../adminSlice.js';

export const AdminSettingsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { settings, settingsSaving } = useSelector((state) => state.admin);

  const [activeTab, setActiveTab] = useState('general');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  // General Settings State
  const [generalConfig, setGeneralConfig] = useState({
    platformName: 'BHUMICRED National Agritech & Carbon Grid',
    supportEmail: 'support@bhumicred.in',
    supportPhone: '+91 1800 200 4567',
    maintenanceMode: false,
    publicRegistrations: true,
    autoKycVerification: true,
    sessionTimeoutMins: '60',
    defaultLanguage: 'en',
    currencySymbol: '₹',
    dailyWithdrawalLimit: 50000,
    dualSignoffAmount: 100000,
    maxAutoApprovedAcreage: 5.0,
    satelliteSensitivity: 'STANDARD',
  });

  useEffect(() => {
    dispatch(fetchSystemSettings());
  }, [dispatch]);

  useEffect(() => {
    if (settings) {
      setGeneralConfig((prev) => ({
        ...prev,
        maintenanceMode: !!settings.maintenanceMode,
        autoKycVerification: !!settings.autoApproveLowRiskKYC,
        dailyWithdrawalLimit: settings.dailyWithdrawalLimit || 50000,
        dualSignoffAmount: settings.requireDualSignoffAboveAmount || 100000,
        maxAutoApprovedAcreage: settings.maxAutoApprovedAcreage || 5.0,
        satelliteSensitivity: settings.satelliteTriggerSensitivity || 'STANDARD',
        sessionTimeoutMins: String(settings.sessionTimeoutMinutes || 60),
      }));
    }
  }, [settings]);

  const handleSave = async () => {
    await dispatch(
      saveSystemSettings({
        maintenanceMode: generalConfig.maintenanceMode,
        autoApproveLowRiskKYC: generalConfig.autoKycVerification,
        dailyWithdrawalLimit: Number(generalConfig.dailyWithdrawalLimit),
        requireDualSignoffAboveAmount: Number(generalConfig.dualSignoffAmount),
        maxAutoApprovedAcreage: Number(generalConfig.maxAutoApprovedAcreage),
        satelliteTriggerSensitivity: generalConfig.satelliteSensitivity,
        sessionTimeoutMinutes: Number(generalConfig.sessionTimeoutMins),
      })
    );
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  // RBAC State
  const [roles, setRoles] = useState([
    {
      id: 'super_admin',
      name: 'Super Admin',
      description: 'Unrestricted control over system configuration, finances, and user management.',
      usersCount: 3,
      permissions: {
        viewAll: true,
        editConfig: true,
        financeApprove: true,
        partnerAssign: true,
        auditLogs: true,
        dataExport: true,
      },
    },
    {
      id: 'staff_officer',
      name: 'Staff / Verification Officer',
      description: 'Reviews land titles, inspections, claims, and KYC verification records.',
      usersCount: 14,
      permissions: {
        viewAll: true,
        editConfig: false,
        financeApprove: false,
        partnerAssign: true,
        auditLogs: true,
        dataExport: false,
      },
    },
    {
      id: 'gov_nodal',
      name: 'Government Nodal Officer',
      description: 'Zonal administrator overseeing public schemes, village lands, and subsidy audits.',
      usersCount: 42,
      permissions: {
        viewAll: true,
        editConfig: false,
        financeApprove: false,
        partnerAssign: false,
        auditLogs: false,
        dataExport: true,
      },
    },
    {
      id: 'partner_agent',
      name: 'Enterprise Field Agent / Lab',
      description: 'Executes geo-tagging, lab testing, tree sensor verification, and generates reports.',
      usersCount: 128,
      permissions: {
        viewAll: false,
        editConfig: false,
        financeApprove: false,
        partnerAssign: false,
        auditLogs: false,
        dataExport: false,
      },
    },
    {
      id: 'farmer_user',
      name: 'Registered Farmer / Landowner',
      description: 'Manages personal land parcels, claims, marketplace purchases, and wallet.',
      usersCount: 12450,
      permissions: {
        viewAll: false,
        editConfig: false,
        financeApprove: false,
        partnerAssign: false,
        auditLogs: false,
        dataExport: false,
      },
    },
  ]);

  // Notifications Template State
  const [templates, setTemplates] = useState([
    {
      id: 'sms_otp',
      channel: 'SMS',
      name: 'Authentication OTP',
      trigger: 'Login / Verification OTP request',
      content: 'Your BHUMICRED verification code is {{otp}}. Valid for 5 minutes. Do not share this OTP with anyone.',
      enabled: true,
    },
    {
      id: 'land_approved',
      channel: 'SMS & WhatsApp',
      name: 'Land Registry Approved',
      trigger: 'Staff Officer approves a land parcel application',
      content: 'Dear {{farmer_name}}, your land parcel {{khasra_no}} at {{village}} has been successfully verified and added to BHUMICRED Registry.',
      enabled: true,
    },
    {
      id: 'claim_settled',
      channel: 'Email & Push',
      name: 'Insurance Claim Payout Disbursed',
      trigger: 'Direct Benefit Transfer (DBT) claim settlement approved',
      content: 'Payout Notice: Claim #{{claim_id}} worth ₹{{amount}} has been credited to your linked BHUMICRED Smart Wallet.',
      enabled: true,
    },
    {
      id: 'soil_ready',
      channel: 'WhatsApp & SMS',
      name: 'Soil Health Card Ready',
      trigger: 'Certified lab uploads completed soil parameters',
      content: 'Good news! Your Soil Health Card for Sample #{{sample_id}} is now ready. View nutrient scores and fertilizer advice on BHUMICRED portal.',
      enabled: true,
    },
  ]);

  return (
    <div className="w-full space-y-6 sm:space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300">
              Super Admin Control
            </span>
            <span className="text-xs text-neutral-400">BHUMICRED Sovereign Node v2.6.0</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white mt-1">
            Platform Configuration & Governance
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            Manage global risk parameters, financial withdrawal ceilings, auto-approval thresholds, and immutable audit controls.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {savedSuccess && (
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/70 px-3 py-2 rounded-xl border border-emerald-300 dark:border-emerald-800 animate-in fade-in">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              Settings Saved & Audited!
            </div>
          )}
          <Button
            variant="primary"
            onClick={handleSave}
            loading={settingsSaving}
            className="flex items-center gap-2 shadow-lg shadow-emerald-900/15"
          >
            <Save className="w-4 h-4" />
            {settingsSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'general', label: 'General Configuration', icon: Sliders },
          { id: 'rbac', label: 'Roles & RBAC Matrix', icon: Shield },
          { id: 'templates', label: 'Notification Templates', icon: Bell },
          { id: 'api', label: 'API Keys & Webhooks', icon: Key },
          { id: 'security', label: 'Security & Compliance', icon: Lock },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 shadow-sm border border-emerald-200 dark:border-emerald-800/60 font-bold'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600 dark:text-emerald-400' : ''}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: GENERAL CONFIG */}
      {activeTab === 'general' && (
        <div className="space-y-6">
          {/* Card 1: Risk, Finance & Automated Governance */}
          <Card className="p-6 border border-slate-200 dark:border-neutral-800">
            <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-2 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-600" />
              Sovereign Risk, Finance & Automated Ceilings
            </h3>
            <p className="text-xs text-neutral-500 mb-5">
              Configure automated thresholds for Smart Wallet payouts, multi-signature underwriter requirements, and GIS parcel boundaries.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormInput
                label="Daily Smart Wallet Withdrawal Limit (₹)"
                type="number"
                value={generalConfig.dailyWithdrawalLimit}
                onChange={(e) => setGeneralConfig({ ...generalConfig, dailyWithdrawalLimit: e.target.value })}
                placeholder="50000"
              />

              <FormInput
                label="Dual-Signoff Required Above Amount (₹)"
                type="number"
                value={generalConfig.dualSignoffAmount}
                onChange={(e) => setGeneralConfig({ ...generalConfig, dualSignoffAmount: e.target.value })}
                placeholder="100000"
              />

              <FormInput
                label="Max Auto-Approved Land Area (Acres)"
                type="number"
                step="0.5"
                value={generalConfig.maxAutoApprovedAcreage}
                onChange={(e) => setGeneralConfig({ ...generalConfig, maxAutoApprovedAcreage: e.target.value })}
                placeholder="5.0"
              />

              <FormSelect
                label="Satellite Parametric Trigger Sensitivity"
                value={generalConfig.satelliteSensitivity}
                onChange={(e) => setGeneralConfig({ ...generalConfig, satelliteSensitivity: e.target.value })}
                options={[
                  { value: 'LOW', label: 'Low (Severe Anomaly Only)' },
                  { value: 'STANDARD', label: 'Standard (IMD / Sentinel-2 Verified)' },
                  { value: 'HIGH', label: 'High (Immediate Distress Payout)' },
                ]}
              />
            </div>
          </Card>

          {/* Card 2: Global Platform Parameters */}
          <Card className="p-6 border border-slate-200 dark:border-neutral-800">
            <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-emerald-600" />
              Global Platform Parameters
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormInput
                label="Platform Brand Name"
                value={generalConfig.platformName}
                onChange={(e) => setGeneralConfig({ ...generalConfig, platformName: e.target.value })}
              />

              <FormInput
                label="Master Support Email"
                type="email"
                value={generalConfig.supportEmail}
                onChange={(e) => setGeneralConfig({ ...generalConfig, supportEmail: e.target.value })}
              />

              <FormInput
                label="Toll-Free Helpline Phone"
                value={generalConfig.supportPhone}
                onChange={(e) => setGeneralConfig({ ...generalConfig, supportPhone: e.target.value })}
              />

              <FormSelect
                label="Session Expiry Timeout"
                value={generalConfig.sessionTimeoutMins}
                onChange={(e) => setGeneralConfig({ ...generalConfig, sessionTimeoutMins: e.target.value })}
                options={[
                  { value: '15', label: '15 Minutes of Inactivity' },
                  { value: '30', label: '30 Minutes of Inactivity' },
                  { value: '60', label: '1 Hour of Inactivity' },
                  { value: '240', label: '4 Hours of Inactivity' },
                ]}
              />
            </div>
          </Card>

          {/* Card 3: Operational Toggles */}
          <Card className="p-6 border border-slate-200 dark:border-neutral-800">
            <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-emerald-600" />
              Operational Toggles
            </h3>

            <div className="space-y-4 divide-y divide-neutral-100 dark:divide-neutral-800">
              {/* Toggle 1 */}
              <div className="flex items-center justify-between pt-3">
                <div className="pr-4">
                  <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
                    Public Farmer & Partner Registration
                  </h4>
                  <p className="text-xs text-neutral-500">
                    Allow new farmers and agronomy partners to create accounts through the public onboarding portal.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setGeneralConfig({
                      ...generalConfig,
                      publicRegistrations: !generalConfig.publicRegistrations,
                    })
                  }
                  className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    generalConfig.publicRegistrations ? 'bg-emerald-600' : 'bg-neutral-300 dark:bg-neutral-700'
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      generalConfig.publicRegistrations ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Toggle 2 */}
              <div className="flex items-center justify-between pt-4">
                <div className="pr-4">
                  <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
                    Simulated Auto-KYC Match
                  </h4>
                  <p className="text-xs text-neutral-500">
                    Automatically approve Aadhaar / PM-KISAN matching records when risk score is zero.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setGeneralConfig({
                      ...generalConfig,
                      autoKycVerification: !generalConfig.autoKycVerification,
                    })
                  }
                  className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    generalConfig.autoKycVerification ? 'bg-emerald-600' : 'bg-neutral-300 dark:bg-neutral-700'
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      generalConfig.autoKycVerification ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Toggle 3 */}
              <div className="flex items-center justify-between pt-4">
                <div className="pr-4">
                  <h4 className="text-sm font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    Maintenance Mode (Emergency Lockdown)
                  </h4>
                  <p className="text-xs text-neutral-500">
                    Restricts non-superadmin access and shows a system maintenance broadcast banner across all citizen portals.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setGeneralConfig({
                      ...generalConfig,
                      maintenanceMode: !generalConfig.maintenanceMode,
                    })
                  }
                  className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    generalConfig.maintenanceMode ? 'bg-rose-600' : 'bg-neutral-300 dark:bg-neutral-700'
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      generalConfig.maintenanceMode ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </Card>

          {/* Audit Trail Navigation Banner */}
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-600 text-white shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-emerald-950 dark:text-emerald-200">
                  Immutable Security Audit Trail Active
                </h4>
                <p className="text-[11px] text-emerald-800 dark:text-emerald-400">
                  Every parameter save or toggle modification is cryptographically logged with IP and actor role.
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              icon={ArrowRight}
              onClick={() => navigate('/admin/audit')}
              className="shrink-0 text-xs font-bold"
            >
              View Audit Logs
            </Button>
          </div>
        </div>
      )}

      {/* TAB 2: RBAC MATRIX */}
      {activeTab === 'rbac' && (
        <Card className="p-6 overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-600" />
                Role-Based Access Control (RBAC) Matrix
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                Define and audit permissions granted to distinct stakeholder roles across the platform.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              {roles.length} Configured Roles
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-50 dark:bg-neutral-800/60 text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                <tr>
                  <th className="p-3">Role Name</th>
                  <th className="p-3 text-center">View All</th>
                  <th className="p-3 text-center">Edit Config</th>
                  <th className="p-3 text-center">Finance Payout</th>
                  <th className="p-3 text-center">Partner Assign</th>
                  <th className="p-3 text-center">Audit Logs</th>
                  <th className="p-3 text-center">Data Export</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 text-xs">
                {roles.map((role) => (
                  <tr key={role.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30">
                    <td className="p-3 font-bold text-neutral-900 dark:text-white">
                      {role.name}
                      <span className="block text-[11px] font-normal text-neutral-400 mt-0.5">
                        {role.usersCount} Active Users
                      </span>
                    </td>
                    {Object.entries(role.permissions).map(([perm, val]) => (
                      <td key={perm} className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={val}
                          readOnly
                          className="w-4 h-4 text-emerald-600 rounded border-neutral-300 focus:ring-emerald-500 cursor-pointer"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* TAB 3: TEMPLATES */}
      {activeTab === 'templates' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <Bell className="w-5 h-5 text-emerald-600" />
                Notification & Alert Templates
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                Pre-configured SMS, WhatsApp, and Email triggers with variable placeholders.
              </p>
            </div>
            <Button variant="outline" size="sm" className="flex items-center gap-1.5">
              + New Template
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {templates.map((tpl) => (
              <Card key={tpl.id} className="p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-800">
                      {tpl.channel}
                    </span>
                    <StatusBadge status={tpl.enabled ? 'ACTIVE' : 'INACTIVE'} label={tpl.enabled ? 'Active' : 'Disabled'} />
                  </div>
                  <h4 className="font-bold text-neutral-900 dark:text-white text-base">{tpl.name}</h4>
                  <p className="text-xs text-neutral-500 mt-1">
                    <span className="font-semibold text-neutral-700 dark:text-neutral-300">Trigger:</span> {tpl.trigger}
                  </p>

                  <div className="mt-3 p-3 bg-neutral-50 dark:bg-neutral-800/80 rounded-lg border border-neutral-200 dark:border-neutral-700 font-mono text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    {tpl.content}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                  <span className="text-[11px] text-neutral-400">Placeholder format: &#123;&#123;variable&#125;&#125;</span>
                  <button className="text-xs font-bold text-emerald-600 hover:text-emerald-700">
                    Edit Template
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: API & WEBHOOKS */}
      {activeTab === 'api' && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-2 flex items-center gap-2">
              <Key className="w-5 h-5 text-emerald-600" />
              Master Developer API Credentials (Sovereign Node)
            </h3>
            <p className="text-xs text-neutral-500 mb-5">
              Secure keys for integrating GIS satellite data feeds, banking DBT gateways, and Agritech ERPs.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                  Production API Key
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 font-mono text-xs bg-neutral-100 dark:bg-neutral-800 px-3.5 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200">
                    {showApiKey ? 'bk_live_9f82a174c8924bceba33901f4c718b9e' : 'bk_live_••••••••••••••••••••••••••••••••'}
                  </div>
                  <Button variant="secondary" size="sm" onClick={() => setShowApiKey(!showApiKey)}>
                    {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => alert('Master API Key copied!')}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                  Active Webhook Listener URL
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value="https://api.bhumicred.in/v1/webhooks/dbt-satellite-feed"
                    className="flex-1 font-mono text-xs bg-neutral-50 dark:bg-neutral-800 px-3.5 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200"
                  />
                  <Button variant="secondary" size="sm" className="flex items-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5" /> Test Ping
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 5: SECURITY & COMPLIANCE */}
      {activeTab === 'security' && (
        <Card className="p-6">
          <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-2 flex items-center gap-2">
            <Lock className="w-5 h-5 text-emerald-600" />
            Security Policies & Sovereign Cloud Compliance
          </h3>
          <p className="text-xs text-neutral-500 mb-6">
            Standards adherence with Indian Data Protection Board (DPDP Act) and MeitY Sovereign Hosting.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-950/20">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold text-sm">
                <CheckCircle className="w-4 h-4" /> Data Residency: India-Only (MeitY Approved)
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                All land polygon coordinates, Aadhaar tokens, and financial ledgers stored exclusively in Mumbai & Hyderabad Tier-4 data centers.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-950/20">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold text-sm">
                <CheckCircle className="w-4 h-4" /> End-to-End Encryption at Rest & Transit
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                AES-256 GCM encryption enabled for all land boundary geometry and soil health records.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AdminSettingsPage;

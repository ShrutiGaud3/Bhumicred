import React, { useState } from 'react';
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
  ToggleLeft,
  ToggleRight,
  AlertTriangle,
  RefreshCw,
  Copy,
  Eye,
  EyeOff
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '../../../components/ui/Card.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { StatusBadge } from '../../../components/ui/StatusBadge.jsx';
import { FormInput } from '../../../components/forms/FormInput.jsx';
import { FormSelect } from '../../../components/forms/FormSelect.jsx';

export const AdminSettingsPage = () => {
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
    autoKycVerification: false,
    sessionTimeoutMins: '60',
    defaultLanguage: 'en',
    currencySymbol: '₹',
  });

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
        dataExport: true
      }
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
        dataExport: false
      }
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
        dataExport: true
      }
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
        dataExport: false
      }
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
        dataExport: false
      }
    }
  ]);

  // Notifications Template State
  const [templates, setTemplates] = useState([
    {
      id: 'sms_otp',
      channel: 'SMS',
      name: 'Authentication OTP',
      trigger: 'Login / Verification OTP request',
      content: 'Your BHUMICRED verification code is {{otp}}. Valid for 5 minutes. Do not share this OTP with anyone.',
      enabled: true
    },
    {
      id: 'land_approved',
      channel: 'SMS & WhatsApp',
      name: 'Land Registry Approved',
      trigger: 'Staff Officer approves a land parcel application',
      content: 'Dear {{farmer_name}}, your land parcel {{khasra_no}} at {{village}} has been successfully verified and added to BHUMICRED Registry.',
      enabled: true
    },
    {
      id: 'claim_settled',
      channel: 'Email & Push',
      name: 'Insurance Claim Payout Disbursed',
      trigger: 'Direct Benefit Transfer (DBT) claim settlement approved',
      content: 'Payout Notice: Claim #{{claim_id}} worth ₹{{amount}} has been credited to your linked BHUMICRED Smart Wallet.',
      enabled: true
    },
    {
      id: 'soil_ready',
      channel: 'WhatsApp & SMS',
      name: 'Soil Health Card Ready',
      trigger: 'Certified lab uploads completed soil parameters',
      content: 'Good news! Your Soil Health Card for Sample #{{sample_id}} is now ready. View nutrient scores and fertilizer advice on BHUMICRED portal.',
      enabled: true
    }
  ]);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="w-full space-y-6 sm:space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300">
              Super Admin Control
            </span>
            <span className="text-xs text-neutral-400">System v2.4.0</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white mt-1">
            Platform Configuration & Security
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            Manage global platform parameters, role-based access control (RBAC), alert templates, and integration credentials.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {savedSuccess && (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-3 py-2 rounded-lg border border-emerald-200 dark:border-emerald-800">
              <CheckCircle className="w-4 h-4" />
              Settings Saved!
            </div>
          )}
          <Button variant="primary" onClick={handleSave} className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save Changes
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
          { id: 'security', label: 'Security & Compliance', icon: Lock }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-primary-50 text-primary-700 dark:bg-primary-950/40 dark:text-primary-300 shadow-sm border border-primary-200 dark:border-primary-800/60'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-primary-600 dark:text-primary-400' : ''}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: GENERAL CONFIG */}
      {activeTab === 'general' && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary-600" />
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
                  { value: '240', label: '4 Hours of Inactivity' }
                ]}
              />
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-primary-600" />
              Operational Toggles
            </h3>

            <div className="space-y-4 divide-y divide-neutral-100 dark:divide-neutral-800">
              <div className="flex items-center justify-between pt-3">
                <div>
                  <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">
                    Public Farmer & Partner Registration
                  </h4>
                  <p className="text-xs text-neutral-500">
                    Allow new farmers and agronomy partners to create accounts through the public portal.
                  </p>
                </div>
                <button
                  onClick={() => setGeneralConfig({ ...generalConfig, publicRegistrations: !generalConfig.publicRegistrations })}
                  className="text-primary-600 hover:text-primary-700"
                >
                  {generalConfig.publicRegistrations ? (
                    <ToggleRight className="w-8 h-8 fill-primary-600 text-white" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-neutral-400" />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between pt-4">
                <div>
                  <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">
                    Simulated Auto-KYC Match
                  </h4>
                  <p className="text-xs text-neutral-500">
                    Automatically approve Aadhaar / PM-KISAN matching records when risk score is zero.
                  </p>
                </div>
                <button
                  onClick={() => setGeneralConfig({ ...generalConfig, autoKycVerification: !generalConfig.autoKycVerification })}
                  className="text-primary-600 hover:text-primary-700"
                >
                  {generalConfig.autoKycVerification ? (
                    <ToggleRight className="w-8 h-8 fill-primary-600 text-white" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-neutral-400" />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between pt-4">
                <div>
                  <h4 className="text-sm font-semibold text-red-600 dark:text-red-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    Maintenance Mode (Emergency Lockdown)
                  </h4>
                  <p className="text-xs text-neutral-500">
                    Restricts non-superadmin access and shows a system maintenance broadcast banner.
                  </p>
                </div>
                <button
                  onClick={() => setGeneralConfig({ ...generalConfig, maintenanceMode: !generalConfig.maintenanceMode })}
                  className="text-red-600 hover:text-red-700"
                >
                  {generalConfig.maintenanceMode ? (
                    <ToggleRight className="w-8 h-8 fill-red-600 text-white" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-neutral-400" />
                  )}
                </button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 2: RBAC MATRIX */}
      {activeTab === 'rbac' && (
        <Card className="p-6 overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary-600" />
                Role-Based Access Control (RBAC) Matrix
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                Define and audit permissions granted to distinct stakeholder roles across the platform.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary-100 text-primary-700 dark:bg-primary-950/60 dark:text-primary-300">
              {roles.length} Configured Roles
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-50 dark:bg-neutral-800/60 text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                <tr>
                  <th className="p-3.5">Role Name</th>
                  <th className="p-3.5 text-center">Active Users</th>
                  <th className="p-3.5 text-center">Global View</th>
                  <th className="p-3.5 text-center">Edit Config</th>
                  <th className="p-3.5 text-center">Finance Disburse</th>
                  <th className="p-3.5 text-center">Assign Tasks</th>
                  <th className="p-3.5 text-center">Audit Logs</th>
                  <th className="p-3.5 text-center">Export Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {roles.map((role) => (
                  <tr key={role.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors">
                    <td className="p-3.5">
                      <div className="font-semibold text-neutral-900 dark:text-white">{role.name}</div>
                      <div className="text-xs text-neutral-500 max-w-xs">{role.description}</div>
                    </td>
                    <td className="p-3.5 text-center font-medium text-neutral-700 dark:text-neutral-300">
                      {role.usersCount.toLocaleString()}
                    </td>
                    {['viewAll', 'editConfig', 'financeApprove', 'partnerAssign', 'auditLogs', 'dataExport'].map((permKey) => (
                      <td key={permKey} className="p-3.5 text-center">
                        <input
                          type="checkbox"
                          checked={role.permissions[permKey]}
                          onChange={(e) => {
                            const newRoles = roles.map(r => {
                              if (r.id === role.id) {
                                return {
                                  ...r,
                                  permissions: { ...r.permissions, [permKey]: e.target.checked }
                                };
                              }
                              return r;
                            });
                            setRoles(newRoles);
                          }}
                          className="w-4 h-4 text-primary-600 rounded border-neutral-300 focus:ring-primary-500 cursor-pointer"
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
              <h3 className="text-base font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary-600" />
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
                    <span className="text-xs font-semibold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/40 px-2.5 py-1 rounded-md">
                      {tpl.channel}
                    </span>
                    <StatusBadge status={tpl.enabled ? 'ACTIVE' : 'INACTIVE'} label={tpl.enabled ? 'Active' : 'Disabled'} />
                  </div>
                  <h4 className="font-semibold text-neutral-900 dark:text-white text-base">{tpl.name}</h4>
                  <p className="text-xs text-neutral-500 mt-1">
                    <span className="font-medium text-neutral-700 dark:text-neutral-300">Trigger:</span> {tpl.trigger}
                  </p>

                  <div className="mt-3 p-3 bg-neutral-50 dark:bg-neutral-800/80 rounded-lg border border-neutral-200 dark:border-neutral-700 font-mono text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    {tpl.content}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                  <span className="text-[11px] text-neutral-400">Placeholder format: &#123;&#123;variable&#125;&#125;</span>
                  <button className="text-xs font-medium text-primary-600 hover:text-primary-700">
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
            <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-2 flex items-center gap-2">
              <Key className="w-5 h-5 text-primary-600" />
              Master Developer API Credentials (Mock)
            </h3>
            <p className="text-xs text-neutral-500 mb-5">
              Secure keys for integrating GIS satellite data feeds, banking DBT gateways, and Agritech ERPs.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Production API Key
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 font-mono text-xs bg-neutral-100 dark:bg-neutral-800 px-3.5 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200">
                    {showApiKey ? 'bk_live_9f82a174c8924bceba33901f4c718b9e' : 'bk_live_••••••••••••••••••••••••••••••••'}
                  </div>
                  <Button variant="secondary" size="sm" onClick={() => setShowApiKey(!showApiKey)}>
                    {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => alert('Mock API Key copied!')}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
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
          <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-2 flex items-center gap-2">
            <Lock className="w-5 h-5 text-primary-600" />
            Security Policies & Sovereign Cloud Compliance
          </h3>
          <p className="text-xs text-neutral-500 mb-6">
            Standards adherence with Indian Data Protection Board (DPDP Act) and MeitY Sovereign Hosting.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-950/20">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-semibold text-sm">
                <CheckCircle className="w-4 h-4" /> Data Residency: India-Only (MeitY Approved)
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                All land polygon coordinates, Aadhaar tokens, and financial ledgers stored exclusively in Mumbai & Hyderabad Tier-4 data centers.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-950/20">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-semibold text-sm">
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
}

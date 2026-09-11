import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card } from '../components/ui/Card.jsx';
import { Button } from '../components/ui/Button.jsx';
import { FormInput } from '../components/forms/FormInput.jsx';
import { FormTextarea } from '../components/forms/FormTextarea.jsx';
import { FormSelect } from '../components/forms/FormSelect.jsx';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  Clock,
  MessageSquare,
  AlertCircle,
  HelpCircle,
  ShieldAlert,
  ChevronRight,
  ChevronDown,
  User,
  Headphones,
  FileQuestion,
  RefreshCw,
  Sparkles,
  ExternalLink,
  BookOpen,
} from 'lucide-react';
import {
  submitSupportTicket,
  fetchUserSupportTickets,
  clearSubmittedTicket,
} from '../features/notifications/notificationSlice.js';
import { notificationService as notifService } from '../services/notificationService.js';

const CATEGORY_OPTIONS = [
  { value: 'GENERAL', label: 'General Inquiry / Assistance' },
  { value: 'SOIL_SAMPLE', label: 'Soil Testing & Mobile Van Pickup' },
  { value: 'CLAIM_PAYOUT', label: 'Parametric Insurance Claim & Payout' },
  { value: 'LAND_DISPUTE', label: 'Land Registry, GIS & Cadastral Naksha' },
  { value: 'MARKETPLACE_ORDER', label: 'Agri Marketplace & Order Delivery' },
  { value: 'WALLET_KYC', label: 'Smart Wallet & KYC Verification' },
  { value: 'PORTAL_BUG', label: 'Technical Grievance / Platform Bug' },
];

const PRIORITY_OPTIONS = [
  { value: 'NORMAL', label: 'Normal (Standard 24-48h SLA)' },
  { value: 'HIGH', label: 'High Priority (Expedited 12-24h)' },
  { value: 'URGENT', label: 'Urgent (Crop / Claim Distress 6h SLA)' },
];

const FAQS_LIST = [
  {
    q: 'How do I register and verify my land boundary on BHUMICRED?',
    a: 'Farmers can navigate to "My Land" in the portal menu and select "Add Land". Follow the step-by-step wizard to enter Khasra/survey details, upload your 7/12 RoR, draw the satellite polygon boundary, and submit for instant Nodal Officer GIS review.',
    cat: 'Land & GIS',
  },
  {
    q: 'When will the field agent visit for soil sample collection?',
    a: 'After you book a soil test under "Soil Testing", a certified BHUMICRED Mobile Diagnostic Van is dispatched within 24–48 hours. The partner agent will call your registered phone prior to arrival.',
    cat: 'Soil Testing',
  },
  {
    q: 'How are parametric tree insurance claims verified and paid?',
    a: 'Claims are audited using multi-spectral satellite moisture/wind index combined with geo-tagged on-field photo uploads. Once validated by the underwriting desk, claim funds credit directly to your BHUMICRED Smart Wallet within 48 hours.',
    cat: 'Insurance',
  },
  {
    q: 'How does Bhumitra AI assist farmers and officers?',
    a: 'Bhumitra AI provides instant regional agronomy advisory, crop disease identification, and central scheme eligibility analysis. It operates in real-time across multiple Indian regional languages.',
    cat: 'Bhumitra AI',
  },
  {
    q: 'How do I withdraw wallet balance or DBT government scheme subsidies?',
    a: 'Go to "Wallet & Payouts" in the sidebar, choose "Withdraw Funds" or link your Aadhaar-seeded bank account. Payouts are processed via automated sovereign treasury gateways.',
    cat: 'Wallet & Payouts',
  },
];

const getStatusBadge = (status) => {
  switch (status) {
    case 'RESOLVED':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
          <CheckCircle2 className="w-3.5 h-3.5" /> Resolved
        </span>
      );
    case 'IN_REVIEW':
    case 'IN_PROGRESS':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-300 dark:border-blue-800">
          <Clock className="w-3.5 h-3.5" /> In Review
        </span>
      );
    case 'CLOSED':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300 border border-neutral-300 dark:border-neutral-700">
          Closed
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
          <AlertCircle className="w-3.5 h-3.5" /> Open
        </span>
      );
  }
};

export const ContactPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const {
    userTickets = [],
    ticketsLoading,
    ticketSubmitting,
    lastSubmittedTicket,
  } = useSelector((state) => state.notifications);

  const [activeTab, setActiveTab] = useState('FORM'); // 'FORM' | 'MY_TICKETS' | 'FAQS'
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    mobile: user?.mobile || user?.phone || '',
    category: 'GENERAL',
    priority: 'NORMAL',
    subject: '',
    message: '',
  });

  const [expandedTicketId, setExpandedTicketId] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [replySubmitting, setReplySubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        mobile: user.mobile || user.phone || prev.mobile,
      }));
      dispatch(fetchUserSupportTickets(user.mobile || user.phone || ''));
    } else {
      dispatch(fetchUserSupportTickets(''));
    }
  }, [user, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.mobile || !formData.message) return;

    await dispatch(submitSupportTicket(formData));
  };

  const handlePostReply = async (ticketId) => {
    if (!replyMessage.trim()) return;
    setReplySubmitting(true);
    try {
      await notifService.replySupportTicket(ticketId, replyMessage.trim());
      setReplyMessage('');
      dispatch(fetchUserSupportTickets(user?.mobile || user?.phone || formData.mobile || ''));
    } catch (err) {
      console.error('Error posting reply:', err);
    } finally {
      setReplySubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* Page Header */}
      <div className="text-center space-y-2 mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
          <Headphones className="w-3.5 h-3.5 text-emerald-600" />
          24/7 Sovereign Citizen & Partner Assistance
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Support & Grievance Desk
        </h1>
        <p className="text-sm text-slate-600 dark:text-neutral-400 max-w-xl mx-auto">
          Official digital helpline and ticket tracking portal for farmers, nodal government authorities, and enterprise partners.
        </p>

        {/* Tab Navigation */}
        <div className="inline-flex p-1 bg-slate-100 dark:bg-neutral-800 rounded-2xl border border-slate-200 dark:border-neutral-700 mt-4">
          <button
            onClick={() => setActiveTab('FORM')}
            className={`px-4 sm:px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'FORM'
                ? 'bg-white dark:bg-neutral-900 text-emerald-800 dark:text-emerald-400 shadow-md'
                : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Submit Grievance / Query
          </button>
          <button
            onClick={() => {
              setActiveTab('MY_TICKETS');
              dispatch(fetchUserSupportTickets(user?.mobile || user?.phone || formData.mobile || ''));
            }}
            className={`px-4 sm:px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'MY_TICKETS'
                ? 'bg-white dark:bg-neutral-900 text-emerald-800 dark:text-emerald-400 shadow-md'
                : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            My Grievance Tickets
            {userTickets.length > 0 && (
              <span className="px-1.5 py-0.2 bg-emerald-600 text-white rounded-full text-[10px] font-extrabold">
                {userTickets.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('FAQS')}
            className={`px-4 sm:px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'FAQS'
                ? 'bg-white dark:bg-neutral-900 text-emerald-800 dark:text-emerald-400 shadow-md'
                : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
            Help & FAQs
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Contact Channels & SLAs */}
        <div className="space-y-4">
          <Card className="p-6 bg-gradient-to-br from-emerald-900 to-teal-950 text-white border-0 shadow-xl relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-emerald-700/20 blur-2xl pointer-events-none" />
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-emerald-700/60 text-emerald-300">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold">Kisan Call Center</h3>
                <p className="text-xs text-emerald-200/80">Toll-Free Immediate Tele-Support</p>
              </div>
            </div>
            <p className="text-2xl font-black tracking-tight text-white mb-1">1800-BHUMI-CRED</p>
            <p className="text-xs text-emerald-300/90 mb-4">(1800-24864-2733) • All India Toll-Free</p>
            
            <a
              href="tel:1800248642733"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md"
            >
              <Phone className="w-4 h-4" />
              Direct Call Desk
            </a>

            <div className="mt-4 pt-4 border-t border-emerald-800/60 text-xs text-emerald-200 flex justify-between items-center">
              <span>Operational:</span>
              <span className="font-semibold text-white">Mon–Sat (8 AM – 8 PM IST)</span>
            </div>
          </Card>

          <Card className="p-5 border border-slate-200 dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Email Assistance</h4>
                <a
                  href="mailto:support@bhumicred.in"
                  className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold mt-0.5 block truncate hover:underline"
                >
                  support@bhumicred.in
                </a>
                <p className="text-xs text-slate-500 dark:text-neutral-400 truncate">
                  grievance@bhumicred.gov.in
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-5 border border-slate-200 dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Central Secretariat</h4>
                <p className="text-xs text-slate-600 dark:text-neutral-400 mt-0.5 leading-relaxed">
                  BHUMICRED Agritech Central, Cyber City, Sector 44, New Delhi - 110001
                </p>
              </div>
            </div>
          </Card>

          {/* SLA Card */}
          <Card className="p-5 bg-slate-50 dark:bg-neutral-800/60 border border-slate-200 dark:border-neutral-700">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-emerald-600" />
              Sovereign Redressal Guarantee
            </h4>
            <ul className="text-xs text-slate-600 dark:text-neutral-400 space-y-1.5">
              <li>• Soil Test Pickups: 24-48 Hours</li>
              <li>• Parametric Claim Review: 48 Hours</li>
              <li>• Land Naksha Realignment: 24 Hours</li>
              <li>• Wallet KYC Inquiries: 12 Hours</li>
            </ul>
          </Card>
        </div>

        {/* Right Side: Tab 1 Form / Tab 2 My Tickets / Tab 3 FAQs */}
        <div className="lg:col-span-2">
          {activeTab === 'FORM' && (
            <Card className="p-6 sm:p-8 border border-slate-200 dark:border-neutral-800 dark:bg-neutral-900 shadow-sm">
              {lastSubmittedTicket ? (
                <div className="text-center py-10 space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50 dark:ring-emerald-950/40 animate-in zoom-in">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white">
                      Grievance Ticket Created!
                    </h3>
                    <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
                      Ticket ID: {lastSubmittedTicket.ticketId}
                    </p>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-neutral-400 max-w-md mx-auto leading-relaxed">
                    Your grievance has been logged onto the sovereign audit queue. Our nodal desk will review your inquiry with priority SLA.
                  </p>

                  <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
                    <Button
                      onClick={() => {
                        dispatch(clearSubmittedTicket());
                        setActiveTab('MY_TICKETS');
                        dispatch(fetchUserSupportTickets(user?.mobile || user?.phone || formData.mobile || ''));
                      }}
                      variant="primary"
                    >
                      Track My Grievance Status
                    </Button>
                    <Button
                      onClick={() => {
                        dispatch(clearSubmittedTicket());
                        setFormData({
                          name: user?.name || '',
                          email: user?.email || '',
                          mobile: user?.mobile || user?.phone || '',
                          category: 'GENERAL',
                          priority: 'NORMAL',
                          subject: '',
                          message: '',
                        });
                      }}
                      variant="outline"
                    >
                      Submit Another Query
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="border-b border-slate-100 dark:border-neutral-800 pb-4 mb-4">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      File a Grievance or Request
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-neutral-400">
                      Fill out the details below to receive instant ticket tracking.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormInput
                      label="Full Name *"
                      name="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Ramesh Patel"
                    />
                    <FormInput
                      label="Mobile Number *"
                      name="mobile"
                      required
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      placeholder="10-digit mobile number"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormInput
                      label="Email Address"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. farmer@example.com"
                    />
                    <FormSelect
                      label="Inquiry Category *"
                      name="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      options={CATEGORY_OPTIONS}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormInput
                      label="Subject / Reference Headline *"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="e.g. Khasra 412/1 soil test pickup reschedule"
                    />
                    <FormSelect
                      label="Priority Level"
                      name="priority"
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      options={PRIORITY_OPTIONS}
                    />
                  </div>

                  <FormTextarea
                    label="Detailed Grievance / Inquiry Description *"
                    name="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Provide complete details including survey numbers, application codes, or incident specifics..."
                  />

                  <Button
                    type="submit"
                    variant="primary"
                    icon={Send}
                    loading={ticketSubmitting}
                    className="w-full py-3 text-sm font-bold shadow-lg shadow-emerald-900/15"
                  >
                    {ticketSubmitting ? 'Registering Grievance...' : 'Submit Support Request'}
                  </Button>
                </form>
              )}
            </Card>
          )}

          {/* Tab 2: My Tickets Desk */}
          {activeTab === 'MY_TICKETS' && (
            <Card className="p-6 border border-slate-200 dark:border-neutral-800 dark:bg-neutral-900 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-neutral-800">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    My Grievance Tickets
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                      {userTickets.length} Recorded
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-neutral-400">
                    Track resolution progress and converse with support officers.
                  </p>
                </div>

                <Button
                  onClick={() => dispatch(fetchUserSupportTickets(user?.mobile || user?.phone || formData.mobile || ''))}
                  variant="outline"
                  size="sm"
                  icon={RefreshCw}
                  loading={ticketsLoading}
                >
                  Refresh
                </Button>
              </div>

              {userTickets.length === 0 ? (
                <div className="text-center py-16 text-slate-400">
                  <FileQuestion className="w-12 h-12 mx-auto stroke-1 text-slate-300 dark:text-neutral-700 mb-2" />
                  <p className="text-sm font-medium text-slate-700 dark:text-neutral-300">
                    No active grievances logged
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Have an issue with land, insurance or payouts? Click "Submit Grievance" above.
                  </p>
                  <Button
                    onClick={() => setActiveTab('FORM')}
                    variant="primary"
                    size="sm"
                    className="mt-4"
                  >
                    Submit New Grievance
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {userTickets.map((ticket) => {
                    const isExpanded = expandedTicketId === ticket._id || expandedTicketId === ticket.ticketId;

                    return (
                      <div
                        key={ticket._id || ticket.ticketId}
                        className="p-5 rounded-2xl border border-slate-200 dark:border-neutral-800 hover:border-emerald-300 dark:hover:border-emerald-700/60 transition-all bg-white dark:bg-neutral-900"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <span className="font-mono text-xs font-extrabold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                              {ticket.ticketId}
                            </span>
                            <span className="text-xs font-bold text-slate-500 dark:text-neutral-400">
                              {ticket.category}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {getStatusBadge(ticket.status)}
                            <span className="text-[11px] text-slate-400">
                              {new Date(ticket.createdAt).toLocaleDateString('en-IN', {
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                          </div>
                        </div>

                        <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-2">
                          {ticket.subject || ticket.message?.slice(0, 50)}
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-neutral-400 mt-1 leading-relaxed">
                          {ticket.message}
                        </p>

                        {ticket.resolutionNotes && (
                          <div className="mt-3 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-xl">
                            <p className="text-xs font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              Official Resolution Note:
                            </p>
                            <p className="text-xs text-emerald-800 dark:text-emerald-400 mt-0.5">
                              {ticket.resolutionNotes}
                            </p>
                          </div>
                        )}

                        {/* Expand Responses / Conversation */}
                        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-neutral-800 flex items-center justify-between">
                          <button
                            onClick={() =>
                              setExpandedTicketId(isExpanded ? null : ticket._id || ticket.ticketId)
                            }
                            className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1 hover:underline"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            {ticket.responses?.length || 0} Responses & History
                            <ChevronRight
                              className={`w-3.5 h-3.5 transition-transform ${
                                isExpanded ? 'rotate-90' : ''
                              }`}
                            />
                          </button>
                        </div>

                        {/* Collapsible Timeline & Reply */}
                        {isExpanded && (
                          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-neutral-800 space-y-3 animate-in fade-in">
                            {ticket.responses && ticket.responses.length > 0 ? (
                              <div className="space-y-2.5">
                                {ticket.responses.map((resp, i) => (
                                  <div
                                    key={i}
                                    className={`p-3 rounded-xl text-xs ${
                                      resp.senderRole === 'SUPER_ADMIN' ||
                                      resp.senderRole === 'ADMIN_STAFF'
                                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 ml-4'
                                        : 'bg-slate-100 dark:bg-neutral-800 text-slate-800 dark:text-neutral-200 mr-4'
                                    }`}
                                  >
                                    <div className="flex items-center justify-between font-bold mb-1">
                                      <span className="text-[11px] text-emerald-800 dark:text-emerald-300">
                                        {resp.senderName} ({resp.senderRole})
                                      </span>
                                      <span className="text-[10px] text-slate-400">
                                        {new Date(resp.createdAt).toLocaleTimeString([], {
                                          hour: '2-digit',
                                          minute: '2-digit',
                                        })}
                                      </span>
                                    </div>
                                    <p className="leading-relaxed">{resp.message}</p>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-xs text-slate-500 italic">
                                No follow-up responses yet. Desk officer will review shortly.
                              </p>
                            )}

                            {/* Reply Input Box */}
                            <div className="flex gap-2 pt-2">
                              <input
                                type="text"
                                placeholder="Type a follow-up message to the support officer..."
                                value={replyMessage}
                                onChange={(e) => setReplyMessage(e.target.value)}
                                className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-neutral-700 dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                              />
                              <Button
                                size="sm"
                                variant="primary"
                                icon={Send}
                                loading={replySubmitting}
                                onClick={() => handlePostReply(ticket.ticketId || ticket._id)}
                              >
                                Send
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          )}

          {/* Tab 3: FAQs Knowledgebase */}
          {activeTab === 'FAQS' && (
            <Card className="p-6 border border-slate-200 dark:border-neutral-800 dark:bg-neutral-900 shadow-sm space-y-4">
              <div className="border-b border-slate-100 dark:border-neutral-800 pb-4">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-emerald-600" />
                  Frequently Asked Questions & Portal Guides
                </h2>
                <p className="text-xs text-slate-500 dark:text-neutral-400">
                  Quick answers for land registration, soil diagnostics, insurance claims, and wallet DBT transfers.
                </p>
              </div>

              <div className="space-y-3">
                {FAQS_LIST.map((faq, idx) => (
                  <div
                    key={idx}
                    className="border border-slate-200 dark:border-neutral-800 rounded-2xl overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                      className="w-full p-4 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-neutral-800/60 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                          {faq.cat}
                        </span>
                        <span>{faq.q}</span>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
                          openFaqIndex === idx ? 'rotate-180 text-emerald-600' : ''
                        }`}
                      />
                    </button>
                    {openFaqIndex === idx && (
                      <div className="px-4 pb-4 pt-1 text-xs text-slate-600 dark:text-neutral-300 leading-relaxed border-t border-slate-100 dark:border-neutral-800 bg-slate-50/50 dark:bg-neutral-800/30">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactPage;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  FileText,
  Receipt,
  Download,
  Printer,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  Sparkles,
  MapPin,
  FlaskConical,
  Trees,
  ShieldCheck,
  Calendar,
  X,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Landmark,
  BadgeCheck,
  Sprout,
  Award,
  Layers,
  Globe,
  Compass,
  FileCheck
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '../../../components/ui/Card.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { PageHeader } from '../../../components/ui/PageHeader.jsx';
import { TaxInvoiceQrCode } from '../../../components/ui/TaxInvoiceQrCode.jsx';
import { storageService } from '../../../services/storageService.js';
import { formatCurrency } from '../../../utils/formatters.js';
import { useToast } from '../../../components/ui/ToastContext.jsx';

export const FarmerReportsInvoicesPage = ({ isEmbedded = false }) => {
  const { user } = useSelector((state) => state.auth);
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'INVOICES' | 'SOIL' | 'GIS' | 'CARBON'
  const [searchQuery, setSearchQuery] = useState('');
  const [invoices, setInvoices] = useState([]);
  const [reports, setReports] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    const userIdentifier = user?.mobile || user?.id || user?._id || user?.name || null;
    const loadedInvoices = storageService.getInvoices(userIdentifier);
    const loadedReports = storageService.getReports(userIdentifier);
    setInvoices(loadedInvoices);
    setReports(loadedReports);
  }, [user]);

  const totalInvoicesAmount = invoices.reduce((acc, curr) => acc + (curr.grandTotal || curr.amount || 0), 0);
  const totalCarbonCredits = reports
    .filter((r) => r.category === 'Carbon Credits')
    .reduce((acc, curr) => acc + (curr.annualSequestration || 0), 0);

  const handlePrintModalInvoice = () => {
    const originalTitle = document.title;
    if (selectedInvoice?.invoiceNumber) {
      document.title = `BHUMICRED_Tax_Invoice_${selectedInvoice.invoiceNumber}`;
    }
    window.print();
    setTimeout(() => {
      document.title = originalTitle;
    }, 1000);
  };

  const handlePrintModalReport = () => {
    const originalTitle = document.title;
    if (selectedReport?.certId || selectedReport?.id) {
      document.title = `BHUMICRED_Official_Audit_${selectedReport.certId || selectedReport.id}`;
    }
    window.print();
    setTimeout(() => {
      document.title = originalTitle;
    }, 1000);
  };

  const filteredInvoices = invoices.filter((inv) => {
    const matchSearch =
      inv.invoiceNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.parcelName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.surveyNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.transactionId?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSearch;
  });

  const filteredReports = reports.filter((rep) => {
    const matchSearch =
      rep.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rep.parcel?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rep.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rep.certId?.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === 'SOIL') return matchSearch && rep.category === 'Soil Health';
    if (activeTab === 'GIS') return matchSearch && (rep.category === 'GIS & Land RoR' || rep.category === 'Tree Asset Audit');
    if (activeTab === 'CARBON') return matchSearch && rep.category === 'Carbon Credits';
    return matchSearch;
  });

  return (
    <div className={`space-y-6 ${isEmbedded ? '' : 'pb-12'}`}>
      {!isEmbedded && (
        <PageHeader
          title="Reports & Tax Invoices"
          subtitle="Access all official GST tax invoices, land cadastral GIS audits, and soil testing laboratory reports in one place."
          backTo="/farmer/dashboard"
          breadcrumbs={[
            { label: 'Farmer Portal', path: '/farmer/dashboard' },
            { label: 'Reports & Invoices' },
          ]}
        />
      )}

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-emerald-900 to-slate-900 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider">
              Total Invoices Paid
            </span>
            <Receipt className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="mt-2.5">
            <div className="text-xl font-black text-white">{formatCurrency(totalInvoicesAmount)}</div>
            <p className="text-[11px] text-emerald-200 mt-0.5">{invoices.length} Official GST Receipts</p>
          </div>
        </Card>

        <Card className="p-4 bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Verified Soil Reports
            </span>
            <div className="p-1.5 rounded-lg bg-sky-50 text-sky-700">
              <FlaskConical className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-xl font-black text-slate-900">
              {reports.filter((r) => r.category === 'Soil Health').length} Certified
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">12-Parameter NABL Diagnostic Cards</p>
          </div>
        </Card>

        <Card className="p-4 bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              GIS Cadastral Audits
            </span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
              <MapPin className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-xl font-black text-slate-900">
              {reports.filter((r) => r.category === 'GIS & Land RoR').length} Synced
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">ISRO 0.3m Satellite & Bhulekh RoR</p>
          </div>
        </Card>

        <Card className="p-4 bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Carbon Accreditations
            </span>
            <div className="p-1.5 rounded-lg bg-teal-50 text-teal-700">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-xl font-black text-slate-900">{totalCarbonCredits.toFixed(1)} tCO2e / yr</div>
            <p className="text-[11px] text-teal-700 font-semibold mt-0.5">IPCC VM0042 Verified Assets</p>
          </div>
        </Card>
      </div>

      {/* Filter Tabs & Search Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
        {/* Tab Switchers */}
        <div className="flex flex-wrap gap-1.5">
          {[
            { id: 'ALL', label: 'All Documents' },
            { id: 'INVOICES', label: 'Tax Invoices & Bills' },
            { id: 'SOIL', label: 'Soil Health Cards' },
            { id: 'GIS', label: 'GIS & Drone Audits' },
            { id: 'CARBON', label: 'Carbon Certificates' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search invoice #, survey, khasra..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white"
          />
        </div>
      </div>

      {/* 1. OFFICIAL TAX INVOICES SECTION */}
      {(activeTab === 'ALL' || activeTab === 'INVOICES') && (
        <Card className="overflow-hidden border border-slate-200 shadow-sm">
          <CardHeader
            title="Official GST Tax Invoices & Payment Receipts"
            subtitle="Download authentic signed invoices with ₹149/acre statutory fee breakdown & 4 verification QR codes"
            action={
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                {filteredInvoices.length} Invoices Found
              </span>
            }
          />
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              {filteredInvoices.length === 0 ? (
                <div className="text-center py-12 px-4 bg-slate-50/50">
                  <Receipt className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h4 className="text-sm font-bold text-slate-800">No Invoices Found</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                    Official GST invoices and receipts are automatically created when you register and map land parcels on BhumiCred.
                  </p>
                  <div className="mt-4">
                    <Link
                      to="/farmer/lands/add"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow transition-all"
                    >
                      Register New Land Parcel
                    </Link>
                  </div>
                </div>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 text-white uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Invoice No & Date</th>
                      <th className="py-3 px-4">Land Parcel / Service Scope</th>
                      <th className="py-3 px-3 text-center">Area</th>
                      <th className="py-3 px-4">Payment & Ref ID</th>
                      <th className="py-3 px-4 text-right">Grand Total (₹)</th>
                      <th className="py-3 px-3 text-center">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-800">
                    {filteredInvoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4">
                          <strong className="font-mono text-slate-950 block text-xs">{inv.invoiceNumber}</strong>
                          <span className="text-[11px] text-slate-500">{inv.invoiceDate} • {inv.invoiceTime || '12:00 PM'}</span>
                        </td>

                        <td className="py-3 px-4">
                          <strong className="text-slate-950 block">{inv.parcelName || 'Agricultural Parcel'}</strong>
                          <span className="text-[11px] text-slate-500">
                            Survey {inv.surveyNumber || '402/A'} • Khasra {inv.khasraNumber || '118/2'}
                          </span>
                        </td>

                        <td className="py-3 px-3 text-center font-mono font-semibold">
                          {inv.acres || 12.4} ac
                        </td>

                        <td className="py-3 px-4">
                          <span className="text-[11px] font-semibold text-slate-800 block">{inv.paymentMethod}</span>
                          <span className="text-[10px] font-mono text-emerald-800">{inv.transactionId}</span>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <strong className="font-mono text-slate-950 text-sm">
                            ₹{(inv.grandTotal || inv.amount || 0).toFixed(2)}
                          </strong>
                          <span className="text-[10px] text-slate-500 block">Inc. 18% GST</span>
                        </td>

                        <td className="py-3 px-3 text-center">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            PAID
                          </span>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setSelectedInvoice(inv)}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1 transition-all shadow-sm"
                              title="View full tax invoice with QR codes"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              View & Print
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 2. LAB REPORTS & AUDIT CERTIFICATES SECTION */}
      {(activeTab === 'ALL' || activeTab === 'SOIL' || activeTab === 'GIS' || activeTab === 'CARBON') && (
        <Card className="overflow-hidden border border-slate-200 shadow-sm">
          <CardHeader
            title="Scientific Lab Reports & Cadastral Audits"
            subtitle="Download Soil Health Cards, Drone LiDAR scans, and Carbon Credit verification certificates"
            action={
              <span className="text-xs font-bold text-sky-800 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-200">
                {filteredReports.length} Reports Available
              </span>
            }
          />
          <CardContent className="p-4 sm:p-6 space-y-4">
            {filteredReports.length === 0 ? (
              <div className="text-center py-10 px-4 bg-slate-50/50 rounded-2xl border border-slate-200">
                <FlaskConical className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-800">No Reports Available</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  Soil health cards and cadastral audit reports are linked directly to your registered land parcels.
                </p>
                <div className="mt-4">
                  <Link
                    to="/farmer/lands/add"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow transition-all"
                  >
                    Register Land Parcel
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredReports.map((rep) => (
                  <div
                    key={rep.id}
                    className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200 hover:border-emerald-300 transition-all space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-sm text-emerald-800">
                          {rep.category === 'Soil Health' ? (
                            <FlaskConical className="w-5 h-5 text-sky-600" />
                          ) : rep.category === 'Carbon Credits' ? (
                            <Sparkles className="w-5 h-5 text-teal-600" />
                          ) : (
                            <MapPin className="w-5 h-5 text-emerald-600" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.2 rounded border border-emerald-200">
                              {rep.category}
                            </span>
                            <span className="font-mono text-[10px] text-slate-500">{rep.certId}</span>
                          </div>
                          <h4 className="font-bold text-xs text-slate-900 mt-1 leading-snug">{rep.title}</h4>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0">
                        ✓ {rep.status}
                      </span>
                    </div>

                    {/* Parcel & Authority Meta */}
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-[11px] space-y-1">
                      <p><span className="text-slate-500">Target Parcel:</span> <strong className="text-slate-900">{rep.parcel}</strong></p>
                      <p><span className="text-slate-500">Issuing Authority:</span> <span className="text-slate-700">{rep.authority}</span></p>
                      <p><span className="text-slate-500">Audit Score / Vitality:</span> <strong className="text-emerald-800">{rep.score}</strong></p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-1 text-xs">
                      <span className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> Issued: {rep.issuedDate}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedReport(rep)}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1 transition-all shadow-sm"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View Certificate
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedReport(rep);
                            setTimeout(() => {
                              handlePrintModalReport();
                            }, 400);
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1 transition-all shadow-sm"
                        >
                          <Download className="w-3.5 h-3.5" />
                          PDF
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* INTERACTIVE FULL OFFICIAL TAX INVOICE MODAL (WITH 4 QR CODES & PRINT CAPABILITY) */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full border border-slate-200 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
            {/* Modal Top Control Bar (Hidden in Print) */}
            <div className="print:hidden p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="text-sm font-bold">Official Digital Tax Invoice & Receipt</h3>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Invoice #{selectedInvoice.invoiceNumber} • Txn {selectedInvoice.transactionId}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrintModalInvoice}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow"
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
                <button
                  type="button"
                  onClick={handlePrintModalInvoice}
                  className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1"
                >
                  <Printer className="w-4 h-4" />
                  Print
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedInvoice(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 ml-2"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body: EXACT PRINTABLE A4 INVOICE */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1">
              <div
                id="tax-invoice-printable"
                className="bg-white rounded-2xl border-2 border-slate-900 p-5 text-slate-900 space-y-3.5 print:p-0 print:border-none print:shadow-none"
              >
                {/* Invoice Header */}
                <div className="flex flex-col sm:flex-row items-start justify-between gap-3 border-b-2 border-slate-900 pb-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-emerald-800 text-white font-black text-xs tracking-wider">
                        BHUMICRED
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-800">
                        Sovereign Agro-GIS & Carbon Credit Registry
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-600">
                      Department of Agriculture, Farmers Welfare & Land Administration • Govt. of Gujarat / India
                    </p>
                    <p className="text-[9px] font-mono text-slate-500">
                      GSTIN: <strong>24AABCB9821A1Z8</strong> • CIN: <strong>U01100GJ2026PTC098214</strong> • SAC: <strong>998313</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-3 sm:text-right self-stretch sm:self-auto bg-slate-50 sm:bg-transparent p-2 rounded-lg border sm:border-none border-slate-200">
                    <TaxInvoiceQrCode
                      value={`https://einvoice.gst.gov.in/verify/${selectedInvoice.invoiceNumber}?gstin=24AABCB9821A1Z8&amt=${selectedInvoice.grandTotal}`}
                      size={44}
                      badgeText="GST E-INVOICE"
                      badgeColor="bg-emerald-900 text-white"
                      label="IRN Tax QR"
                      subLabel="Govt GSTN Portal"
                      className="hidden sm:flex"
                    />
                    <div className="text-[11px] space-y-0.5">
                      <span className="inline-block px-2.5 py-0.5 rounded bg-emerald-800 text-white text-[10px] font-black uppercase tracking-wider">
                        Official Digital Tax Invoice
                      </span>
                      <p className="pt-1"><span className="text-slate-500">Invoice No:</span> <strong className="font-mono text-slate-950">{selectedInvoice.invoiceNumber}</strong></p>
                      <p><span className="text-slate-500">Date & Time:</span> <strong className="text-slate-900">{selectedInvoice.invoiceDate} • {selectedInvoice.invoiceTime || '12:00 PM'}</strong></p>
                      <p><span className="text-slate-500">Transaction ID:</span> <strong className="font-mono text-emerald-800">{selectedInvoice.transactionId}</strong></p>
                      <div className="pt-0.5">
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          ✓ PAID & VERIFIED
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Farmer & Land Particulars with Cadastral QR */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-300 text-[11px]">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-black uppercase tracking-wider text-emerald-900 border-b border-slate-200 pb-0.5 block">
                      Billed To / Applicant Farmer Particulars
                    </span>
                    <div className="pt-0.5 space-y-0.5 text-slate-700 leading-tight">
                      <p><span className="text-slate-500 w-24 inline-block">Farmer Name:</span> <strong className="text-slate-950">{user?.name || selectedInvoice.farmerName || 'Farmer'}</strong></p>
                      <p><span className="text-slate-500 w-24 inline-block">Father/Husband:</span> <strong className="text-slate-800">{user?.fatherName || selectedInvoice.fatherName || ''}</strong></p>
                      <p><span className="text-slate-500 w-24 inline-block">Mobile:</span> <span className="font-mono text-slate-800">{user?.mobile || selectedInvoice.mobile || ''}</span></p>
                      <p><span className="text-slate-500 w-24 inline-block">Email:</span> <span className="text-slate-800">{user?.email || selectedInvoice.email || 'farmer@bhumicred.gov.in'}</span></p>
                      <p><span className="text-slate-500 w-24 inline-block">Address:</span> <span className="text-slate-800">{user?.address ? `${user.address.gramPanchayat || user.address.city || ''}, ${user.address.district || ''}, ${user.address.state || ''}` : selectedInvoice.address || 'Anand, Gujarat'}</span></p>
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-[9px] font-black uppercase tracking-wider text-emerald-900 border-b border-slate-200 pb-0.5 block">
                      Registered Land Parcel & Verification Scope
                    </span>
                    <div className="pt-0.5 flex items-start justify-between gap-2">
                      <div className="space-y-0.5 text-slate-700 leading-tight flex-1 min-w-0">
                        <p><span className="text-slate-500 w-24 inline-block">Parcel Name:</span> <strong className="text-slate-950">{selectedInvoice.parcelName || 'Registered Plot'}</strong></p>
                        <p><span className="text-slate-500 w-24 inline-block">Survey/Khasra:</span> <strong className="font-mono text-emerald-800">Survey {selectedInvoice.surveyNumber || '402/A'} • Khasra {selectedInvoice.khasraNumber || '118/2'}</strong></p>
                        <p><span className="text-slate-500 w-24 inline-block">Total Land Area:</span> <strong className="text-slate-900 font-mono">{selectedInvoice.acres || 12.4} Acres</strong></p>
                        <p><span className="text-slate-500 w-24 inline-block">Rate Standard:</span> <span className="font-semibold text-emerald-800">₹149 / Acre (Statutory Fee)</span></p>
                        <p><span className="text-slate-500 w-24 inline-block">Payment Mode:</span> <span className="text-slate-800">{selectedInvoice.paymentMethod}</span></p>
                      </div>
                      <TaxInvoiceQrCode
                        value={`https://bhumicred.gov.in/gis/cadastral?survey=${selectedInvoice.surveyNumber}&khasra=${selectedInvoice.khasraNumber}&acres=${selectedInvoice.acres}&lat=22.5630&lng=72.9290`}
                        size={42}
                        badgeText="GIS CADASTRE"
                        badgeColor="bg-teal-800 text-white"
                        label="Parcel Map QR"
                        subLabel={`Survey ${selectedInvoice.surveyNumber}`}
                        showLabel={false}
                      />
                    </div>
                  </div>
                </div>

                {/* Itemized Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[11px] border border-slate-300 rounded-lg overflow-hidden">
                    <thead className="bg-slate-900 text-white uppercase text-[9px] tracking-wider">
                      <tr>
                        <th className="py-2 px-2.5 w-7 text-center border-r border-slate-700">#</th>
                        <th className="py-2 px-3 border-r border-slate-700">Service / Fee Description</th>
                        <th className="py-2 px-2.5 text-center border-r border-slate-700">Rate/Acre</th>
                        <th className="py-2 px-2.5 text-center border-r border-slate-700">Area</th>
                        <th className="py-2 px-3 text-right">Taxable Amount (₹)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-800">
                      <tr className="hover:bg-slate-50/50">
                        <td className="py-2 px-2.5 text-center font-bold text-slate-500 border-r border-slate-200">1</td>
                        <td className="py-2 px-3 border-r border-slate-200">
                          <strong className="block text-slate-950">Soil Testing & Nutrient Laboratory Analysis</strong>
                          <span className="text-[9px] text-slate-500">N-P-K, pH, Organic Carbon & Micro-Nutrient Mapping</span>
                        </td>
                        <td className="py-2 px-2.5 text-center font-mono font-semibold border-r border-slate-200">₹49.00</td>
                        <td className="py-2 px-2.5 text-center font-mono border-r border-slate-200">{selectedInvoice.acres || 12.4} ac</td>
                        <td className="py-2 px-3 text-right font-mono font-bold">₹{(selectedInvoice.soilTesting || 607.6).toFixed(2)}</td>
                      </tr>
                      <tr className="hover:bg-slate-50/50">
                        <td className="py-2 px-2.5 text-center font-bold text-slate-500 border-r border-slate-200">2</td>
                        <td className="py-2 px-3 border-r border-slate-200">
                          <strong className="block text-slate-950">GIS Cadastral Polygon & Drone Field Inspection</strong>
                          <span className="text-[9px] text-slate-500">Satellite boundary verification & geotagged vertex inspection</span>
                        </td>
                        <td className="py-2 px-2.5 text-center font-mono font-semibold border-r border-slate-200">₹50.00</td>
                        <td className="py-2 px-2.5 text-center font-mono border-r border-slate-200">{selectedInvoice.acres || 12.4} ac</td>
                        <td className="py-2 px-3 text-right font-mono font-bold">₹{(selectedInvoice.inspection || 620.0).toFixed(2)}</td>
                      </tr>
                      <tr className="hover:bg-slate-50/50">
                        <td className="py-2 px-2.5 text-center font-bold text-slate-500 border-r border-slate-200">3</td>
                        <td className="py-2 px-3 border-r border-slate-200">
                          <strong className="block text-slate-950">Carbon Credit Generator & Registry Tokenization</strong>
                          <span className="text-[9px] text-slate-500">Agroforestry carbon sequestration baseline estimation</span>
                        </td>
                        <td className="py-2 px-2.5 text-center font-mono font-semibold border-r border-slate-200">₹35.00</td>
                        <td className="py-2 px-2.5 text-center font-mono border-r border-slate-200">{selectedInvoice.acres || 12.4} ac</td>
                        <td className="py-2 px-3 text-right font-mono font-bold">₹{(selectedInvoice.carbonCredit || 434.0).toFixed(2)}</td>
                      </tr>
                      <tr className="hover:bg-slate-50/50">
                        <td className="py-2 px-2.5 text-center font-bold text-slate-500 border-r border-slate-200">4</td>
                        <td className="py-2 px-3 border-r border-slate-200">
                          <strong className="block text-slate-950">Application Processing, Title Deed & File Documentation</strong>
                          <span className="text-[9px] text-slate-500">E-filing desk assessment, 7/12 & Pawti legal audit</span>
                        </td>
                        <td className="py-2 px-2.5 text-center font-mono font-semibold border-r border-slate-200">₹15.00</td>
                        <td className="py-2 px-2.5 text-center font-mono border-r border-slate-200">{selectedInvoice.acres || 12.4} ac</td>
                        <td className="py-2 px-3 text-right font-mono font-bold">₹{(selectedInvoice.fileCharges || 186.0).toFixed(2)}</td>
                      </tr>

                      {(selectedInvoice.optInsurance || selectedInvoice.treeInsuranceAmount) && (
                        <tr className="hover:bg-slate-50/50 bg-emerald-50/30">
                          <td className="py-2 px-2.5 text-center font-bold text-emerald-800 border-r border-slate-200">5</td>
                          <td className="py-2 px-3 border-r border-slate-200">
                            <strong className="block text-slate-950">
                              Tree Asset Insurance Policy ({selectedInvoice.insurancePlan || 'Custom Sovereign Tree Shield @ ₹31/tree/year'})
                            </strong>
                            <span className="text-[9px] text-emerald-700 font-semibold">
                              4-5 Angle Biometric Geotagged Tree Verification • {selectedInvoice.treePhotosCount || 5} Angles Attached
                            </span>
                          </td>
                          <td className="py-2 px-2.5 text-center font-mono font-semibold border-r border-slate-200 text-emerald-900">
                            ₹{(selectedInvoice.insuranceRatePerTree || 31).toFixed(2)} / tree
                          </td>
                          <td className="py-2 px-2.5 text-center font-mono border-r border-slate-200 font-semibold">
                            {selectedInvoice.insuredTreeCount || selectedInvoice.treeCount || 4} Insured Trees
                          </td>
                          <td className="py-2 px-3 text-right font-mono font-black text-emerald-950">
                            ₹{(selectedInvoice.treeInsuranceAmount || (Number(selectedInvoice.insuredTreeCount || selectedInvoice.treeCount || 4) * (selectedInvoice.insuranceRatePerTree || 31))).toFixed(2)}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Totals & UPI Settlement QR */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-3 border-t border-slate-300 pt-2.5">
                  <div className="space-y-1.5 max-w-sm text-[10px] text-slate-600">
                    <TaxInvoiceQrCode
                      value={`upi://pay?pa=bhumicred@sbi&pn=BHUMICRED_REGISTRY&am=${selectedInvoice.grandTotal}&tr=${selectedInvoice.transactionId}&cu=INR`}
                      size={48}
                      badgeText="UPI / RBI TREASURY"
                      badgeColor="bg-blue-900 text-white"
                      label="Treasury Settlement QR"
                      subLabel={`Ref: ${selectedInvoice.transactionId} • Verified`}
                    />
                    <p className="text-[9px] text-slate-500 italic">
                      * Land charges calculated at ₹149/ac + Tree insurance at ₹{selectedInvoice.insuranceRatePerTree || 31}/tree/year + 18% GST (CGST 9% + SGST 9%).
                    </p>
                  </div>

                  <div className="w-full sm:w-64 bg-slate-50 rounded-lg p-2.5 border border-slate-300 text-[11px] space-y-1">
                    <div className="flex justify-between text-slate-700">
                      <span>Land Statutory Fee (₹149/ac):</span>
                      <span className="font-mono">₹{(selectedInvoice.landSubtotal || (selectedInvoice.acres ? selectedInvoice.acres * 149 : 1847.6)).toFixed(2)}</span>
                    </div>
                    {(selectedInvoice.optInsurance || selectedInvoice.treeInsuranceAmount) && (
                      <div className="flex justify-between text-emerald-800 font-medium">
                        <span>Tree Insurance ({selectedInvoice.insuredTreeCount || selectedInvoice.treeCount || 4} Trees @ ₹{selectedInvoice.insuranceRatePerTree || 31}/yr):</span>
                        <span className="font-mono font-bold">₹{(selectedInvoice.treeInsuranceAmount || (Number(selectedInvoice.insuredTreeCount || selectedInvoice.treeCount || 4) * (selectedInvoice.insuranceRatePerTree || 31))).toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-slate-900 font-bold border-t border-slate-200 pt-0.5">
                      <span>Taxable Subtotal:</span>
                      <strong className="font-mono">₹{(selectedInvoice.subtotal || 1847.6).toFixed(2)}</strong>
                    </div>
                    <div className="flex justify-between text-slate-600 text-[10px]">
                      <span>Central GST (CGST @ 9%):</span>
                      <span className="font-mono">₹{(selectedInvoice.cgst || 166.28).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-600 text-[10px]">
                      <span>State GST (SGST @ 9%):</span>
                      <span className="font-mono">₹{(selectedInvoice.sgst || 166.28).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-700 border-t border-slate-200 pt-0.5 font-semibold text-[10px]">
                      <span>Total GST (18%):</span>
                      <span className="font-mono">₹{(selectedInvoice.gstTotal || 332.57).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xs font-black text-emerald-900 bg-emerald-100 p-1.5 rounded border border-emerald-300 mt-0.5">
                      <span>Grand Total Paid:</span>
                      <span className="font-mono text-sm">₹{(selectedInvoice.grandTotal || 2180.17).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Digital Signature & Seal */}
                <div className="flex flex-col sm:flex-row justify-between items-end gap-2 border-t border-slate-300 pt-2.5 text-[10px] text-slate-500">
                  <div>
                    <p className="font-bold text-slate-800">BHUMICRED Sovereign Agricultural Registry</p>
                    <p className="text-[9px]">Authorized Digital Registrar • State Revenue Liaison Bureau</p>
                  </div>
                  <div className="flex items-center gap-2.5 text-right">
                    <TaxInvoiceQrCode
                      value={`https://bhumicred.gov.in/cert/security?cert=BC-TAX-AUTH-2026-9810&inv=${selectedInvoice.invoiceNumber}&seal=0x9f8e`}
                      size={38}
                      badgeText="DIGITAL SEAL"
                      badgeColor="bg-emerald-800 text-white"
                      label="Security Seal QR"
                      subLabel="CERT-ID: BC-TAX-AUTH-2026-9810"
                      showLabel={false}
                    />
                    <div>
                      <div className="font-serif italic font-bold text-slate-800 text-xs">Digitally Signed & Certified</div>
                      <p className="text-[9px] font-mono text-emerald-700">CERT-ID: BC-TAX-AUTH-2026-9810</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* INTERACTIVE FULL OFFICIAL SCIENTIFIC REPORT / CADASTRAL AUDIT MODAL */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full border border-slate-200 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
            {/* Modal Header Controls (Hidden in Print) */}
            <div className="print:hidden p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <Award className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="text-sm font-bold">{selectedReport.title}</h3>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Certificate ID: {selectedReport.certId || selectedReport.id} • Issued {selectedReport.issuedDate}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrintModalReport}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow"
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
                <button
                  type="button"
                  onClick={handlePrintModalReport}
                  className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1"
                >
                  <Printer className="w-4 h-4" />
                  Print
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedReport(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 ml-2"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body: AUTHENTIC PRINTABLE CERTIFICATE */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 text-slate-900">
              <div className="border-4 border-double border-emerald-800 p-5 sm:p-7 rounded-2xl bg-gradient-to-b from-emerald-50/20 via-white to-slate-50/30 space-y-4 print:p-0 print:border-none print:shadow-none">
                {/* Certificate Emblem & Top Banner */}
                <div className="text-center border-b-2 border-emerald-800 pb-4">
                  <div className="inline-flex items-center justify-center p-2 rounded-full bg-emerald-100 text-emerald-800 mb-1.5">
                    {selectedReport.category === 'Soil Health' ? (
                      <FlaskConical className="w-7 h-7" />
                    ) : selectedReport.category === 'Carbon Credits' ? (
                      <Sparkles className="w-7 h-7" />
                    ) : selectedReport.category === 'Tree Asset Audit' ? (
                      <Trees className="w-7 h-7" />
                    ) : (
                      <MapPin className="w-7 h-7" />
                    )}
                  </div>
                  <h2 className="text-lg sm:text-xl font-black text-emerald-950 uppercase tracking-tight">
                    {selectedReport.category === 'Soil Health'
                      ? 'National Soil Health Diagnostic Card & Nutrient Profile'
                      : selectedReport.category === 'Carbon Credits'
                      ? 'National Agroforestry Carbon Credit Sequestration Certificate'
                      : selectedReport.category === 'Tree Asset Audit'
                      ? 'Biometric Tree Asset & Multi-Angle Canopy Vitality Audit'
                      : 'High-Resolution Satellite GIS Cadastral Boundary Audit'}
                  </h2>
                  <p className="text-xs font-semibold text-emerald-800 mt-0.5">
                    BHUMICRED Sovereign Agricultural Registry • {selectedReport.authority}
                  </p>
                  <div className="inline-block mt-2 px-3 py-0.5 bg-emerald-900 text-white rounded-full text-[11px] font-mono font-bold tracking-wider">
                    REGISTRATION CERTIFICATE • {selectedReport.certId || selectedReport.id}
                  </div>
                </div>

                {/* Farmer & Land Particulars Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <div>
                    <span className="text-slate-500 font-medium block text-[10px]">Farmer / Applicant:</span>
                    <strong className="text-slate-900">{selectedReport.ownerName || user?.name || 'Citizen Farmer'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium block text-[10px]">Survey & Khasra:</span>
                    <strong className="text-slate-900">Survey {selectedReport.surveyNumber || '108/A'} • Khasra {selectedReport.khasraNumber || '412/9'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium block text-[10px]">Land Area:</span>
                    <strong className="text-emerald-900 font-mono">{selectedReport.areaAcres || 5} Acres ({selectedReport.areaHectares || 2.02} Ha)</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium block text-[10px]">Location / Village:</span>
                    <span className="text-slate-700">{selectedReport.location || 'Navli, Anand, Gujarat'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium block text-[10px]">Audit Status:</span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800">
                      ✓ {selectedReport.status}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium block text-[10px]">Date of Certification:</span>
                    <span className="font-mono text-slate-700">{selectedReport.issuedDate}</span>
                  </div>
                </div>

                {/* 1. SOIL HEALTH DIAGNOSTIC CARD VIEW */}
                {selectedReport.category === 'Soil Health' && selectedReport.parameters && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                      <FlaskConical className="w-4 h-4 text-emerald-700" />
                      12-Parameter Chemical & Nutrient Profile (NABL Standard)
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left border border-slate-300 rounded-lg overflow-hidden">
                        <thead className="bg-emerald-900 text-white font-bold text-[10px] uppercase">
                          <tr>
                            <th className="p-2 border-r border-emerald-800">Nutrient Parameter</th>
                            <th className="p-2 border-r border-emerald-800">Observed Value</th>
                            <th className="p-2 border-r border-emerald-800">Standard Benchmarks</th>
                            <th className="p-2">Rating & Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 text-slate-800 bg-white">
                          <tr>
                            <td className="p-2 font-medium border-r">Soil Reaction (pH)</td>
                            <td className="p-2 font-bold font-mono border-r">{selectedReport.parameters.ph}</td>
                            <td className="p-2 text-slate-500 border-r">6.5 - 7.5</td>
                            <td className="p-2 text-emerald-700 font-semibold">Optimal Neutral</td>
                          </tr>
                          <tr>
                            <td className="p-2 font-medium border-r">Electrical Conductivity (EC)</td>
                            <td className="p-2 font-bold font-mono border-r">{selectedReport.parameters.ec}</td>
                            <td className="p-2 text-slate-500 border-r">&lt; 1.0 dS/m</td>
                            <td className="p-2 text-emerald-700 font-semibold">Normal (Non-Saline)</td>
                          </tr>
                          <tr>
                            <td className="p-2 font-medium border-r">Organic Carbon (OC)</td>
                            <td className="p-2 font-bold font-mono border-r">{selectedReport.parameters.oc}</td>
                            <td className="p-2 text-slate-500 border-r">&gt; 0.75%</td>
                            <td className="p-2 text-emerald-700 font-semibold">High / Carbon Rich</td>
                          </tr>
                          <tr>
                            <td className="p-2 font-medium border-r">Available Nitrogen (N)</td>
                            <td className="p-2 font-bold font-mono border-r">{selectedReport.parameters.nitrogen}</td>
                            <td className="p-2 text-slate-500 border-r">280 - 560 kg/ha</td>
                            <td className="p-2 text-blue-700 font-semibold">Medium Adequate</td>
                          </tr>
                          <tr>
                            <td className="p-2 font-medium border-r">Available Phosphorus (P)</td>
                            <td className="p-2 font-bold font-mono border-r">{selectedReport.parameters.phosphorus}</td>
                            <td className="p-2 text-slate-500 border-r">14 - 28 kg/ha</td>
                            <td className="p-2 text-emerald-700 font-semibold">High Fertility</td>
                          </tr>
                          <tr>
                            <td className="p-2 font-medium border-r">Available Potassium (K)</td>
                            <td className="p-2 font-bold font-mono border-r">{selectedReport.parameters.potassium}</td>
                            <td className="p-2 text-slate-500 border-r">150 - 300 kg/ha</td>
                            <td className="p-2 text-emerald-700 font-semibold">High</td>
                          </tr>
                          <tr>
                            <td className="p-2 font-medium border-r">Available Zinc (Zn) & Iron (Fe)</td>
                            <td className="p-2 font-bold font-mono border-r">{selectedReport.parameters.zinc} • {selectedReport.parameters.iron}</td>
                            <td className="p-2 text-slate-500 border-r">&gt; 0.6 ppm</td>
                            <td className="p-2 text-emerald-700 font-semibold">Adequate</td>
                          </tr>
                          <tr>
                            <td className="p-2 font-medium border-r">Manganese (Mn) & Boron (B)</td>
                            <td className="p-2 font-bold font-mono border-r">{selectedReport.parameters.manganese} • {selectedReport.parameters.boron}</td>
                            <td className="p-2 text-slate-500 border-r">&gt; 0.5 ppm</td>
                            <td className="p-2 text-emerald-700 font-semibold">Normal</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs">
                      <span className="font-bold text-emerald-950 block mb-0.5">🌾 Scientific Agronomist Advisory & Dosage:</span>
                      <p className="text-slate-700 leading-relaxed">{selectedReport.recommendation}</p>
                    </div>
                  </div>
                )}

                {/* 2. CADASTRAL GIS AUDIT VIEW */}
                {selectedReport.category === 'GIS & Land RoR' && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                      <Compass className="w-4 h-4 text-emerald-700" />
                      Satellite GIS Cadastral Vertex & Perimeter Analysis
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1.5">
                        <span className="font-bold text-slate-900 block border-b border-slate-100 pb-1">🛰️ Geodetic & Remote Sensing Meta:</span>
                        <p><span className="text-slate-500">Satellite Sensor:</span> <strong className="text-slate-800">{selectedReport.satelliteResolution}</strong></p>
                        <p><span className="text-slate-500">Total Perimeter:</span> <strong className="font-mono text-emerald-800">{selectedReport.boundaryPerimeter}</strong></p>
                        <p><span className="text-slate-500">Bhulekh RoR 7/12 Sync:</span> <strong className="font-mono text-slate-800">{selectedReport.bhulekhSyncId}</strong></p>
                        <p><span className="text-slate-500">Elevation:</span> <span className="text-slate-700">{selectedReport.elevation}</span></p>
                        <p><span className="text-slate-500">Dispute & Overlap:</span> <span className="font-bold text-emerald-700">{selectedReport.disputeStatus}</span></p>
                      </div>

                      <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1.5">
                        <span className="font-bold text-slate-900 block border-b border-slate-100 pb-1">📍 4 Geo-Corner GPS Boundary Vertices:</span>
                        <div className="space-y-1 font-mono text-[11px] text-slate-800">
                          {selectedReport.geoCorners?.map((c, idx) => (
                            <div key={idx} className="flex justify-between py-0.5 border-b border-slate-50 last:border-none">
                              <span className="font-bold text-slate-600">{c.label}:</span>
                              <span>{c.lat}, {c.lng}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. CARBON CREDIT CERTIFICATE VIEW */}
                {selectedReport.category === 'Carbon Credits' && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-teal-900 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-teal-700" />
                      Agro-Ecosystem Carbon Sequestration & Asset Metrics
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                      <div className="p-3 bg-teal-50 rounded-xl border border-teal-200">
                        <span className="text-[10px] text-teal-800 uppercase font-bold">Annual Sequestration</span>
                        <div className="text-xl font-black text-teal-950 mt-1">{selectedReport.score}</div>
                        <span className="text-[10px] text-teal-700 font-medium">VM0042 Protocol</span>
                      </div>
                      <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                        <span className="text-[10px] text-emerald-800 uppercase font-bold">Carbon Tokens Ready</span>
                        <div className="text-xl font-black text-emerald-950 mt-1">{selectedReport.carbonTokens}</div>
                        <span className="text-[10px] text-emerald-700 font-medium">Verified On-Chain Asset</span>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-[10px] text-slate-600 uppercase font-bold">Estimated Market Value</span>
                        <div className="text-xl font-black text-slate-900 mt-1">{selectedReport.estimatedAssetValue}</div>
                        <span className="text-[10px] text-slate-500 font-medium">@ ₹1,200 / Token</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. TREE ASSET BIOMETRIC SCAN VIEW */}
                {selectedReport.category === 'Tree Asset Audit' && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                      <Trees className="w-4 h-4 text-emerald-700" />
                      Multi-Angle Biometric Tree Asset & Insurance Summary
                    </h4>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-slate-500 text-[10px] block">Insured Trees:</span>
                        <strong className="text-slate-900 text-sm">{selectedReport.insuredTreeCount}</strong>
                      </div>
                      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-slate-500 text-[10px] block">4-5 Angle GPS Scans:</span>
                        <strong className="text-emerald-800 text-sm">{selectedReport.treePhotosCount}</strong>
                      </div>
                      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-slate-500 text-[10px] block">Canopy Vitality:</span>
                        <strong className="text-emerald-800 text-sm">{selectedReport.score}</strong>
                      </div>
                      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-slate-500 text-[10px] block">Fungal / Pest Risk:</span>
                        <strong className="text-emerald-700 text-sm">{selectedReport.fungalPestRisk}</strong>
                      </div>
                    </div>
                  </div>
                )}

                {/* Verification Footer & QR Code */}
                <div className="mt-4 pt-3 border-t-2 border-emerald-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <TaxInvoiceQrCode
                      value={`https://bhumicred.gov.in/verify/${selectedReport.certId || selectedReport.id}?survey=${selectedReport.surveyNumber}&owner=${selectedReport.ownerName}`}
                      size={42}
                      badgeText="VERIFIED CERT"
                      badgeColor="bg-emerald-900 text-white"
                      label="Verification QR"
                      subLabel="BhumiCred Sovereign Registry"
                      showLabel={false}
                    />
                    <div>
                      <p className="font-mono text-[10px] text-slate-500">Tamper-Proof Verification ID</p>
                      <strong className="font-mono text-emerald-950 block">{selectedReport.certId || selectedReport.id}</strong>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800">
                        <ShieldCheck className="w-3.5 h-3.5" /> Digitally Sealed & Certified by Registrar
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="w-36 border-b border-dashed border-slate-400 pb-0.5 mb-0.5 font-serif text-xs italic font-bold text-slate-800">
                      Dr. Arvind Mehta
                    </div>
                    <p className="text-[10px] text-slate-600 font-medium">Head of Agronomy & Lab Quality</p>
                    <p className="text-[9px] text-slate-400">BhumiCred NABL Testing Bureau</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

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
  BadgeCheck
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
    const loadedInvoices = storageService.getInvoices();
    const loadedReports = storageService.getReports();
    setInvoices(loadedInvoices);
    setReports(loadedReports);
  }, []);

  const totalInvoicesAmount = invoices.reduce((acc, curr) => acc + (curr.grandTotal || curr.amount || 0), 0);

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
      rep.category?.toLowerCase().includes(searchQuery.toLowerCase());
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
            <p className="text-[11px] text-slate-500 mt-0.5">N-P-K & Micro-nutrient maps</p>
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
              {reports.filter((r) => r.category === 'GIS & Land RoR' || r.category === 'Tree Asset Audit').length} Synced
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">Bhulekh RoR & Drone verified</p>
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
            <div className="text-xl font-black text-slate-900">18.6 tCO2e / yr</div>
            <p className="text-[11px] text-teal-700 font-semibold mt-0.5">Minting Ready Token Asset</p>
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
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.2 rounded border border-emerald-200">
                          {rep.category}
                        </span>
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
                    <p><span className="text-slate-500">Issuing Lab:</span> <span className="text-slate-700">{rep.authority}</span></p>
                    <p><span className="text-slate-500">Audit Score / Vitality:</span> <strong className="text-emerald-800">{rep.score}</strong></p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-1 text-xs">
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> Issued: {rep.issuedDate}
                    </span>

                    <button
                      type="button"
                      onClick={() => {
                        toast.success(`Downloading ${rep.title} (${rep.fileSize})...`);
                        setTimeout(() => {
                          window.print();
                        }, 600);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download {rep.fileSize}
                    </button>
                  </div>
                </div>
              ))}
            </div>
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
    </div>
  );
};

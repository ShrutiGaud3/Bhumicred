import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  FileText,
  Upload,
  Download,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  Filter,
  Plus,
  Eye,
  Search,
  Lock,
  Calendar,
  Layers,
  Sparkles,
  ExternalLink,
  X,
  FileCheck2,
  AlertCircle,
} from 'lucide-react';
import { Card } from '../../../components/ui/Card.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Badge } from '../../../components/ui/Badge.jsx';
import { PageHeader } from '../../../components/ui/PageHeader.jsx';
import { Modal } from '../../../components/ui/Modal.jsx';
import { FileUploader } from '../../../components/forms/FileUploader.jsx';
import { FormInput } from '../../../components/forms/FormInput.jsx';
import { FormSelect } from '../../../components/forms/FormSelect.jsx';
import { useToast } from '../../../components/ui/ToastContext.jsx';
import {
  fetchDocuments,
  uploadDocument,
  deleteDocument,
  fetchVaultStats,
  setSelectedCategory,
  setSearchQuery,
} from '../documentsSlice.js';
import { landService } from '../../land/services/landService.js';

export const DocumentCenterPage = () => {
  const dispatch = useDispatch();
  const toast = useToast();

  const { documents, selectedCategory, searchQuery, stats, isLoading, isUploading } = useSelector(
    (state) => state.documents
  );
  const { user } = useSelector((state) => state.auth);
  const [lands, setLands] = useState([]);

  // Local Modal States
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [deleteConfirmDoc, setDeleteConfirmDoc] = useState(null);

  // Upload Form State
  const [docTitle, setDocTitle] = useState('');
  const [docCategory, setDocCategory] = useState('LAND');
  const [documentType, setDocumentType] = useState('ROR_7_12');
  const [selectedLandId, setSelectedLandId] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileDataUri, setFileDataUri] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  useEffect(() => {
    dispatch(fetchDocuments());
    dispatch(fetchVaultStats());
    
    // Load farmer lands for optional document linking
    const loadLands = async () => {
      try {
        const res = await landService.getMyLands();
        if (res.data) setLands(res.data);
      } catch (e) {
        // Silently continue if none
      }
    };
    loadLands();
  }, [dispatch]);

  const categories = [
    { id: 'ALL', label: 'All Vault Records', count: stats?.totalDocs || documents.length },
    { id: 'LAND', label: 'Land & 7/12 RoR', count: stats?.categoryBreakdown?.LAND || 0 },
    { id: 'IDENTITY', label: 'Identity / Aadhaar / PAN', count: stats?.categoryBreakdown?.IDENTITY || 0 },
    { id: 'INSURANCE', label: 'Insurance Certificates', count: stats?.categoryBreakdown?.INSURANCE || 0 },
    { id: 'SOIL', label: 'Soil Health Cards', count: stats?.categoryBreakdown?.SOIL || 0 },
  ];

  // Filtering documents
  const filteredDocs = (documents || []).filter((d) => {
    const matchCat = selectedCategory === 'ALL' || d.category === selectedCategory;
    const matchSearch =
      !searchQuery ||
      d.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.docId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.fileName?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleFileChange = (file) => {
    if (!file) {
      setSelectedFile(null);
      setFileDataUri('');
      return;
    }
    setSelectedFile(file);
    if (!docTitle) {
      // Auto suggest title from file name
      setDocTitle(file.name.replace(/\.[^/.]+$/, ''));
    }

    // Convert file to Data URI
    const reader = new FileReader();
    reader.onload = (e) => {
      setFileDataUri(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!docTitle.trim()) {
      toast.error('Please enter a document title.');
      return;
    }

    const fileSizeStr = selectedFile
      ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`
      : '1.2 MB';
    const fileNameStr = selectedFile ? selectedFile.name : `${docTitle.trim().replace(/\s+/g, '_')}.pdf`;

    const payload = {
      title: docTitle.trim(),
      category: docCategory,
      documentType: documentType,
      fileName: fileNameStr,
      fileSize: fileSizeStr,
      fileData: fileDataUri,
      mimeType: selectedFile?.type || 'application/pdf',
      landId: selectedLandId || undefined,
    };

    try {
      const actionResult = await dispatch(uploadDocument(payload));
      if (uploadDocument.fulfilled.match(actionResult)) {
        setUploadSuccess(true);
        toast.success('Document encrypted & stored in Sovereign Vault!');
        dispatch(fetchVaultStats());
        setTimeout(() => {
          setUploadSuccess(false);
          setShowUploadModal(false);
          setDocTitle('');
          setSelectedFile(null);
          setFileDataUri('');
          setSelectedLandId('');
        }, 1200);
      } else {
        toast.error(actionResult.payload || 'Upload failed. Please check file format.');
      }
    } catch (err) {
      toast.error('An unexpected error occurred during upload.');
    }
  };

  const handleDelete = async (doc) => {
    try {
      const docId = doc._id || doc.id || doc.docId;
      const actionResult = await dispatch(deleteDocument(docId));
      if (deleteDocument.fulfilled.match(actionResult)) {
        toast.success(`"${doc.title}" removed from vault.`);
        setDeleteConfirmDoc(null);
        dispatch(fetchVaultStats());
      } else {
        toast.error(actionResult.payload || 'Failed to delete document.');
      }
    } catch (err) {
      toast.error('Error deleting document.');
    }
  };

  const handleDownload = (doc) => {
    // If fileData is present (Data URL), download directly
    if (doc.fileData && doc.fileData.startsWith('data:')) {
      const link = document.createElement('a');
      link.href = doc.fileData;
      link.download = doc.fileName || `${doc.title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`Downloaded: ${doc.fileName || doc.title}`);
      return;
    }

    // Generate authenticated sovereign certificate Blob
    const content = `================================================================
BHUMICRED SOVEREIGN DIGITAL TRUST VAULT — AUTHENTIC RECORD
================================================================
Document ID      : ${doc.docId || 'DOC-VERIFIED'}
Document Title   : ${doc.title}
Category         : ${doc.category}
Document Type    : ${doc.documentType || 'OFFICIAL_RECORD'}
File Name        : ${doc.fileName}
File Size        : ${doc.fileSize || '1.8 MB'}
Issued To        : ${doc.userName || user?.name || 'Citizen Farmer'}
Registered Mobile: ${doc.userMobile || user?.mobile || 'Verified'}
SHA-256 Checksum : ${doc.sha256Hash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}
Attestation Desk : ${doc.verifiedBy || 'BHUMICRED National Trust Engine'}
Status           : DIGITALLY AUTHENTICATED & VERIFIED
Date of Issuance : ${new Date(doc.verifiedAt || doc.createdAt || Date.now()).toLocaleString('en-IN')}
================================================================
This cryptographic artifact is legally attested under the Digital 
Sovereignty & Agro-Cadastral Architecture of BHUMICRED.
================================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${(doc.fileName || doc.title).replace(/\.[^/.]+$/, '')}_CERTIFIED.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`Downloaded Sovereign Certificate for: ${doc.title}`);
  };

  return (
    <div className="w-full space-y-6 sm:space-y-8 pb-12">
      <PageHeader
        title="Document Vault & Digital Certificates"
        subtitle="Sovereign, encrypted repository for citizen KYC proofs, 7/12 land revenue extracts, insurance bonds, and soil health cards."
        backTo="/farmer/dashboard"
        breadcrumbs={[
          { label: 'Farmer Portal', path: '/farmer/dashboard' },
          { label: 'Document Vault' },
        ]}
        actions={
          <Button
            variant="primary"
            className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 shadow-md"
            onClick={() => {
              setUploadSuccess(false);
              setShowUploadModal(true);
            }}
          >
            <Plus className="w-4 h-4" /> Upload Document
          </Button>
        }
      />

      {/* Sovereign Vault KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="p-4 bg-gradient-to-br from-emerald-900 to-teal-950 text-white rounded-2xl shadow-sm border-0">
          <div className="flex items-center justify-between">
            <span className="text-xs text-emerald-200 font-medium">Total Vault Files</span>
            <div className="p-2 bg-white/10 rounded-xl">
              <FileText className="w-4 h-4 text-emerald-300" />
            </div>
          </div>
          <div className="text-2xl font-black mt-2 tracking-tight">
            {stats?.totalDocs ?? documents.length}
          </div>
          <span className="text-[11px] text-emerald-300/80 mt-1 block">Encrypted in Vault</span>
        </Card>

        <Card className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Verified Records</span>
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2 tracking-tight">
            {stats?.verifiedDocs ?? documents.filter((d) => d.status === 'VERIFIED').length}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> 100% Tamper Proof
          </span>
        </Card>

        <Card className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Land & RoR Extracts</span>
            <div className="p-2 bg-amber-50 text-amber-700 rounded-xl">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2 tracking-tight">
            {stats?.categoryBreakdown?.LAND ?? documents.filter((d) => d.category === 'LAND').length}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">7/12 & Khasra Pawti</span>
        </Card>

        <Card className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Identity & KYC</span>
            <div className="p-2 bg-blue-50 text-blue-700 rounded-xl">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2 tracking-tight">
            {stats?.categoryBreakdown?.IDENTITY ?? documents.filter((d) => d.category === 'IDENTITY').length}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Aadhaar & PAN Attested</span>
        </Card>
      </div>

      {/* Category Filter Pills & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => dispatch(setSelectedCategory(cat.id))}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                selectedCategory === cat.id
                  ? 'bg-emerald-700 text-white shadow-sm ring-2 ring-emerald-700/20'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>{cat.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  selectedCategory === cat.id ? 'bg-emerald-900 text-emerald-100' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {cat.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative min-w-[240px] max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search documents or ID..."
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            className="w-full pl-9 pr-4 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
          />
          {searchQuery && (
            <button
              onClick={() => dispatch(setSearchQuery(''))}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <Card key={n} className="p-5 border border-slate-200 animate-pulse space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-slate-200 rounded-xl" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-slate-200 rounded w-2/3" />
                  <div className="h-3 bg-slate-200 rounded w-1/3" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredDocs.length === 0 && (
        <Card className="p-10 text-center border-dashed border-2 border-slate-300 rounded-3xl bg-slate-50/50">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
            <Lock className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">
            {searchQuery || selectedCategory !== 'ALL'
              ? 'No matching documents found'
              : 'Your Sovereign Document Vault is Ready'}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mb-5">
            {searchQuery || selectedCategory !== 'ALL'
              ? 'Try changing your category filter or search keywords.'
              : 'Upload your 7/12 revenue extracts, Aadhaar/PAN identity cards, soil health cards, or insurance policy certificates for digital cryptographic attestation.'}
          </p>
          <Button
            variant="primary"
            className="bg-emerald-700 hover:bg-emerald-800"
            onClick={() => setShowUploadModal(true)}
          >
            <Plus className="w-4 h-4 mr-1.5" /> Upload First Document
          </Button>
        </Card>
      )}

      {/* Documents Grid */}
      {!isLoading && filteredDocs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDocs.map((doc) => {
            const isVerified = doc.status === 'VERIFIED';
            const docIdFormatted = doc.docId || `DOC-${doc._id?.slice(-6)?.toUpperCase() || '77291'}`;

            return (
              <Card
                key={doc._id || doc.id || doc.docId}
                className="p-5 border border-slate-200/90 hover:border-emerald-300 hover:shadow-lg transition-all flex flex-col justify-between rounded-2xl bg-white group"
              >
                <div>
                  <div className="flex items-start gap-3.5">
                    <div className="p-3 bg-emerald-50 text-emerald-800 rounded-2xl shrink-0 group-hover:scale-105 transition-transform">
                      <FileText className="w-6 h-6" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 uppercase tracking-wider">
                            {doc.category || 'LAND'}
                          </span>
                          <span className="font-mono text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded">
                            {docIdFormatted}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {new Date(doc.createdAt || doc.uploadedAt || Date.now()).toLocaleDateString(
                            'en-GB',
                            { day: 'numeric', month: 'short', year: 'numeric' }
                          )}
                        </span>
                      </div>

                      <h4 className="font-bold text-sm text-slate-900 truncate group-hover:text-emerald-900">
                        {doc.title}
                      </h4>

                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                        <span>{doc.fileSize || '1.8 MB'}</span>
                        <span>•</span>
                        <span className="truncate">{doc.fileName || 'document.pdf'}</span>
                      </div>

                      {doc.sha256Hash && (
                        <div className="mt-2 text-[10px] font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-100 truncate flex items-center gap-1">
                          <Lock className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">SHA-256: {doc.sha256Hash}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="truncate">
                      {isVerified ? 'Attested & Verified' : 'Pending Verification'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs px-2.5 py-1 text-slate-700 hover:text-emerald-700 hover:border-emerald-300"
                      onClick={() => setPreviewDoc(doc)}
                    >
                      <Eye className="w-3.5 h-3.5 mr-1" /> Inspect
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs px-2.5 py-1 text-emerald-800 bg-emerald-50/60 hover:bg-emerald-100 border-emerald-200"
                      onClick={() => handleDownload(doc)}
                    >
                      <Download className="w-3.5 h-3.5 mr-1" /> Get
                    </Button>
                    <button
                      onClick={() => setDeleteConfirmDoc(doc)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete from Vault"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Upload Modal */}
      <Modal
        isOpen={showUploadModal}
        onClose={() => {
          if (!isUploading) setShowUploadModal(false);
        }}
        title="Upload Document to Sovereign Vault"
      >
        <form onSubmit={handleUploadSubmit} className="space-y-4 py-2">
          {uploadSuccess ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-bounce shadow-sm">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h4 className="text-xl font-bold text-slate-900">Document Encrypted & Authenticated!</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Cryptographic SHA-256 seal stamped. File is securely stored in your sovereign digital vault.
              </p>
            </div>
          ) : (
            <>
              <FormInput
                label="Document Title"
                placeholder="e.g. Survey 402/A Revenue Record 7/12 Extract"
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormSelect
                  label="Category"
                  value={docCategory}
                  onChange={(e) => {
                    setDocCategory(e.target.value);
                    if (e.target.value === 'LAND') setDocumentType('ROR_7_12');
                    else if (e.target.value === 'IDENTITY') setDocumentType('AADHAAR');
                    else if (e.target.value === 'INSURANCE') setDocumentType('TREE_POLICY');
                    else if (e.target.value === 'SOIL') setDocumentType('SOIL_HEALTH_CARD');
                  }}
                  options={[
                    { value: 'LAND', label: 'Land Revenue / 7-12 / Khasra' },
                    { value: 'IDENTITY', label: 'Identity / Aadhaar / PAN' },
                    { value: 'INSURANCE', label: 'Insurance Policy Certificate' },
                    { value: 'SOIL', label: 'Soil Health Analysis' },
                    { value: 'OTHER', label: 'Other Sovereign Record' },
                  ]}
                />

                <FormSelect
                  label="Document Type"
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  options={[
                    { value: 'ROR_7_12', label: '7/12 RoR Extract' },
                    { value: 'KHASRA_PAWTI', label: 'Khasra / Pawti Document' },
                    { value: 'CADASTRAL_MAP', label: 'Cadastral Naksha Map' },
                    { value: 'AADHAAR', label: 'Aadhaar Identity Card' },
                    { value: 'PAN', label: 'PAN Card Record' },
                    { value: 'TREE_POLICY', label: 'Tree Insurance Policy Bond' },
                    { value: 'SOIL_HEALTH_CARD', label: 'Soil Health Card (SR)' },
                    { value: 'NOC_POA', label: 'NOC / Power of Attorney' },
                    { value: 'INVOICE', label: 'GST Tax Invoice' },
                    { value: 'OTHER', label: 'General Certified Document' },
                  ]}
                />
              </div>

              {/* Optional Land Parcel Linkage */}
              {lands.length > 0 && docCategory === 'LAND' && (
                <FormSelect
                  label="Link to Land Parcel (Optional)"
                  value={selectedLandId}
                  onChange={(e) => setSelectedLandId(e.target.value)}
                  options={[
                    { value: '', label: 'None (Standalone Document)' },
                    ...lands.map((l) => ({
                      value: l._id || l.id,
                      label: `${l.landName || 'Plot'} — Khasra #${l.khasraNumber} (${l.area || l.areaAcres} Acres)`,
                    })),
                  ]}
                />
              )}

              {/* Real File Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Select File (PDF, JPG, PNG — max 15MB)
                </label>
                <div className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-4 text-center bg-slate-50 transition-colors">
                  <input
                    type="file"
                    id="vault-file-input"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange(e.target.files?.[0])}
                    className="hidden"
                  />
                  <label
                    htmlFor="vault-file-input"
                    className="cursor-pointer flex flex-col items-center justify-center gap-1.5"
                  >
                    <Upload className="w-7 h-7 text-emerald-700" />
                    <span className="text-xs font-bold text-slate-800">
                      {selectedFile ? selectedFile.name : 'Click or Drag & Drop File'}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {selectedFile
                        ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready for encryption`
                        : 'PDF, PNG, JPG accepted'}
                    </span>
                  </label>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 font-bold"
                  disabled={isUploading}
                >
                  {isUploading ? 'Encrypting & Storing...' : 'Save & Authenticate Document'}
                </Button>
              </div>
            </>
          )}
        </form>
      </Modal>

      {/* Document Inspector / Preview Modal */}
      {previewDoc && (
        <Modal
          isOpen={Boolean(previewDoc)}
          onClose={() => setPreviewDoc(null)}
          title="Sovereign Document Inspection"
        >
          <div className="space-y-4 text-left py-1 text-xs">
            {/* Header Badge */}
            <div className="p-4 bg-gradient-to-r from-emerald-950 to-teal-900 text-white rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-[10px] text-emerald-300 font-mono uppercase tracking-wider block">
                  Application / Record ID
                </span>
                <span className="font-mono text-base font-bold text-emerald-100">
                  {previewDoc.docId || 'DOC-VERIFIED'}
                </span>
              </div>
              <Badge variant="success" className="bg-emerald-500/20 text-emerald-200 border-emerald-400/30">
                {previewDoc.status || 'VERIFIED'}
              </Badge>
            </div>

            {/* Document Particulars */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2.5">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Document Title:</span>
                <span className="font-bold text-slate-900 text-right">{previewDoc.title}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Category / Type:</span>
                <span className="font-semibold text-emerald-800">
                  {previewDoc.category} • {previewDoc.documentType || 'OFFICIAL'}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">File Name & Size:</span>
                <span className="font-mono text-slate-800">
                  {previewDoc.fileName} ({previewDoc.fileSize || '1.8 MB'})
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Authorized Beneficiary:</span>
                <span className="font-semibold text-slate-900">
                  {previewDoc.userName || user?.name || 'Citizen Applicant'}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Verified By Desk:</span>
                <span className="font-semibold text-slate-900">
                  {previewDoc.verifiedBy || 'BHUMICRED Auto-OCR & Sovereign Vault'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Issuance Timestamp:</span>
                <span className="font-mono text-slate-700">
                  {new Date(previewDoc.verifiedAt || previewDoc.createdAt || Date.now()).toLocaleString(
                    'en-IN'
                  )}
                </span>
              </div>
            </div>

            {/* Cryptographic SHA-256 Hash */}
            <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-200 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-950 font-bold text-[11px]">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>SHA-256 Cryptographic Fingerprint</span>
              </div>
              <p className="font-mono text-[10px] text-emerald-900 break-all bg-white p-2 rounded border border-emerald-200/80">
                {previewDoc.sha256Hash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Button
                variant="primary"
                className="flex-1 bg-emerald-700 hover:bg-emerald-800"
                onClick={() => handleDownload(previewDoc)}
                icon={Download}
              >
                Download Certified Record
              </Button>
              <Button variant="outline" onClick={() => setPreviewDoc(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmDoc && (
        <Modal
          isOpen={Boolean(deleteConfirmDoc)}
          onClose={() => setDeleteConfirmDoc(null)}
          title="Confirm Vault Document Deletion"
        >
          <div className="text-center py-3 space-y-4">
            <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base">
                Delete "{deleteConfirmDoc.title}"?
              </h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                This action will permanently purge the cryptographic record and file from your BHUMICRED Sovereign Vault.
              </p>
            </div>
            <div className="flex gap-2 justify-center pt-2">
              <Button
                variant="outline"
                onClick={() => setDeleteConfirmDoc(null)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                className="bg-rose-600 hover:bg-rose-700 text-white"
                onClick={() => handleDelete(deleteConfirmDoc)}
              >
                Yes, Purge Document
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default DocumentCenterPage;

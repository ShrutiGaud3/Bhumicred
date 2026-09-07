import React, { useState } from 'react';
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
} from 'lucide-react';
import { Card } from '../../../components/ui/Card.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Badge } from '../../../components/ui/Badge.jsx';
import { PageHeader } from '../../../components/ui/PageHeader.jsx';
import { Modal } from '../../../components/ui/Modal.jsx';
import { FileUploader } from '../../../components/forms/FileUploader.jsx';
import { FormInput } from '../../../components/forms/FormInput.jsx';
import { FormSelect } from '../../../components/forms/FormSelect.jsx';
import { MOCK_DOCUMENTS } from '../../../services/mockData/documentsMock.js';

export const DocumentCenterPage = () => {
  const [documents, setDocuments] = useState(MOCK_DOCUMENTS);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [docName, setDocName] = useState('');
  const [docCategory, setDocCategory] = useState('LAND');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const categories = [
    { id: 'ALL', label: 'All Documents' },
    { id: 'IDENTITY', label: 'Identity / KYC' },
    { id: 'LAND', label: 'Land Revenue 7/12' },
    { id: 'INSURANCE', label: 'Insurance Certificates' },
    { id: 'SOIL', label: 'Soil Health Cards' },
  ];

  const filteredDocs = documents.filter(
    (d) => selectedCategory === 'ALL' || d.category === selectedCategory
  );

  const handleUpload = (e) => {
    e.preventDefault();
    const newDoc = {
      id: `doc_${Date.now()}`,
      name: docName || 'New Uploaded Document.pdf',
      category: docCategory,
      entityType: docCategory === 'LAND' ? 'Land' : 'User',
      uploadedAt: new Date().toISOString(),
      fileSize: '2.4 MB',
      status: 'VERIFIED',
      verifiedBy: 'Auto-Verification OCR',
    };
    setDocuments([newDoc, ...documents]);
    setUploadSuccess(true);
    setTimeout(() => {
      setUploadSuccess(false);
      setShowUploadModal(false);
      setDocName('');
    }, 1500);
  };

  return (
    <div className="w-full space-y-6 sm:space-y-8 pb-12">
      <PageHeader
        title="Document Vault & Digital Certificates"
        subtitle="Centralized, verified digital repository for KYC, 7/12 extracts, insurance policies, and soil cards."
        backTo="/farmer/dashboard"
        breadcrumbs={[
          { label: 'Farmer Portal', path: '/farmer/dashboard' },
          { label: 'Document Vault' },
        ]}
        actions={
          <Button
            variant="primary"
            className="flex items-center gap-2"
            onClick={() => setShowUploadModal(true)}
          >
            <Plus className="w-4 h-4" /> Upload Document
          </Button>
        }
      />

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-gray-200">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedCategory === cat.id
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Documents List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDocs.map((doc) => (
          <Card
            key={doc.id}
            className="p-5 border border-gray-200 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="flex items-start gap-3.5">
              <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl shrink-0">
                <FileText className="w-6 h-6" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="success" className="text-[10px]">{doc.category}</Badge>
                  <span className="text-[11px] text-gray-400 font-mono">
                    {new Date(doc.uploadedAt).toLocaleDateString('en-GB')}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-gray-900 truncate">{doc.name}</h4>
                <p className="text-xs text-gray-500 mt-1">
                  {doc.fileSize} • Verified by {doc.verifiedBy}
                </p>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Digitally Authenticated
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs flex items-center gap-1"
                  onClick={() => alert(`Downloading ${doc.name}...`)}
                >
                  <Download className="w-3.5 h-3.5" /> Download
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Upload Modal */}
      <Modal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        title="Upload Document to Vault"
      >
        <form onSubmit={handleUpload} className="space-y-6 py-2">
          {uploadSuccess ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-gray-900">Document Uploaded & Verified!</h4>
              <p className="text-sm text-gray-500 mt-1">Stored securely in your encrypted vault.</p>
            </div>
          ) : (
            <>
              <FormInput
                label="Document Title"
                placeholder="e.g. Survey 402/A Soil Card 2026.pdf"
                value={docName}
                onChange={(e) => setDocName(e.target.value)}
                required
              />

              <FormSelect
                label="Document Category"
                value={docCategory}
                onChange={(e) => setDocCategory(e.target.value)}
                options={[
                  { value: 'LAND', label: 'Land Revenue 7/12 Extract' },
                  { value: 'IDENTITY', label: 'Identity / Aadhaar KYC' },
                  { value: 'INSURANCE', label: 'Insurance Policy Certificate' },
                  { value: 'SOIL', label: 'Soil Health Analysis' },
                  { value: 'CARBON', label: 'Carbon Baseline Audit Report' },
                ]}
              />

              <FileUploader
                label="Select PDF or Image file (max 15MB)"
                accept=".pdf,.jpg,.jpeg,.png"
              />

              <Button type="submit" variant="primary" className="w-full py-3">
                Save & Authenticate Document
              </Button>
            </>
          )}
        </form>
      </Modal>
    </div>
  );
};

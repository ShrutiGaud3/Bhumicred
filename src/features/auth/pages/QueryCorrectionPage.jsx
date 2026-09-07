import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileQuestion, UploadCloud, CheckCircle2, ArrowRight } from 'lucide-react';
import { Card } from '../../../components/ui/Card.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { FormTextarea } from '../../../components/forms/FormTextarea.jsx';
import { FileUploader } from '../../../components/forms/FileUploader.jsx';

export const QueryCorrectionPage = () => {
  const navigate = useNavigate();
  const [responseNotes, setResponseNotes] = useState('');
  const [file, setFile] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      navigate('/verification-pending');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <FileQuestion className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Admin Clarification Required</h2>
        <p className="text-xs text-slate-500 mt-1">
          Please respond to the reviewer's query and upload corrected documents.
        </p>
      </div>

      {/* Admin Remarks Notice */}
      <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-left space-y-1">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-800">
          Reviewer Query Remarks
        </span>
        <p className="text-xs text-rose-900 font-medium leading-relaxed">
          "The uploaded 7/12 land revenue certificate copy is blurry around the Khasra boundary stamps. Please upload a clear scanned PDF."
        </p>
      </div>

      {isSubmitted ? (
        <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2 animate-in fade-in">
          <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
          <h3 className="text-sm font-bold text-emerald-900">Correction Re-Submitted Successfully</h3>
          <p className="text-xs text-emerald-700">Redirecting to status desk...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <FileUploader
            label="Upload Clear Scanned Document"
            required
            onFileSelect={setFile}
          />

          <FormTextarea
            label="Explanation / Clarification Remarks"
            name="notes"
            rows={3}
            value={responseNotes}
            onChange={(e) => setResponseNotes(e.target.value)}
            placeholder="Add any clarifying remarks for the verification desk..."
          />

          <Button type="submit" variant="primary" size="lg" className="w-full" icon={ArrowRight}>
            Re-Submit for Approval
          </Button>
        </form>
      )}
    </div>
  );
};

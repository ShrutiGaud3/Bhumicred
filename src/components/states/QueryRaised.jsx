import React from 'react';
import { HelpCircle, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button.jsx';

export const QueryRaised = ({
  queryRemarks = 'The uploaded survey number document is blurry. Please re-upload a clear scanned copy.',
  onResolve,
}) => {
  return (
    <div className="max-w-xl mx-auto my-8 p-8 bg-white rounded-3xl border border-rose-200 shadow-xl text-center">
      <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-5">
        <HelpCircle className="w-8 h-8" />
      </div>
      <span className="inline-block px-3 py-1 bg-rose-100 text-rose-800 text-xs font-bold rounded-full uppercase tracking-wider mb-2">
        Action Required
      </span>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Admin Query Raised</h2>
      <p className="text-sm text-slate-600 mb-6">
        Our verification team reviewed your submission and requested additional clarification/documents.
      </p>

      <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100 text-left mb-6">
        <h4 className="text-xs font-bold text-rose-900 uppercase tracking-wider mb-1">
          Reviewer Remarks:
        </h4>
        <p className="text-sm text-rose-800 font-medium">{queryRemarks}</p>
      </div>

      {onResolve && (
        <Button onClick={onResolve} variant="primary" icon={ArrowRight}>
          Upload Correction / Respond
        </Button>
      )}
    </div>
  );
};

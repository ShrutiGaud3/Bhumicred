import React, { useState } from 'react';
import { UploadCloud, File, CheckCircle2, Trash2, Eye } from 'lucide-react';

export const FileUploader = ({
  label,
  accept = '.pdf,.jpg,.jpeg,.png',
  maxSizeMB = 10,
  helperText = 'Supported formats: PDF, PNG, JPG (up to 10MB)',
  onFileSelect,
  required = false,
  className = '',
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      if (onFileSelect) onFileSelect(file);
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    setSelectedFile(null);
    if (onFileSelect) onFileSelect(null);
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-neutral-200 mb-1.5">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      {!selectedFile ? (
        <label
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            if (e.dataTransfer.files?.[0]) {
              setSelectedFile(e.dataTransfer.files[0]);
              if (onFileSelect) onFileSelect(e.dataTransfer.files[0]);
            }
          }}
          className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
            isDragging
              ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30'
              : 'border-slate-300 dark:border-neutral-700 hover:border-emerald-500 hover:bg-slate-50/60 dark:hover:bg-neutral-800/60'
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mb-3 shadow-sm">
            <UploadCloud className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-slate-900 dark:text-white mb-0.5">
            Click to upload <span className="font-normal text-slate-500 dark:text-neutral-400">or drag and drop</span>
          </p>
          <p className="text-[11px] text-slate-400 dark:text-neutral-500">{helperText}</p>
          <input
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      ) : (
        <div className="flex items-center justify-between p-3.5 bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl">
          <div className="flex items-center gap-3 truncate">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
              <File className="w-4 h-4" />
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{selectedFile.name}</p>
              <p className="text-[10px] text-emerald-800 dark:text-emerald-300 font-semibold">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready for submission
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              type="button"
              onClick={handleRemove}
              className="p-1.5 text-slate-400 dark:text-neutral-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-neutral-800 rounded-lg transition-colors"
              title="Remove document"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

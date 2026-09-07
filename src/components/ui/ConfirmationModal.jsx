import React from 'react';
import { Modal } from './Modal.jsx';
import { Button } from './Button.jsx';
import { AlertTriangle, HelpCircle, CheckCircle } from 'lucide-react';

export const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed with this request?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'warning', // warning | danger | success
  isLoading = false,
}) => {
  const iconConfig = {
    warning: { icon: AlertTriangle, bg: 'bg-amber-100 text-amber-700', btn: 'secondary' },
    danger: { icon: AlertTriangle, bg: 'bg-rose-100 text-rose-600', btn: 'danger' },
    success: { icon: CheckCircle, bg: 'bg-emerald-100 text-emerald-700', btn: 'primary' },
  };

  const current = iconConfig[variant] || iconConfig.warning;
  const IconComponent = current.icon;

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md">
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-2xl flex-shrink-0 ${current.bg}`}>
          <IconComponent className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900">{title}</h3>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">{message}</p>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
        <Button variant="ghost" size="sm" onClick={onClose} disabled={isLoading}>
          {cancelText}
        </Button>
        <Button
          variant={current.btn}
          size="sm"
          onClick={onConfirm}
          isLoading={isLoading}
        >
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
};

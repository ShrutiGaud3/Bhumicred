import React from 'react';

export const FormSelect = ({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  error,
  required = false,
  disabled = false,
  className = '',
  ...props
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={name} className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-neutral-200 mb-1.5">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`block w-full rounded-xl border bg-white dark:bg-neutral-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${
          error
            ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200 dark:focus:ring-rose-900/40'
            : 'border-slate-300 dark:border-neutral-700 focus:border-emerald-600 dark:focus:border-emerald-500 focus:ring-emerald-100 dark:focus:ring-emerald-950/40'
        } ${disabled ? 'bg-slate-50 dark:bg-neutral-900 text-slate-500 dark:text-neutral-500 cursor-not-allowed' : ''}`}
        {...props}
      >
        <option value="" disabled className="dark:bg-neutral-800 dark:text-neutral-400">
          {placeholder}
        </option>
        {options.map((opt, idx) => (
          <option key={idx} value={typeof opt === 'object' ? opt.value : opt} className="dark:bg-neutral-800 dark:text-white">
            {typeof opt === 'object' ? opt.label : opt}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">{error}</p>}
    </div>
  );
};

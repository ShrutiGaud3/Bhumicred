import React from 'react';

export const FormInput = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
  helperText,
  icon: Icon,
  prefix,
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
      <div className="relative rounded-xl">
        {prefix ? (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
            <div className="flex items-center gap-1.5 pr-2.5 border-r border-slate-300 dark:border-neutral-700">
              {Icon && <Icon className="w-4 h-4 text-slate-400 dark:text-neutral-500 shrink-0" />}
              <span className="text-slate-700 dark:text-neutral-300 font-bold text-xs sm:text-sm select-none tracking-wide">{prefix}</span>
            </div>
          </div>
        ) : Icon ? (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-neutral-500">
            <Icon className="w-5 h-5" />
          </div>
        ) : null}
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          className={`block w-full rounded-xl border bg-white dark:bg-neutral-800 py-2.5 pr-3.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 transition-all ${
            prefix ? (Icon ? 'pl-[76px]' : 'pl-[56px]') : Icon ? 'pl-11' : 'px-3.5'
          } ${
            error
              ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200 dark:focus:ring-rose-900/40'
              : 'border-slate-300 dark:border-neutral-700 focus:border-emerald-600 dark:focus:border-emerald-500 focus:ring-emerald-100 dark:focus:ring-emerald-950/40'
          } ${disabled ? 'bg-slate-50 dark:bg-neutral-900 text-slate-500 dark:text-neutral-500 cursor-not-allowed' : ''}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">{error}</p>}
      {helperText && !error && <p className="mt-1 text-xs text-slate-500 dark:text-neutral-400">{helperText}</p>}
    </div>
  );
};


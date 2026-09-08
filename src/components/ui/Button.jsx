import React from 'react';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  icon: Icon,
  type = 'button',
  onClick,
  to,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed';

  const variants = {
    primary:
      'bg-emerald-700 hover:bg-emerald-800 text-white shadow-md shadow-emerald-900/10 focus:ring-emerald-600',
    secondary:
      'bg-amber-600 hover:bg-amber-700 text-white shadow-md shadow-amber-900/10 focus:ring-amber-500',
    outline:
      'border-2 border-emerald-700 text-emerald-800 hover:bg-emerald-50 focus:ring-emerald-600',
    ghost:
      'text-slate-700 hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-400',
    danger:
      'bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-900/10 focus:ring-rose-500',
    dark:
      'bg-slate-900 hover:bg-slate-800 text-white shadow-md focus:ring-slate-700',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3.5 text-base gap-2.5',
    xl: 'px-8 py-4 text-lg gap-3 font-semibold',
  };

  const combinedClasses = `${baseClasses} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`;

  const content = (
    <>
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current shrink-0" />
      ) : Icon ? (
        <Icon className="w-4 h-4 text-current shrink-0" />
      ) : null}
      {children}
    </>
  );

  if (to && !disabled && !isLoading) {
    return (
      <Link to={to} className={combinedClasses} onClick={onClick} {...props}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={combinedClasses}
      {...props}
    >
      {content}
    </button>
  );
};

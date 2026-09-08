import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Check, X, Plus } from 'lucide-react';

export const SearchableSelect = ({
  label,
  name,
  value,
  onChange,
  options = [], // Can be array of strings or array of { value, label }
  placeholder = 'Select an option...',
  searchPlaceholder = 'Type to search...',
  error,
  required = false,
  disabled = false,
  allowCustom = true,
  className = '',
  helperText,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef(null);
  const searchInputRef = useRef(null);

  // Normalize options to standard { value, label } format
  const normalizedOptions = options.map((opt) => {
    if (typeof opt === 'object' && opt !== null) {
      return { value: opt.value, label: opt.label || opt.value };
    }
    return { value: opt, label: opt };
  });

  // Filter options matching search query
  const filteredOptions = normalizedOptions.filter((opt) =>
    opt.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Selected option label
  const selectedOption = normalizedOptions.find((opt) => opt.value === value);
  const displayLabel = selectedOption ? selectedOption.label : value || '';

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('touchstart', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [isOpen]);

  // Focus search input on open
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSearchQuery('');
    }
  }, [isOpen]);

  const handleSelect = (val) => {
    if (onChange) {
      onChange({ target: { name, value: val } });
    }
    setIsOpen(false);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    if (onChange) {
      onChange({ target: { name, value: '' } });
    }
  };

  const handleUseCustomQuery = () => {
    if (searchQuery.trim()) {
      handleSelect(searchQuery.trim());
    }
  };

  const isExactMatch = normalizedOptions.some(
    (opt) => opt.label.toLowerCase() === searchQuery.trim().toLowerCase()
  );

  return (
    <div className={`w-full relative ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      {/* Main Trigger Button */}
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between rounded-xl border bg-white px-3.5 py-2.5 text-sm cursor-pointer transition-all ${
          error
            ? 'border-rose-400 ring-2 ring-rose-100'
            : isOpen
            ? 'border-emerald-600 ring-2 ring-emerald-100 shadow-sm'
            : 'border-slate-300 hover:border-slate-400'
        } ${disabled ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : ''}`}
      >
        <span
          className={`truncate pr-2 ${
            displayLabel ? 'text-slate-900 font-medium' : 'text-slate-400'
          }`}
        >
          {displayLabel || placeholder}
        </span>

        <div className="flex items-center gap-1.5 shrink-0 text-slate-400">
          {displayLabel && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="p-0.5 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
              title="Clear selection"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-emerald-600' : ''
            }`}
          />
        </div>
      </div>

      {/* Dropdown Menu Popup */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Search Bar inside popover */}
          <div className="p-2.5 border-b border-slate-100 bg-slate-50/80">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (filteredOptions.length > 0) {
                      handleSelect(filteredOptions[0].value);
                    } else if (allowCustom && searchQuery.trim()) {
                      handleUseCustomQuery();
                    }
                  } else if (e.key === 'Escape') {
                    setIsOpen(false);
                  }
                }}
                placeholder={searchPlaceholder}
                className="w-full pl-9 pr-8 py-2 bg-white rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Options List */}
          <div className="max-h-56 overflow-y-auto p-1.5 space-y-0.5 scrollbar-thin">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt, idx) => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelect(opt.value)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-left transition-colors ${
                      isSelected
                        ? 'bg-emerald-50 text-emerald-900 font-bold'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="truncate">{opt.label}</span>
                    {isSelected && <Check className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />}
                  </button>
                );
              })
            ) : (
              <div className="p-3 text-center text-xs text-slate-400">
                No matching options found
              </div>
            )}

            {/* Custom value entry option if not exact match */}
            {allowCustom && searchQuery.trim() && !isExactMatch && (
              <button
                type="button"
                onClick={handleUseCustomQuery}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-emerald-800 bg-emerald-50 hover:bg-emerald-100 font-semibold transition-colors mt-1 border border-emerald-200/60"
              >
                <Plus className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">Use custom: "{searchQuery.trim()}"</span>
              </button>
            )}
          </div>
        </div>
      )}

      {error && <p className="mt-1 text-xs text-rose-600 font-medium">{error}</p>}
      {helperText && !error && <p className="mt-1 text-[11px] text-slate-500">{helperText}</p>}
    </div>
  );
};

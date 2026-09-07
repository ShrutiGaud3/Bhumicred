import React, { useRef, useEffect } from 'react';

export const OtpInput = ({ length = 6, value = '', onChange, disabled = false, error }) => {
  const inputRefs = useRef([]);

  const otpArray = value.split('').slice(0, length);
  while (otpArray.length < length) {
    otpArray.push('');
  }

  useEffect(() => {
    if (inputRefs.current[0] && !disabled) {
      inputRefs.current[0].focus();
    }
  }, [disabled]);

  const handleChange = (e, index) => {
    const val = e.target.value.replace(/\D/g, '');
    if (!val) {
      const newOtp = [...otpArray];
      newOtp[index] = '';
      onChange(newOtp.join(''));
      return;
    }

    const lastChar = val.slice(-1);
    const newOtp = [...otpArray];
    newOtp[index] = lastChar;
    const combined = newOtp.join('');
    onChange(combined);

    // Auto-focus next input
    if (index < length - 1 && lastChar) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otpArray[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').replace(/\D/g, '').slice(0, length);
    if (pastedData) {
      onChange(pastedData);
      const focusIndex = Math.min(pastedData.length, length - 1);
      inputRefs.current[focusIndex]?.focus();
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
        {otpArray.map((digit, idx) => (
          <input
            key={idx}
            ref={(el) => (inputRefs.current[idx] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e, idx)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            disabled={disabled}
            className={`w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-bold rounded-xl border bg-white focus:outline-none transition-all ${
              error
                ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 text-rose-700'
                : 'border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-slate-900'
            } ${disabled ? 'bg-slate-100 cursor-not-allowed opacity-60' : 'shadow-sm'}`}
          />
        ))}
      </div>
      {error && <p className="mt-2 text-xs font-semibold text-rose-600">{error}</p>}
    </div>
  );
};

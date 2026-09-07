import React from 'react';
import { Check } from 'lucide-react';

export const Stepper = ({ steps, currentStep, className = '' }) => {
  // Normalize currentStep (support 0-indexed or 1-indexed)
  const normalizedIndex = currentStep >= 0 && currentStep < steps.length ? currentStep : Math.max(0, currentStep - 1);

  return (
    <div className={`w-full py-2 ${className}`}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < normalizedIndex;
          const isCurrent = index === normalizedIndex;

          return (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center relative group">
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-300 ${
                    isCompleted
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                      : isCurrent
                      ? 'bg-emerald-800 text-white ring-4 ring-emerald-100 shadow-md'
                      : 'bg-slate-100 text-slate-400 border border-slate-200'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : index + 1}
                </div>
                <span
                  className={`text-[11px] sm:text-xs mt-2 font-medium text-center hidden md:block max-w-[110px] truncate ${
                    isCurrent ? 'text-emerald-900 font-bold' : 'text-slate-500'
                  }`}
                >
                  {step.title || step}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-1.5 sm:mx-3 rounded-full transition-colors duration-300 ${
                    index < normalizedIndex ? 'bg-emerald-600' : 'bg-slate-200'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Mobile Step Title Banner */}
      <div className="md:hidden text-center mt-3 pt-2 border-t border-slate-100">
        <span className="text-xs font-bold text-emerald-800">
          Step {normalizedIndex + 1} of {steps.length}: {steps[normalizedIndex]?.title || steps[normalizedIndex]}
        </span>
        {steps[normalizedIndex]?.description && (
          <p className="text-[10px] text-slate-500 mt-0.5">{steps[normalizedIndex].description}</p>
        )}
      </div>
    </div>
  );
};

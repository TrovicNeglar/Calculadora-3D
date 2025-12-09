import React from 'react';

interface NumberInputProps {
  label: string;
  value: number | string;
  onChange: (val: number) => void;
  unit?: string;
  step?: string;
  placeholder?: string;
  min?: string;
}

export const NumberInput: React.FC<NumberInputProps> = ({ 
  label, 
  value, 
  onChange, 
  unit, 
  step = "0.01", 
  placeholder,
  min = "0"
}) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
        {label}
      </label>
      <div className="relative">
        <input
          type="number"
          min={min}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className="w-full bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 shadow-sm transition-all"
          placeholder={placeholder}
        />
        {unit && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <span className="text-slate-400 text-xs font-medium">{unit}</span>
          </div>
        )}
      </div>
    </div>
  );
};

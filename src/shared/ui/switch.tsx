import { forwardRef, InputHTMLAttributes } from 'react';

interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ checked, onChange, disabled, label, id, className = '', ...props }, ref) => {
    return (
      <div className={`flex items-center gap-3 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
        {label && <label htmlFor={id} className="text-sm font-medium text-brand-espresso cursor-pointer">{label}</label>}
        <button
          type="button"
          role="switch"
          id={id}
          aria-checked={checked}
          disabled={disabled}
          onClick={() => onChange(!checked)}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-copper focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
            checked ? 'bg-brand-copper' : 'bg-brand-gray/30'
          } ${className}`}
        >
          <span className="sr-only">Toggle {label}</span>
          <span
            aria-hidden="true"
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
              checked ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
        {/* Прихований інпут для сумісності з формами, якщо треба */}
        <input type="checkbox" className="hidden" ref={ref} checked={checked} readOnly {...props} />
      </div>
    );
  }
);

Switch.displayName = 'Switch';
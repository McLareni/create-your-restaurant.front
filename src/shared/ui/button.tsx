import { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'brand' | 'outline' | 'outlineDark' | 'ghost';
  isLoading?: boolean;
  icon?: ReactNode;
}

export const Button = ({
  children,
  variant = 'primary',
  isLoading = false,
  className = '',
  disabled,
  icon,
  ...props
}: ButtonProps) => {
  const baseStyles = 'inline-flex h-12 items-center justify-center gap-2 rounded-xl px-5 text-sm font-bold transition-all outline-none disabled:pointer-events-none disabled:opacity-50 active:scale-98 cursor-pointer border-0';
  
  const variants = {
    primary: 'bg-text-main text-bg-surface hover:opacity-90 dark:bg-bg-surface dark:text-text-main',
    brand: 'bg-brand-gold text-white hover:bg-brand-gold-hover shadow-sm',
    outline: 'border border-solid border-neutral-200 dark:border-border-main bg-transparent text-text-main hover:bg-bg-element',
    outlineDark: 'border border-solid border-border-main bg-transparent text-text-main hover:bg-bg-element/50',
    ghost: 'bg-transparent text-text-main hover:bg-bg-element',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : icon ? (
        <span className="flex items-center justify-center gap-2">
          {icon}
          {children}
        </span>
      ) : (
        className.includes('flex') ? children : <span className="flex items-center justify-center">{children}</span>
      )}
    </button>
  );
};
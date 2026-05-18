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
  const baseStyles = 'inline-flex h-12 items-center justify-center gap-2 rounded-md px-4 py-2 text-[15px] font-medium transition-colors outline-none disabled:pointer-events-none disabled:opacity-50';
  
  const variants = {
    primary: 'bg-zinc-900 text-brand-cream hover:bg-zinc-800 dark:bg-brand-cream dark:text-brand-espresso dark:hover:bg-white',
    brand: 'bg-brand-copper text-white hover:bg-brand-gold',
    outline: 'border border-zinc-200 bg-transparent text-zinc-900 hover:bg-zinc-100 dark:border-brand-gray/40 dark:text-brand-cream dark:hover:bg-brand-gray/20',
    outlineDark: 'border border-brand-gray/30 bg-transparent text-brand-cream hover:bg-brand-gray/10 hover:border-brand-gray/50',
    ghost: 'bg-transparent text-zinc-900 hover:bg-zinc-100 dark:text-brand-cream dark:hover:bg-brand-gray/20',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : icon ? (
        <span className="flex items-center gap-2">
          {icon}
          {children}
        </span>
      ) : (
        children
      )}
    </button>
  );
};
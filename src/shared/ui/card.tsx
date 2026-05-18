import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card = ({ children, className = '', onClick }: CardProps) => {
  return (
    <div 
      onClick={onClick}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-xl border border-brand-gray/10 bg-white dark:bg-brand-mocha dark:border-brand-gray/20 shadow-sm transition-all hover:border-brand-copper/30 hover:shadow-md ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  );
};
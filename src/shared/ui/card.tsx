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
      className={`group relative flex flex-col justify-between overflow-hidden rounded-xl border border-brand-gray/10 bg-white p-4 shadow-sm transition-all hover:border-brand-copper/30 hover:shadow-md ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  );
};
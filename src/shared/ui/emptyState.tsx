import { ReactNode } from 'react';
import { Button } from '@/shared/ui/button';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
}

export const EmptyState = ({ icon, title, description, actionLabel, onAction }: EmptyStateProps) => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center text-center border-2 border-dashed border-border-main rounded-2xl bg-bg-element/20 p-8">
      <div className="text-text-muted/40 mb-3 *:h-12 *:w-12">{icon}</div>
      <h3 className="text-lg font-serif font-bold text-text-main mb-1">{title}</h3>
      <p className="text-sm text-text-muted max-w-sm mb-5 font-light">{description}</p>
      <Button variant="outline" onClick={onAction}>{actionLabel}</Button>
    </div>
  );
};
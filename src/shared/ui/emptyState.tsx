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
    <div className="flex flex-1 flex-col items-center justify-center text-center border-2 border-dashed border-brand-gray/20 dark:border-brand-gray/30 rounded-xl bg-brand-cream/30 dark:bg-brand-mocha/30 p-8">
      <div className="text-brand-gray/40 dark:text-brand-gray/60 mb-3 *:h-12 *:w-12">{icon}</div>
      <h3 className="text-lg font-medium text-brand-espresso dark:text-brand-cream mb-1">{title}</h3>
      <p className="text-sm text-brand-gray max-w-sm mb-4">{description}</p>
      <Button variant="outline" onClick={onAction}>{actionLabel}</Button>
    </div>
  );
};
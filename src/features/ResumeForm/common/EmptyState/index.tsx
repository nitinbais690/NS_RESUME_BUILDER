import React from 'react';
import { type LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  message,
  actionLabel,
  onAction,
}) => (
  <div className="form-empty-state">
    <div className="form-empty-state__icon">
      <Icon size={32} />
    </div>
    <p className="form-empty-state__message">{message}</p>
    {onAction && actionLabel && (
      <button type="button" className="form-empty-state__action" onClick={onAction}>
        {actionLabel}
      </button>
    )}
  </div>
);

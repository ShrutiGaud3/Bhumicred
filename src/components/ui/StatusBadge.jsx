import React from 'react';
import { Badge } from './Badge.jsx';
import { CheckCircle2, Clock, AlertTriangle, XCircle, FileQuestion, Ban } from 'lucide-react';

export const StatusBadge = ({ status, className = '' }) => {
  const statusConfig = {
    APPROVED: { label: 'Approved', variant: 'success', icon: CheckCircle2 },
    ACTIVE: { label: 'Active', variant: 'success', icon: CheckCircle2 },
    PENDING_ONBOARDING: { label: 'Onboarding Incomplete', variant: 'warning', icon: Clock },
    PENDING_VERIFICATION: { label: 'Pending Verification', variant: 'warning', icon: Clock },
    QUERY_RAISED: { label: 'Query Raised', variant: 'danger', icon: FileQuestion },
    REJECTED: { label: 'Rejected', variant: 'danger', icon: XCircle },
    SUSPENDED: { label: 'Suspended', variant: 'danger', icon: Ban },
    REQUESTED: { label: 'Requested', variant: 'info', icon: Clock },
    ASSIGNED: { label: 'Assigned', variant: 'purple', icon: Clock },
    IN_PROGRESS: { label: 'In Progress', variant: 'info', icon: Clock },
    COMPLETED: { label: 'Completed', variant: 'success', icon: CheckCircle2 },
  };

  const config = statusConfig[status] || {
    label: status ? status.replace(/_/g, ' ') : 'Unknown',
    variant: 'default',
    icon: Clock,
  };

  const IconComponent = config.icon;

  return (
    <Badge variant={config.variant} className={className}>
      <IconComponent className="w-3 h-3" />
      <span>{config.label}</span>
    </Badge>
  );
};

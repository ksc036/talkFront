export type BotType = 'voc' | 'role';

export type VOCType =
  | 'voc-created-department'
  | 'voc-created-manager'
  | 'voc-assigned-department'
  | 'voc-assigned-manager'
  | 'voc-assigned-approver'
  | 'voc-assigned-previewer'
  | 'voc-type-changed'
  | 'voc-department-revoked'
  | 'voc-manager-revoked'
  | 'voc-approval-rejected'
  | 'voc-approval-approved'
  | 'voc-deadline-tomorrow'
  | 'voc-deadline-expired'
  | 'voc-withdrawn-by-citizen'
  | 'voc-withdrawn-by-admin';

export type RoleType =
  | 'role-user-grade-changed'
  | 'role-master-privilege-transferred';

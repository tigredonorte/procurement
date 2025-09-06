import React from 'react';

export type ParagraphVariant = 'default' | 'lead' | 'muted' | 'small';

export interface ParagraphProps extends React.HTMLAttributes<globalThis.HTMLParagraphElement> {
  variant?: ParagraphVariant;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'neutral';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
}
import { AccordionProps as MuiAccordionProps } from '@mui/material';
import { ReactNode } from 'react';

export type AccordionVariant = 'default' | 'glass' | 'bordered' | 'separated';

export interface AccordionProps extends Omit<MuiAccordionProps, 'variant'> {
  children: React.ReactElement | React.ReactElement[];
  variant?: AccordionVariant;
  disabled?: boolean;
  defaultExpanded?: boolean;
  expanded?: boolean;
  onChange?: (event: React.SyntheticEvent, expanded: boolean) => void;
}

export interface AccordionSummaryProps {
  children: ReactNode;
  expandIcon?: ReactNode;
  disabled?: boolean;
}

export interface AccordionDetailsProps {
  children: ReactNode;
}

export interface AccordionActionsProps {
  children: ReactNode;
  disableSpacing?: boolean;
}
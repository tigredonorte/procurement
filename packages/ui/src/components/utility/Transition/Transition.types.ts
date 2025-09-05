import { ReactNode } from 'react';
import { TransitionProps } from '@mui/material/transitions';

export type TransitionVariant = 'fade' | 'slide' | 'scale' | 'collapse' | 'grow' | 'zoom';
export type SlideDirection = 'up' | 'down' | 'left' | 'right';

export interface CustomTransitionProps extends Omit<TransitionProps, 'children'> {
  children: ReactNode;
  variant?: TransitionVariant;
  direction?: SlideDirection; // Used with slide variant
  duration?: number | { enter?: number; exit?: number };
  delay?: number;
  easing?: string | { enter?: string; exit?: string };
}
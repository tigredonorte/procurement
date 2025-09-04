import { ContainerProps as MuiContainerProps } from '@mui/material';
import { ReactNode } from 'react';

export interface ContainerProps extends Omit<MuiContainerProps, 'maxWidth'> {
  children: ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false | string;
  variant?: 'default' | 'fluid' | 'centered' | 'padded';
  padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  responsive?: boolean;
}
import React from 'react';
import { 
  Accordion as MuiAccordion,
  AccordionSummary as MuiAccordionSummary,
  AccordionDetails as MuiAccordionDetails,
  AccordionActions as MuiAccordionActions,
  useTheme,
  alpha
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { 
  AccordionProps, 
  AccordionSummaryProps, 
  AccordionDetailsProps, 
  AccordionActionsProps 
} from './Accordion.types';

export const Accordion: React.FC<AccordionProps> = ({
  children,
  variant = 'default',
  disabled = false,
  defaultExpanded = false,
  expanded,
  onChange,
  sx,
  ...props
}) => {
  const theme = useTheme();

  const getVariantStyles = () => {
    switch (variant) {
      case 'glass':
        return {
          backgroundColor: alpha(theme.palette.background.paper, 0.1),
          backdropFilter: 'blur(20px)',
          border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          '&:before': {
            display: 'none',
          },
        };
      case 'bordered':
        return {
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: theme.spacing(1),
          '&:before': {
            display: 'none',
          },
          '&:not(:last-child)': {
            marginBottom: theme.spacing(1),
          },
        };
      case 'separated':
        return {
          boxShadow: theme.shadows[1],
          borderRadius: theme.spacing(1),
          '&:before': {
            display: 'none',
          },
          '&:not(:last-child)': {
            marginBottom: theme.spacing(2),
          },
        };
      default:
        return {};
    }
  };

  return (
    <MuiAccordion
      disabled={disabled}
      defaultExpanded={defaultExpanded}
      expanded={expanded}
      onChange={onChange}
      sx={{
        ...getVariantStyles(),
        ...sx,
      }}
      {...props}
    >
      {children}
    </MuiAccordion>
  );
};

export const AccordionSummary: React.FC<AccordionSummaryProps> = ({
  children,
  expandIcon = <ExpandMoreIcon />,
  disabled = false,
  ...props
}) => {
  return (
    <MuiAccordionSummary
      expandIcon={expandIcon}
      disabled={disabled}
      {...props}
    >
      {children}
    </MuiAccordionSummary>
  );
};

export const AccordionDetails: React.FC<AccordionDetailsProps> = ({
  children,
  ...props
}) => {
  return (
    <MuiAccordionDetails {...props}>
      {children}
    </MuiAccordionDetails>
  );
};

export const AccordionActions: React.FC<AccordionActionsProps> = ({
  children,
  disableSpacing = false,
  ...props
}) => {
  return (
    <MuiAccordionActions disableSpacing={disableSpacing} {...props}>
      {children}
    </MuiAccordionActions>
  );
};
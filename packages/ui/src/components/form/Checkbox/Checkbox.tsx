import React from 'react';
import { 
  Checkbox as MuiCheckbox, 
  FormControlLabel, 
  FormHelperText,
  styled,
  alpha
} from '@mui/material';

import { CheckboxProps } from './Checkbox.types';

const StyledCheckbox = styled(MuiCheckbox)<{ customVariant?: CheckboxProps['variant'] }>(
  ({ theme, customVariant }) => ({
    ...(customVariant === 'rounded' && {
      '& .MuiSvgIcon-root': {
        borderRadius: '50%',
      },
    }),
    
    '&.MuiCheckbox-root': {
      transition: 'all 0.3s ease',
      '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.1),
      },
    },
    
    '&.Mui-checked': {
      color: theme.palette.primary.main,
    },
    
    '&.MuiCheckbox-indeterminate': {
      color: theme.palette.primary.main,
    },
  })
);

const StyledFormControlLabel = styled(FormControlLabel)<{ error?: boolean }>(
  ({ theme, error }) => ({
    marginLeft: 0,
    '& .MuiFormControlLabel-label': {
      color: error ? theme.palette.error.main : theme.palette.text.primary,
      fontSize: '0.875rem',
    },
  })
);

const StyledFormHelperText = styled(FormHelperText)(({ theme }) => ({
  marginLeft: theme.spacing(4),
  marginTop: theme.spacing(0.5),
}));

export const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  ({ variant = 'default', label, error, helperText, ...props }, ref) => {
    const checkbox = (
      <StyledCheckbox
        ref={ref}
        customVariant={variant}
        {...props}
      />
    );
    
    if (label) {
      return (
        <>
          <StyledFormControlLabel
            control={checkbox}
            label={label}
            error={error}
          />
          {helperText && (
            <StyledFormHelperText error={error}>
              {helperText}
            </StyledFormHelperText>
          )}
        </>
      );
    }
    
    return checkbox;
  }
);

Checkbox.displayName = 'Checkbox';
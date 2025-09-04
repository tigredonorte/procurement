import React, { forwardRef, useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { 
  Paper,
  Box,
  Typography,
  alpha,
  IconButton,
  Grid,
  Chip,
  Fade,
  Grow,
  Zoom,
  ButtonBase,
  useTheme
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  ChevronLeft,
  ChevronRight,
  Today,
  KeyboardArrowDown,
  KeyboardArrowUp
} from '@mui/icons-material';
import { CalendarProps } from './Calendar.types';

// Calendar size configurations
const sizeConfigs = {
  xs: {
    headerHeight: 40,
    daySize: 28,
    fontSize: '0.75rem',
    spacing: 1,
    iconSize: 'small' as const,
  },
  sm: {
    headerHeight: 48,
    daySize: 32,
    fontSize: '0.875rem',
    spacing: 1.5,
    iconSize: 'small' as const,
  },
  md: {
    headerHeight: 56,
    daySize: 40,
    fontSize: '0.875rem',
    spacing: 2,
    iconSize: 'medium' as const,
  },
  lg: {
    headerHeight: 64,
    daySize: 48,
    fontSize: '1rem',
    spacing: 2.5,
    iconSize: 'medium' as const,
  },
  xl: {
    headerHeight: 72,
    daySize: 56,
    fontSize: '1.125rem',
    spacing: 3,
    iconSize: 'large' as const,
  },
};

// Calendar utility functions
const isSameDay = (date1: Date, date2: Date): boolean => {
  return date1.getDate() === date2.getDate() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getFullYear() === date2.getFullYear();
};

const isSameMonth = (date1: Date, date2: Date): boolean => {
  return date1.getMonth() === date2.getMonth() &&
         date1.getFullYear() === date2.getFullYear();
};

const isDateInRange = (date: Date, startDate: Date | null, endDate: Date | null): boolean => {
  if (!startDate || !endDate) return false;
  return date >= startDate && date <= endDate;
};

const isDateBetween = (date: Date, startDate: Date | null, endDate: Date | null): boolean => {
  if (!startDate || !endDate) return false;
  return date > startDate && date < endDate;
};

const getDaysInMonth = (date: Date): number => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

const getFirstDayOfMonth = (date: Date): number => {
  return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
};

const getMonthName = (date: Date): string => {
  return date.toLocaleString('default', { month: 'long' });
};

const getYearFromDate = (date: Date): number => {
  return date.getFullYear();
};

const isDateDisabled = (date: Date, minDate?: Date, maxDate?: Date): boolean => {
  if (minDate && date < minDate) return true;
  if (maxDate && date > maxDate) return true;
  return false;
};

const StyledCalendar = styled(Paper, {
  shouldForwardProp: (prop) => !['glass', 'gradient', 'calendarSize'].includes(prop as string),
})<{ glass?: boolean; gradient?: boolean; calendarSize: keyof typeof sizeConfigs }>(
  ({ theme, glass, gradient, calendarSize }) => {
    const config = sizeConfigs[calendarSize];
    return {
      padding: theme.spacing(config.spacing * 1.5),
      borderRadius: theme.spacing(2.5),
      overflow: 'hidden',
      position: 'relative',
      minWidth: config.daySize * 7 + theme.spacing(config.spacing * 3),
      backgroundColor: glass ? alpha(theme.palette.background.paper, 0.95) : theme.palette.background.paper,
      border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
      boxShadow: theme.shadows[2],
      ...(glass && {
        backgroundColor: alpha(theme.palette.background.paper, 0.95),
        backdropFilter: 'blur(20px)',
        border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
      }),
      ...(gradient && {
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)}, ${alpha(theme.palette.secondary.main, 0.05)})`,
      }),
    };
  }
);

const DayButton = styled(ButtonBase, {
  shouldForwardProp: (prop) => !['isSelected', 'isInRange', 'isRangeStart', 'isRangeEnd', 'isToday', 'isDisabled', 'themeColor', 'daySize'].includes(prop as string),
})<{
  isSelected?: boolean;
  isInRange?: boolean;
  isRangeStart?: boolean;
  isRangeEnd?: boolean;
  isToday?: boolean;
  isDisabled?: boolean;
  themeColor: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  daySize: number;
}>(({ theme, isSelected, isInRange, isRangeStart, isRangeEnd, isToday, isDisabled, themeColor, daySize }) => {
  const paletteColor = theme.palette[themeColor];
  
  return {
  width: daySize,
  height: daySize,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1rem',
  fontWeight: 600,
  position: 'relative',
  color: '#000000', // Force black text for maximum visibility
  backgroundColor: 'rgba(255, 255, 255, 0.9)', // Force white background
  border: '1px solid #e0e0e0', // Add border for visibility
  cursor: 'pointer',
  transition: theme.transitions.create(['background-color', 'color', 'transform', 'box-shadow'], {
    duration: theme.transitions.duration.short,
  }),
  '&:hover': {
    backgroundColor: alpha(paletteColor.main, 0.08),
    transform: 'scale(1.05)',
    boxShadow: theme.shadows[1],
    ...(isDisabled && {
      transform: 'none',
      backgroundColor: 'transparent',
      boxShadow: 'none',
    }),
  },
  ...(isToday && !isSelected && {
    border: `2px solid ${paletteColor.main}`,
    fontWeight: 600,
    color: paletteColor.main,
    backgroundColor: alpha(paletteColor.main, 0.05),
  }),
  ...(isSelected && {
    backgroundColor: paletteColor.main,
    color: paletteColor.contrastText,
    fontWeight: 600,
    boxShadow: theme.shadows[3],
    '&:hover': {
      backgroundColor: paletteColor.dark,
      transform: 'scale(1.05)',
    },
  }),
  ...(isInRange && !isSelected && {
    backgroundColor: alpha(paletteColor.main, 0.15),
    color: paletteColor.main,
    fontWeight: 600,
  }),
  ...(isRangeStart && {
    backgroundColor: paletteColor.main,
    color: paletteColor.contrastText,
    fontWeight: 600,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    '&:hover': {
      backgroundColor: paletteColor.dark,
    },
  }),
  ...(isRangeEnd && {
    backgroundColor: paletteColor.main,
    color: paletteColor.contrastText,
    fontWeight: 600,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    '&:hover': {
      backgroundColor: paletteColor.dark,
    },
  }),
  ...(isDisabled && {
    color: '#666666',
    cursor: 'not-allowed',
    opacity: 1.0,
    '&:hover': {
      backgroundColor: 'transparent',
      transform: 'none',
      boxShadow: 'none',
    },
  }),
  };
});

const YearButton = styled(ButtonBase)<{
  isSelected?: boolean;
  color: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
}>(({ theme, isSelected, color }) => {
  const paletteColor = theme.palette[color];
  
  return {
  padding: theme.spacing(1, 2),
  borderRadius: theme.spacing(1),
  fontSize: '0.875rem',
  fontWeight: 500,
  transition: theme.transitions.create(['background-color', 'color', 'transform'], {
    duration: theme.transitions.duration.short,
  }),
  '&:hover': {
    backgroundColor: alpha(paletteColor.main, 0.08),
    transform: 'scale(1.05)',
  },
  ...(isSelected && {
    backgroundColor: paletteColor.main,
    color: paletteColor.contrastText,
    fontWeight: 600,
  }),
  };
});

export const Calendar = forwardRef<HTMLDivElement, CalendarProps>(
  ({
    variant = 'default',
    color = 'primary',
    size = 'md',
    value,
    onChange,
    glass = false,
    gradient = false,
    minDate,
    maxDate,
    ...props
  }, ref) => {
    const theme = useTheme();
    const config = sizeConfigs[size];
    
    // Map custom colors to Material-UI palette colors
    const getThemeColor = (colorName: string): 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' => {
      const colorMap: Record<string, 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'> = {
        primary: 'primary',
        secondary: 'secondary',
        success: 'success',
        warning: 'warning',
        danger: 'error', // Map 'danger' to 'error'
        neutral: 'primary', // Map 'neutral' to 'primary' since 'grey' doesn't have main property
      };
      return colorMap[colorName] || 'primary';
    };
    
    const themeColor = getThemeColor(color);
    const [currentDate, setCurrentDate] = useState(() => {
      if (value) {
        if (Array.isArray(value)) {
          return value[0] || new Date();
        }
        return value;
      }
      return new Date();
    });
    
    const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
    const [isYearView, setIsYearView] = useState(variant === 'year');
    const [focusedDate, setFocusedDate] = useState<Date>(() => new Date());
    const calendarRef = useRef<HTMLDivElement>(null);

    // Memoized calendar data
    const calendarData = useMemo(() => {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const daysInMonth = getDaysInMonth(currentDate);
      const firstDayOfMonth = getFirstDayOfMonth(currentDate);
      const today = new Date();

      const days: Date[] = [];
      
      // Previous month's trailing days
      const prevMonth = new Date(year, month - 1, 0);
      const prevMonthDays = getDaysInMonth(prevMonth);
      for (let i = firstDayOfMonth - 1; i >= 0; i--) {
        days.push(new Date(year, month - 1, prevMonthDays - i));
      }

      // Current month's days
      for (let day = 1; day <= daysInMonth; day++) {
        days.push(new Date(year, month, day));
      }

      // Next month's leading days
      const remainingCells = 42 - days.length;
      for (let day = 1; day <= remainingCells; day++) {
        days.push(new Date(year, month + 1, day));
      }

      return { days, today, year, month };
    }, [currentDate]);

    // Navigation handlers
    const goToPreviousMonth = useCallback(() => {
      setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    }, []);

    const goToNextMonth = useCallback(() => {
      setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    }, []);

    const goToPreviousYear = useCallback(() => {
      setCurrentDate(prev => new Date(prev.getFullYear() - 1, prev.getMonth(), 1));
    }, []);

    const goToNextYear = useCallback(() => {
      setCurrentDate(prev => new Date(prev.getFullYear() + 1, prev.getMonth(), 1));
    }, []);

    const goToToday = useCallback(() => {
      const today = new Date();
      setCurrentDate(today);
      if (onChange) {
        if (variant === 'default') {
          onChange(today);
        } else if (variant === 'multi') {
          onChange([today]);
        } else if (variant === 'range') {
          onChange([today, today]);
        }
      }
    }, [onChange, variant]);

    // Date selection handler
    const handleDateClick = useCallback((date: Date) => {
      if (isDateDisabled(date, minDate, maxDate)) return;

      if (!onChange) return;

      switch (variant) {
        case 'default':
          onChange(date);
          break;

        case 'multi':
          const currentMulti = Array.isArray(value) ? value : [];
          const existingIndex = currentMulti.findIndex(d => isSameDay(d, date));
          
          if (existingIndex >= 0) {
            // Remove date if already selected
            const newMulti = currentMulti.filter((_, index) => index !== existingIndex);
            onChange(newMulti.length > 0 ? newMulti : null);
          } else {
            // Add date
            onChange([...currentMulti, date]);
          }
          break;

        case 'range':
          const currentRange = Array.isArray(value) ? value : [];
          
          if (currentRange.length === 0 || currentRange.length === 2) {
            // Start new range
            onChange([date]);
          } else if (currentRange.length === 1) {
            const startDate = currentRange[0];
            if (startDate && date < startDate) {
              onChange([date, startDate]);
            } else if (startDate) {
              onChange([startDate, date]);
            }
          }
          break;

        case 'year':
          onChange(date);
          break;
      }
    }, [variant, value, onChange, minDate, maxDate]);

    // Keyboard navigation handler
    const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
      const { key } = event;
      let newFocusedDate = new Date(focusedDate);
      let shouldPreventDefault = false;

      switch (key) {
        case 'ArrowUp':
          newFocusedDate.setDate(focusedDate.getDate() - 7);
          shouldPreventDefault = true;
          break;
        case 'ArrowDown':
          newFocusedDate.setDate(focusedDate.getDate() + 7);
          shouldPreventDefault = true;
          break;
        case 'ArrowLeft':
          newFocusedDate.setDate(focusedDate.getDate() - 1);
          shouldPreventDefault = true;
          break;
        case 'ArrowRight':
          newFocusedDate.setDate(focusedDate.getDate() + 1);
          shouldPreventDefault = true;
          break;
        case 'Home':
          newFocusedDate.setDate(1);
          shouldPreventDefault = true;
          break;
        case 'End':
          newFocusedDate.setMonth(focusedDate.getMonth() + 1);
          newFocusedDate.setDate(0);
          shouldPreventDefault = true;
          break;
        case 'PageUp':
          if (event.shiftKey) {
            newFocusedDate.setFullYear(focusedDate.getFullYear() - 1);
          } else {
            newFocusedDate.setMonth(focusedDate.getMonth() - 1);
          }
          shouldPreventDefault = true;
          break;
        case 'PageDown':
          if (event.shiftKey) {
            newFocusedDate.setFullYear(focusedDate.getFullYear() + 1);
          } else {
            newFocusedDate.setMonth(focusedDate.getMonth() + 1);
          }
          shouldPreventDefault = true;
          break;
        case 'Enter':
        case ' ':
          handleDateClick(focusedDate);
          shouldPreventDefault = true;
          break;
        case 'Escape':
          if (calendarRef.current) {
            calendarRef.current.blur();
          }
          shouldPreventDefault = true;
          break;
      }

      if (shouldPreventDefault) {
        event.preventDefault();
        setFocusedDate(newFocusedDate);
        
        // Update currentDate if focused date moves to different month
        if (newFocusedDate.getMonth() !== currentDate.getMonth() || 
            newFocusedDate.getFullYear() !== currentDate.getFullYear()) {
          setCurrentDate(new Date(newFocusedDate.getFullYear(), newFocusedDate.getMonth(), 1));
        }
      }
    }, [focusedDate, currentDate, handleDateClick]);

    // Year selection handler
    const handleYearClick = useCallback((year: number) => {
      const newDate = new Date(year, currentDate.getMonth(), 1);
      setCurrentDate(newDate);
      if (onChange && variant === 'year') {
        onChange(newDate);
      }
      setIsYearView(false);
    }, [currentDate, onChange, variant]);

    // Check if date is selected
    const isDateSelected = useCallback((date: Date): boolean => {
      if (!value) return false;

      if (Array.isArray(value)) {
        return value.some(d => isSameDay(d, date));
      }
      return isSameDay(value, date);
    }, [value]);

    // Check if date is in range
    const isDateInCurrentRange = useCallback((date: Date): boolean => {
      if (variant !== 'range' || !Array.isArray(value) || value.length !== 2 || !value[0] || !value[1]) return false;
      return isDateInRange(date, value[0], value[1]);
    }, [variant, value]);

    // Check if date is between range dates (for hover effect)
    const isDateBetweenRange = useCallback((date: Date): boolean => {
      if (variant !== 'range' || !Array.isArray(value) || value.length !== 1 || !hoveredDate) return false;
      const startDate = value[0];
      if (!startDate) return false;
      if (hoveredDate < startDate) {
        return isDateBetween(date, hoveredDate, startDate);
      }
      return isDateBetween(date, startDate, hoveredDate);
    }, [variant, value, hoveredDate]);

    const renderCalendarGrid = () => {
      const { days, today } = calendarData;
      const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

      return (
        <Box>
          {/* Weekday headers */}
          <Grid container spacing={0} sx={{ mb: 1.5 }}>
            {weekDays.map((day, index) => (
              <Grid item xs key={index} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 700,
                    fontSize: config.fontSize,
                    width: config.daySize,
                    height: config.daySize * 0.6,
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: theme.palette.text.primary,
                    backgroundColor: alpha(theme.palette[themeColor].main, 0.08),
                    borderRadius: '4px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  {day}
                </Typography>
              </Grid>
            ))}
          </Grid>

          {/* Calendar days */}
          <Grid container spacing={0} sx={{ gap: '2px 0' }}>
            {days.map((date, index) => {
              const isCurrentMonth = isSameMonth(date, currentDate);
              const isSelected = isDateSelected(date);
              const isToday = isSameDay(date, today);
              const isDisabled = isDateDisabled(date, minDate, maxDate);
              const isInRange = isDateInCurrentRange(date) || isDateBetweenRange(date);
              const isRangeStart = variant === 'range' && Array.isArray(value) && value.length === 2 && value[0] && isSameDay(date, value[0]);
              const isRangeEnd = variant === 'range' && Array.isArray(value) && value.length === 2 && value[1] && isSameDay(date, value[1]);
              const isFocused = isSameDay(date, focusedDate);

              return (
                <Grid item xs key={index} sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Zoom in={true} timeout={index * 20} key={`${date.getTime()}-${currentDate.getMonth()}`}>
                    <DayButton
                      isSelected={isSelected}
                      isInRange={isInRange}
                      isRangeStart={isRangeStart}
                      isRangeEnd={isRangeEnd}
                      isToday={isToday}
                      isDisabled={isDisabled}
                      themeColor={themeColor}
                      daySize={config.daySize}
                      onClick={() => handleDateClick(date)}
                      onMouseEnter={() => variant === 'range' && setHoveredDate(date)}
                      onMouseLeave={() => variant === 'range' && setHoveredDate(null)}
                      onFocus={() => setFocusedDate(date)}
                      disabled={isDisabled}
                      tabIndex={isFocused ? 0 : -1}
                      aria-label={`${date.toLocaleDateString()} ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
                      aria-selected={isSelected}
                      aria-current={isToday ? 'date' : undefined}
                      role="gridcell"
                      sx={{
                        opacity: isCurrentMonth ? 1 : 0.9, // Better visibility for previous/next month days
                        m: 0.25,
                        outline: isFocused ? `2px solid ${theme.palette[themeColor].main}` : 'none',
                        outlineOffset: '2px',
                        fontSize: config.fontSize,
                        // Enhanced styling for better visual hierarchy
                        ...((!isCurrentMonth && !isSelected && !isToday) && {
                          color: '#333333',
                          fontWeight: 600,
                        }),
                        ...(isCurrentMonth && !isSelected && !isToday && {
                          color: '#000000',
                          fontWeight: 600,
                        }),
                      }}
                    >
                      {date.getDate()}
                    </DayButton>
                  </Zoom>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      );
    };

    const renderYearGrid = () => {
      const currentYear = currentDate.getFullYear();
      const startYear = Math.floor(currentYear / 12) * 12;
      const years = Array.from({ length: 12 }, (_, i) => startYear + i);

      return (
        <Grid container spacing={1}>
          {years.map((year) => {
            const isSelected = Array.isArray(value) ? 
              value.some(d => d.getFullYear() === year) : 
              value?.getFullYear() === year;

            return (
              <Grid item xs={3} key={year}>
                <YearButton
                  isSelected={isSelected}
                  color={themeColor}
                  onClick={() => handleYearClick(year)}
                  sx={{ width: '100%' }}
                >
                  {year}
                </YearButton>
              </Grid>
            );
          })}
        </Grid>
      );
    };

    const renderHeader = () => (
      <Box
        id="calendar-header"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: config.headerHeight,
          mb: config.spacing,
        }}
      >
        <IconButton
          onClick={isYearView ? goToPreviousYear : goToPreviousMonth}
          size={config.iconSize}
          sx={{
            color: theme.palette[themeColor].main,
            '&:hover': {
              backgroundColor: alpha(theme.palette[themeColor].main, 0.08),
            },
          }}
        >
          <ChevronLeft />
        </IconButton>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {variant === 'year' ? (
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                fontSize: config.fontSize,
                color: theme.palette[themeColor].main,
              }}
            >
              {`${Math.floor(currentDate.getFullYear() / 12) * 12}-${Math.floor(currentDate.getFullYear() / 12) * 12 + 11}`}
            </Typography>
          ) : (
            <ButtonBase
              onClick={() => setIsYearView(!isYearView)}
              sx={{
                borderRadius: 1,
                px: 1,
                py: 0.5,
                '&:hover': {
                  backgroundColor: alpha(theme.palette[themeColor].main, 0.08),
                },
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  fontSize: config.fontSize,
                  color: theme.palette[themeColor].main,
                }}
              >
                {isYearView ? `${Math.floor(currentDate.getFullYear() / 12) * 12}-${Math.floor(currentDate.getFullYear() / 12) * 12 + 11}` : `${getMonthName(currentDate)} ${getYearFromDate(currentDate)}`}
              </Typography>
              {isYearView ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </ButtonBase>
          )}

          <IconButton
            onClick={goToToday}
            size={config.iconSize}
            sx={{
              color: theme.palette[themeColor].main,
              '&:hover': {
                backgroundColor: alpha(theme.palette[themeColor].main, 0.08),
              },
            }}
          >
            <Today fontSize={config.iconSize} />
          </IconButton>
        </Box>

        <IconButton
          onClick={isYearView ? goToNextYear : goToNextMonth}
          size={config.iconSize}
          sx={{
            color: theme.palette[themeColor].main,
            '&:hover': {
              backgroundColor: alpha(theme.palette[themeColor].main, 0.08),
            },
          }}
        >
          <ChevronRight />
        </IconButton>
      </Box>
    );

    const renderSelectedDates = () => {
      if (!value) return null;

      const selectedDates = Array.isArray(value) ? value : [value];
      if (selectedDates.length === 0) return null;

      return (
        <Fade in={true}>
          <Box sx={{ mt: config.spacing, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selectedDates.map((date, index) => (
              <Chip
                key={index}
                label={date.toLocaleDateString()}
                size="small"
                color={color as any}
                variant={variant === 'range' && selectedDates.length === 2 ? 
                  (index === 0 ? 'filled' : 'outlined') : 'filled'
                }
                sx={{
                  fontSize: '0.75rem',
                  height: 24,
                }}
              />
            ))}
          </Box>
        </Fade>
      );
    };

    return (
      <StyledCalendar 
        ref={calendarRef} 
        glass={glass} 
        gradient={gradient} 
        calendarSize={size} 
        tabIndex={0}
        role="grid"
        aria-label={`Calendar for ${getMonthName(currentDate)} ${getYearFromDate(currentDate)}`}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {renderHeader()}
        
        <Fade in={true} timeout={300}>
          <Box role="grid" aria-labelledby="calendar-header">
            {(isYearView && variant !== 'year') ? renderYearGrid() : renderCalendarGrid()}
          </Box>
        </Fade>

        {variant !== 'year' && renderSelectedDates()}
      </StyledCalendar>
    );
  }
);

Calendar.displayName = 'Calendar';
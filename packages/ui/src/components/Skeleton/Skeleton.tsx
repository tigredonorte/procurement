import React from 'react';
import { Skeleton as MuiSkeleton, Box, Stack } from '@mui/material';
import { SkeletonProps } from './Skeleton.types';

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  animation = 'pulse',
  width,
  height,
  count = 1,
  spacing = 1,
  borderRadius,
  className,
}) => {
  const getSkeletonVariant = () => {
    switch (variant) {
      case 'circular': return 'circular';
      case 'rectangular': return 'rectangular';
      case 'wave': return 'rectangular';
      default: return 'text';
    }
  };

  const getSkeletonAnimation = () => {
    if (variant === 'wave') return 'wave';
    return animation;
  };

  const getDefaultDimensions = () => {
    switch (variant) {
      case 'circular':
        return { width: 40, height: 40 };
      case 'rectangular':
      case 'wave':
        return { width: '100%', height: 40 };
      default:
        return { width: '100%', height: undefined };
    }
  };

  const defaults = getDefaultDimensions();
  const finalWidth = width ?? defaults.width;
  const finalHeight = height ?? defaults.height;

  const singleSkeleton = (
    <MuiSkeleton
      variant={getSkeletonVariant()}
      animation={getSkeletonAnimation()}
      width={finalWidth}
      height={finalHeight}
      sx={{
        borderRadius: borderRadius,
      }}
      className={className}
    />
  );

  if (count === 1) {
    return singleSkeleton;
  }

  return (
    <Stack spacing={spacing}>
      {Array.from({ length: count }).map((_, index) => (
        <Box key={index}>
          {React.cloneElement(singleSkeleton)}
        </Box>
      ))}
    </Stack>
  );
};
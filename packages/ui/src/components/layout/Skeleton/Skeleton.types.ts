export type SkeletonVariant = 'text' | 'circular' | 'rectangular' | 'wave';
export type SkeletonAnimation = 'pulse' | 'wave' | false;

export interface SkeletonProps {
  variant?: SkeletonVariant;
  animation?: SkeletonAnimation;
  width?: number | string;
  height?: number | string;
  count?: number;
  spacing?: number;
  borderRadius?: number | string;
  className?: string;
}
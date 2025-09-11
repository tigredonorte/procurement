// DOM types for ESLint compatibility
export type DOMRect = {
  top: number;
  left: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
};

export type KeyboardEvent = {
  key: string;
  preventDefault: () => void;
  stopPropagation: () => void;
};

// Component types
export interface TutorialStep {
  id: string;
  target: string; // CSS selector
  title: string;
  content: string;
  position?: 'top' | 'right' | 'bottom' | 'left' | 'auto';
  action?: {
    label: string;
    onClick: () => void;
  };
  spotlightPadding?: number;
  disableInteraction?: boolean;
  requiresAction?: boolean;
}

export interface TutorialOverlayProps {
  steps: TutorialStep[];
  onComplete?: () => void;
  onSkip?: () => void;
  onStepComplete?: (stepId: string) => void;
  initialStep?: number;
  active?: boolean;
  showProgress?: boolean;
  allowKeyboardNavigation?: boolean;
  allowClickThrough?: boolean;
  variant?: 'tooltip' | 'modal' | 'highlight' | 'spotlight';
  allowSkip?: boolean;
  animated?: boolean;
}

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
  target: string; // CSS selector
  title: string;
  content: string;
  placement?: 'top' | 'right' | 'bottom' | 'left' | 'auto';
  action?: {
    label: string;
    onClick: () => void;
  };
  spotlightPadding?: number;
  disableInteraction?: boolean;
}

export interface TutorialOverlayProps {
  steps: TutorialStep[];
  onComplete?: () => void;
  onSkip?: () => void;
  initialStep?: number;
  active?: boolean;
  showProgress?: boolean;
  allowKeyboardNavigation?: boolean;
  allowClickThrough?: boolean;
}

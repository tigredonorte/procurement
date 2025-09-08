import React from 'react';

export interface AutocompleteOption<T = unknown> {
  id?: string;
  key?: string;
  value?: string;
  label?: string;
  name?: string;
  text?: string;
  description?: string;
  data?: T;
}

export interface AutocompleteProps<T = AutocompleteOption> {
  /** Controlled input value */
  value: string;
  /** Input value change */
  onChange: (val: string) => void;

  /** Suggestion items (generic) */
  suggestions: T[];
  /** Unique key extractor */
  getKey?: (item: T) => string;
  /** Text label extractor */
  getLabel?: (item: T) => string;
  /** Optional description extractor (for SR and UI) */
  getDescription?: (item: T) => string | undefined;
  /** Custom row renderer */
  renderSuggestion?: (item: T, state: { active: boolean; query: string }) => React.ReactNode;
  /** Called when a suggestion is chosen */
  onSelect?: (item: T) => void;

  /** Allow values not in suggestions */
  allowFreeText?: boolean;
  /** Enable multiple selection (chips) */
  multiple?: boolean;
  /** Selected items in multiple mode */
  selectedItems?: T[];
  /** Update selected items in multiple mode */
  onSelectedItemsChange?: (items: T[]) => void;

  /** Async mode flags */
  async?: boolean;
  isLoading?: boolean;
  /** Debounce in ms for local filtering or remote fetch triggers */
  debounceMs?: number;

  /** Inline completion remainder visibility */
  showGhostText?: boolean;
  /** Case/fuzzy options (local filtering only) */
  matchMode?: 'startsWith' | 'contains' | 'fuzzy';

  /** A11y & structure */
  id?: string;
  inputAriaLabel?: string;
  placeholder?: string;
  autoFocus?: boolean;
  disabled?: boolean;

  /** Styling hooks */
  className?: string;
  inputClassName?: string;
  listClassName?: string;
  itemClassName?: string;
  activeItemClassName?: string;
  chipClassName?: string;

  /** Portal the popup if desired */
  portal?: boolean | { container?: HTMLElement };
  /** Max visible items before scroll */
  maxVisibleItems?: number;
}

export interface AutocompleteState {
  open: boolean;
  activeIndex: number;
  ghost: string;
  inputValue: string;
  composition: boolean;
}

export interface SuggestionItemState {
  active: boolean;
  query: string;
}

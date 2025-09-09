# Appendices

[← Back to Main Documentation](./readme.md)

---

## A. Color Contrast Matrix

| Background  | Text Color  | Contrast Ratio | WCAG Level |
| ----------- | ----------- | -------------- | ---------- |
| White       | Neutral-600 | 4.54:1         | AA         |
| White       | Neutral-700 | 7.24:1         | AAA        |
| Primary-500 | White       | 4.51:1         | AA         |
| Dark-900    | White       | 15.8:1         | AAA        |
| Dark-800    | Neutral-300 | 9.2:1          | AAA        |

## B. Component Size Matrix

| Component     | XS   | SM   | MD   | LG   | XL   |
| ------------- | ---- | ---- | ---- | ---- | ---- |
| Button Height | 28px | 32px | 36px | 40px | 48px |
| Input Height  | 32px | 36px | 40px | 44px | 52px |
| Icon Size     | 16px | 18px | 20px | 24px | 28px |
| Avatar Size   | 24px | 32px | 40px | 48px | 64px |
| Chip Height   | 20px | 24px | 28px | 32px | 36px |

## C. Z-Index Scale

```scss
$z-index: (
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modal-backdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
  toast: 1080,
  tour: 1090,
);
```

## D. Export Structure

```typescript
// Main export from @requisio/ui-library
export {
  // Provider
  UIProvider,
  useTheme,

  // Core Components
  Button,
  Input,
  Select,
  Checkbox,
  Radio,
  Switch,

  // Layout Components
  Container,
  Grid,
  Stack,
  Spacer,

  // DataDisplay
  Card,
  Table,
  List,
  Avatar,
  Badge,
  Chip,

  // Feedback
  Alert,
  Toast,
  Progress,
  Skeleton,
  Spinner,

  // Navigation
  Navbar,
  Sidebar,
  Breadcrumb,
  Tabs,
  Pagination,

  // Overlay
  Modal,
  Drawer,
  Popover,
  Tooltip,

  // Forms
  Form,
  FormField,
  FormSection,

  // Charts
  Chart,
  Sparkline,

  // Utilities
  ThemeCustomizer,
  ColorPicker,

  // Types
  type Theme,
  type Component,
  type ThemeCustomization,
};
```

[← Back to Main Documentation](./readme.md)

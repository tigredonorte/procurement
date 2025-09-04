# @procurement/ui

A comprehensive UI component library for the Procurement platform, built with React, TypeScript, and Material-UI.

## Installation

```bash
npm install @procurement/ui
# or
pnpm add @procurement/ui
# or
yarn add @procurement/ui
```

## Features

- 🎨 **Beautiful Components** - Professionally designed with attention to detail
- 🌓 **Theme Support** - Full light and dark mode support
- 📱 **Responsive** - Mobile-first design that works on all devices
- ♿ **Accessible** - WCAG compliant with proper ARIA attributes
- 📝 **TypeScript** - Fully typed for excellent developer experience
- 📚 **Storybook** - Interactive documentation with live examples
- ⚡ **Performance** - Optimized for production use

## Quick Start

```tsx
import { Button, Heading, Text, Paragraph } from '@procurement/ui';

function App() {
  return (
    <div>
      <Heading level="h1" gradient color="primary">
        Welcome to Procurement UI
      </Heading>
      <Paragraph variant="lead">Build beautiful interfaces with our component library.</Paragraph>
      <Button variant="solid" color="primary">
        Get Started
      </Button>
    </div>
  );
}
```

## Component Categories

### Core Components

- **Button** - Interactive buttons with multiple variants and effects
  - Variants: solid, outline, ghost, glass, gradient
  - Effects: glow, pulse animations
  - Full theme color support

### Typography Components

- **Text** - Flexible text wrapper with variants
- **Heading** - Semantic headings (h1-h6) with gradient support
- **Paragraph** - Paragraph text with multiple styles
- **Code** - Code display with syntax highlighting and copy functionality
- **Blockquote** - Quote blocks with attribution

[See full Typography documentation](./src/components/Typography.md)

## Development

### Setup

1. Clone the repository
2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Start Storybook:
   ```bash
   pnpm dev
   ```

### Scripts

- `pnpm dev` - Start Storybook development server
- `pnpm build` - Build the library for production
- `pnpm build-storybook` - Build static Storybook
- `pnpm lint` - Run ESLint
- `pnpm type-check` - Run TypeScript type checking

### Project Structure

```
packages/ui/
├── src/
│   ├── components/       # Component implementations
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.types.ts
│   │   │   ├── Button.stories.tsx
│   │   │   └── index.ts
│   │   ├── Text/
│   │   ├── Heading/
│   │   ├── Paragraph/
│   │   ├── Code/
│   │   └── Blockquote/
│   └── index.ts          # Main exports
├── .storybook/          # Storybook configuration
├── package.json
└── README.md
```

## Storybook

View the component library in Storybook:

```bash
pnpm dev
```

Then open [http://localhost:6006](http://localhost:6006)

Each component includes:

- Interactive examples
- Props documentation
- Code snippets
- Playground for testing

## Theme Integration

The library uses Material-UI's theme system. Components automatically adapt to your theme:

```tsx
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Button } from '@procurement/ui';

const theme = createTheme({
  palette: {
    mode: 'dark', // or 'light'
    primary: {
      main: '#007bff',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Button color="primary">Themed Button</Button>
    </ThemeProvider>
  );
}
```

## TypeScript Support

All components are fully typed. Import types as needed:

```tsx
import type { ButtonProps, HeadingProps } from '@procurement/ui';

const MyButton: React.FC<ButtonProps> = (props) => {
  return <Button {...props} />;
};
```

## Contributing

### Adding New Components

1. Create component folder in `src/components/`
2. Implement component files:
   - `Component.tsx` - Main implementation
   - `Component.types.ts` - TypeScript types
   - `Component.stories.tsx` - Storybook stories
   - `index.ts` - Exports
3. Add export to `src/index.ts`
4. Document in README

### Code Style

- Use functional components with hooks
- Implement proper TypeScript types
- Include comprehensive Storybook stories
- Follow existing patterns and conventions
- Ensure light/dark theme compatibility

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT © Procurement Platform

## Links

- [Documentation](./src/components/Typography.md)
- [Storybook](http://localhost:6006) (when running locally)
- [GitHub Repository](https://github.com/procurement/ui)

## Changelog

### v1.0.0

- Initial release
- Button component with 5 variants and special effects
- Complete Typography component set (Text, Heading, Paragraph, Code, Blockquote)
- Full theme support (light/dark modes)
- Comprehensive Storybook documentation

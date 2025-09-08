import React, { FC, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  IconButton,
  Stack,
  Typography,
  alpha,
  styled,
  useTheme,
  Tooltip,
} from '@mui/material';
import {
  ContentCopy as CopyIcon,
  Fullscreen as FullscreenIcon,
  FullscreenExit as ExitFullscreenIcon,
  WrapText as WrapIcon,
  Code as CodeIcon,
} from '@mui/icons-material';
import Editor, { Monaco } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';

import type { CodeEditorProps } from './CodeEditor.types';

// Styled components
const EditorContainer = styled(Paper)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.98)} 0%, ${alpha(theme.palette.background.paper, 0.95)} 100%)`,
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  border: `1px solid ${alpha(theme.palette.divider, 0.18)}`,
  borderRadius: theme.shape.borderRadius * 2,
  overflow: 'hidden',
}));

const Toolbar = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(1, 2),
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
  background: alpha(theme.palette.background.default, 0.4),
}));

const LanguageBadge = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  padding: theme.spacing(0.5, 1),
  borderRadius: theme.shape.borderRadius,
  background: alpha(theme.palette.primary.main, 0.1),
  color: theme.palette.primary.main,
  fontSize: '0.75rem',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
}));

const EditorWrapper = styled(Box)<{ fullscreen: boolean }>(({ theme, fullscreen }) => ({
  position: 'relative',
  flex: 1,
  minHeight: 200,
  ...(fullscreen && {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: theme.zIndex.modal,
    background: theme.palette.background.paper,
  }),
}));

const PlaceholderOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  left: theme.spacing(8),
  color: theme.palette.text.disabled,
  fontFamily: 'Monaco, Menlo, "Ubuntu Mono", Consolas, source-code-pro, monospace',
  fontSize: '0.875rem',
  pointerEvents: 'none',
  userSelect: 'none',
}));

// Monaco editor themes
const customLightTheme = {
  base: 'vs' as const,
  inherit: true,
  rules: [
    { token: 'comment', foreground: '6A737D', fontStyle: 'italic' },
    { token: 'keyword', foreground: 'D73A49' },
    { token: 'string', foreground: '032F62' },
    { token: 'number', foreground: '005CC5' },
  ],
  colors: {
    'editor.background': '#FFFFFF',
    'editor.foreground': '#24292E',
    'editor.lineHighlightBackground': '#F6F8FA',
    'editorLineNumber.foreground': '#959DA5',
    'editorIndentGuide.background': '#D1D5DA',
    'editor.selectionBackground': '#C8E1FF',
  },
};

const customDarkTheme = {
  base: 'vs-dark' as const,
  inherit: true,
  rules: [
    { token: 'comment', foreground: '6A737D', fontStyle: 'italic' },
    { token: 'keyword', foreground: 'F97583' },
    { token: 'string', foreground: '9ECBFF' },
    { token: 'number', foreground: '79B8FF' },
  ],
  colors: {
    'editor.background': '#0D1117',
    'editor.foreground': '#C9D1D9',
    'editor.lineHighlightBackground': '#161B22',
    'editorLineNumber.foreground': '#8B949E',
    'editorIndentGuide.background': '#21262D',
    'editor.selectionBackground': '#3392FF44',
  },
};

// Main component
export const CodeEditor: FC<CodeEditorProps> = ({
  language,
  height = '400px',
  theme: themeProp = 'auto',
  value,
  onChange,
  readOnly = false,
  lineNumbers = true,
  minimap = false,
  fontSize = 14,
  wordWrap = false,
  showToolbar = true,
  autoFormat = false,
  placeholder,
  onSave,
}) => {
  const theme = useTheme();
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [isWrapped, setIsWrapped] = React.useState(wordWrap);
  const [isCopied, setIsCopied] = React.useState(false);

  // Determine theme
  const editorTheme = React.useMemo(() => {
    if (themeProp === 'auto') {
      return theme.palette.mode === 'dark' ? 'custom-dark' : 'custom-light';
    }
    return themeProp === 'dark' ? 'custom-dark' : 'custom-light';
  }, [themeProp, theme.palette.mode]);

  // Handle editor mount
  const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor, monaco: Monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Define custom themes
    monaco.editor.defineTheme('custom-light', customLightTheme);
    monaco.editor.defineTheme('custom-dark', customDarkTheme);

    // Auto format on mount if enabled
    if (autoFormat && !readOnly) {
      window.setTimeout(() => {
        editor.getAction('editor.action.formatDocument')?.run();
      }, 100);
    }

    // Add save shortcut
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      if (onSave) {
        const currentValue = editor.getValue();
        onSave(currentValue);
      }
    });
  };

  // Handle copy to clipboard
  const handleCopy = async () => {
    if (editorRef.current) {
      const text = editorRef.current.getValue();
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      window.setTimeout(() => setIsCopied(false), 2000);
    }
  };

  // Handle fullscreen toggle
  const handleFullscreenToggle = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Handle word wrap toggle
  const handleWrapToggle = () => {
    setIsWrapped(!isWrapped);
    if (editorRef.current) {
      editorRef.current.updateOptions({
        wordWrap: !isWrapped ? 'on' : 'off',
      });
    }
  };

  // Handle format document
  const handleFormat = () => {
    if (editorRef.current && !readOnly) {
      editorRef.current.getAction('editor.action.formatDocument')?.run();
    }
  };

  // Handle ESC key in fullscreen
  useEffect(() => {
    if (isFullscreen) {
      const handleEsc = (e: globalThis.KeyboardEvent) => {
        if (e.key === 'Escape') {
          setIsFullscreen(false);
        }
      };
      window.addEventListener('keydown', handleEsc);
      return () => window.removeEventListener('keydown', handleEsc);
    }
  }, [isFullscreen]);

  const editorOptions: editor.IStandaloneEditorConstructionOptions = {
    readOnly,
    minimap: { enabled: minimap },
    fontSize,
    wordWrap: isWrapped ? 'on' : 'off',
    lineNumbers: lineNumbers ? 'on' : 'off',
    scrollBeyondLastLine: false,
    automaticLayout: true,
    tabSize: 2,
    insertSpaces: true,
    folding: true,
    foldingStrategy: 'indentation',
    showFoldingControls: 'mouseover',
    smoothScrolling: true,
    cursorBlinking: 'smooth',
    cursorSmoothCaretAnimation: 'on',
    renderWhitespace: 'selection',
    renderLineHighlight: 'all',
    selectOnLineNumbers: true,
    roundedSelection: true,
    padding: { top: 16, bottom: 16 },
    fontFamily: 'Monaco, Menlo, "Ubuntu Mono", Consolas, source-code-pro, monospace',
    fontLigatures: true,
  };

  return (
    <EditorContainer elevation={2}>
      {showToolbar && (
        <Toolbar>
          <Stack direction="row" spacing={2} alignItems="center">
            <LanguageBadge>
              <CodeIcon sx={{ fontSize: 14 }} />
              {language}
            </LanguageBadge>
            {readOnly && (
              <Typography variant="caption" color="text.secondary">
                Read Only
              </Typography>
            )}
          </Stack>
          
          <Stack direction="row" spacing={1}>
            {!readOnly && (
              <Tooltip title="Format Code (Ctrl+Shift+F)">
                <IconButton size="small" onClick={handleFormat}>
                  <CodeIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            
            <Tooltip title={isWrapped ? 'Disable Word Wrap' : 'Enable Word Wrap'}>
              <IconButton
                size="small"
                onClick={handleWrapToggle}
                color={isWrapped ? 'primary' : 'default'}
              >
                <WrapIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            
            <Tooltip title={isCopied ? 'Copied!' : 'Copy to Clipboard'}>
              <IconButton
                size="small"
                onClick={handleCopy}
                color={isCopied ? 'success' : 'default'}
              >
                <CopyIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            
            <Tooltip title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}>
              <IconButton size="small" onClick={handleFullscreenToggle}>
                {isFullscreen ? (
                  <ExitFullscreenIcon fontSize="small" />
                ) : (
                  <FullscreenIcon fontSize="small" />
                )}
              </IconButton>
            </Tooltip>
          </Stack>
        </Toolbar>
      )}
      
      <EditorWrapper fullscreen={isFullscreen}>
        {placeholder && !value && (
          <PlaceholderOverlay>{placeholder}</PlaceholderOverlay>
        )}
        
        <Editor
          height={isFullscreen ? '100vh' : height}
          language={language}
          value={value}
          onChange={(newValue) => onChange?.(newValue || '')}
          theme={editorTheme}
          options={editorOptions}
          onMount={handleEditorDidMount}
          loading={
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                color: 'text.secondary',
              }}
            >
              <Typography variant="body2">Loading editor...</Typography>
            </Box>
          }
        />
      </EditorWrapper>
    </EditorContainer>
  );
};

// Export default
export default CodeEditor;
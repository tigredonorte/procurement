import React, { forwardRef, useCallback, useState, useRef } from 'react';
import {
  Box,
  Paper,
  Toolbar,
  IconButton,
  Tooltip,
  Divider,
  Typography,
  useTheme,
  alpha,
} from '@mui/material';
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatStrikethrough,
  FormatListBulleted,
  FormatListNumbered,
  Link,
  Image,
  Code,
  FormatQuote,
} from '@mui/icons-material';

import { RichTextEditorProps, ToolbarConfig } from './RichTextEditor.types';

const DEFAULT_TOOLBAR: Required<Omit<ToolbarConfig, 'customItems'>> & Pick<ToolbarConfig, 'customItems'> = {
  bold: true,
  italic: true,
  underline: true,
  strikethrough: false,
  orderedList: true,
  unorderedList: true,
  link: true,
  image: false,
  codeBlock: false,
  quote: false,
  customItems: [],
};

export const RichTextEditor = forwardRef<HTMLDivElement, RichTextEditorProps>(
  (
    {
      value = '',
      onChange,
      placeholder = 'Start typing...',
      disabled = false,
      readOnly = false,
      toolbar = {},
      height = 300,
      maxLength,
      onFocus,
      onBlur,
      className,
      'data-testid': testId,
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedBy,
      ...props
    },
    ref
  ) => {
    const theme = useTheme();
    const editorRef = useRef<HTMLDivElement>(null);
    const [isFocused, setIsFocused] = useState(false);
    const [content, setContent] = useState(value);

    const toolbarConfig = { ...DEFAULT_TOOLBAR, ...toolbar };

    const handleContentChange = useCallback((newContent: string) => {
      if (maxLength && newContent.length > maxLength) {
        return;
      }
      
      setContent(newContent);
      onChange?.(newContent);
    }, [maxLength, onChange]);

    const handleFocus = useCallback(() => {
      setIsFocused(true);
      onFocus?.();
    }, [onFocus]);

    const handleBlur = useCallback(() => {
      setIsFocused(false);
      onBlur?.();
    }, [onBlur]);

    const applyFormat = useCallback((command: string, value?: string) => {
      if (disabled || readOnly) return;
      
      document.execCommand(command, false, value);
      editorRef.current?.focus();
    }, [disabled, readOnly]);

    const getToolbarButton = (
      key: string,
      icon: React.ReactElement,
      tooltip: string,
      command: string,
      commandValue?: string
    ) => {
      if (!toolbarConfig[key as keyof typeof toolbarConfig]) return null;
      
      return (
        <Tooltip key={key} title={tooltip}>
          <IconButton
            size="small"
            onClick={() => applyFormat(command, commandValue)}
            disabled={disabled || readOnly}
            aria-label={tooltip}
          >
            {icon}
          </IconButton>
        </Tooltip>
      );
    };

    const characterCount = content.replace(/<[^>]*>/g, '').length;

    return (
      <Paper
        ref={ref}
        className={className}
        data-testid={testId}
        elevation={1}
        sx={{
          border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
          borderRadius: 1,
          overflow: 'hidden',
          transition: 'border-color 0.2s ease-in-out',
          ...(isFocused && {
            borderColor: theme.palette.primary.main,
            boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
          }),
          ...(disabled && {
            backgroundColor: theme.palette.action.disabledBackground,
            color: theme.palette.text.disabled,
          }),
        }}
        {...props}
      >
        {/* Toolbar */}
        <Toolbar
          variant="dense"
          sx={{
            minHeight: 48,
            px: 1,
            borderBottom: `1px solid ${theme.palette.divider}`,
            backgroundColor: alpha(theme.palette.background.paper, 0.8),
          }}
        >
          {getToolbarButton('bold', <FormatBold />, 'Bold', 'bold')}
          {getToolbarButton('italic', <FormatItalic />, 'Italic', 'italic')}
          {getToolbarButton('underline', <FormatUnderlined />, 'Underline', 'underline')}
          {getToolbarButton('strikethrough', <FormatStrikethrough />, 'Strikethrough', 'strikeThrough')}
          
          {(toolbarConfig.bold || toolbarConfig.italic || toolbarConfig.underline || toolbarConfig.strikethrough) && 
           (toolbarConfig.orderedList || toolbarConfig.unorderedList) && (
            <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
          )}
          
          {getToolbarButton('orderedList', <FormatListNumbered />, 'Numbered List', 'insertOrderedList')}
          {getToolbarButton('unorderedList', <FormatListBulleted />, 'Bulleted List', 'insertUnorderedList')}
          
          {(toolbarConfig.orderedList || toolbarConfig.unorderedList) && 
           (toolbarConfig.link || toolbarConfig.image || toolbarConfig.codeBlock || toolbarConfig.quote) && (
            <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
          )}
          
          {getToolbarButton('link', <Link />, 'Insert Link', 'createLink', 'https://')}
          {getToolbarButton('image', <Image />, 'Insert Image', 'insertImage')}
          {getToolbarButton('codeBlock', <Code />, 'Code Block', 'formatBlock', 'pre')}
          {getToolbarButton('quote', <FormatQuote />, 'Quote', 'formatBlock', 'blockquote')}
          
          {/* Custom toolbar items */}
          {toolbarConfig.customItems && toolbarConfig.customItems.length > 0 && (
            <>
              <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
              {toolbarConfig.customItems.map((item) => (
                <Tooltip key={item.id} title={item.label}>
                  <IconButton
                    size="small"
                    onClick={() => item.action(editorRef.current)}
                    disabled={item.disabled || disabled || readOnly}
                    aria-label={item.label}
                  >
                    {item.icon}
                  </IconButton>
                </Tooltip>
              ))}
            </>
          )}
          
          <Box sx={{ flexGrow: 1 }} />
          
          {/* Character count */}
          {maxLength && (
            <Typography
              variant="caption"
              color={characterCount > maxLength * 0.8 ? 'error' : 'text.secondary'}
              sx={{ mr: 1 }}
            >
              {characterCount}/{maxLength}
            </Typography>
          )}
        </Toolbar>

        {/* Editor */}
        <Box
          ref={editorRef}
          contentEditable={!disabled && !readOnly}
          onInput={(e) => handleContentChange(e.currentTarget.innerHTML)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          dangerouslySetInnerHTML={{ __html: content }}
          role="textbox"
          aria-label={ariaLabel || 'Rich text editor'}
          aria-describedby={ariaDescribedBy}
          aria-multiline="true"
          tabIndex={disabled ? -1 : 0}
          sx={{
            minHeight: typeof height === 'number' ? `${height}px` : height,
            p: 2,
            outline: 'none',
            cursor: disabled ? 'not-allowed' : 'text',
            '&:empty::before': {
              content: `"${placeholder}"`,
              color: theme.palette.text.disabled,
              pointerEvents: 'none',
            },
            '& p': {
              margin: '8px 0',
              '&:first-of-type': {
                marginTop: 0,
              },
              '&:last-of-type': {
                marginBottom: 0,
              },
            },
            '& ul, & ol': {
              marginLeft: theme.spacing(2),
            },
            '& blockquote': {
              borderLeft: `4px solid ${theme.palette.primary.main}`,
              paddingLeft: theme.spacing(2),
              margin: `${theme.spacing(1)} 0`,
              fontStyle: 'italic',
              backgroundColor: alpha(theme.palette.primary.main, 0.05),
            },
            '& pre': {
              backgroundColor: alpha(theme.palette.text.primary, 0.08),
              padding: theme.spacing(1),
              borderRadius: 1,
              fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
              fontSize: '0.875rem',
              overflow: 'auto',
            },
            '& a': {
              color: theme.palette.primary.main,
              textDecoration: 'underline',
            },
          }}
        />
      </Paper>
    );
  }
);

RichTextEditor.displayName = 'RichTextEditor';

export default RichTextEditor;
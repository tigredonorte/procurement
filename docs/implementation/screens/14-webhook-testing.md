## 26. Webhook Testing & Logs

### 26.1 Webhook Test Screen

**Layout:**
```typescript
Card {
  variant: 'glass',
  padding: 'lg'
}

// Test Configuration
Stack {
  direction: 'column',
  gap: 'lg'
}

Select {
  label: 'Select Webhook',
  placeholder: 'Choose a webhook to test',
  options: configuredWebhooks
}

// Payload Editor
Label {
  text: 'Test Payload'
}

CodeEditor {
  language: 'json',
  height: '300px',
  theme: darkMode ? 'dark' : 'light',
  value: testPayload,
  onChange: setTestPayload
}

// Test Controls
Stack {
  direction: 'row',
  gap: 'md',
  align: 'center'
}

Button {
  variant: 'gradient',
  icon: <SendIcon />,
  text: 'Send Test',
  loading: isTesting
}

Button {
  variant: 'outline',
  icon: <RefreshIcon />,
  text: 'Reset Payload'
}

// Response Display
Card {
  variant: 'elevated',
  padding: 'md',
  marginTop: 'lg'
}

Tabs {
  tabs: [
    {
      value: 'response',
      label: 'Response',
      content: <CodeBlock language="json" text={responseBody} />
    },
    {
      value: 'headers',
      label: 'Headers',
      content: <CodeBlock language="http" text={responseHeaders} />
    },
    {
      value: 'timing',
      label: 'Timing',
      content: <TimingDiagram data={timingData} />
    }
  ]
}
```

### 26.2 Webhook Logs Screen (`/app/webhooks/logs`)

**Layout:**
```typescript
// Filters
Stack {
  direction: 'row',
  gap: 'md',
  marginBottom: 'lg'
}

Select {
  placeholder: 'All webhooks',
  options: webhookOptions
}

Select {
  placeholder: 'All statuses',
  options: [
    { value: 'success', label: 'Success' },
    { value: 'failed', label: 'Failed' },
    { value: 'pending', label: 'Pending' }
  ]
}

DateRangePicker {
  placeholder: 'Last 24 hours'
}

// Logs Table
Table {
  variant: 'striped',
  columns: [
    { key: 'timestamp', label: 'Time', sortable: true },
    { key: 'webhook', label: 'Webhook' },
    { key: 'event', label: 'Event' },
    { key: 'status', label: 'Status' },
    { key: 'statusCode', label: 'Response Code' },
    { key: 'duration', label: 'Duration' },
    { key: 'actions', label: '' }
  ]
}

// Log Detail Modal
Modal {
  title: 'Webhook Log Details',
  size: 'lg'
}

Tabs {
  tabs: [
    {
      value: 'request',
      label: 'Request',
      content: <CodeBlock language="json" text={requestBody} />
    },
    {
      value: 'response',
      label: 'Response',
      content: <CodeBlock language="json" text={responseBody} />
    },
    {
      value: 'error',
      label: 'Error',
      content: <Alert variant="danger" description={errorMessage} />
    }
  ]
}

// Retry Button
Button {
  variant: 'outline',
  icon: <RefreshIcon />,
  text: 'Retry',
  onClick: retryWebhook
}
```


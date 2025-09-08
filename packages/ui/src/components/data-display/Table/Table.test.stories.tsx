import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within, expect, waitFor, fn } from '@storybook/test';
import { useState } from 'react';
import { 
  Box, 
  Typography, 
  Chip,
  Stack,
  IconButton,
  useTheme
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon 
} from '@mui/icons-material';

import { Table } from './Table';
import { ColumnConfig, SortConfig } from './Table.types';

const meta: Meta<typeof Table> = {
  title: 'Data Display/Table/Tests',
  component: Table,
  parameters: { 
    layout: 'centered', 
    chromatic: { disableSnapshot: false } 
  },
  tags: ['autodocs', 'test'],
};

export default meta;
export type Story = StoryObj<typeof meta>;

// Test data
const testData = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active', priority: 1 },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Inactive', priority: 2 },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Editor', status: 'Active', priority: 3 },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'User', status: 'Active', priority: 4 },
  { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: 'Admin', status: 'Inactive', priority: 5 },
];

const basicColumns: ColumnConfig[] = [
  { key: 'name', label: 'Name', sortable: true, priority: 1 },
  { key: 'email', label: 'Email', sortable: true, priority: 2 },
  { key: 'role', label: 'Role', sortable: true, priority: 3 },
  { 
    key: 'status', 
    label: 'Status', 
    sortable: true, 
    priority: 4, 
    render: (value) => (
      <Chip 
        label={value as string} 
        color={(value as string) === 'Active' ? 'success' : 'default'}
        size="small"
        data-testid="status-chip"
      />
    )
  },
];

const extendedColumns: ColumnConfig[] = [
  ...basicColumns,
  {
    key: 'actions',
    label: 'Actions',
    sortable: false,
    priority: 5,
    width: 120,
    render: (_value, rowData) => (
      <Stack direction="row" spacing={1}>
        <IconButton 
          size="small" 
          color="primary"
          data-testid={`edit-button-${(rowData as Record<string, unknown>).id}`}
        >
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton 
          size="small" 
          color="error"
          data-testid={`delete-button-${(rowData as Record<string, unknown>).id}`}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Stack>
    )
  }
];

// Large dataset for performance testing
const generateLargeDataset = (size: number) => {
  return Array.from({ length: size }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    role: i % 3 === 0 ? 'Admin' : i % 2 === 0 ? 'Editor' : 'User',
    status: i % 2 === 0 ? 'Active' : 'Inactive',
    priority: i + 1,
  }));
};

// Test Stories
export const BasicInteraction: Story = {
  render: function BasicInteractionTable() {
    const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'name', direction: 'asc' });
    
    const sortedData = [...testData].sort((a, b) => {
      const aValue = a[sortConfig.key as keyof typeof a];
      const bValue = b[sortConfig.key as keyof typeof b];
      if (sortConfig.direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    return (
      <Box width={800}>
        <Table
          data-testid="interactive-table"
          columns={basicColumns}
          data={sortedData}
          selectable
          sortable
          selectedRows={selectedRows}
          onSelectionChange={setSelectedRows}
          sortConfig={sortConfig}
          onSortChange={(key, direction) => setSortConfig({ key, direction })}
          hoverable
          variant="default"
        />
      </Box>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const table = canvas.getByTestId('interactive-table');
    
    await expect(table).toBeInTheDocument();
    
    // Test sorting interaction
    const nameHeader = canvas.getByRole('button', { name: /name/i });
    await userEvent.click(nameHeader);
    
    // Test row selection
    const firstCheckbox = canvas.getAllByRole('checkbox')[1]; // First row checkbox (skip header)
    await userEvent.click(firstCheckbox);
    await expect(firstCheckbox).toBeChecked();
    
    // Test hover interaction
    const firstRow = canvas.getByRole('row', { name: /John Doe/i });
    await userEvent.hover(firstRow);
    
    await waitFor(() => {
      expect(table).toBeVisible();
    });
  },
};

export const FormInteraction: Story = {
  render: function FormInteractionTable() {
    const [selectedRows, setSelectedRows] = useState<(string | number)[]>([1, 3]);
    const [data, setData] = useState(testData);
    
    const handleEdit = fn((rowData: Record<string, unknown>) => {
      // Edit action for rowData
      void rowData;
    });
    
    const handleDelete = fn((rowData: Record<string, unknown>) => {
      // Delete action for rowData
      setData(prev => prev.filter(item => item.id !== rowData.id));
    });
    
    const columnsWithActions: ColumnConfig[] = [
      ...basicColumns,
      {
        key: 'actions',
        label: 'Actions',
        sortable: false,
        priority: 5,
        render: (_value, rowData) => (
          <Stack direction="row" spacing={1}>
            <IconButton 
              size="small" 
              color="primary"
              onClick={() => handleEdit(rowData)}
              data-testid={`edit-${(rowData as Record<string, unknown>).id}`}
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton 
              size="small" 
              color="error"
              onClick={() => handleDelete(rowData)}
              data-testid={`delete-${(rowData as Record<string, unknown>).id}`}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Stack>
        )
      }
    ];
    
    return (
      <Box width={800}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Selected: {selectedRows.join(', ')}
        </Typography>
        <Table
          data-testid="form-table"
          columns={columnsWithActions}
          data={data}
          selectable
          selectedRows={selectedRows}
          onSelectionChange={setSelectedRows}
          variant="striped"
        />
      </Box>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Test select all functionality
    const selectAllCheckbox = canvas.getAllByRole('checkbox')[0];
    await userEvent.click(selectAllCheckbox);
    
    await waitFor(() => {
      const checkboxes = canvas.getAllByRole('checkbox');
      checkboxes.slice(1).forEach(checkbox => {
        expect(checkbox).toBeChecked();
      });
    });
    
    // Test individual checkbox interaction
    const firstRowCheckbox = canvas.getAllByRole('checkbox')[1];
    await userEvent.click(firstRowCheckbox);
    await expect(firstRowCheckbox).not.toBeChecked();
    
    // Test action button interaction
    const editButton = canvas.getByTestId('edit-1');
    await userEvent.click(editButton);
    
    const deleteButton = canvas.getByTestId('delete-2');
    await userEvent.click(deleteButton);
    
    await waitFor(() => {
      expect(canvas.queryByText('Jane Smith')).not.toBeInTheDocument();
    });
  },
};

export const KeyboardNavigation: Story = {
  render: function KeyboardNavigationTable() {
    const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
    const [focusedRow, setFocusedRow] = useState<number | null>(null);
    
    return (
      <Box width={800}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Use Tab, Arrow keys, Space, and Enter to navigate. Focused row: {focusedRow || 'None'}
        </Typography>
        <Table
          data-testid="keyboard-table"
          columns={extendedColumns}
          data={testData}
          selectable
          sortable
          selectedRows={selectedRows}
          onSelectionChange={setSelectedRows}
          onRowFocus={(event, rowData) => setFocusedRow((rowData as Record<string, unknown>).id as number)}
          onRowBlur={() => setFocusedRow(null)}
          variant="default"
        />
      </Box>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const table = canvas.getByTestId('keyboard-table');
    
    // Test Tab navigation
    await userEvent.tab();
    const firstCheckbox = canvas.getAllByRole('checkbox')[0];
    await expect(firstCheckbox).toHaveFocus();
    
    // Test Space for checkbox selection
    await userEvent.keyboard(' ');
    await expect(firstCheckbox).toBeChecked();
    
    // Test navigation to sort buttons
    await userEvent.tab();
    await userEvent.tab();
    const sortButton = canvas.getByTestId('sort-indicator');
    await expect(sortButton).toHaveFocus();
    
    // Test Enter on sort button
    await userEvent.keyboard('{Enter}');
    
    await waitFor(() => {
      expect(table).toBeVisible();
    });
  },
};

export const ScreenReader: Story = {
  render: function ScreenReaderTable() {
    const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
    
    return (
      <Box width={800}>
        <Typography id="table-caption" variant="h6" gutterBottom>
          User Management Table
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          A table showing user information with sortable columns and row selection
        </Typography>
        <Table
          data-testid="accessible-table"
          columns={basicColumns}
          data={testData}
          selectable
          sortable
          selectedRows={selectedRows}
          onSelectionChange={setSelectedRows}
          variant="default"
          aria-label="User management table"
          aria-describedby="table-caption"
          role="table"
        />
      </Box>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const table = canvas.getByTestId('accessible-table');
    
    // Test table has proper ARIA attributes
    await expect(table).toHaveAttribute('aria-label');
    
    // Test column headers have proper role and scope
    const columnHeaders = canvas.getAllByRole('columnheader');
    expect(columnHeaders).toHaveLength(5); // 4 columns + checkbox column
    
    // Test row selection accessibility
    const selectAllCheckbox = canvas.getAllByRole('checkbox')[0];
    await expect(selectAllCheckbox).toHaveAttribute('aria-label', 'select all');
    
    const firstRowCheckbox = canvas.getAllByRole('checkbox')[1];
    await expect(firstRowCheckbox).toHaveAttribute('aria-label', 'select row 0');
    
    // Test sort labels are accessible
    const sortButtons = canvas.getAllByRole('button');
    const nameSortButton = sortButtons.find(button => button.textContent?.includes('Name'));
    await expect(nameSortButton).toBeInTheDocument();
    
    await waitFor(() => {
      expect(table).toBeVisible();
    });
  },
};

export const FocusManagement: Story = {
  render: function FocusManagementTable() {
    const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
    const [sortConfig, setSortConfig] = useState<SortConfig>();
    
    return (
      <Box width={800}>
        <button data-testid="before-table">Before Table</button>
        <Table
          data-testid="focus-table"
          columns={extendedColumns}
          data={testData}
          selectable
          sortable
          selectedRows={selectedRows}
          onSelectionChange={setSelectedRows}
          sortConfig={sortConfig}
          onSortChange={(key, direction) => setSortConfig({ key, direction })}
          variant="default"
        />
        <button data-testid="after-table">After Table</button>
      </Box>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Test focus moves into table
    const beforeButton = canvas.getByTestId('before-table');
    beforeButton.focus();
    
    await userEvent.tab();
    const firstCheckbox = canvas.getAllByRole('checkbox')[0];
    await expect(firstCheckbox).toHaveFocus();
    
    // Test focus moves through table elements
    await userEvent.tab();
    await userEvent.tab();
    const nameSort = canvas.getByRole('button', { name: /name/i });
    await expect(nameSort).toHaveFocus();
    
    // Test focus moves to action buttons
    for (let i = 0; i < 10; i++) {
      await userEvent.tab();
    }
    
    const editButton = canvas.getByTestId('edit-button-1');
    await expect(editButton).toHaveFocus();
    
    // Test focus eventually leaves table
    await userEvent.tab();
    await userEvent.tab();
    const afterButton = canvas.getByTestId('after-table');
    await expect(afterButton).toHaveFocus();
  },
};

export const ResponsiveDesign: Story = {
  render: function ResponsiveTable() {
    const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
    
    return (
      <Box>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Resize viewport to test responsive behavior. Lower priority columns hide first.
        </Typography>
        <Box data-testid="responsive-container" width="100%" maxWidth={400}>
          <Table
            data-testid="responsive-table"
            columns={extendedColumns}
            data={testData}
            responsive
            columnPriorities={[1, 2, 3, 4, 5]}
            showColumnToggle
            selectable
            selectedRows={selectedRows}
            onSelectionChange={setSelectedRows}
            variant="glass"
          />
        </Box>
      </Box>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const table = canvas.getByTestId('responsive-table');
    
    await expect(table).toBeInTheDocument();
    
    // Test that essential columns are visible
    await expect(canvas.getByText('Name')).toBeVisible();
    await expect(canvas.getByText('Email')).toBeVisible();
    
    // Test column toggle functionality (mobile behavior simulation)
    const columnToggle = canvas.queryByRole('button', { name: '' });
    if (columnToggle) {
      await userEvent.click(columnToggle);
    }
    
    await waitFor(() => {
      expect(table).toBeVisible();
    });
  },
  parameters: {
    viewport: { defaultViewport: 'mobile1' }
  }
};

export const ThemeVariations: Story = {
  render: function ThemeVariationsTable() {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    
    return (
      <Stack spacing={3}>
        <Typography variant="h6">
          Current theme: {isDark ? 'Dark' : 'Light'} Mode
        </Typography>
        
        {(['default', 'striped', 'glass', 'minimal', 'gradient'] as const).map(variant => (
          <Box key={variant}>
            <Typography variant="subtitle1" gutterBottom>
              {variant.charAt(0).toUpperCase() + variant.slice(1)} Variant
            </Typography>
            <Table
              data-testid={`theme-table-${variant}`}
              columns={basicColumns}
              data={testData.slice(0, 3)}
              variant={variant}
              hoverable={variant !== 'minimal'}
            />
          </Box>
        ))}
      </Stack>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Test each variant renders correctly
    const variants = ['default', 'striped', 'glass', 'minimal', 'gradient'];
    
    for (const variant of variants) {
      const table = canvas.getByTestId(`theme-table-${variant}`);
      await expect(table).toBeVisible();
      
      // Test hover state for hoverable tables
      if (variant !== 'minimal') {
        const firstRow = within(table).getAllByRole('row')[1]; // Skip header
        await userEvent.hover(firstRow);
      }
    }
    
    await waitFor(() => {
      expect(canvas.getByText('Current theme:')).toBeVisible();
    });
  },
};

export const VisualStates: Story = {
  render: function VisualStatesTable() {
    const [selectedRows, setSelectedRows] = useState<(string | number)[]>([1, 3]);
    
    return (
      <Stack spacing={4}>
        <Box>
          <Typography variant="h6" gutterBottom>Loading State</Typography>
          <Table
            data-testid="loading-table"
            columns={basicColumns}
            data={[]}
            loading
            variant="default"
          />
        </Box>
        
        <Box>
          <Typography variant="h6" gutterBottom>Empty State</Typography>
          <Table
            data-testid="empty-table"
            columns={basicColumns}
            data={[]}
            variant="minimal"
            emptyStateComponent={
              <Box py={4} textAlign="center" data-testid="empty-state">
                <Typography variant="h6" color="text.secondary">
                  No data available
                </Typography>
              </Box>
            }
          />
        </Box>
        
        <Box>
          <Typography variant="h6" gutterBottom>Selection State</Typography>
          <Table
            data-testid="selection-table"
            columns={basicColumns}
            data={testData}
            selectable
            selectedRows={selectedRows}
            onSelectionChange={setSelectedRows}
            variant="default"
          />
        </Box>
        
        <Box>
          <Typography variant="h6" gutterBottom>Visual Effects</Typography>
          <Table
            data-testid="effects-table"
            columns={basicColumns}
            data={testData.slice(0, 3)}
            glow
            pulse
            variant="glass"
          />
        </Box>
      </Stack>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Test loading state
    const loadingTable = canvas.getByTestId('loading-table');
    await expect(loadingTable).toBeVisible();
    
    const loadingIndicator = canvas.getByTestId('table-loading');
    await expect(loadingIndicator).toBeInTheDocument();
    
    // Test empty state
    const emptyTable = canvas.getByTestId('empty-table');
    await expect(emptyTable).toBeVisible();
    
    const emptyState = canvas.getByTestId('empty-state');
    await expect(emptyState).toBeVisible();
    await expect(canvas.getByText('No data available')).toBeVisible();
    
    // Test selection state
    const selectionTable = canvas.getByTestId('selection-table');
    await expect(selectionTable).toBeVisible();
    
    const selectedRows = within(selectionTable).getAllByRole('checkbox').filter(cb => (cb as HTMLInputElement).checked);
    expect(selectedRows.length).toBeGreaterThan(0);
    
    // Test visual effects
    const effectsTable = canvas.getByTestId('effects-table');
    await expect(effectsTable).toBeVisible();
    
    await waitFor(() => {
      expect(loadingTable).toBeVisible();
    });
  },
};

export const Performance: Story = {
  render: function PerformanceTable() {
    const largeDataset = generateLargeDataset(1000);
    const [sortConfig, setSortConfig] = useState<SortConfig>();
    
    return (
      <Stack spacing={3}>
        <Box>
          <Typography variant="h6" gutterBottom>
            Large Dataset - 1,000 rows (Virtual Scrolling)
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Only visible rows are rendered for optimal performance
          </Typography>
          <Box height={400}>
            <Table
              data-testid="performance-table"
              columns={basicColumns}
              data={largeDataset}
              virtualScrolling
              rowHeight={52}
              containerHeight={400}
              overscan={5}
              sortable
              sortConfig={sortConfig}
              onSortChange={(key, direction) => setSortConfig({ key, direction })}
              variant="minimal"
            />
          </Box>
        </Box>
        
        <Box>
          <Typography variant="h6" gutterBottom>
            Regular Table - Same Data (Performance Comparison)
          </Typography>
          <Box height={300} overflow="auto">
            <Table
              data-testid="regular-table"
              columns={basicColumns}
              data={largeDataset.slice(0, 100)} // Limit for performance
              variant="default"
            />
          </Box>
        </Box>
      </Stack>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Test virtual scrolling table
    const performanceTable = canvas.getByTestId('performance-table');
    await expect(performanceTable).toBeVisible();
    
    // Test scrolling performance
    const scrollContainer = performanceTable.closest('[style*="overflow: auto"]');
    if (scrollContainer) {
      scrollContainer.scrollTop = 1000;
      await waitFor(() => {
        expect(scrollContainer.scrollTop).toBeGreaterThan(0);
      });
    }
    
    // Test sorting with large dataset
    const sortButton = canvas.getByRole('button', { name: /name/i });
    const startTime = Date.now();
    
    await userEvent.click(sortButton);
    
    await waitFor(() => {
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // Performance expectation: sorting should complete within reasonable time
      expect(duration).toBeLessThan(1000); // Less than 1 second
      expect(performanceTable).toBeVisible();
    });
    
    // Test regular table
    const regularTable = canvas.getByTestId('regular-table');
    await expect(regularTable).toBeVisible();
  },
};

export const EdgeCases: Story = {
  render: function EdgeCasesTable() {
    const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
    
    // Edge case data
    const singleRow = [{ id: 1, name: 'Only User', email: 'only@example.com', role: 'Admin', status: 'Active' }];
    
    const longContentData = [
      { 
        id: 1, 
        name: 'User with Very Long Name That Might Break Layout and Cause Issues',
        email: 'very.long.email.address.that.might.cause.overflow@example-domain-with-long-name.com',
        role: 'Administrator with Extended Privileges',
        status: 'Active but Under Review' 
      },
      {
        id: 2,
        name: 'Normal User',
        email: 'normal@example.com',
        role: 'User',
        status: 'Active'
      }
    ];
    
    const specialCharData = [
      { id: 1, name: 'User <script>alert("xss")</script>', email: '\'test@example.com', role: '"Admin"', status: '&Active&' },
      { id: 2, name: 'Unicode 🚀 User', email: 'üñîçødé@example.com', role: 'Ädmin', status: 'Åctive' },
    ];
    
    return (
      <Stack spacing={4}>
        <Box>
          <Typography variant="h6" gutterBottom>Empty Data</Typography>
          <Table
            data-testid="empty-data-table"
            columns={basicColumns}
            data={[]}
            variant="default"
          />
        </Box>
        
        <Box>
          <Typography variant="h6" gutterBottom>Single Row</Typography>
          <Table
            data-testid="single-row-table"
            columns={basicColumns}
            data={singleRow}
            selectable
            selectedRows={selectedRows}
            onSelectionChange={setSelectedRows}
            variant="striped"
          />
        </Box>
        
        <Box>
          <Typography variant="h6" gutterBottom>Long Content</Typography>
          <Box width={600}>
            <Table
              data-testid="long-content-table"
              columns={basicColumns}
              data={longContentData}
              variant="default"
            />
          </Box>
        </Box>
        
        <Box>
          <Typography variant="h6" gutterBottom>Special Characters & XSS Protection</Typography>
          <Table
            data-testid="special-chars-table"
            columns={basicColumns}
            data={specialCharData}
            variant="minimal"
          />
        </Box>
        
        <Box>
          <Typography variant="h6" gutterBottom>No Columns Defined</Typography>
          <Table
            data-testid="no-columns-table"
            data={testData}
            variant="default"
          />
        </Box>
      </Stack>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Test empty data
    const emptyTable = canvas.getByTestId('empty-data-table');
    await expect(emptyTable).toBeVisible();
    await expect(canvas.getByText('No data available')).toBeVisible();
    
    // Test single row
    const singleRowTable = canvas.getByTestId('single-row-table');
    await expect(singleRowTable).toBeVisible();
    
    const singleRowCheckbox = within(singleRowTable).getAllByRole('checkbox')[1];
    await userEvent.click(singleRowCheckbox);
    await expect(singleRowCheckbox).toBeChecked();
    
    // Test long content doesn't break layout
    const longContentTable = canvas.getByTestId('long-content-table');
    await expect(longContentTable).toBeVisible();
    
    const longNameCell = canvas.getByText(/User with Very Long Name/);
    await expect(longNameCell).toBeVisible();
    
    // Test special characters are handled safely
    const specialCharsTable = canvas.getByTestId('special-chars-table');
    await expect(specialCharsTable).toBeVisible();
    
    // Ensure XSS content is escaped
    const xssContent = canvas.queryByText(/<script>/);
    expect(xssContent).toBeInTheDocument(); // Should be visible as text, not executed
    
    // Test unicode characters
    const unicodeContent = canvas.getByText(/🚀/);
    await expect(unicodeContent).toBeVisible();
    
    // Test no columns case
    const noColumnsTable = canvas.getByTestId('no-columns-table');
    await expect(noColumnsTable).toBeVisible();
    
    await waitFor(() => {
      expect(emptyTable).toBeVisible();
    });
  },
};

export const Integration: Story = {
  render: function IntegrationTable() {
    const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'name', direction: 'asc' });
    const [data, setData] = useState(testData);
    const [density, setDensity] = useState<'compact' | 'normal' | 'comfortable'>('normal');
    
    const sortedData = [...data].sort((a, b) => {
      const aValue = a[sortConfig.key as keyof typeof a];
      const bValue = b[sortConfig.key as keyof typeof b];
      if (sortConfig.direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    const handleDelete = (rowData: Record<string, unknown>) => {
      setData(prev => prev.filter(item => item.id !== rowData.id));
      setSelectedRows(prev => prev.filter(id => id !== rowData.id));
    };
    
    const integrationColumns: ColumnConfig[] = [
      ...basicColumns,
      {
        key: 'actions',
        label: 'Actions',
        sortable: false,
        priority: 5,
        render: (_value, rowData) => (
          <IconButton 
            size="small" 
            color="error"
            onClick={() => handleDelete(rowData)}
            data-testid={`delete-${(rowData as Record<string, unknown>).id}`}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        )
      }
    ];
    
    return (
      <Box width={900}>
        <Stack direction="row" spacing={2} mb={2}>
          <button
            onClick={() => setDensity('compact')}
            data-testid="density-compact"
          >
            Compact
          </button>
          <button
            onClick={() => setDensity('normal')}
            data-testid="density-normal"
          >
            Normal
          </button>
          <button
            onClick={() => setDensity('comfortable')}
            data-testid="density-comfortable"
          >
            Comfortable
          </button>
        </Stack>
        
        <Typography variant="body2" gutterBottom>
          Selected: {selectedRows.length} rows | Density: {density} | Total: {data.length} rows
        </Typography>
        
        <Box height={400}>
          <Table
            data-testid="integration-table"
            columns={integrationColumns}
            data={sortedData}
            
            // All features combined
            selectable
            sortable
            hoverable
            responsive
            stickyHeader
            
            // State
            selectedRows={selectedRows}
            onSelectionChange={setSelectedRows}
            sortConfig={sortConfig}
            onSortChange={(key, direction) => setSortConfig({ key, direction })}
            density={density}
            
            // Visual
            variant="gradient"
            glow
            
            // Container
            containerHeight={350}
            columnPriorities={[1, 2, 3, 4, 5]}
          />
        </Box>
      </Box>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const table = canvas.getByTestId('integration-table');
    
    await expect(table).toBeVisible();
    
    // Test density change
    const compactButton = canvas.getByTestId('density-compact');
    await userEvent.click(compactButton);
    await expect(canvas.getByText(/Density: compact/)).toBeVisible();
    
    // Test selection with all features
    const selectAllCheckbox = canvas.getAllByRole('checkbox')[0];
    await userEvent.click(selectAllCheckbox);
    
    await waitFor(() => {
      expect(canvas.getByText(/Selected: 5 rows/)).toBeVisible();
    });
    
    // Test sorting with all features
    const emailSort = canvas.getByRole('button', { name: /email/i });
    await userEvent.click(emailSort);
    
    // Test deletion affecting all systems
    const deleteButton = canvas.getByTestId('delete-1');
    await userEvent.click(deleteButton);
    
    await waitFor(() => {
      expect(canvas.getByText(/Total: 4 rows/)).toBeVisible();
      expect(canvas.getByText(/Selected: 4 rows/)).toBeVisible(); // Selection adjusted
    });
    
    // Test density change with fewer rows
    const comfortableButton = canvas.getByTestId('density-comfortable');
    await userEvent.click(comfortableButton);
    
    await waitFor(() => {
      expect(canvas.getByText(/Density: comfortable/)).toBeVisible();
      expect(table).toBeVisible();
    });
  },
};
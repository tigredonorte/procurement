import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Chip, 
  Avatar, 
  Stack,
  Box,
  Typography,
  Button,
  IconButton
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Star as StarIcon
} from '@mui/icons-material';

import { Table } from './Table';
import { ColumnConfig, SortConfig } from './Table.types';

const meta = {
  title: 'Data Display/Table',
  component: Table,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample data
const sampleData = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active', salary: 75000, department: 'Engineering', joinDate: '2020-01-15' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active', salary: 65000, department: 'Design', joinDate: '2021-03-22' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Editor', status: 'Inactive', salary: 55000, department: 'Marketing', joinDate: '2019-07-10' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'User', status: 'Active', salary: 70000, department: 'Engineering', joinDate: '2020-11-05' },
  { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: 'Admin', status: 'Active', salary: 80000, department: 'Engineering', joinDate: '2018-09-12' },
  { id: 6, name: 'Diana Prince', email: 'diana@example.com', role: 'Editor', status: 'Active', salary: 60000, department: 'Content', joinDate: '2021-01-08' },
];

// Generate large dataset for virtual scrolling
const generateLargeDataset = (size: number) => {
  const departments = ['Engineering', 'Design', 'Marketing', 'Sales', 'HR', 'Finance'];
  const roles = ['Admin', 'User', 'Editor', 'Manager'];
  const statuses = ['Active', 'Inactive'];
  
  return Array.from({ length: size }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    role: roles[i % roles.length],
    status: statuses[i % statuses.length],
    salary: 50000 + (i * 1000) % 50000,
    department: departments[i % departments.length],
    joinDate: `202${(i % 4) + 0}-0${(i % 9) + 1}-${10 + (i % 20)}`,
  }));
};

const largeDataset = generateLargeDataset(10000);

// Column configurations
const basicColumns: ColumnConfig[] = [
  { key: 'name', label: 'Name', sortable: true, priority: 1 },
  { key: 'email', label: 'Email', sortable: true, priority: 2 },
  { key: 'role', label: 'Role', sortable: true, priority: 3 },
  { key: 'status', label: 'Status', sortable: true, priority: 4, render: (value) => (
    <Chip 
      label={value} 
      color={value === 'Active' ? 'success' : 'default'}
      size="small"
    />
  )},
];

const extendedColumns: ColumnConfig[] = [
  { 
    key: 'avatar', 
    label: 'Avatar', 
    sortable: false, 
    priority: 1,
    width: 60,
    render: (_, rowData) => (
      <Avatar sx={{ width: 32, height: 32 }}>
        {rowData.name.charAt(0)}
      </Avatar>
    )
  },
  { key: 'name', label: 'Name', sortable: true, priority: 2 },
  { key: 'email', label: 'Email', sortable: true, priority: 3 },
  { key: 'department', label: 'Department', sortable: true, priority: 4 },
  { key: 'role', label: 'Role', sortable: true, priority: 5 },
  { 
    key: 'salary', 
    label: 'Salary', 
    sortable: true, 
    priority: 6,
    align: 'right' as const,
    render: (value) => `$${value.toLocaleString()}`
  },
  { 
    key: 'status', 
    label: 'Status', 
    sortable: true, 
    priority: 7,
    render: (value) => (
      <Chip 
        label={value} 
        color={value === 'Active' ? 'success' : 'default'}
        size="small"
      />
    )
  },
  {
    key: 'actions',
    label: 'Actions',
    sortable: false,
    priority: 8,
    width: 120,
    render: (_, rowData) => (
      <Stack direction="row" spacing={1}>
        <IconButton size="small" color="primary">
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" color="error">
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Stack>
    )
  }
];

export const Default: Story = {
  render: () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sampleData.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.email}</TableCell>
              <TableCell>{row.role}</TableCell>
              <TableCell>
                <Chip 
                  label={row.status} 
                  color={row.status === 'Active' ? 'success' : 'default'}
                  size="small"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  ),
};

export const DensityOptions: Story = {
  render: () => (
    <Stack spacing={4}>
      <Box>
        <Typography variant="h6" gutterBottom>Compact Density</Typography>
        <Table 
          columns={basicColumns}
          data={sampleData.slice(0, 3)}
          density="compact"
        />
      </Box>
      
      <Box>
        <Typography variant="h6" gutterBottom>Normal Density (Default)</Typography>
        <Table 
          columns={basicColumns}
          data={sampleData.slice(0, 3)}
          density="normal"
        />
      </Box>
      
      <Box>
        <Typography variant="h6" gutterBottom>Comfortable Density</Typography>
        <Table 
          columns={basicColumns}
          data={sampleData.slice(0, 3)}
          density="comfortable"
        />
      </Box>
    </Stack>
  ),
};

export const StickyHeader: Story = {
  render: () => (
    <Box height={300}>
      <Table
        columns={extendedColumns}
        data={sampleData.concat(sampleData).concat(sampleData)} // Triple the data for scrolling
        stickyHeader
        variant="striped"
        containerHeight={300}
      />
    </Box>
  ),
};

export const RowSelection: Story = {
  render: function RowSelectionTable() {
    const [selectedRows, setSelectedRows] = useState<(string | number)[]>([1, 3]);
    
    return (
      <Box>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Selected rows: {selectedRows.join(', ') || 'None'}
        </Typography>
        <Table
          columns={basicColumns}
          data={sampleData}
          selectable
          selectedRows={selectedRows}
          onSelectionChange={setSelectedRows}
          variant="default"
        />
      </Box>
    );
  },
};

export const ColumnSorting: Story = {
  render: function SortableTable() {
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'name', direction: 'asc' });
    
    const sortedData = [...sampleData].sort((a, b) => {
      if (sortConfig.direction === 'asc') {
        return a[sortConfig.key as keyof typeof a] > b[sortConfig.key as keyof typeof b] ? 1 : -1;
      } else {
        return a[sortConfig.key as keyof typeof a] < b[sortConfig.key as keyof typeof b] ? 1 : -1;
      }
    });
    
    return (
      <Box>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Sorted by: {sortConfig.key} ({sortConfig.direction})
        </Typography>
        <Table
          columns={extendedColumns}
          data={sortedData}
          sortable
          sortConfig={sortConfig}
          onSortChange={(key, direction) => setSortConfig({ key, direction })}
          variant="gradient"
        />
      </Box>
    );
  },
};

export const VirtualScrolling: Story = {
  render: () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Virtual Scrolling - 10,000 rows
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Only visible rows are rendered for optimal performance
      </Typography>
      <Table
        columns={extendedColumns}
        data={largeDataset}
        virtualScrolling
        rowHeight={52}
        containerHeight={400}
        overscan={10}
        variant="minimal"
      />
    </Box>
  ),
};

export const ResponsiveDesign: Story = {
  render: () => (
    <Box>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Resize your window to see columns hide/show based on priority
      </Typography>
      <Table
        columns={extendedColumns}
        data={sampleData}
        responsive
        columnPriorities={[1, 2, 3, 4, 5, 6, 7, 8]} // Avatar and Name have highest priority
        showColumnToggle
        variant="glass"
      />
    </Box>
  ),
};

export const AllFeaturesCombined: Story = {
  render: function AdvancedTable() {
    const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'name', direction: 'asc' });
    
    const sortedData = [...sampleData].sort((a, b) => {
      if (sortConfig.direction === 'asc') {
        return a[sortConfig.key as keyof typeof a] > b[sortConfig.key as keyof typeof b] ? 1 : -1;
      } else {
        return a[sortConfig.key as keyof typeof a] < b[sortConfig.key as keyof typeof b] ? 1 : -1;
      }
    });
    
    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Advanced Table - All Features Combined
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Density: Comfortable | Selection | Sorting | Sticky Header | Responsive | Visual Effects
        </Typography>
        <Box height={400}>
          <Table
            columns={extendedColumns}
            data={sortedData}
            
            // Visual
            variant="gradient"
            glow
            density="comfortable"
            
            // Features
            stickyHeader
            selectable
            selectedRows={selectedRows}
            onSelectionChange={setSelectedRows}
            sortable
            sortConfig={sortConfig}
            onSortChange={(key, direction) => setSortConfig({ key, direction })}
            responsive
            columnPriorities={[1, 2, 3, 4, 5, 6, 7, 8]}
            
            // Interactions
            hoverable
            onRowClick={(event, rowData) => {
              
            }}
            
            // Container
            containerHeight={400}
          />
        </Box>
      </Box>
    );
  },
};

export const LoadingState: Story = {
  render: () => (
    <Table
      columns={basicColumns}
      data={[]}
      loading
      variant="default"
    />
  ),
};

export const EmptyState: Story = {
  render: () => (
    <Table
      columns={basicColumns}
      data={[]}
      variant="minimal"
      emptyStateComponent={
        <Box py={6} textAlign="center">
          <StarIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No users found
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Try adjusting your search criteria
          </Typography>
          <Button variant="contained" size="small" sx={{ mt: 2 }}>
            Add User
          </Button>
        </Box>
      }
    />
  ),
};

export const Variants: Story = {
  render: () => (
    <Stack spacing={4}>
      <Box>
        <Typography variant="h6" gutterBottom>Default</Typography>
        <Table columns={basicColumns} data={sampleData.slice(0, 3)} variant="default" />
      </Box>
      
      <Box>
        <Typography variant="h6" gutterBottom>Striped</Typography>
        <Table columns={basicColumns} data={sampleData.slice(0, 3)} variant="striped" />
      </Box>
      
      <Box>
        <Typography variant="h6" gutterBottom>Glass</Typography>
        <Table columns={basicColumns} data={sampleData.slice(0, 3)} variant="glass" />
      </Box>
      
      <Box>
        <Typography variant="h6" gutterBottom>Minimal</Typography>
        <Table columns={basicColumns} data={sampleData.slice(0, 3)} variant="minimal" />
      </Box>
      
      <Box>
        <Typography variant="h6" gutterBottom>Gradient</Typography>
        <Table columns={basicColumns} data={sampleData.slice(0, 3)} variant="gradient" />
      </Box>
    </Stack>
  ),
};

export const VisualEffects: Story = {
  render: () => (
    <Stack spacing={4}>
      <Box>
        <Typography variant="h6" gutterBottom>With Glow</Typography>
        <Table columns={basicColumns} data={sampleData.slice(0, 3)} glow />
      </Box>
      
      <Box>
        <Typography variant="h6" gutterBottom>With Pulse</Typography>
        <Table columns={basicColumns} data={sampleData.slice(0, 3)} pulse variant="glass" />
      </Box>
      
      <Box>
        <Typography variant="h6" gutterBottom>Glow + Pulse</Typography>
        <Table columns={basicColumns} data={sampleData.slice(0, 3)} glow pulse />
      </Box>
      
      <Box>
        <Typography variant="h6" gutterBottom>Hoverable</Typography>
        <Table columns={basicColumns} data={sampleData.slice(0, 3)} hoverable />
      </Box>
    </Stack>
  ),
};

export const CustomRendering: Story = {
  render: () => (
    <Table
      columns={extendedColumns}
      data={sampleData}
      variant="striped"
      renderCell={(value, column, rowData, rowIndex) => {
        // Custom rendering for specific columns
        if (column.key === 'name') {
          return (
            <Box display="flex" alignItems="center" gap={1}>
              <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                {value.charAt(0)}
              </Avatar>
              <Typography variant="body2" fontWeight="medium">
                {value}
              </Typography>
            </Box>
          );
        }
        
        // Fall back to column's render function or default
        return column.render ? column.render(value, rowData) : value;
      }}
    />
  ),
};

// Backward compatibility stories
export const BackwardCompatibility: Story = {
  render: () => (
    <Stack spacing={4}>
      <Box>
        <Typography variant="h6" gutterBottom>Basic Usage (Backward Compatible)</Typography>
        <TableContainer component={Paper}>
          <Table hoverable variant="striped">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sampleData.slice(0, 3).map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.role}</TableCell>
                  <TableCell>
                    <Chip 
                      label={row.status} 
                      color={row.status === 'Active' ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Stack>
  ),
};
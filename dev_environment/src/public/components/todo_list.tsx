import React, { useState } from 'react';
import {
  EuiBasicTable,
  EuiBasicTableColumn,
  EuiButton,
  EuiBadge,
  EuiHealth,
  EuiText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiSpacer,
  EuiButtonIcon,
  EuiToolTip,
  Criteria,
  Pagination,
  Direction,
} from '@elastic/eui';
import moment from 'moment';
import { TodoItem, TodoStatus, TodoPriority } from '../../common';

interface TodoListProps {
  todos: TodoItem[];
  total: number;
  loading: boolean;
  pageIndex: number;
  pageSize: number;
  sortField: string;
  sortDirection: Direction;
  onTableChange: (criteria: Criteria<TodoItem>) => void;
  onEdit: (todo: TodoItem) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: TodoStatus) => void;
}

const getStatusColor = (status: TodoStatus): string => {
  switch (status) {
    case TodoStatus.PLANNED:
      return 'default';
    case TodoStatus.IN_PROGRESS:
      return 'primary';
    case TodoStatus.COMPLETED:
      return 'success';
    case TodoStatus.COMPLETED_WITH_ERROR:
      return 'danger';
    default:
      return 'default';
  }
};

const getPriorityColor = (priority: TodoPriority): string => {
  switch (priority) {
    case TodoPriority.LOW:
      return '#6dccb1';
    case TodoPriority.MEDIUM:
      return '#54b399';
    case TodoPriority.HIGH:
      return '#f5a700';
    case TodoPriority.CRITICAL:
      return '#bd271e';
    default:
      return 'default';
  }
};

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  total,
  loading,
  pageIndex,
  pageSize,
  sortField,
  sortDirection,
  onTableChange,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  const columns: Array<EuiBasicTableColumn<TodoItem>> = [
    {
      field: 'title',
      name: 'Title',
      sortable: true,
      truncateText: true,
      width: '20%',
      render: (title: string, item: TodoItem) => (
        <EuiText size="s">
          <strong>{title}</strong>
          {item.description && (
            <div>
              <EuiText size="xs" color="subdued">
                {item.description}
              </EuiText>
            </div>
          )}
        </EuiText>
      ),
    },
    {
      field: 'status',
      name: 'Status',
      sortable: true,
      width: '130px',
      render: (status: TodoStatus) => (
        <EuiHealth color={getStatusColor(status)}>
          {status.replace(/_/g, ' ').toUpperCase()}
        </EuiHealth>
      ),
    },
    {
      field: 'priority',
      name: 'Priority',
      sortable: true,
      width: '100px',
      render: (priority: TodoPriority) => (
        <EuiBadge color={getPriorityColor(priority)}>{priority.toUpperCase()}</EuiBadge>
      ),
    },
    {
      field: 'tags',
      name: 'Tags',
      truncateText: true,
      width: '15%',
      render: (tags: string[]) => (
        <EuiFlexGroup wrap responsive={false} gutterSize="xs">
          {tags.slice(0, 3).map((tag) => (
            <EuiFlexItem grow={false} key={tag}>
              <EuiBadge color="hollow">{tag}</EuiBadge>
            </EuiFlexItem>
          ))}
          {tags.length > 3 && (
            <EuiFlexItem grow={false}>
              <EuiBadge color="hollow">+{tags.length - 3}</EuiBadge>
            </EuiFlexItem>
          )}
        </EuiFlexGroup>
      ),
    },
    {
      field: 'assignee',
      name: 'Assignee',
      sortable: true,
      truncateText: true,
      width: '120px',
      render: (assignee?: string) => assignee || '-',
    },
    {
      field: 'dueDate',
      name: 'Due Date',
      sortable: true,
      width: '120px',
      render: (dueDate?: string) => {
        if (!dueDate) return '-';
        const date = moment(dueDate);
        const isOverdue = date.isBefore(moment()) && date.isValid();
        return (
          <EuiText size="s" color={isOverdue ? 'danger' : 'default'}>
            {date.format('MMM DD, YYYY')}
          </EuiText>
        );
      },
    },
    {
      field: 'createdAt',
      name: 'Created',
      sortable: true,
      width: '120px',
      render: (createdAt: string) => moment(createdAt).format('MMM DD, YYYY'),
    },
    {
      name: 'Actions',
      width: '180px',
      render: (item: TodoItem) => (
        <EuiFlexGroup gutterSize="s" responsive={false} wrap>
          {item.status !== TodoStatus.COMPLETED && (
            <EuiFlexItem grow={false}>
              <EuiToolTip content="Mark as completed">
                <EuiButtonIcon
                  iconType="check"
                  color="success"
                  aria-label="Complete"
                  onClick={() => onStatusChange(item.id, TodoStatus.COMPLETED)}
                />
              </EuiToolTip>
            </EuiFlexItem>
          )}
          <EuiFlexItem grow={false}>
            <EuiToolTip content="Edit">
              <EuiButtonIcon
                iconType="pencil"
                color="primary"
                aria-label="Edit"
                onClick={() => onEdit(item)}
              />
            </EuiToolTip>
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiToolTip content="Delete">
              <EuiButtonIcon
                iconType="trash"
                color="danger"
                aria-label="Delete"
                onClick={() => onDelete(item.id)}
              />
            </EuiToolTip>
          </EuiFlexItem>
        </EuiFlexGroup>
      ),
    },
  ];

  const pagination: Pagination = {
    pageIndex,
    pageSize,
    totalItemCount: total,
    pageSizeOptions: [10, 25, 50, 100],
  };

  const sorting = {
    sort: {
      field: sortField as keyof TodoItem,
      direction: sortDirection,
    },
  };

  return (
    <EuiBasicTable
      items={todos}
      columns={columns}
      pagination={pagination}
      sorting={sorting}
      onChange={onTableChange}
      loading={loading}
      tableLayout="auto"
    />
  );
};

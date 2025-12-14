import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TodoList } from './todo_list';
import { TodoItem, TodoStatus, TodoPriority } from '../../common';

describe('TodoList', () => {
  const mockTodos: TodoItem[] = [
    {
      id: '1',
      title: 'Task 1',
      description: 'Description 1',
      status: TodoStatus.PLANNED,
      priority: TodoPriority.HIGH,
      tags: ['tag1', 'tag2'],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    {
      id: '2',
      title: 'Task 2',
      status: TodoStatus.COMPLETED,
      priority: TodoPriority.MEDIUM,
      tags: [],
      createdAt: '2024-01-02T00:00:00Z',
      updatedAt: '2024-01-02T00:00:00Z',
    },
  ];

  const defaultProps = {
    todos: mockTodos,
    total: 2,
    loading: false,
    pageIndex: 0,
    pageSize: 10,
    sortField: 'createdAt',
    sortDirection: 'desc' as const,
    onTableChange: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn(),
    onStatusChange: jest.fn(),
  };

  it('should render todo items', () => {
    render(<TodoList {...defaultProps} />);

    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
    expect(screen.getByText('Description 1')).toBeInTheDocument();
  });

  it('should render status badges', () => {
    render(<TodoList {...defaultProps} />);

    expect(screen.getByText('PLANNED')).toBeInTheDocument();
    expect(screen.getByText('COMPLETED')).toBeInTheDocument();
  });

  it('should render priority badges', () => {
    render(<TodoList {...defaultProps} />);

    expect(screen.getByText('HIGH')).toBeInTheDocument();
    expect(screen.getByText('MEDIUM')).toBeInTheDocument();
  });

  it('should render tags', () => {
    render(<TodoList {...defaultProps} />);

    expect(screen.getByText('tag1')).toBeInTheDocument();
    expect(screen.getByText('tag2')).toBeInTheDocument();
  });

  it('should show loading state', () => {
    render(<TodoList {...defaultProps} loading={true} />);

    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
  });

  it('should call onEdit when edit button is clicked', () => {
    const onEdit = jest.fn();
    render(<TodoList {...defaultProps} onEdit={onEdit} />);

    const editButtons = screen.getAllByLabelText('Edit');
    fireEvent.click(editButtons[0]);

    expect(onEdit).toHaveBeenCalledWith(mockTodos[0]);
  });

  it('should call onDelete when delete button is clicked', () => {
    const onDelete = jest.fn();
    render(<TodoList {...defaultProps} onDelete={onDelete} />);

    const deleteButtons = screen.getAllByLabelText('Delete');
    fireEvent.click(deleteButtons[0]);

    expect(onDelete).toHaveBeenCalledWith('1');
  });

  it('should call onStatusChange when complete button is clicked', () => {
    const onStatusChange = jest.fn();
    render(<TodoList {...defaultProps} onStatusChange={onStatusChange} />);

    const completeButtons = screen.getAllByLabelText('Complete');
    fireEvent.click(completeButtons[0]);

    expect(onStatusChange).toHaveBeenCalledWith('1', TodoStatus.COMPLETED);
  });

  it('should not show complete button for completed tasks', () => {
    render(<TodoList {...defaultProps} />);

    const completeButtons = screen.getAllByLabelText('Complete');
    // Only task 1 (PLANNED) should have a complete button
    expect(completeButtons).toHaveLength(1);
  });

  it('should show empty state when no todos', () => {
    render(<TodoList {...defaultProps} todos={[]} total={0} />);

    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
  });
});

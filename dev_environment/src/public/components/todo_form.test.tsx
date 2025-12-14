import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoForm } from './todo_form';
import { TodoStatus, TodoPriority } from '../../common';

describe('TodoForm', () => {
  const defaultProps = {
    availableTags: ['tag1', 'tag2', 'tag3'],
    onSubmit: jest.fn(),
    onCancel: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render empty form for new todo', () => {
    render(<TodoForm {...defaultProps} />);

    expect(screen.getByPlaceholderText('Enter task title')).toHaveValue('');
    expect(screen.getByPlaceholderText('Enter task description')).toHaveValue('');
    expect(screen.getByText('Create')).toBeInTheDocument();
  });

  it('should render form with todo data for editing', () => {
    const todo = {
      id: '1',
      title: 'Test Task',
      description: 'Test Description',
      status: TodoStatus.IN_PROGRESS,
      priority: TodoPriority.HIGH,
      tags: ['tag1'],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    };

    render(<TodoForm {...defaultProps} todo={todo} />);

    expect(screen.getByDisplayValue('Test Task')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument();
    expect(screen.getByText('Update')).toBeInTheDocument();
  });

  it('should show validation error when title is empty', async () => {
    render(<TodoForm {...defaultProps} />);

    const createButton = screen.getByText('Create');
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument();
    });

    expect(defaultProps.onSubmit).not.toHaveBeenCalled();
  });

  it('should submit form with valid data', async () => {
    render(<TodoForm {...defaultProps} />);

    const titleInput = screen.getByPlaceholderText('Enter task title');
    const descriptionInput = screen.getByPlaceholderText('Enter task description');

    fireEvent.change(titleInput, { target: { value: 'New Task' } });
    fireEvent.change(descriptionInput, { target: { value: 'New Description' } });

    const createButton = screen.getByText('Create');
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(defaultProps.onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'New Task',
          description: 'New Description',
          status: TodoStatus.PLANNED,
          priority: TodoPriority.MEDIUM,
        })
      );
    });
  });

  it('should call onCancel when cancel button is clicked', () => {
    render(<TodoForm {...defaultProps} />);

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(defaultProps.onCancel).toHaveBeenCalled();
  });

  it('should show error message field when status is completed with error', async () => {
    render(<TodoForm {...defaultProps} />);

    // Initially error message field should not be visible
    expect(screen.queryByPlaceholderText('Describe the error')).not.toBeInTheDocument();

    // Change status to completed with error
    const statusSelect = screen.getByRole('combobox', { name: /status/i });
    fireEvent.change(statusSelect, { target: { value: TodoStatus.COMPLETED_WITH_ERROR } });

    // Error message field should now be visible
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Describe the error')).toBeInTheDocument();
    });
  });

  it('should require error message when status is completed with error', async () => {
    render(<TodoForm {...defaultProps} />);

    const titleInput = screen.getByPlaceholderText('Enter task title');
    const statusSelect = screen.getByRole('combobox', { name: /status/i });

    fireEvent.change(titleInput, { target: { value: 'Test Task' } });
    fireEvent.change(statusSelect, { target: { value: TodoStatus.COMPLETED_WITH_ERROR } });

    const createButton = screen.getByText('Create');
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(screen.getByText('Error message is required for completed with error status')).toBeInTheDocument();
    });

    expect(defaultProps.onSubmit).not.toHaveBeenCalled();
  });
});

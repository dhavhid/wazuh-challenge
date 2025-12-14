import React, { useState } from 'react';
import {
  EuiForm,
  EuiFormRow,
  EuiFieldText,
  EuiTextArea,
  EuiSelect,
  EuiComboBox,
  EuiDatePicker,
  EuiButton,
  EuiButtonEmpty,
  EuiFlexGroup,
  EuiFlexItem,
  EuiSpacer,
  EuiComboBoxOptionOption,
} from '@elastic/eui';
import moment, { Moment } from 'moment';
import { TodoItem, TodoStatus, TodoPriority, CreateTodoRequest } from '../../common';

interface TodoFormProps {
  todo?: TodoItem;
  availableTags: string[];
  onSubmit: (data: CreateTodoRequest) => void;
  onCancel: () => void;
}

const statusOptions = [
  { value: TodoStatus.PLANNED, text: 'Planned' },
  { value: TodoStatus.IN_PROGRESS, text: 'In Progress' },
  { value: TodoStatus.COMPLETED, text: 'Completed' },
  { value: TodoStatus.COMPLETED_WITH_ERROR, text: 'Completed with Error' },
];

const priorityOptions = [
  { value: TodoPriority.LOW, text: 'Low' },
  { value: TodoPriority.MEDIUM, text: 'Medium' },
  { value: TodoPriority.HIGH, text: 'High' },
  { value: TodoPriority.CRITICAL, text: 'Critical' },
];

export const TodoForm: React.FC<TodoFormProps> = ({ todo, availableTags, onSubmit, onCancel }) => {
  const [title, setTitle] = useState(todo?.title || '');
  const [description, setDescription] = useState(todo?.description || '');
  const [status, setStatus] = useState(todo?.status || TodoStatus.PLANNED);
  const [priority, setPriority] = useState(todo?.priority || TodoPriority.MEDIUM);
  const [assignee, setAssignee] = useState(todo?.assignee || '');
  const [dueDate, setDueDate] = useState<Moment | null>(
    todo?.dueDate ? moment(todo.dueDate) : null
  );
  const [selectedTags, setSelectedTags] = useState<EuiComboBoxOptionOption[]>(
    todo?.tags.map((tag) => ({ label: tag })) || []
  );
  const [errorMessage, setErrorMessage] = useState(todo?.errorMessage || '');

  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});

  const tagOptions: EuiComboBoxOptionOption[] = availableTags.map((tag) => ({
    label: tag,
  }));

  const onCreateTag = (searchValue: string, flattenedOptions: EuiComboBoxOptionOption[]) => {
    const normalizedSearchValue = searchValue.trim().toLowerCase();

    if (!normalizedSearchValue) {
      return;
    }

    const newOption = {
      label: searchValue,
    };

    if (
      flattenedOptions.findIndex(
        (option) => option.label.trim().toLowerCase() === normalizedSearchValue
      ) === -1
    ) {
      setSelectedTags([...selectedTags, newOption]);
    }
  };

  const validate = (): boolean => {
    const newErrors: { [key: string]: string[] } = {};

    if (!title.trim()) {
      newErrors.title = ['Title is required'];
    }

    if (status === TodoStatus.COMPLETED_WITH_ERROR && !errorMessage.trim()) {
      newErrors.errorMessage = ['Error message is required for completed with error status'];
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      return;
    }

    const data: CreateTodoRequest = {
      title,
      description: description || undefined,
      status,
      priority,
      tags: selectedTags.map((tag) => tag.label),
      assignee: assignee || undefined,
      dueDate: dueDate ? dueDate.toISOString() : undefined,
    };

    if (status === TodoStatus.COMPLETED_WITH_ERROR) {
      (data as any).errorMessage = errorMessage;
    }

    onSubmit(data);
  };

  return (
    <EuiForm component="form">
      <EuiFormRow label="Title" isInvalid={!!errors.title} error={errors.title} fullWidth>
        <EuiFieldText
          placeholder="Enter task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          isInvalid={!!errors.title}
          fullWidth
        />
      </EuiFormRow>

      <EuiFormRow label="Description" fullWidth>
        <EuiTextArea
          placeholder="Enter task description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          fullWidth
        />
      </EuiFormRow>

      <EuiFlexGroup>
        <EuiFlexItem>
          <EuiFormRow label="Status" fullWidth>
            <EuiSelect
              options={statusOptions}
              value={status}
              onChange={(e) => setStatus(e.target.value as TodoStatus)}
              fullWidth
            />
          </EuiFormRow>
        </EuiFlexItem>

        <EuiFlexItem>
          <EuiFormRow label="Priority" fullWidth>
            <EuiSelect
              options={priorityOptions}
              value={priority}
              onChange={(e) => setPriority(e.target.value as TodoPriority)}
              fullWidth
            />
          </EuiFormRow>
        </EuiFlexItem>
      </EuiFlexGroup>

      <EuiFormRow label="Tags" fullWidth>
        <EuiComboBox
          placeholder="Select or create tags"
          options={tagOptions}
          selectedOptions={selectedTags}
          onChange={setSelectedTags}
          onCreateOption={onCreateTag}
          isClearable={true}
          fullWidth
        />
      </EuiFormRow>

      <EuiFlexGroup>
        <EuiFlexItem>
          <EuiFormRow label="Assignee" fullWidth>
            <EuiFieldText
              placeholder="Enter assignee name"
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              fullWidth
            />
          </EuiFormRow>
        </EuiFlexItem>

        <EuiFlexItem>
          <EuiFormRow label="Due Date" fullWidth>
            <EuiDatePicker
              selected={dueDate}
              onChange={(date) => setDueDate(date)}
              placeholder="Select due date"
              fullWidth
              popoverPlacement='top-end'
            />
          </EuiFormRow>
        </EuiFlexItem>
      </EuiFlexGroup>

      {status === TodoStatus.COMPLETED_WITH_ERROR && (
        <EuiFormRow
          label="Error Message"
          isInvalid={!!errors.errorMessage}
          error={errors.errorMessage}
          fullWidth
        >
          <EuiTextArea
            placeholder="Describe the error"
            value={errorMessage}
            onChange={(e) => setErrorMessage(e.target.value)}
            isInvalid={!!errors.errorMessage}
            rows={2}
            fullWidth
          />
        </EuiFormRow>
      )}

      <EuiSpacer />

      <EuiFlexGroup justifyContent="flexEnd">
        <EuiFlexItem grow={false}>
          <EuiButtonEmpty onClick={onCancel}>Cancel</EuiButtonEmpty>
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          <EuiButton type="submit" fill onClick={handleSubmit}>
            {todo ? 'Update' : 'Create'}
          </EuiButton>
        </EuiFlexItem>
      </EuiFlexGroup>
    </EuiForm>
  );
};

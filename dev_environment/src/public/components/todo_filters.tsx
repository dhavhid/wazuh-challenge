import React from 'react';
import {
  EuiFieldSearch,
  EuiFilterGroup,
  EuiFilterButton,
  EuiPopover,
  EuiFilterSelectItem,
  EuiFlexGroup,
  EuiFlexItem,
  EuiSpacer,
} from '@elastic/eui';
import { TodoStatus, TodoPriority } from '../../common';

interface TodoFiltersProps {
  searchQuery: string;
  selectedStatuses: TodoStatus[];
  selectedPriorities: TodoPriority[];
  selectedTags: string[];
  availableTags: string[];
  onSearchChange: (query: string) => void;
  onStatusChange: (statuses: TodoStatus[]) => void;
  onPriorityChange: (priorities: TodoPriority[]) => void;
  onTagChange: (tags: string[]) => void;
}

const statusOptions = [
  { value: TodoStatus.PLANNED, label: 'Planned' },
  { value: TodoStatus.IN_PROGRESS, label: 'In Progress' },
  { value: TodoStatus.COMPLETED, label: 'Completed' },
  { value: TodoStatus.COMPLETED_WITH_ERROR, label: 'Completed with Error' },
];

const priorityOptions = [
  { value: TodoPriority.LOW, label: 'Low' },
  { value: TodoPriority.MEDIUM, label: 'Medium' },
  { value: TodoPriority.HIGH, label: 'High' },
  { value: TodoPriority.CRITICAL, label: 'Critical' },
];

export const TodoFilters: React.FC<TodoFiltersProps> = ({
  searchQuery,
  selectedStatuses,
  selectedPriorities,
  selectedTags,
  availableTags,
  onSearchChange,
  onStatusChange,
  onPriorityChange,
  onTagChange,
}) => {
  const [isStatusPopoverOpen, setIsStatusPopoverOpen] = React.useState(false);
  const [isPriorityPopoverOpen, setIsPriorityPopoverOpen] = React.useState(false);
  const [isTagPopoverOpen, setIsTagPopoverOpen] = React.useState(false);

  const toggleStatus = (status: TodoStatus) => {
    if (selectedStatuses.includes(status)) {
      onStatusChange(selectedStatuses.filter((s) => s !== status));
    } else {
      onStatusChange([...selectedStatuses, status]);
    }
  };

  const togglePriority = (priority: TodoPriority) => {
    if (selectedPriorities.includes(priority)) {
      onPriorityChange(selectedPriorities.filter((p) => p !== priority));
    } else {
      onPriorityChange([...selectedPriorities, priority]);
    }
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagChange(selectedTags.filter((t) => t !== tag));
    } else {
      onTagChange([...selectedTags, tag]);
    }
  };

  return (
    <>
      <EuiFlexGroup gutterSize="m" responsive={false}>
        <EuiFlexItem grow={true}>
          <EuiFieldSearch
            placeholder="Search tasks by title, description, tags, or assignee..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            isClearable={true}
            fullWidth
          />
        </EuiFlexItem>
      </EuiFlexGroup>

      <EuiSpacer size="m" />

      <EuiFilterGroup>
        <EuiPopover
          button={
            <EuiFilterButton
              iconType="arrowDown"
              onClick={() => setIsStatusPopoverOpen(!isStatusPopoverOpen)}
              isSelected={isStatusPopoverOpen}
              numFilters={statusOptions.length}
              hasActiveFilters={selectedStatuses.length > 0}
              numActiveFilters={selectedStatuses.length}
            >
              Status
            </EuiFilterButton>
          }
          isOpen={isStatusPopoverOpen}
          closePopover={() => setIsStatusPopoverOpen(false)}
          panelPaddingSize="none"
        >
          <div className="euiFilterSelect__items">
            {statusOptions.map((option) => (
              <EuiFilterSelectItem
                key={option.value}
                checked={selectedStatuses.includes(option.value) ? 'on' : undefined}
                onClick={() => toggleStatus(option.value)}
              >
                {option.label}
              </EuiFilterSelectItem>
            ))}
          </div>
        </EuiPopover>

        <EuiPopover
          button={
            <EuiFilterButton
              iconType="arrowDown"
              onClick={() => setIsPriorityPopoverOpen(!isPriorityPopoverOpen)}
              isSelected={isPriorityPopoverOpen}
              numFilters={priorityOptions.length}
              hasActiveFilters={selectedPriorities.length > 0}
              numActiveFilters={selectedPriorities.length}
            >
              Priority
            </EuiFilterButton>
          }
          isOpen={isPriorityPopoverOpen}
          closePopover={() => setIsPriorityPopoverOpen(false)}
          panelPaddingSize="none"
        >
          <div className="euiFilterSelect__items">
            {priorityOptions.map((option) => (
              <EuiFilterSelectItem
                key={option.value}
                checked={selectedPriorities.includes(option.value) ? 'on' : undefined}
                onClick={() => togglePriority(option.value)}
              >
                {option.label}
              </EuiFilterSelectItem>
            ))}
          </div>
        </EuiPopover>

        {availableTags.length > 0 && (
          <EuiPopover
            button={
              <EuiFilterButton
                iconType="arrowDown"
                onClick={() => setIsTagPopoverOpen(!isTagPopoverOpen)}
                isSelected={isTagPopoverOpen}
                numFilters={availableTags.length}
                hasActiveFilters={selectedTags.length > 0}
                numActiveFilters={selectedTags.length}
              >
                Tags
              </EuiFilterButton>
            }
            isOpen={isTagPopoverOpen}
            closePopover={() => setIsTagPopoverOpen(false)}
            panelPaddingSize="none"
          >
            <div className="euiFilterSelect__items">
              {availableTags.map((tag) => (
                <EuiFilterSelectItem
                  key={tag}
                  checked={selectedTags.includes(tag) ? 'on' : undefined}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </EuiFilterSelectItem>
              ))}
            </div>
          </EuiPopover>
        )}
      </EuiFilterGroup>
    </>
  );
};

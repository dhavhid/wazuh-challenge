import React, { useState, useEffect, useCallback } from 'react';
import { I18nProvider } from '@osd/i18n/react';
import { BrowserRouter as Router } from 'react-router-dom';

import {
  EuiButton,
  EuiPage,
  EuiPageBody,
  EuiPageHeader,
  EuiTitle,
  EuiSpacer,
  EuiModal,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiModalBody,
  EuiConfirmModal,
  EuiTabbedContent,
  EuiFlexGroup,
  EuiFlexItem,
  Criteria,
  Direction,
} from '@elastic/eui';

import { CoreStart } from '../../../../src/core/public';
import { NavigationPublicPluginStart } from '../../../../src/plugins/navigation/public';

import { PLUGIN_ID, PLUGIN_NAME } from '../../common';
import {
  TodoItem,
  TodoStatus,
  TodoPriority,
  CreateTodoRequest,
  TodoStats,
} from '../../common';
import { TodoApi } from '../services/todo_api';
import { TodoList } from './todo_list';
import { TodoForm } from './todo_form';
import { TodoFilters } from './todo_filters';
import { TodoStatsComponent } from './todo_stats';

interface CustomPluginAppDeps {
  basename: string;
  notifications: CoreStart['notifications'];
  http: CoreStart['http'];
  navigation: NavigationPublicPluginStart;
}

export const CustomPluginApp = ({
  basename,
  notifications,
  http,
  navigation,
}: CustomPluginAppDeps) => {
  const todoApi = new TodoApi(http);

  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<TodoStats | null>(null);
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<TodoStatus[]>([]);
  const [selectedPriorities, setSelectedPriorities] = useState<TodoPriority[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState<Direction>('desc');

  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [editingTodo, setEditingTodo] = useState<TodoItem | null>(null);
  const [deletingTodoId, setDeletingTodoId] = useState<string | null>(null);

  const loadTodos = useCallback(async () => {
    setLoading(true);
    try {
      const result = await todoApi.searchTodos({
        query: searchQuery || undefined,
        status: selectedStatuses.length > 0 ? selectedStatuses : undefined,
        priority: selectedPriorities.length > 0 ? selectedPriorities : undefined,
        tags: selectedTags.length > 0 ? selectedTags : undefined,
        from: pageIndex * pageSize,
        size: pageSize,
        sortField,
        sortOrder: sortDirection,
      });
      setTodos(result.items);
      setTotal(result.total);
    } catch (error) {
      notifications.toasts.addDanger({
        title: 'Error loading tasks',
        // @ts-ignore
        text: error.message,
      });
    } finally {
      setLoading(false);
    }
  }, [
    searchQuery,
    selectedStatuses,
    selectedPriorities,
    selectedTags,
    pageIndex,
    pageSize,
    sortField,
    sortDirection,
  ]);

  const loadStats = useCallback(async () => {
    try {
      const statsData = await todoApi.getStats();
      setStats(statsData);
    } catch (error) {
      notifications.toasts.addDanger({
        title: 'Error loading statistics',
        // @ts-ignore
        text: error.message,
      });
    }
  }, []);

  const loadTags = useCallback(async () => {
    try {
      const tags = await todoApi.getAllTags();
      setAvailableTags(tags);
    } catch (error) {
      console.error('Error loading tags:', error);
    }
  }, []);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  useEffect(() => {
    loadStats();
    loadTags();
  }, [loadStats, loadTags]);

  const handleCreateTodo = async (data: CreateTodoRequest) => {
    try {
      await todoApi.createTodo(data);
      notifications.toasts.addSuccess('Task created successfully');
      setIsCreateModalVisible(false);
      loadTodos();
      loadStats();
      loadTags();
    } catch (error) {
      notifications.toasts.addDanger({
        title: 'Error creating task',
        text: error.message,
      });
    }
  };

  const handleUpdateTodo = async (data: CreateTodoRequest) => {
    if (!editingTodo) return;

    try {
      await todoApi.updateTodo(editingTodo.id, data);
      notifications.toasts.addSuccess('Task updated successfully');
      setEditingTodo(null);
      loadTodos();
      loadStats();
      loadTags();
    } catch (error) {
      notifications.toasts.addDanger({
        title: 'Error updating task',
        text: error.message,
      });
    }
  };

  const handleDeleteTodo = async () => {
    if (!deletingTodoId) return;

    try {
      await todoApi.deleteTodo(deletingTodoId);
      notifications.toasts.addSuccess('Task deleted successfully');
      setDeletingTodoId(null);
      loadTodos();
      loadStats();
    } catch (error) {
      notifications.toasts.addDanger({
        title: 'Error deleting task',
        text: error.message,
      });
    }
  };

  const handleStatusChange = async (id: string, status: TodoStatus) => {
    try {
      await todoApi.updateTodo(id, { status });
      notifications.toasts.addSuccess('Task status updated');
      loadTodos();
      loadStats();
    } catch (error) {
      notifications.toasts.addDanger({
        title: 'Error updating status',
        text: error.message,
      });
    }
  };

  const handleTableChange = (criteria: Criteria<TodoItem>) => {
    if (criteria.page) {
      setPageIndex(criteria.page.index);
      setPageSize(criteria.page.size);
    }
    if (criteria.sort) {
      setSortField(criteria.sort.field as string);
      setSortDirection(criteria.sort.direction);
    }
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setPageIndex(0);
  };

  const handleStatusFilterChange = (statuses: TodoStatus[]) => {
    setSelectedStatuses(statuses);
    setPageIndex(0);
  };

  const handlePriorityFilterChange = (priorities: TodoPriority[]) => {
    setSelectedPriorities(priorities);
    setPageIndex(0);
  };

  const handleTagFilterChange = (tags: string[]) => {
    setSelectedTags(tags);
    setPageIndex(0);
  };

  const tabs = [
    {
      id: 'tasks',
      name: 'Tasks',
      content: (
        <>
          <EuiSpacer />
          <TodoFilters
            searchQuery={searchQuery}
            selectedStatuses={selectedStatuses}
            selectedPriorities={selectedPriorities}
            selectedTags={selectedTags}
            availableTags={availableTags}
            onSearchChange={handleSearchChange}
            onStatusChange={handleStatusFilterChange}
            onPriorityChange={handlePriorityFilterChange}
            onTagChange={handleTagFilterChange}
          />
          <EuiSpacer />
          <TodoList
            todos={todos}
            total={total}
            loading={loading}
            pageIndex={pageIndex}
            pageSize={pageSize}
            sortField={sortField}
            sortDirection={sortDirection}
            onTableChange={handleTableChange}
            onEdit={setEditingTodo}
            onDelete={setDeletingTodoId}
            onStatusChange={handleStatusChange}
          />
        </>
      ),
    },
    {
      id: 'stats',
      name: 'Statistics',
      content: (
        <>
          <EuiSpacer />
          {stats && <TodoStatsComponent stats={stats} />}
        </>
      ),
    },
  ];

  return (
    <Router basename={basename}>
      <I18nProvider>
        <>
          <navigation.ui.TopNavMenu appName={PLUGIN_ID} useDefaultBehaviors={true} />
          <EuiPage paddingSize="l">
            <EuiPageBody>
              <EuiPageHeader>
                <EuiFlexGroup justifyContent="spaceBetween" alignItems="center">
                  <EuiFlexItem grow={false}>
                    <EuiTitle size="l">
                      <h1>{PLUGIN_NAME}</h1>
                    </EuiTitle>
                  </EuiFlexItem>
                  <EuiFlexItem grow={false}>
                    <EuiButton fill iconType="plusInCircle" onClick={() => setIsCreateModalVisible(true)}>
                      Create Task
                    </EuiButton>
                  </EuiFlexItem>
                </EuiFlexGroup>
              </EuiPageHeader>

              <EuiSpacer />

              <EuiTabbedContent tabs={tabs} initialSelectedTab={tabs[0]} />
            </EuiPageBody>
          </EuiPage>

          {isCreateModalVisible && (
            <EuiModal onClose={() => setIsCreateModalVisible(false)}>
              <EuiModalHeader>
                <EuiModalHeaderTitle>Create New Task</EuiModalHeaderTitle>
              </EuiModalHeader>
              <EuiModalBody>
                <TodoForm
                  availableTags={availableTags}
                  onSubmit={handleCreateTodo}
                  onCancel={() => setIsCreateModalVisible(false)}
                />
              </EuiModalBody>
            </EuiModal>
          )}

          {editingTodo && (
            <EuiModal onClose={() => setEditingTodo(null)}>
              <EuiModalHeader>
                <EuiModalHeaderTitle>Edit Task</EuiModalHeaderTitle>
              </EuiModalHeader>
              <EuiModalBody>
                <TodoForm
                  todo={editingTodo}
                  availableTags={availableTags}
                  onSubmit={handleUpdateTodo}
                  onCancel={() => setEditingTodo(null)}
                />
              </EuiModalBody>
            </EuiModal>
          )}

          {deletingTodoId && (
            <EuiConfirmModal
              title="Delete Task"
              onCancel={() => setDeletingTodoId(null)}
              onConfirm={handleDeleteTodo}
              cancelButtonText="Cancel"
              confirmButtonText="Delete"
              buttonColor="danger"
            >
              <p>Are you sure you want to delete this task? This action cannot be undone.</p>
            </EuiConfirmModal>
          )}
        </>
      </I18nProvider>
    </Router>
  );
};

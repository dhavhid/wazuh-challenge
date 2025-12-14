export const PLUGIN_ID = 'customPlugin';
export const PLUGIN_NAME = 'TO-DO plugin';
export const TODO_INDEX = '.todo-items';

export enum TodoStatus {
  PLANNED = 'planned',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  COMPLETED_WITH_ERROR = 'completed_with_error',
}

export enum TodoPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export interface TodoItem {
  id: string;
  title: string;
  description?: string;
  status: TodoStatus;
  priority: TodoPriority;
  tags: string[];
  assignee?: string;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  completedAt?: string;
  errorMessage?: string;
}

export interface CreateTodoRequest {
  title: string;
  description?: string;
  status?: TodoStatus;
  priority?: TodoPriority;
  tags?: string[];
  assignee?: string;
  dueDate?: string;
}

export interface UpdateTodoRequest {
  title?: string;
  description?: string;
  status?: TodoStatus;
  priority?: TodoPriority;
  tags?: string[];
  assignee?: string;
  dueDate?: string;
  completedAt?: string;
  errorMessage?: string;
}

export interface SearchTodosRequest {
  query?: string;
  status?: TodoStatus[];
  priority?: TodoPriority[];
  tags?: string[];
  from?: number;
  size?: number;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface TodoStats {
  total: number;
  byStatus: Record<TodoStatus, number>;
  byPriority: Record<TodoPriority, number>;
  completionRate: number;
  avgCompletionTime?: number;
}

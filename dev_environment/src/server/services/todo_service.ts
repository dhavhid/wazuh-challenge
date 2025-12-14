import { ILegacyScopedClusterClient } from '../../../../src/core/server';
import {
  TodoItem,
  TodoStatus,
  TodoPriority,
  CreateTodoRequest,
  UpdateTodoRequest,
  SearchTodosRequest,
  TodoStats,
  TODO_INDEX,
} from '../../common';
import { v4 as uuidv4 } from 'uuid';

export class TodoService {
  constructor(private readonly client: ILegacyScopedClusterClient) {}

  async ensureIndexExists(): Promise<void> {
    const indexExists = await this.client.callAsCurrentUser('indices.exists', {
      index: TODO_INDEX,
    });

    if (!indexExists) {
      await this.client.callAsCurrentUser('indices.create', {
        index: TODO_INDEX,
        body: {
          settings: {
            number_of_shards: 1,
            number_of_replicas: 0,
          },
          mappings: {
            properties: {
              id: { type: 'keyword' },
              title: { type: 'text' },
              description: { type: 'text' },
              status: { type: 'keyword' },
              priority: { type: 'keyword' },
              tags: { type: 'keyword' },
              assignee: { type: 'keyword' },
              createdAt: { type: 'date' },
              updatedAt: { type: 'date' },
              dueDate: { type: 'date' },
              completedAt: { type: 'date' },
              errorMessage: { type: 'text' },
            },
          },
        },
      });
    }
  }

  async createTodo(data: CreateTodoRequest): Promise<TodoItem> {
    await this.ensureIndexExists();

    const id = uuidv4();
    const now = new Date().toISOString();

    const todo: TodoItem = {
      id,
      title: data.title,
      description: data.description,
      status: data.status || TodoStatus.PLANNED,
      priority: data.priority || TodoPriority.MEDIUM,
      tags: data.tags || [],
      assignee: data.assignee,
      createdAt: now,
      updatedAt: now,
      dueDate: data.dueDate,
    };

    await this.client.callAsCurrentUser('index', {
      index: TODO_INDEX,
      id,
      body: todo,
      refresh: 'wait_for',
    });

    return todo;
  }

  async getTodo(id: string): Promise<TodoItem | null> {
    try {
      const response = await this.client.callAsCurrentUser('get', {
        index: TODO_INDEX,
        id,
      });

      return response._source as TodoItem;
    } catch (error) {
      if (error.statusCode === 404) {
        return null;
      }
      throw error;
    }
  }

  async updateTodo(id: string, data: UpdateTodoRequest): Promise<TodoItem | null> {
    const existingTodo = await this.getTodo(id);
    if (!existingTodo) {
      return null;
    }

    const updatedTodo: TodoItem = {
      ...existingTodo,
      ...data,
      updatedAt: new Date().toISOString(),
    };

    if (data.status === TodoStatus.COMPLETED && !data.completedAt) {
      updatedTodo.completedAt = new Date().toISOString();
    }

    await this.client.callAsCurrentUser('index', {
      index: TODO_INDEX,
      id,
      body: updatedTodo,
      refresh: 'wait_for',
    });

    return updatedTodo;
  }

  async deleteTodo(id: string): Promise<boolean> {
    try {
      await this.client.callAsCurrentUser('delete', {
        index: TODO_INDEX,
        id,
        refresh: 'wait_for',
      });
      return true;
    } catch (error) {
      if (error.statusCode === 404) {
        return false;
      }
      throw error;
    }
  }

  async searchTodos(params: SearchTodosRequest): Promise<{ items: TodoItem[]; total: number }> {
    await this.ensureIndexExists();

    const must: any[] = [];

    if (params.query) {
      must.push({
        multi_match: {
          query: params.query,
          fields: ['title^2', 'description', 'tags', 'assignee'],
          fuzziness: 'AUTO',
        },
      });
    }

    if (params.status && params.status.length > 0) {
      must.push({
        terms: { status: params.status },
      });
    }

    if (params.priority && params.priority.length > 0) {
      must.push({
        terms: { priority: params.priority },
      });
    }

    if (params.tags && params.tags.length > 0) {
      must.push({
        terms: { tags: params.tags },
      });
    }

    const body: any = {
      query: must.length > 0 ? { bool: { must } } : { match_all: {} },
      from: params.from || 0,
      size: params.size || 10,
      sort: [
        {
          [params.sortField || 'createdAt']: {
            order: params.sortOrder || 'desc',
          },
        },
      ],
    };

    const response = await this.client.callAsCurrentUser('search', {
      index: TODO_INDEX,
      body,
    });

    const items = response.hits.hits.map((hit: any) => hit._source as TodoItem);
    const total = response.hits.total.value;

    return { items, total };
  }

  async getStats(): Promise<TodoStats> {
    await this.ensureIndexExists();

    const response = await this.client.callAsCurrentUser('search', {
      index: TODO_INDEX,
      body: {
        size: 0,
        aggs: {
          by_status: {
            terms: { field: 'status' },
          },
          by_priority: {
            terms: { field: 'priority' },
          },
          completed_items: {
            filter: { term: { status: TodoStatus.COMPLETED } },
            aggs: {
              avg_completion_time: {
                avg: {
                  script: {
                    source: `
                      if (doc['completedAt'].size() > 0 && doc['createdAt'].size() > 0) {
                        return doc['completedAt'].value.millis - doc['createdAt'].value.millis;
                      }
                      return 0;
                    `,
                  },
                },
              },
            },
          },
        },
      },
    });

    const total = response.hits.total.value;
    const byStatus: Record<TodoStatus, number> = {
      [TodoStatus.PLANNED]: 0,
      [TodoStatus.IN_PROGRESS]: 0,
      [TodoStatus.COMPLETED]: 0,
      [TodoStatus.COMPLETED_WITH_ERROR]: 0,
    };

    const byPriority: Record<TodoPriority, number> = {
      [TodoPriority.LOW]: 0,
      [TodoPriority.MEDIUM]: 0,
      [TodoPriority.HIGH]: 0,
      [TodoPriority.CRITICAL]: 0,
    };

    response.aggregations.by_status.buckets.forEach((bucket: any) => {
      byStatus[bucket.key as TodoStatus] = bucket.doc_count;
    });

    response.aggregations.by_priority.buckets.forEach((bucket: any) => {
      byPriority[bucket.key as TodoPriority] = bucket.doc_count;
    });

    const completionRate = total > 0 ? (byStatus[TodoStatus.COMPLETED] / total) * 100 : 0;
    const avgCompletionTime =
      response.aggregations.completed_items.avg_completion_time.value || undefined;

    return {
      total,
      byStatus,
      byPriority,
      completionRate,
      avgCompletionTime,
    };
  }

  async getAllTags(): Promise<string[]> {
    await this.ensureIndexExists();

    const response = await this.client.callAsCurrentUser('search', {
      index: TODO_INDEX,
      body: {
        size: 0,
        aggs: {
          tags: {
            terms: {
              field: 'tags',
              size: 100,
            },
          },
        },
      },
    });

    return response.aggregations.tags.buckets.map((bucket: any) => bucket.key);
  }

  async bulkImport(todos: CreateTodoRequest[]): Promise<{ success: number; failed: number }> {
    await this.ensureIndexExists();

    const now = new Date().toISOString();
    const operations: any[] = [];

    todos.forEach((todoData) => {
      const id = uuidv4();
      const todo: TodoItem = {
        id,
        title: todoData.title,
        description: todoData.description,
        status: todoData.status || TodoStatus.PLANNED,
        priority: todoData.priority || TodoPriority.MEDIUM,
        tags: todoData.tags || [],
        assignee: todoData.assignee,
        createdAt: now,
        updatedAt: now,
        dueDate: todoData.dueDate,
      };

      // Set completedAt for completed tasks
      if (
        todo.status === TodoStatus.COMPLETED ||
        todo.status === TodoStatus.COMPLETED_WITH_ERROR
      ) {
        todo.completedAt = now;
      }

      // Add error message if status is completed with error
      if (todo.status === TodoStatus.COMPLETED_WITH_ERROR && (todoData as any).errorMessage) {
        todo.errorMessage = (todoData as any).errorMessage;
      }

      // Add index operation
      operations.push({ index: { _index: TODO_INDEX, _id: id } });
      operations.push(todo);
    });

    const response = await this.client.callAsCurrentUser('bulk', {
      body: operations,
      refresh: 'wait_for',
    });

    const failed = response.items.filter((item: any) => item.index.error).length;
    const success = response.items.length - failed;

    return { success, failed };
  }

  async hasSampleData(): Promise<boolean> {
    try {
      const response = await this.client.callAsCurrentUser('search', {
        index: TODO_INDEX,
        body: {
          size: 0,
          query: {
            match_all: {},
          },
        },
      });

      return response.hits.total.value > 0;
    } catch (error) {
      if (error.statusCode === 404) {
        return false;
      }
      throw error;
    }
  }

  async deleteAllTodos(): Promise<number> {
    try {
      const response = await this.client.callAsCurrentUser('deleteByQuery', {
        index: TODO_INDEX,
        body: {
          query: {
            match_all: {},
          },
        },
        refresh: 'wait_for',
      });

      return response.deleted;
    } catch (error) {
      if (error.statusCode === 404) {
        return 0;
      }
      throw error;
    }
  }
}

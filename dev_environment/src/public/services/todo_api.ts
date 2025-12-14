import { HttpSetup } from '../../../../src/core/public';
import {
  TodoItem,
  CreateTodoRequest,
  UpdateTodoRequest,
  SearchTodosRequest,
  TodoStats,
} from '../../common';

export class TodoApi {
  constructor(private readonly http: HttpSetup) {}

  async createTodo(data: CreateTodoRequest): Promise<TodoItem> {
    return await this.http.post('/api/custom_plugin/todos', {
      body: JSON.stringify(data),
    });
  }

  async getTodo(id: string): Promise<TodoItem> {
    return await this.http.get(`/api/custom_plugin/todos/${id}`);
  }

  async updateTodo(id: string, data: UpdateTodoRequest): Promise<TodoItem> {
    return await this.http.put(`/api/custom_plugin/todos/${id}`, {
      body: JSON.stringify(data),
    });
  }

  async deleteTodo(id: string): Promise<{ success: boolean }> {
    return await this.http.delete(`/api/custom_plugin/todos/${id}`);
  }

  async searchTodos(params: SearchTodosRequest): Promise<{ items: TodoItem[]; total: number }> {
    return await this.http.post('/api/custom_plugin/todos/_search', {
      body: JSON.stringify(params),
    });
  }

  async getStats(): Promise<TodoStats> {
    return await this.http.get('/api/custom_plugin/todos/_stats');
  }

  async getAllTags(): Promise<string[]> {
    const response = await this.http.get<{ tags: string[] }>(
      '/api/custom_plugin/todos/_tags'
    );
    return response.tags;
  }
}

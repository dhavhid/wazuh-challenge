import { TodoApi } from './todo_api';
import { TodoStatus, TodoPriority } from '../../common';

describe('TodoApi', () => {
  let todoApi: TodoApi;
  let mockHttp: any;

  beforeEach(() => {
    mockHttp = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
    };
    todoApi = new TodoApi(mockHttp);
  });

  describe('createTodo', () => {
    it('should create a todo', async () => {
      const mockTodo = {
        id: '1',
        title: 'Test Task',
        status: TodoStatus.PLANNED,
        priority: TodoPriority.MEDIUM,
        tags: [],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      mockHttp.post.mockResolvedValueOnce(mockTodo);

      const data = {
        title: 'Test Task',
      };

      const result = await todoApi.createTodo(data);

      expect(result).toEqual(mockTodo);
      expect(mockHttp.post).toHaveBeenCalledWith('/api/custom_plugin/todos', {
        body: JSON.stringify(data),
      });
    });
  });

  describe('getTodo', () => {
    it('should get a todo by id', async () => {
      const mockTodo = {
        id: '1',
        title: 'Test Task',
        status: TodoStatus.PLANNED,
        priority: TodoPriority.MEDIUM,
        tags: [],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      mockHttp.get.mockResolvedValueOnce(mockTodo);

      const result = await todoApi.getTodo('1');

      expect(result).toEqual(mockTodo);
      expect(mockHttp.get).toHaveBeenCalledWith('/api/custom_plugin/todos/1');
    });
  });

  describe('updateTodo', () => {
    it('should update a todo', async () => {
      const mockTodo = {
        id: '1',
        title: 'Updated Task',
        status: TodoStatus.COMPLETED,
        priority: TodoPriority.HIGH,
        tags: [],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-02T00:00:00Z',
      };

      mockHttp.put.mockResolvedValueOnce(mockTodo);

      const updates = {
        title: 'Updated Task',
        status: TodoStatus.COMPLETED,
      };

      const result = await todoApi.updateTodo('1', updates);

      expect(result).toEqual(mockTodo);
      expect(mockHttp.put).toHaveBeenCalledWith('/api/custom_plugin/todos/1', {
        body: JSON.stringify(updates),
      });
    });
  });

  describe('deleteTodo', () => {
    it('should delete a todo', async () => {
      mockHttp.delete.mockResolvedValueOnce({ success: true });

      const result = await todoApi.deleteTodo('1');

      expect(result).toEqual({ success: true });
      expect(mockHttp.delete).toHaveBeenCalledWith('/api/custom_plugin/todos/1');
    });
  });

  describe('searchTodos', () => {
    it('should search todos', async () => {
      const mockResponse = {
        items: [
          {
            id: '1',
            title: 'Test Task',
            status: TodoStatus.PLANNED,
            priority: TodoPriority.MEDIUM,
            tags: [],
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
          },
        ],
        total: 1,
      };

      mockHttp.post.mockResolvedValueOnce(mockResponse);

      const params = {
        query: 'test',
        from: 0,
        size: 10,
      };

      const result = await todoApi.searchTodos(params);

      expect(result).toEqual(mockResponse);
      expect(mockHttp.post).toHaveBeenCalledWith('/api/custom_plugin/todos/_search', {
        body: JSON.stringify(params),
      });
    });
  });

  describe('getStats', () => {
    it('should get statistics', async () => {
      const mockStats = {
        total: 10,
        byStatus: {
          [TodoStatus.PLANNED]: 3,
          [TodoStatus.IN_PROGRESS]: 2,
          [TodoStatus.COMPLETED]: 5,
          [TodoStatus.COMPLETED_WITH_ERROR]: 0,
        },
        byPriority: {
          [TodoPriority.LOW]: 2,
          [TodoPriority.MEDIUM]: 4,
          [TodoPriority.HIGH]: 3,
          [TodoPriority.CRITICAL]: 1,
        },
        completionRate: 50,
      };

      mockHttp.get.mockResolvedValueOnce(mockStats);

      const result = await todoApi.getStats();

      expect(result).toEqual(mockStats);
      expect(mockHttp.get).toHaveBeenCalledWith('/api/custom_plugin/todos/_stats');
    });
  });

  describe('getAllTags', () => {
    it('should get all tags', async () => {
      const mockResponse = { tags: ['tag1', 'tag2', 'tag3'] };

      mockHttp.get.mockResolvedValueOnce(mockResponse);

      const result = await todoApi.getAllTags();

      expect(result).toEqual(['tag1', 'tag2', 'tag3']);
      expect(mockHttp.get).toHaveBeenCalledWith('/api/custom_plugin/todos/_tags');
    });
  });
});

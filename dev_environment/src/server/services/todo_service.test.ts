import { TodoService } from './todo_service';
import { TodoStatus, TodoPriority } from '../../common';

describe('TodoService', () => {
  let todoService: TodoService;
  let mockClient: any;

  beforeEach(() => {
    mockClient = {
      callAsCurrentUser: jest.fn(),
    };
    todoService = new TodoService(mockClient);
  });

  describe('ensureIndexExists', () => {
    it('should create index if it does not exist', async () => {
      mockClient.callAsCurrentUser
        .mockResolvedValueOnce(false) // indices.exists
        .mockResolvedValueOnce({}); // indices.create

      await todoService.ensureIndexExists();

      expect(mockClient.callAsCurrentUser).toHaveBeenCalledWith('indices.exists', {
        index: '.todo-items',
      });
      expect(mockClient.callAsCurrentUser).toHaveBeenCalledWith('indices.create', expect.any(Object));
    });

    it('should not create index if it already exists', async () => {
      mockClient.callAsCurrentUser.mockResolvedValueOnce(true); // indices.exists

      await todoService.ensureIndexExists();

      expect(mockClient.callAsCurrentUser).toHaveBeenCalledTimes(1);
      expect(mockClient.callAsCurrentUser).toHaveBeenCalledWith('indices.exists', {
        index: '.todo-items',
      });
    });
  });

  describe('createTodo', () => {
    it('should create a new todo with default values', async () => {
      mockClient.callAsCurrentUser
        .mockResolvedValueOnce(true) // ensureIndexExists - indices.exists
        .mockResolvedValueOnce({}); // index

      const data = {
        title: 'Test Task',
        description: 'Test Description',
      };

      const result = await todoService.createTodo(data);

      expect(result).toMatchObject({
        title: 'Test Task',
        description: 'Test Description',
        status: TodoStatus.PLANNED,
        priority: TodoPriority.MEDIUM,
        tags: [],
      });
      expect(result.id).toBeDefined();
      expect(result.createdAt).toBeDefined();
      expect(result.updatedAt).toBeDefined();
    });

    it('should create a todo with custom status and priority', async () => {
      mockClient.callAsCurrentUser
        .mockResolvedValueOnce(true) // ensureIndexExists
        .mockResolvedValueOnce({}); // index

      const data = {
        title: 'High Priority Task',
        status: TodoStatus.IN_PROGRESS,
        priority: TodoPriority.HIGH,
        tags: ['urgent', 'security'],
      };

      const result = await todoService.createTodo(data);

      expect(result).toMatchObject({
        title: 'High Priority Task',
        status: TodoStatus.IN_PROGRESS,
        priority: TodoPriority.HIGH,
        tags: ['urgent', 'security'],
      });
    });
  });

  describe('getTodo', () => {
    it('should return a todo by id', async () => {
      const mockTodo = {
        id: 'test-id',
        title: 'Test Task',
        status: TodoStatus.PLANNED,
        priority: TodoPriority.MEDIUM,
        tags: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      mockClient.callAsCurrentUser.mockResolvedValueOnce({
        _source: mockTodo,
      });

      const result = await todoService.getTodo('test-id');

      expect(result).toEqual(mockTodo);
      expect(mockClient.callAsCurrentUser).toHaveBeenCalledWith('get', {
        index: '.todo-items',
        id: 'test-id',
      });
    });

    it('should return null if todo not found', async () => {
      mockClient.callAsCurrentUser.mockRejectedValueOnce({
        statusCode: 404,
      });

      const result = await todoService.getTodo('non-existent-id');

      expect(result).toBeNull();
    });

    it('should throw error for other errors', async () => {
      mockClient.callAsCurrentUser.mockRejectedValueOnce({
        statusCode: 500,
        message: 'Internal error',
      });

      await expect(todoService.getTodo('test-id')).rejects.toMatchObject({
        statusCode: 500,
      });
    });
  });

  describe('updateTodo', () => {
    it('should update an existing todo', async () => {
      const existingTodo = {
        id: 'test-id',
        title: 'Old Title',
        status: TodoStatus.PLANNED,
        priority: TodoPriority.MEDIUM,
        tags: [],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      mockClient.callAsCurrentUser
        .mockResolvedValueOnce({ _source: existingTodo }) // getTodo
        .mockResolvedValueOnce({}); // index

      const updates = {
        title: 'New Title',
        status: TodoStatus.COMPLETED,
      };

      const result = await todoService.updateTodo('test-id', updates);

      expect(result).toMatchObject({
        title: 'New Title',
        status: TodoStatus.COMPLETED,
      });
      expect(result?.updatedAt).not.toBe(existingTodo.updatedAt);
      expect(result?.completedAt).toBeDefined();
    });

    it('should return null if todo not found', async () => {
      mockClient.callAsCurrentUser.mockRejectedValueOnce({
        statusCode: 404,
      });

      const result = await todoService.updateTodo('non-existent-id', { title: 'New Title' });

      expect(result).toBeNull();
    });
  });

  describe('deleteTodo', () => {
    it('should delete a todo', async () => {
      mockClient.callAsCurrentUser.mockResolvedValueOnce({});

      const result = await todoService.deleteTodo('test-id');

      expect(result).toBe(true);
      expect(mockClient.callAsCurrentUser).toHaveBeenCalledWith('delete', {
        index: '.todo-items',
        id: 'test-id',
        refresh: 'wait_for',
      });
    });

    it('should return false if todo not found', async () => {
      mockClient.callAsCurrentUser.mockRejectedValueOnce({
        statusCode: 404,
      });

      const result = await todoService.deleteTodo('non-existent-id');

      expect(result).toBe(false);
    });
  });

  describe('searchTodos', () => {
    it('should search todos with query', async () => {
      mockClient.callAsCurrentUser
        .mockResolvedValueOnce(true) // ensureIndexExists
        .mockResolvedValueOnce({
          hits: {
            hits: [
              { _source: { id: '1', title: 'Task 1' } },
              { _source: { id: '2', title: 'Task 2' } },
            ],
            total: { value: 2 },
          },
        });

      const result = await todoService.searchTodos({
        query: 'test',
        from: 0,
        size: 10,
      });

      expect(result.items).toHaveLength(2);
      expect(result.total).toBe(2);
    });

    it('should filter by status', async () => {
      mockClient.callAsCurrentUser
        .mockResolvedValueOnce(true) // ensureIndexExists
        .mockResolvedValueOnce({
          hits: {
            hits: [{ _source: { id: '1', title: 'Task 1', status: TodoStatus.COMPLETED } }],
            total: { value: 1 },
          },
        });

      const result = await todoService.searchTodos({
        status: [TodoStatus.COMPLETED],
      });

      expect(result.items).toHaveLength(1);
      expect(mockClient.callAsCurrentUser).toHaveBeenCalledWith(
        'search',
        expect.objectContaining({
          body: expect.objectContaining({
            query: expect.objectContaining({
              bool: expect.objectContaining({
                must: expect.arrayContaining([
                  expect.objectContaining({
                    terms: { status: [TodoStatus.COMPLETED] },
                  }),
                ]),
              }),
            }),
          }),
        })
      );
    });
  });

  describe('getStats', () => {
    it('should return statistics', async () => {
      mockClient.callAsCurrentUser
        .mockResolvedValueOnce(true) // ensureIndexExists
        .mockResolvedValueOnce({
          hits: { total: { value: 10 } },
          aggregations: {
            by_status: {
              buckets: [
                { key: TodoStatus.COMPLETED, doc_count: 5 },
                { key: TodoStatus.PLANNED, doc_count: 3 },
                { key: TodoStatus.IN_PROGRESS, doc_count: 2 },
              ],
            },
            by_priority: {
              buckets: [
                { key: TodoPriority.HIGH, doc_count: 4 },
                { key: TodoPriority.MEDIUM, doc_count: 4 },
                { key: TodoPriority.LOW, doc_count: 2 },
              ],
            },
            completed_items: {
              avg_completion_time: { value: 86400000 }, // 1 day in ms
            },
          },
        });

      const result = await todoService.getStats();

      expect(result.total).toBe(10);
      expect(result.byStatus[TodoStatus.COMPLETED]).toBe(5);
      expect(result.completionRate).toBe(50);
      expect(result.avgCompletionTime).toBe(86400000);
    });
  });

  describe('getAllTags', () => {
    it('should return all unique tags', async () => {
      mockClient.callAsCurrentUser
        .mockResolvedValueOnce(true) // ensureIndexExists
        .mockResolvedValueOnce({
          aggregations: {
            tags: {
              buckets: [
                { key: 'security' },
                { key: 'compliance' },
                { key: 'urgent' },
              ],
            },
          },
        });

      const result = await todoService.getAllTags();

      expect(result).toEqual(['security', 'compliance', 'urgent']);
    });
  });
});

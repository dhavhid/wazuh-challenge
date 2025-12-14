import { schema } from '@osd/config-schema';
import { IRouter } from '../../../../src/core/server';
import { TodoService } from '../services/todo_service';
import { TodoStatus, TodoPriority } from '../../common';
import { generateDistributedSampleData } from '../sample_data/generate_sample_data';

export function defineRoutes(router: IRouter) {
  // Create a new TODO
  router.post(
    {
      path: '/api/custom_plugin/todos',
      validate: {
        body: schema.object({
          title: schema.string(),
          description: schema.maybe(schema.string()),
          status: schema.maybe(
            schema.oneOf([
              schema.literal(TodoStatus.PLANNED),
              schema.literal(TodoStatus.IN_PROGRESS),
              schema.literal(TodoStatus.COMPLETED),
              schema.literal(TodoStatus.COMPLETED_WITH_ERROR),
            ])
          ),
          priority: schema.maybe(
            schema.oneOf([
              schema.literal(TodoPriority.LOW),
              schema.literal(TodoPriority.MEDIUM),
              schema.literal(TodoPriority.HIGH),
              schema.literal(TodoPriority.CRITICAL),
            ])
          ),
          tags: schema.maybe(schema.arrayOf(schema.string())),
          assignee: schema.maybe(schema.string()),
          dueDate: schema.maybe(schema.string()),
        }),
      },
    },
    async (context, request, response) => {
      try {
        const client = context.core.opensearch.legacy.client;
        const todoService = new TodoService(client);
        const todo = await todoService.createTodo(request.body);
        return response.ok({ body: todo });
      } catch (error) {
        return response.customError({
          statusCode: 500,
          body: { message: error.message },
        });
      }
    }
  );

  // Get a single TODO by ID
  router.get(
    {
      path: '/api/custom_plugin/todos/{id}',
      validate: {
        params: schema.object({
          id: schema.string(),
        }),
      },
    },
    async (context, request, response) => {
      try {
        const client = context.core.opensearch.legacy.client;
        const todoService = new TodoService(client);
        const todo = await todoService.getTodo(request.params.id);

        if (!todo) {
          return response.notFound({ body: { message: 'TODO not found' } });
        }

        return response.ok({ body: todo });
      } catch (error) {
        return response.customError({
          statusCode: 500,
          body: { message: error.message },
        });
      }
    }
  );

  // Update a TODO
  router.put(
    {
      path: '/api/custom_plugin/todos/{id}',
      validate: {
        params: schema.object({
          id: schema.string(),
        }),
        body: schema.object({
          title: schema.maybe(schema.string()),
          description: schema.maybe(schema.string()),
          status: schema.maybe(
            schema.oneOf([
              schema.literal(TodoStatus.PLANNED),
              schema.literal(TodoStatus.IN_PROGRESS),
              schema.literal(TodoStatus.COMPLETED),
              schema.literal(TodoStatus.COMPLETED_WITH_ERROR),
            ])
          ),
          priority: schema.maybe(
            schema.oneOf([
              schema.literal(TodoPriority.LOW),
              schema.literal(TodoPriority.MEDIUM),
              schema.literal(TodoPriority.HIGH),
              schema.literal(TodoPriority.CRITICAL),
            ])
          ),
          tags: schema.maybe(schema.arrayOf(schema.string())),
          assignee: schema.maybe(schema.string()),
          dueDate: schema.maybe(schema.string()),
          completedAt: schema.maybe(schema.string()),
          errorMessage: schema.maybe(schema.string()),
        }),
      },
    },
    async (context, request, response) => {
      try {
        const client = context.core.opensearch.legacy.client;
        const todoService = new TodoService(client);
        const todo = await todoService.updateTodo(request.params.id, request.body);

        if (!todo) {
          return response.notFound({ body: { message: 'TODO not found' } });
        }

        return response.ok({ body: todo });
      } catch (error) {
        return response.customError({
          statusCode: 500,
          body: { message: error.message },
        });
      }
    }
  );

  // Delete a TODO
  router.delete(
    {
      path: '/api/custom_plugin/todos/{id}',
      validate: {
        params: schema.object({
          id: schema.string(),
        }),
      },
    },
    async (context, request, response) => {
      try {
        const client = context.core.opensearch.legacy.client;
        const todoService = new TodoService(client);
        const deleted = await todoService.deleteTodo(request.params.id);

        if (!deleted) {
          return response.notFound({ body: { message: 'TODO not found' } });
        }

        return response.ok({ body: { success: true } });
      } catch (error) {
        return response.customError({
          statusCode: 500,
          body: { message: error.message },
        });
      }
    }
  );

  // Search TODOs
  router.post(
    {
      path: '/api/custom_plugin/todos/_search',
      validate: {
        body: schema.object({
          query: schema.maybe(schema.string()),
          status: schema.maybe(schema.arrayOf(schema.string())),
          priority: schema.maybe(schema.arrayOf(schema.string())),
          tags: schema.maybe(schema.arrayOf(schema.string())),
          from: schema.maybe(schema.number()),
          size: schema.maybe(schema.number()),
          sortField: schema.maybe(schema.string()),
          sortOrder: schema.maybe(schema.oneOf([schema.literal('asc'), schema.literal('desc')])),
        }),
      },
    },
    async (context, request, response) => {
      try {
        const client = context.core.opensearch.legacy.client;
        const todoService = new TodoService(client);
        const result = await todoService.searchTodos(request.body);
        return response.ok({ body: result });
      } catch (error) {
        return response.customError({
          statusCode: 500,
          body: { message: error.message },
        });
      }
    }
  );

  // Get statistics
  router.get(
    {
      path: '/api/custom_plugin/todos/_stats',
      validate: false,
    },
    async (context, request, response) => {
      try {
        const client = context.core.opensearch.legacy.client;
        const todoService = new TodoService(client);
        const stats = await todoService.getStats();
        return response.ok({ body: stats });
      } catch (error) {
        return response.customError({
          statusCode: 500,
          body: { message: error.message },
        });
      }
    }
  );

  // Get all tags
  router.get(
    {
      path: '/api/custom_plugin/todos/_tags',
      validate: false,
    },
    async (context, request, response) => {
      try {
        const client = context.core.opensearch.legacy.client;
        const todoService = new TodoService(client);
        const tags = await todoService.getAllTags();
        return response.ok({ body: { tags } });
      } catch (error) {
        return response.customError({
          statusCode: 500,
          body: { message: error.message },
        });
      }
    }
  );

  // Load sample data
  router.post(
    {
      path: '/api/custom_plugin/todos/_sample_data/load',
      validate: {
        body: schema.object({
          force: schema.maybe(schema.boolean()),
        }),
      },
    },
    async (context, request, response) => {
      try {
        const client = context.core.opensearch.legacy.client;
        const todoService = new TodoService(client);
        const { force } = request.body;

        // Check if data already exists
        const hasData = await todoService.hasSampleData();

        if (hasData && !force) {
          return response.customError({
            statusCode: 409,
            body: {
              message:
                'Sample data already exists. Use force=true to reload.',
            },
          });
        }

        // Delete existing data if force is true
        if (hasData && force) {
          await todoService.deleteAllTodos();
        }

        // Generate and import sample data
        const sampleData = generateDistributedSampleData();
        const result = await todoService.bulkImport(sampleData);

        return response.ok({
          body: {
            message: 'Sample data loaded successfully',
            imported: result.success,
            failed: result.failed,
            total: sampleData.length,
          },
        });
      } catch (error) {
        return response.customError({
          statusCode: 500,
          body: { message: error.message },
        });
      }
    }
  );

  // Delete all sample data
  router.delete(
    {
      path: '/api/custom_plugin/todos/_sample_data',
      validate: false,
    },
    async (context, request, response) => {
      try {
        const client = context.core.opensearch.legacy.client;
        const todoService = new TodoService(client);
        const deleted = await todoService.deleteAllTodos();

        return response.ok({
          body: {
            message: 'All TODO items deleted successfully',
            deleted,
          },
        });
      } catch (error) {
        return response.customError({
          statusCode: 500,
          body: { message: error.message },
        });
      }
    }
  );

  // Get sample data status
  router.get(
    {
      path: '/api/custom_plugin/todos/_sample_data/status',
      validate: false,
    },
    async (context, request, response) => {
      try {
        const client = context.core.opensearch.legacy.client;
        const todoService = new TodoService(client);
        const hasData = await todoService.hasSampleData();

        const stats = hasData ? await todoService.getStats() : null;

        return response.ok({
          body: {
            hasData,
            stats,
          },
        });
      } catch (error) {
        return response.customError({
          statusCode: 500,
          body: { message: error.message },
        });
      }
    }
  );
}

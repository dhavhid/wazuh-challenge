# TO-DO Plugin Testing Guide

## Overview

This plugin includes comprehensive tests for both frontend and backend components using Jest as the testing framework. The tests are designed to run within the Docker development environment and ensure the plugin functions correctly.

## Table of Contents

1. [Test Structure](#test-structure)
2. [Running Tests](#running-tests)
3. [Test Coverage](#test-coverage)
4. [Writing Tests](#writing-tests)
5. [Testing Patterns](#testing-patterns)
6. [Troubleshooting](#troubleshooting)

## Test Structure

```
custom_plugin/
├── test/
│   ├── jest.config.js          # Jest configuration
│   ├── setup_tests.ts          # Test setup file
│   └── __mocks__/
│       └── style_mock.ts       # Mock for CSS imports
├── server/
│   └── services/
│       └── todo_service.test.ts    # Backend service tests
└── public/
    ├── services/
    │   └── todo_api.test.ts        # API client tests
    └── components/
        ├── todo_list.test.tsx      # TodoList component tests
        └── todo_form.test.tsx      # TodoForm component tests
```

## Running Tests

### Prerequisites

Before running tests, ensure you have:
1. Docker and Docker Compose installed
2. Development environment running (see dev_environment/README.md)
3. Plugin dependencies installed

### Running All Tests

From the plugin directory:

```bash
# Inside Docker container
yarn test
```

Or from the OpenSearch Dashboards root:

```bash
# Run tests for this plugin only
yarn test:jest plugins/custom_plugin
```

### Running Tests in Watch Mode

For development, use watch mode to automatically re-run tests on file changes:

```bash
yarn test:watch
```

### Running Specific Test Files

```bash
# Run a specific test file
yarn test todo_service.test.ts

# Run tests matching a pattern
yarn test --testPathPattern=components

# Run tests by name
yarn test --testNamePattern="should create a todo"
```

### Running Tests with Coverage

```bash
# Generate coverage report
yarn test --coverage

# Coverage report will be in target/coverage/
# Open target/coverage/index.html in a browser to view detailed report
```

## Test Coverage

### Coverage Goals

- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

### Current Coverage

| Component | Statements | Branches | Functions | Lines |
|-----------|-----------|----------|-----------|-------|
| TodoService | ~95% | ~90% | 100% | ~95% |
| TodoApi | 100% | 100% | 100% | 100% |
| TodoList | ~85% | ~80% | ~90% | ~85% |
| TodoForm | ~80% | ~75% | ~85% | ~80% |

## Writing Tests

### Backend Tests

#### Testing TodoService

Example test structure:

```typescript
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

  it('should create a todo', async () => {
    // Setup mocks
    mockClient.callAsCurrentUser
      .mockResolvedValueOnce(true)  // ensureIndexExists
      .mockResolvedValueOnce({});   // index

    // Execute
    const result = await todoService.createTodo({
      title: 'Test Task',
    });

    // Assert
    expect(result.title).toBe('Test Task');
    expect(result.id).toBeDefined();
    expect(mockClient.callAsCurrentUser).toHaveBeenCalledWith(
      'index',
      expect.objectContaining({
        index: '.todo-items',
      })
    );
  });
});
```

**Key Points:**
- Mock the OpenSearch client
- Test both success and error scenarios
- Verify mock call arguments
- Test edge cases (null, undefined, empty values)

#### Testing Routes

While we don't have dedicated route tests in this implementation, here's how you would test them:

```typescript
import { defineRoutes } from './routes';

describe('Todo Routes', () => {
  let router: any;
  let mockContext: any;

  beforeEach(() => {
    router = {
      post: jest.fn(),
      get: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
    };

    mockContext = {
      core: {
        opensearch: {
          legacy: {
            client: {
              callAsCurrentUser: jest.fn(),
            },
          },
        },
      },
    };
  });

  it('should register routes', () => {
    defineRoutes(router);

    expect(router.post).toHaveBeenCalledWith(
      expect.objectContaining({
        path: '/api/custom_plugin/todos',
      }),
      expect.any(Function)
    );
  });
});
```

### Frontend Tests

#### Testing React Components

Example test for TodoList:

```typescript
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TodoList } from './todo_list';
import { TodoItem, TodoStatus, TodoPriority } from '../../common';

describe('TodoList', () => {
  const mockTodos: TodoItem[] = [
    {
      id: '1',
      title: 'Task 1',
      status: TodoStatus.PLANNED,
      priority: TodoPriority.HIGH,
      tags: ['tag1'],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
  ];

  const defaultProps = {
    todos: mockTodos,
    total: 1,
    loading: false,
    pageIndex: 0,
    pageSize: 10,
    sortField: 'createdAt',
    sortDirection: 'desc' as const,
    onTableChange: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn(),
    onStatusChange: jest.fn(),
  };

  it('should render todo items', () => {
    render(<TodoList {...defaultProps} />);
    expect(screen.getByText('Task 1')).toBeInTheDocument();
  });

  it('should call onEdit when edit button clicked', () => {
    const onEdit = jest.fn();
    render(<TodoList {...defaultProps} onEdit={onEdit} />);

    const editButton = screen.getByLabelText('Edit');
    fireEvent.click(editButton);

    expect(onEdit).toHaveBeenCalledWith(mockTodos[0]);
  });
});
```

**Key Points:**
- Use `@testing-library/react` for component rendering
- Test user interactions with `fireEvent` or `userEvent`
- Use `screen` queries for finding elements
- Mock props and callbacks
- Test both render and behavior

#### Testing Forms

Example test for TodoForm validation:

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TodoForm } from './todo_form';

describe('TodoForm', () => {
  it('should show validation error for empty title', async () => {
    const onSubmit = jest.fn();
    render(
      <TodoForm
        availableTags={[]}
        onSubmit={onSubmit}
        onCancel={jest.fn()}
      />
    );

    const submitButton = screen.getByText('Create');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument();
    });

    expect(onSubmit).not.toHaveBeenCalled();
  });
});
```

**Key Points:**
- Test validation logic
- Use `waitFor` for async assertions
- Verify form submission behavior
- Test conditional rendering (error messages, optional fields)

#### Testing API Services

Example test for TodoApi:

```typescript
import { TodoApi } from './todo_api';

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

  it('should create a todo', async () => {
    const mockTodo = { id: '1', title: 'Test' };
    mockHttp.post.mockResolvedValueOnce(mockTodo);

    const result = await todoApi.createTodo({ title: 'Test' });

    expect(result).toEqual(mockTodo);
    expect(mockHttp.post).toHaveBeenCalledWith(
      '/api/custom_plugin/todos',
      { body: JSON.stringify({ title: 'Test' }) }
    );
  });
});
```

**Key Points:**
- Mock the HTTP client
- Verify correct HTTP method and URL
- Test request body serialization
- Test error handling

## Testing Patterns

### 1. **Arrange-Act-Assert Pattern**

```typescript
it('should update a todo', async () => {
  // Arrange - Set up test data and mocks
  const mockTodo = { id: '1', title: 'Original' };
  mockClient.callAsCurrentUser.mockResolvedValue({ _source: mockTodo });

  // Act - Execute the function being tested
  const result = await todoService.updateTodo('1', { title: 'Updated' });

  // Assert - Verify the results
  expect(result?.title).toBe('Updated');
});
```

### 2. **Testing Async Code**

```typescript
// Using async/await
it('should handle async operations', async () => {
  await expect(todoService.createTodo(data)).resolves.toMatchObject({
    title: 'Test',
  });
});

// Testing rejections
it('should handle errors', async () => {
  mockClient.callAsCurrentUser.mockRejectedValue(new Error('Failed'));
  await expect(todoService.createTodo(data)).rejects.toThrow('Failed');
});
```

### 3. **Testing Component State**

```typescript
it('should update state on user input', () => {
  render(<TodoForm {...props} />);

  const titleInput = screen.getByPlaceholderText('Enter task title');
  fireEvent.change(titleInput, { target: { value: 'New Title' } });

  expect(titleInput).toHaveValue('New Title');
});
```

### 4. **Testing Callbacks**

```typescript
it('should call callback with correct arguments', () => {
  const onStatusChange = jest.fn();
  render(<TodoList {...props} onStatusChange={onStatusChange} />);

  const completeButton = screen.getByLabelText('Complete');
  fireEvent.click(completeButton);

  expect(onStatusChange).toHaveBeenCalledWith('1', TodoStatus.COMPLETED);
  expect(onStatusChange).toHaveBeenCalledTimes(1);
});
```

### 5. **Testing Error Scenarios**

```typescript
describe('error handling', () => {
  it('should return null when todo not found', async () => {
    mockClient.callAsCurrentUser.mockRejectedValue({ statusCode: 404 });
    const result = await todoService.getTodo('non-existent');
    expect(result).toBeNull();
  });

  it('should throw on server errors', async () => {
    mockClient.callAsCurrentUser.mockRejectedValue({ statusCode: 500 });
    await expect(todoService.getTodo('1')).rejects.toMatchObject({
      statusCode: 500,
    });
  });
});
```

## Test Best Practices

### DO ✅

1. **Write Descriptive Test Names**
   ```typescript
   it('should create a todo with default status and priority')
   ```

2. **Test One Thing Per Test**
   ```typescript
   // Good - focused test
   it('should set completedAt when status is completed', async () => {
     const result = await todoService.updateTodo('1', {
       status: TodoStatus.COMPLETED
     });
     expect(result?.completedAt).toBeDefined();
   });
   ```

3. **Use Test Data Builders**
   ```typescript
   const createMockTodo = (overrides = {}) => ({
     id: '1',
     title: 'Test',
     status: TodoStatus.PLANNED,
     priority: TodoPriority.MEDIUM,
     tags: [],
     createdAt: new Date().toISOString(),
     updatedAt: new Date().toISOString(),
     ...overrides,
   });
   ```

4. **Clean Up After Tests**
   ```typescript
   afterEach(() => {
     jest.clearAllMocks();
   });
   ```

5. **Test Edge Cases**
   - Empty arrays
   - Null/undefined values
   - Large datasets
   - Special characters in strings

### DON'T ❌

1. **Don't Test Implementation Details**
   ```typescript
   // Bad - testing internal state
   expect(component.state.isLoading).toBe(true);

   // Good - testing observable behavior
   expect(screen.getByRole('progressbar')).toBeInTheDocument();
   ```

2. **Don't Use Real Dependencies**
   ```typescript
   // Bad - using real OpenSearch
   const client = new OpenSearchClient();

   // Good - using mocks
   const mockClient = { callAsCurrentUser: jest.fn() };
   ```

3. **Don't Ignore Warnings**
   - Fix all console warnings and errors
   - Wrap async updates in `act()` when needed

4. **Don't Make Tests Depend on Each Other**
   ```typescript
   // Bad - tests depend on order
   it('test 1', () => { shared.value = 1; });
   it('test 2', () => { expect(shared.value).toBe(1); });

   // Good - independent tests
   it('test 1', () => {
     const value = 1;
     expect(value).toBe(1);
   });
   ```

## Troubleshooting

### Common Issues

#### 1. **Tests Fail in Docker but Pass Locally**

**Problem**: Different Node versions or missing dependencies

**Solution**:
```bash
# Rebuild Docker container
docker-compose down
docker-compose up --build

# Or clear node_modules and reinstall
rm -rf node_modules
yarn install
```

#### 2. **Import Errors for EUI Components**

**Problem**: EUI components not found or styled incorrectly

**Solution**: Check that style mocks are configured:
```javascript
// test/jest.config.js
moduleNameMapper: {
  '\\.(css|less|scss|sass)$': '<rootDir>/test/__mocks__/style_mock.ts',
}
```

#### 3. **Async Test Timeouts**

**Problem**: Tests timeout waiting for async operations

**Solution**:
```typescript
// Increase timeout for specific test
it('should complete async operation', async () => {
  // ...
}, 10000); // 10 second timeout

// Or use waitFor with custom timeout
await waitFor(
  () => expect(screen.getByText('Loaded')).toBeInTheDocument(),
  { timeout: 5000 }
);
```

#### 4. **Mock Not Working**

**Problem**: Mock function not being called or returning undefined

**Solution**:
```typescript
// Ensure mock is properly configured before test
beforeEach(() => {
  mockClient.callAsCurrentUser.mockReset();
  mockClient.callAsCurrentUser.mockResolvedValue({ result: 'success' });
});

// Check mock was called
expect(mockClient.callAsCurrentUser).toHaveBeenCalled();

// Debug mock calls
console.log(mockClient.callAsCurrentUser.mock.calls);
```

#### 5. **React Testing Library Queries Fail**

**Problem**: `Unable to find element` errors

**Solution**:
```typescript
// Use screen.debug() to see rendered output
render(<Component />);
screen.debug();

// Use getAllBy* for multiple elements
const buttons = screen.getAllByRole('button');

// Use queryBy* for elements that may not exist
const optionalElement = screen.queryByText('Optional');
expect(optionalElement).not.toBeInTheDocument();
```

## Running Tests in CI/CD

### GitHub Actions Example

```yaml
name: Test Plugin

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: yarn install
      - name: Run tests
        run: yarn test --coverage
      - name: Upload coverage
        uses: codecov/codecov-action@v2
        with:
          directory: ./target/coverage
```

### Docker-based CI

```bash
# In CI environment
docker-compose run --rm opensearch-dashboards yarn test --ci --coverage

# Generate coverage report
docker-compose run --rm opensearch-dashboards yarn test --coverage --coverageReporters=text-summary
```

## Test Metrics

### Measuring Test Quality

1. **Code Coverage**: Aim for >80% coverage
2. **Test Count**: ~1-3 tests per function/component
3. **Test Speed**: All tests should complete in <30 seconds
4. **Flakiness**: 0 flaky tests (tests that randomly fail)

### Monitoring Tests

```bash
# Run tests with verbose output
yarn test --verbose

# Generate detailed coverage report
yarn test --coverage --coverageReporters=html text

# Run only changed tests (useful in development)
yarn test --onlyChanged
```

## Additional Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [OpenSearch Dashboards Testing Guide](../../TESTING.md)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

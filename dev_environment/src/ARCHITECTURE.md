# TO-DO Plugin Architecture

## Overview

This plugin is a complete task management application for OpenSearch Dashboards that allows security professionals to track compliance-related tasks. It follows the standard OpenSearch Dashboards plugin architecture with clear separation between frontend, backend, and data layers.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend (React)                     │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────────┐  │
│  │   TodoList  │  │   TodoForm   │  │   TodoStats       │  │
│  │  Component  │  │  Component   │  │   Component       │  │
│  └─────────────┘  └──────────────┘  └───────────────────┘  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │             TodoFilters Component                    │   │
│  └─────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│                    TodoApi Service Layer                     │
├─────────────────────────────────────────────────────────────┤
│                     HTTP / REST API                          │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    Backend (Node.js)                         │
├─────────────────────────────────────────────────────────────┤
│                    Route Handlers                            │
│  POST   /api/custom_plugin/todos                            │
│  GET    /api/custom_plugin/todos/:id                        │
│  PUT    /api/custom_plugin/todos/:id                        │
│  DELETE /api/custom_plugin/todos/:id                        │
│  POST   /api/custom_plugin/todos/_search                    │
│  GET    /api/custom_plugin/todos/_stats                     │
│  GET    /api/custom_plugin/todos/_tags                      │
├─────────────────────────────────────────────────────────────┤
│                TodoService (Business Logic)                  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    OpenSearch Cluster                        │
│                    Index: .todo-items                        │
└─────────────────────────────────────────────────────────────┘
```

## Directory Structure

```
custom_plugin/
├── common/                      # Shared types and constants
│   └── index.ts                # TodoItem, enums, interfaces
├── server/                      # Backend code
│   ├── plugin.ts               # Server plugin initialization
│   ├── routes/
│   │   └── index.ts            # REST API route definitions
│   └── services/
│       ├── todo_service.ts     # Business logic & OpenSearch operations
│       └── todo_service.test.ts
├── public/                      # Frontend code
│   ├── plugin.ts               # Client plugin initialization
│   ├── application.tsx         # App bootstrap
│   ├── components/
│   │   ├── app.tsx             # Main application component
│   │   ├── todo_list.tsx       # Table with sorting & pagination
│   │   ├── todo_list.test.tsx
│   │   ├── todo_form.tsx       # Create/Edit form
│   │   ├── todo_form.test.tsx
│   │   ├── todo_stats.tsx      # Charts and statistics
│   │   └── todo_filters.tsx    # Search and filters
│   └── services/
│       ├── todo_api.ts         # API client wrapper
│       └── todo_api.test.ts
├── test/                        # Test configuration
│   ├── jest.config.js
│   ├── setup_tests.ts
│   └── __mocks__/
└── opensearch_dashboards.json  # Plugin manifest
```

## Component Details

### Frontend Components

#### 1. **App Component** (`public/components/app.tsx`)
- **Purpose**: Main application container and state management
- **Responsibilities**:
  - Manages global application state (todos, filters, pagination)
  - Coordinates between child components
  - Handles API calls via TodoApi service
  - Manages modal states (create, edit, delete)
  - Implements tabbed interface (Tasks, Statistics)
- **State Management**:
  - Uses React hooks (useState, useEffect, useCallback)
  - No external state management library (Redux, MobX) to keep it simple
  - State updates trigger re-renders and API calls

#### 2. **TodoList Component** (`public/components/todo_list.tsx`)
- **Purpose**: Display todos in a sortable, paginated table
- **Features**:
  - Server-side pagination
  - Column sorting (title, status, priority, dates)
  - Action buttons (complete, edit, delete)
  - Color-coded status and priority badges
  - Responsive design with EUI components
- **Props**: todos, pagination state, sorting state, event handlers

#### 3. **TodoForm Component** (`public/components/todo_form.tsx`)
- **Purpose**: Create and edit todos
- **Features**:
  - All todo fields (title, description, status, priority, tags, assignee, due date)
  - Client-side validation
  - Tag creation (ComboBox with custom tag support)
  - Conditional fields (error message for "completed with error" status)
  - Date picker for due dates
- **Validation**:
  - Required title field
  - Required error message when status is "completed with error"

#### 4. **TodoStats Component** (`public/components/todo_stats.tsx`)
- **Purpose**: Visualize task statistics
- **Visualizations**:
  - Summary stats (total, completed, in progress, completion rate, avg time)
  - Pie chart for tasks by status
  - Bar chart for tasks by priority
  - Uses @elastic/charts library for consistent UI
- **Data Source**: Aggregations from OpenSearch

#### 5. **TodoFilters Component** (`public/components/todo_filters.tsx`)
- **Purpose**: Search and filter todos
- **Features**:
  - Full-text search (searches title, description, tags, assignee)
  - Filter by status (multi-select)
  - Filter by priority (multi-select)
  - Filter by tags (multi-select, populated from existing tags)
  - Filter state indicators (active filter counts)

### Backend Components

#### 1. **TodoService** (`server/services/todo_service.ts`)
- **Purpose**: Business logic and OpenSearch operations
- **Methods**:
  - `ensureIndexExists()`: Creates index with mappings if not exists
  - `createTodo(data)`: Creates new todo with generated ID and timestamps
  - `getTodo(id)`: Retrieves single todo by ID
  - `updateTodo(id, data)`: Updates todo, auto-sets completedAt for completed todos
  - `deleteTodo(id)`: Deletes todo
  - `searchTodos(params)`: Full-text search with filters, pagination, sorting
  - `getStats()`: Aggregates statistics (by status, priority, completion metrics)
  - `getAllTags()`: Returns all unique tags across todos
- **OpenSearch Operations**:
  - Uses legacy OpenSearch client
  - Index: `.todo-items` (hidden index)
  - Refresh: `wait_for` on write operations for consistency
  - Aggregations for statistics

#### 2. **Route Handlers** (`server/routes/index.ts`)
- **Purpose**: HTTP API endpoints
- **Validation**: Uses @osd/config-schema for request validation
- **Error Handling**: Catches errors and returns appropriate HTTP status codes
- **Endpoints**:
  - `POST /api/custom_plugin/todos` - Create
  - `GET /api/custom_plugin/todos/:id` - Read one
  - `PUT /api/custom_plugin/todos/:id` - Update
  - `DELETE /api/custom_plugin/todos/:id` - Delete
  - `POST /api/custom_plugin/todos/_search` - Search with filters
  - `GET /api/custom_plugin/todos/_stats` - Get statistics
  - `GET /api/custom_plugin/todos/_tags` - Get all tags

#### 3. **TodoApi** (`public/services/todo_api.ts`)
- **Purpose**: Frontend API client
- **Responsibilities**:
  - Wraps HTTP calls to backend
  - Handles JSON serialization
  - Returns typed responses
  - Abstracts API details from components

### 4. **Sample Data Generator** (`server/sample_data/generate_sample_data.ts`)
- **Purpose**: Generate realistic sample data for demonstrations
- **Features**:
  - Generates 500 diverse TODO items
  - Realistic distribution across statuses and priorities
  - Security-focused content (PCI DSS, ISO 27001, SOX, HIPAA, GDPR, etc.)
  - Varied assignees, tags, due dates
  - Error messages for failed tasks
- **Functions**:
  - `generateSampleData(count)`: Generate N random items
  - `generateDistributedSampleData()`: Generate 500 items with realistic distribution
- **Auto-loading**: Plugin automatically loads sample data on first startup

## Data Model

### TodoItem Entity

```typescript
interface TodoItem {
  id: string;              // UUID v4
  title: string;           // Required
  description?: string;    // Optional
  status: TodoStatus;      // Enum: planned, in_progress, completed, completed_with_error
  priority: TodoPriority;  // Enum: low, medium, high, critical
  tags: string[];          // Array of tag strings
  assignee?: string;       // Optional assignee name
  createdAt: string;       // ISO 8601 timestamp
  updatedAt: string;       // ISO 8601 timestamp
  dueDate?: string;        // ISO 8601 date
  completedAt?: string;    // ISO 8601 timestamp (auto-set on completion)
  errorMessage?: string;   // Required when status is completed_with_error
}
```

### OpenSearch Index Mapping

```json
{
  "mappings": {
    "properties": {
      "id": { "type": "keyword" },
      "title": { "type": "text" },
      "description": { "type": "text" },
      "status": { "type": "keyword" },
      "priority": { "type": "keyword" },
      "tags": { "type": "keyword" },
      "assignee": { "type": "keyword" },
      "createdAt": { "type": "date" },
      "updatedAt": { "type": "date" },
      "dueDate": { "type": "date" },
      "completedAt": { "type": "date" },
      "errorMessage": { "type": "text" }
    }
  }
}
```

## Sample Data System

### Automatic Loading

The plugin includes an automatic sample data loading system:

1. **First Startup Detection**: Checks if TODO index exists and has data
2. **Generation**: Creates 500 realistic TODO items in memory
3. **Bulk Import**: Uses OpenSearch bulk API for efficient import
4. **Logging**: All operations logged to OSD logs
5. **Idempotent**: Won't reload if data already exists

### Sample Data Features

**Distribution (500 items):**
- Completed: 250 (50%)
- Planned: 100 (20%)
- In Progress: 75 (15%)
- Completed with Error: 75 (15%)

**Content:**
- 40+ task title templates
- 7 security frameworks (PCI DSS, ISO 27001, SOX, etc.)
- 30+ security tags
- 20 team member assignees
- Realistic due dates (past for completed, future for incomplete)
- Error messages for failed tasks

### Manual Management API

Three new endpoints for sample data:
- `POST /api/custom_plugin/todos/_sample_data/load` - Load/reload
- `DELETE /api/custom_plugin/todos/_sample_data` - Delete all
- `GET /api/custom_plugin/todos/_sample_data/status` - Check status

### Configuration

Can be disabled in `opensearch_dashboards.yml`:
```yaml
customPlugin.loadSampleData: false
```

## Key Design Decisions

### 1. **Why Hidden Index (`.todo-items`)?**
- System/internal data, not user content
- Prevents accidental deletion through Dashboards UI
- Follows OpenSearch convention for system indices

### 2. **Why Legacy OpenSearch Client?**
- OpenSearch Dashboards 2.16 still uses legacy client in plugin context
- New client would require different setup
- Legacy client is sufficient for this use case

### 3. **Why No External State Management (Redux, MobX)?**
- Application state is simple enough for React hooks
- Reduces bundle size and complexity
- Easier to understand and maintain
- useState + useCallback is sufficient

### 4. **Why Server-Side Pagination?**
- Scalability: can handle large datasets
- Performance: only fetch what's needed
- Consistent with OpenSearch patterns

### 5. **Why OpenSearch Aggregations for Stats?**
- Efficient: calculated at query time
- Real-time: always up to date
- Leverages OpenSearch's strengths
- No need for separate stats calculation

### 6. **Why Tabs Instead of Separate Pages?**
- Single-page application pattern
- Better UX (no full page reload)
- Consistent with Dashboards patterns
- Easy navigation between tasks and stats

## Security Considerations

### 1. **Input Validation**
- Backend validates all inputs using @osd/config-schema
- Frontend validates in form components
- OpenSearch injection prevented by using structured queries

### 2. **Authentication & Authorization**
- Relies on OpenSearch Dashboards authentication
- All API calls go through OSD backend (authenticated)
- No direct client-to-OpenSearch communication

### 3. **Data Isolation**
- Each Dashboards tenant gets isolated data
- Uses OpenSearch Dashboards' security context
- Index permissions handled by OpenSearch security plugin

## Performance Optimizations

### 1. **Frontend**
- Debounced search (implicit via React state updates)
- Lazy loading of stats (separate tab, loaded on demand)
- Memoized callbacks to prevent unnecessary re-renders
- Pagination to limit DOM nodes

### 2. **Backend**
- Index caching (ensureIndexExists checks once)
- Efficient OpenSearch queries (only fetch needed fields)
- `refresh: wait_for` instead of `true` (balance consistency/performance)
- Aggregations over iteration for statistics

### 3. **OpenSearch**
- Proper field mappings (keyword for filters, text for search)
- Limited result size (default 10, max controlled)
- Targeted queries (multi_match with field boosting)

## Extensibility Points

### 1. **Adding New Fields**
1. Update `TodoItem` interface in `common/index.ts`
2. Update OpenSearch mapping in `TodoService.ensureIndexExists()`
3. Add field to `TodoForm` component
4. Add column to `TodoList` table (if needed)

### 2. **Adding New Filters**
1. Add filter UI to `TodoFilters` component
2. Update `SearchTodosRequest` interface
3. Update `TodoService.searchTodos()` query builder
4. Update route handler validation schema

### 3. **Adding New Visualizations**
1. Create new aggregation in `TodoService.getStats()`
2. Add chart to `TodoStatsComponent`
3. Update `TodoStats` interface if needed

### 4. **Adding New Status/Priority Values**
1. Update enum in `common/index.ts`
2. Update color mappings in components
3. No backend changes needed (accepts enum values)

## Dependencies

### Production Dependencies
- **uuid**: Generate unique IDs for todos
- **moment**: Date formatting and manipulation
- **@elastic/charts**: Charting library for statistics

### Development Dependencies
- **@testing-library/react**: Component testing
- **@testing-library/jest-dom**: Jest matchers for DOM
- **jest**: Test runner (from OSD root)

### Platform Dependencies
- **OpenSearch Dashboards 2.16+**
- **OpenSearch 2.x**
- **Node.js 14.20.1+ <19**

## Future Improvements

### Suggested Enhancements
1. **Real-time Updates**: WebSocket support for multi-user collaboration
2. **Comments**: Add comment threads to tasks
3. **Attachments**: File uploads linked to tasks
4. **Notifications**: Email/Slack notifications for due dates
5. **Bulk Operations**: Select multiple tasks for batch updates
6. **Task Templates**: Pre-defined task templates for common workflows
7. **Audit Log**: Track all changes to tasks
8. **Export**: Export tasks to CSV/PDF
9. **Recurring Tasks**: Support for recurring compliance tasks
10. **Subtasks**: Hierarchical task breakdown
11. **Time Tracking**: Log time spent on tasks
12. **Custom Fields**: Allow users to define custom fields

### Technical Improvements
1. **Caching**: Add Redis cache for frequently accessed data
2. **Optimistic Updates**: Update UI before server confirms
3. **Offline Support**: Service Worker for offline capability
4. **Advanced Search**: Elasticsearch Query DSL builder UI
5. **Saved Searches**: Save and reuse complex filter combinations
6. **API Rate Limiting**: Protect against abuse
7. **Metrics**: Add telemetry for usage analytics

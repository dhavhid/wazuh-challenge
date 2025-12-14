# Sample Data Guide

## Overview

The TO-DO plugin automatically loads 500 sample records when it starts for the first time. This sample data is designed to demonstrate all features of the plugin with realistic security and compliance tasks.

## Automatic Loading

### How It Works

1. **First Startup**: When the plugin starts for the first time and no TODO items exist in the index, it automatically generates and imports 500 sample records.

2. **Idempotent**: The plugin checks if data already exists before importing. If data is found, it skips the import to avoid duplicates.

3. **Logging**: All sample data operations are logged to the OpenSearch Dashboards logs:
   ```
   [info][plugins][customPlugin] No existing data found. Loading sample data...
   [info][plugins][customPlugin] Generated 500 sample TODO items
   [info][plugins][customPlugin] Sample data loaded successfully: 500 items imported, 0 failed
   ```

### Configuration

You can disable automatic sample data loading by configuring the plugin in `opensearch_dashboards.yml`:

```yaml
# Disable automatic sample data loading
customPlugin.loadSampleData: false
```

## Sample Data Characteristics

### Data Distribution

The sample data includes a realistic distribution of tasks:

**By Status:**
- ✅ **Completed**: 250 items (50%)
- 📋 **Planned**: 100 items (20%)
- 🔄 **In Progress**: 75 items (15%)
- ❌ **Completed with Error**: 75 items (15%)

**By Priority:**
- 🔴 **Critical**: 75 items (15%)
- 🟠 **High**: 100 items (20%)
- 🟡 **Medium**: 175 items (35%)
- 🟢 **Low**: 150 items (30%)

### Sample Data Features

Each TODO item includes:

1. **Title**: Combines security framework (PCI DSS, ISO 27001, SOX, HIPAA, GDPR, NIST, CIS) with task type
   - Example: "PCI DSS: Review firewall rules for compliance"

2. **Description**: Detailed context about why the task is needed
   - Example: "Required for annual compliance audit. This task requires coordination with multiple teams and stakeholders."

3. **Status**: One of four statuses (planned, in_progress, completed, completed_with_error)

4. **Priority**: One of four priorities (low, medium, high, critical)

5. **Tags**: 2-5 relevant tags from a pool of 30+ security-related tags
   - Examples: compliance, security, audit, critical, infrastructure, policy, etc.

6. **Assignee**: Random assignment from 20 team members (80% assigned, 20% unassigned)
   - Examples: John Smith, Sarah Johnson, Michael Brown, etc.

7. **Dates**:
   - **Created/Updated**: Timestamp when imported
   - **Due Date**:
     - Future dates for incomplete tasks (next 3 months)
     - Past dates for completed tasks (last 3 months)
   - **Completed At**: Automatically set for completed tasks

8. **Error Messages**: For tasks with status "completed_with_error"
   - Examples: "System access denied during implementation", "Conflicting security policy found"

### Sample Task Examples

```json
{
  "title": "ISO 27001: Conduct vulnerability assessment",
  "description": "Required for annual compliance audit. This task requires coordination with multiple teams and stakeholders.",
  "status": "in_progress",
  "priority": "high",
  "tags": ["security", "assessment", "compliance", "vulnerability"],
  "assignee": "Sarah Johnson",
  "dueDate": "2025-02-15T10:30:00Z"
}
```

```json
{
  "title": "PCI DSS: Update security patches on production servers",
  "description": "Critical security update needed. Ensure all documentation is updated upon completion.",
  "status": "completed",
  "priority": "critical",
  "tags": ["patch-management", "infrastructure", "security"],
  "assignee": "Michael Brown",
  "dueDate": "2024-12-01T14:00:00Z",
  "completedAt": "2024-12-01T16:30:00Z"
}
```

```json
{
  "title": "GDPR: Implement data loss prevention",
  "description": "Part of quarterly security review. This task requires coordination with multiple teams and stakeholders.",
  "status": "completed_with_error",
  "priority": "high",
  "tags": ["data-protection", "compliance", "security"],
  "assignee": "Emily Davis",
  "errorMessage": "Required software version not compatible"
}
```

## Manual Sample Data Management

### API Endpoints

The plugin provides several API endpoints for managing sample data:

#### 1. Load Sample Data

Load 500 new sample records:

```bash
curl -X POST "http://localhost:5603/api/custom_plugin/todos/_sample_data/load" \
  -H "Content-Type: application/json" \
  -H "osd-xsrf: true" \
  -d '{}'
```

Response:
```json
{
  "message": "Sample data loaded successfully",
  "imported": 500,
  "failed": 0,
  "total": 500
}
```

#### 2. Force Reload Sample Data

Delete all existing data and reload fresh sample data:

```bash
curl -X POST "http://localhost:5603/api/custom_plugin/todos/_sample_data/load" \
  -H "Content-Type: application/json" \
  -H "osd-xsrf: true" \
  -d '{"force": true}'
```

**⚠️ Warning**: This deletes ALL existing TODO items, including user-created ones!

#### 3. Delete All Sample Data

Remove all TODO items:

```bash
curl -X DELETE "http://localhost:5603/api/custom_plugin/todos/_sample_data" \
  -H "osd-xsrf: true"
```

Response:
```json
{
  "message": "All TODO items deleted successfully",
  "deleted": 500
}
```

#### 4. Check Sample Data Status

Check if sample data exists and get statistics:

```bash
curl -X GET "http://localhost:5603/api/custom_plugin/todos/_sample_data/status"
```

Response:
```json
{
  "hasData": true,
  "stats": {
    "total": 500,
    "byStatus": {
      "planned": 100,
      "in_progress": 75,
      "completed": 250,
      "completed_with_error": 75
    },
    "byPriority": {
      "low": 150,
      "medium": 175,
      "high": 100,
      "critical": 75
    },
    "completionRate": 50.0,
    "avgCompletionTime": null
  }
}
```

### Using the Dev Tools Console

You can also use OpenSearch Dashboards Dev Tools Console:

```javascript
// Load sample data
POST /api/custom_plugin/todos/_sample_data/load
{
  "force": false
}

// Check status
GET /api/custom_plugin/todos/_sample_data/status

// Delete all data
DELETE /api/custom_plugin/todos/_sample_data
```

## Use Cases

### 1. Development & Testing

Sample data is perfect for:
- Testing search and filter functionality
- Validating sorting and pagination
- Testing statistics and charts
- Performance testing with realistic data volume
- UI/UX evaluation
- Demo presentations

### 2. Training & Demonstrations

Use sample data to:
- Train new users on the plugin features
- Demonstrate workflows and best practices
- Show different task states and priorities
- Illustrate reporting and analytics capabilities

### 3. Quality Assurance

Sample data helps with:
- End-to-end testing scenarios
- Data validation testing
- Performance benchmarking
- Load testing
- Edge case identification

## Best Practices

### 1. Keep Sample Data for Reference

The sample data provides good examples of:
- How to structure task titles
- What information to include in descriptions
- How to use tags effectively
- Typical priority and status distributions

### 2. Reset When Needed

If your test data becomes messy:
```bash
# Reset to fresh sample data
curl -X POST "http://localhost:5603/api/custom_plugin/todos/_sample_data/load" \
  -H "Content-Type: application/json" \
  -H "osd-xsrf: true" \
  -d '{"force": true}'
```

### 3. Production Environments

For production:
1. Disable automatic loading in `opensearch_dashboards.yml`:
   ```yaml
   customPlugin.loadSampleData: false
   ```

2. Delete sample data after initial testing:
   ```bash
   curl -X DELETE "http://localhost:5603/api/custom_plugin/todos/_sample_data" \
     -H "osd-xsrf: true"
   ```

3. Start fresh with real tasks from your organization

## Customizing Sample Data

### Modifying the Generator

To customize the sample data, edit:
```
server/sample_data/generate_sample_data.ts
```

You can modify:
- **Task titles**: Edit `taskTitles` array
- **Descriptions**: Edit `taskDescriptions` array
- **Tags**: Edit `tags` array
- **Assignees**: Edit `assignees` array
- **Security frameworks**: Edit `securityFrameworks` array
- **Error messages**: Edit `errorMessages` array
- **Distribution**: Modify `generateDistributedSampleData()` function

### Example: Add Custom Frameworks

```typescript
const securityFrameworks = [
  'PCI DSS',
  'ISO 27001',
  'SOX',
  'HIPAA',
  'GDPR',
  'NIST',
  'CIS',
  'COBIT',        // Add new
  'FISMA',        // Add new
  'FedRAMP'       // Add new
];
```

### Example: Change Distribution

```typescript
const distribution = {
  [TodoStatus.COMPLETED]: 300,           // 60% completed
  [TodoStatus.PLANNED]: 100,             // 20% planned
  [TodoStatus.IN_PROGRESS]: 50,          // 10% in progress
  [TodoStatus.COMPLETED_WITH_ERROR]: 50, // 10% with errors
};
```

## Troubleshooting

### Sample Data Not Loading

**Problem**: Sample data doesn't appear after plugin start

**Solutions**:
1. Check logs for errors:
   ```bash
   docker logs opensearch-dashboards | grep customPlugin
   ```

2. Verify configuration:
   ```yaml
   # In opensearch_dashboards.yml
   customPlugin.loadSampleData: true  # Should be true or omitted
   ```

3. Manually trigger load:
   ```bash
   curl -X POST "http://localhost:5603/api/custom_plugin/todos/_sample_data/load" \
     -H "Content-Type: application/json" \
     -H "osd-xsrf: true" \
     -d '{}'
   ```

### Duplicate Data

**Problem**: Running the load endpoint multiple times creates duplicates

**Solution**: Sample data protection prevents this by default. To reload:
```bash
curl -X POST "http://localhost:5603/api/custom_plugin/todos/_sample_data/load" \
  -H "Content-Type: application/json" \
  -H "osd-xsrf: true" \
  -d '{"force": true}'
```

### Performance Issues

**Problem**: 500 records cause slow loading

**Solutions**:
1. Reduce sample data count in `generate_sample_data.ts`:
   ```typescript
   export function generateDistributedSampleData(count: number = 100) {
     // Generate fewer items
   }
   ```

2. Use pagination effectively (set smaller page sizes)

3. Add indexes if needed (already configured by default)

## Technical Details

### Bulk Import Process

1. **Generation**: Creates 500 TODO objects in memory
2. **Batch Preparation**: Converts to OpenSearch bulk API format
3. **Bulk Insert**: Uses OpenSearch `bulk` API for efficient import
4. **Refresh**: Waits for index refresh (`refresh: 'wait_for'`)
5. **Verification**: Returns success/failure counts

### Performance

- **Generation Time**: < 1 second
- **Import Time**: 1-2 seconds for 500 items
- **Total Time**: ~2-3 seconds
- **Memory Usage**: Minimal (~5MB)

### Index Impact

- **Index Size**: ~500KB for 500 items
- **Shard Count**: 1 (default for `.todo-items` index)
- **Replicas**: 0 (development default)

## Summary

The sample data feature provides:
- ✅ **Automatic loading** on first startup
- ✅ **500 realistic records** with diverse data
- ✅ **Realistic distribution** across statuses and priorities
- ✅ **Security-focused content** relevant to compliance professionals
- ✅ **Manual management** via API endpoints
- ✅ **Customizable** for different use cases
- ✅ **Idempotent** operations (won't create duplicates)
- ✅ **Production-ready** (can be disabled)

This makes the plugin immediately useful for demonstrations, testing, training, and development without requiring manual data entry!

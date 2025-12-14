# Sample Data Feature - Quick Reference

## 🎯 What's New

The TO-DO plugin now includes **automatic sample data loading** with **500 realistic security and compliance tasks**!

## ✨ Key Features

### Automatic Loading
- ✅ **500 sample records** loaded on first startup
- ✅ **Idempotent** - won't create duplicates
- ✅ **Configurable** - can be disabled
- ✅ **Smart** - only loads if no data exists

### Sample Data Contents

| Category | Count | Percentage |
|----------|-------|------------|
| ✅ Completed | 250 | 50% |
| 📋 Planned | 100 | 20% |
| 🔄 In Progress | 75 | 15% |
| ❌ With Errors | 75 | 15% |

**Includes:**
- 7 Security Frameworks (PCI DSS, ISO 27001, SOX, HIPAA, GDPR, NIST, CIS)
- 40+ Task Types (vulnerability assessment, patch management, audits, etc.)
- 30+ Tags (compliance, security, audit, infrastructure, etc.)
- 20 Team Members
- Realistic due dates
- Error messages for failed tasks

## 🚀 Quick Start

### First Time Setup

1. Start OpenSearch Dashboards:
   ```bash
   yarn start
   ```

2. Navigate to the plugin:
   - Open http://localhost:5601
   - Click "TO-DO plugin" in sidebar
   - **500 sample records are automatically loaded!**

3. That's it! Start exploring the data.

## 📋 API Commands

### Check Status
```bash
curl http://localhost:5603/api/custom_plugin/todos/_sample_data/status
```

### Load Sample Data
```bash
curl -X POST http://localhost:5603/api/custom_plugin/todos/_sample_data/load \
  -H "Content-Type: application/json" \
  -H "osd-xsrf: true" \
  -d '{}'
```

### Reload (Force)
```bash
curl -X POST http://localhost:5603/api/custom_plugin/todos/_sample_data/load \
  -H "Content-Type: application/json" \
  -H "osd-xsrf: true" \
  -d '{"force": true}'
```

### Delete All Data
```bash
curl -X DELETE http://localhost:5603/api/custom_plugin/todos/_sample_data \
  -H "osd-xsrf: true"
```

## ⚙️ Configuration

Disable automatic loading in `opensearch_dashboards.yml`:

```yaml
customPlugin.loadSampleData: false
```

## 📊 Sample Data Examples

### Example 1: Compliance Task
```json
{
  "title": "PCI DSS: Review firewall rules for compliance",
  "description": "Required for annual compliance audit...",
  "status": "in_progress",
  "priority": "high",
  "tags": ["compliance", "security", "network"],
  "assignee": "Sarah Johnson",
  "dueDate": "2025-02-15T10:00:00Z"
}
```

### Example 2: Completed Task
```json
{
  "title": "ISO 27001: Update security documentation",
  "description": "Part of quarterly security review...",
  "status": "completed",
  "priority": "medium",
  "tags": ["documentation", "compliance"],
  "assignee": "Michael Brown",
  "completedAt": "2024-12-10T14:30:00Z"
}
```

### Example 3: Failed Task
```json
{
  "title": "GDPR: Implement data loss prevention",
  "description": "Critical security update needed...",
  "status": "completed_with_error",
  "priority": "critical",
  "tags": ["data-protection", "security"],
  "assignee": "Emily Davis",
  "errorMessage": "Required software version not compatible"
}
```

## 🎓 Use Cases

### Development & Testing
- Test search functionality with realistic data
- Validate filters and sorting
- Performance testing with 500 items
- UI/UX evaluation

### Demonstrations
- Show plugin capabilities
- Training sessions
- Sales demos
- Stakeholder presentations

### Quality Assurance
- End-to-end testing
- Data validation
- Load testing
- Edge case identification

## 🛠️ Technical Details

### Implementation Files
- `server/sample_data/generate_sample_data.ts` - Data generator
- `server/services/todo_service.ts` - Bulk import methods
- `server/plugin.ts` - Auto-load on startup
- `server/routes/index.ts` - API endpoints

### Performance
- **Generation**: < 1 second
- **Import**: 1-2 seconds
- **Total Time**: ~2-3 seconds
- **Memory**: ~5MB

### Data Distribution Logic
```typescript
// Status distribution (500 total)
Completed: 250         // 50%
Planned: 100          // 20%
In Progress: 75       // 15%
With Errors: 75       // 15%

// Priority distribution
Critical: 75          // 15%
High: 100            // 20%
Medium: 175          // 35%
Low: 150             // 30%
```

## 📖 Full Documentation

For complete details, see:
- [SAMPLE_DATA.md](./SAMPLE_DATA.md) - Complete guide
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Technical architecture
- [README.md](./README.md) - Main documentation

## 🎉 Benefits

1. **Instant Demo**: No need to manually create data
2. **Realistic**: Security-focused content relevant to users
3. **Complete**: All features demonstrated (statuses, priorities, tags, etc.)
4. **Flexible**: Easy to reload or clear
5. **Configurable**: Can be disabled for production

## ❓ FAQ

**Q: Will sample data load every time I restart?**
A: No, it only loads once when the index is empty.

**Q: Can I disable automatic loading?**
A: Yes, set `customPlugin.loadSampleData: false` in config.

**Q: Can I reload sample data?**
A: Yes, use the API with `force: true` parameter.

**Q: What if I want different sample data?**
A: Edit `server/sample_data/generate_sample_data.ts` and customize.

**Q: Does this affect production?**
A: Disable it in production via config. Delete sample data before production use.

## 🔗 Quick Links

- Load Data: `POST /api/custom_plugin/todos/_sample_data/load`
- Delete Data: `DELETE /api/custom_plugin/todos/_sample_data`
- Check Status: `GET /api/custom_plugin/todos/_sample_data/status`

---

**Ready to use immediately upon plugin installation!** 🚀

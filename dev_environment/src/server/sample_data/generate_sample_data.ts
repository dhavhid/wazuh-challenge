import { TodoStatus, TodoPriority, CreateTodoRequest } from '../../common';

// Sample data pools
const securityFrameworks = ['PCI DSS', 'ISO 27001', 'SOX', 'HIPAA', 'GDPR', 'NIST', 'CIS'];

const taskTitles = [
  'Review firewall rules for compliance',
  'Update security patches on production servers',
  'Conduct vulnerability assessment',
  'Review access control policies',
  'Implement multi-factor authentication',
  'Audit user permissions',
  'Review encryption standards',
  'Update incident response plan',
  'Conduct security awareness training',
  'Review backup and recovery procedures',
  'Assess third-party vendor security',
  'Update security documentation',
  'Review network segmentation',
  'Conduct penetration testing',
  'Implement data loss prevention',
  'Review log management system',
  'Update password policies',
  'Assess cloud security controls',
  'Review endpoint protection',
  'Conduct security risk assessment',
  'Implement security monitoring',
  'Review disaster recovery plan',
  'Update security baselines',
  'Assess container security',
  'Review API security controls',
  'Implement security automation',
  'Conduct compliance audit',
  'Review security metrics',
  'Update threat model',
  'Assess mobile device security',
  'Review database security',
  'Implement privilege management',
  'Conduct security tabletop exercise',
  'Review security architecture',
  'Update security training materials',
  'Assess IoT device security',
  'Review change management process',
  'Implement security orchestration',
  'Conduct security assessment',
  'Review physical security controls',
];

const taskDescriptions = [
  'Required for annual compliance audit',
  'Critical security update needed',
  'Part of quarterly security review',
  'Identified during last security assessment',
  'Required by security policy',
  'Remediation from penetration test',
  'Based on new regulatory requirements',
  'Follow-up from security incident',
  'Part of continuous improvement plan',
  'Required for certification renewal',
  'Identified in risk assessment',
  'Required by internal audit',
  'Part of security roadmap',
  'Based on threat intelligence',
  'Required for vendor compliance',
  'Part of security framework implementation',
  'Follow-up from management review',
  'Required by security standard',
  'Identified in gap analysis',
  'Part of security transformation',
];

const tags = [
  'compliance',
  'security',
  'audit',
  'critical',
  'infrastructure',
  'policy',
  'training',
  'assessment',
  'remediation',
  'monitoring',
  'encryption',
  'access-control',
  'network',
  'cloud',
  'endpoint',
  'incident-response',
  'risk-management',
  'vulnerability',
  'patch-management',
  'documentation',
  'backup',
  'recovery',
  'threat-hunting',
  'forensics',
  'governance',
  'data-protection',
  'identity',
  'authentication',
  'authorization',
  'logging',
];

const assignees = [
  'John Smith',
  'Sarah Johnson',
  'Michael Brown',
  'Emily Davis',
  'David Wilson',
  'Jessica Martinez',
  'Robert Taylor',
  'Jennifer Anderson',
  'William Thomas',
  'Maria Garcia',
  'James Rodriguez',
  'Lisa Martinez',
  'Christopher Lee',
  'Patricia White',
  'Daniel Harris',
  'Nancy Clark',
  'Matthew Lewis',
  'Susan Walker',
  'Joseph Hall',
  'Karen Allen',
];

const errorMessages = [
  'System access denied during implementation',
  'Conflicting security policy found',
  'Required software version not compatible',
  'Insufficient permissions to complete task',
  'Third-party service unavailable',
  'Configuration conflict detected',
  'Required resources not available',
  'Dependency on blocked task',
  'Change request rejected',
  'Budget approval pending',
  'Technical limitation discovered',
  'Stakeholder approval required',
  'Environmental constraints',
  'Integration issues encountered',
  'Performance impact too high',
];

/**
 * Generates a random date within a range
 */
function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

/**
 * Randomly select items from an array
 */
function randomSelect<T>(array: T[], min: number = 1, max: number = 3): T[] {
  const count = Math.floor(Math.random() * (max - min + 1)) + min;
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

/**
 * Get random item from array
 */
function randomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Generate a single TODO item
 */
function generateTodoItem(index: number): CreateTodoRequest {
  const now = new Date();
  const sixMonthsAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
  const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
  const oneMonthFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const threeMonthsFromNow = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);

  // Distribute statuses realistically
  const statusRand = Math.random();
  let status: TodoStatus;
  if (statusRand < 0.5) {
    status = TodoStatus.COMPLETED;
  } else if (statusRand < 0.7) {
    status = TodoStatus.PLANNED;
  } else if (statusRand < 0.85) {
    status = TodoStatus.IN_PROGRESS;
  } else {
    status = TodoStatus.COMPLETED_WITH_ERROR;
  }

  // Distribute priorities
  const priorityRand = Math.random();
  let priority: TodoPriority;
  if (priorityRand < 0.15) {
    priority = TodoPriority.CRITICAL;
  } else if (priorityRand < 0.35) {
    priority = TodoPriority.HIGH;
  } else if (priorityRand < 0.7) {
    priority = TodoPriority.MEDIUM;
  } else {
    priority = TodoPriority.LOW;
  }

  // Generate title with framework reference
  const framework = randomItem(securityFrameworks);
  const baseTitle = randomItem(taskTitles);
  const title = `${framework}: ${baseTitle}`;

  // Generate description
  const description = `${randomItem(taskDescriptions)}. ${
    Math.random() > 0.5
      ? 'This task requires coordination with multiple teams and stakeholders.'
      : 'Ensure all documentation is updated upon completion.'
  }`;

  // Select tags (2-5 tags per item)
  const selectedTags = randomSelect(tags, 2, 5);

  // Assign to someone (80% chance)
  const assignee = Math.random() > 0.2 ? randomItem(assignees) : undefined;

  // Set due date based on status
  let dueDate: string | undefined;
  if (status === TodoStatus.PLANNED || status === TodoStatus.IN_PROGRESS) {
    // Future due dates for incomplete tasks
    dueDate = randomDate(now, threeMonthsFromNow).toISOString();
  } else {
    // Past due dates for completed tasks
    dueDate = randomDate(threeMonthsAgo, oneMonthFromNow).toISOString();
  }

  const todo: CreateTodoRequest = {
    title,
    description,
    status,
    priority,
    tags: selectedTags,
    assignee,
    dueDate,
  };

  // Add error message for tasks completed with error
  if (status === TodoStatus.COMPLETED_WITH_ERROR) {
    (todo as any).errorMessage = randomItem(errorMessages);
  }

  return todo;
}

/**
 * Generate array of sample TODO items
 */
export function generateSampleData(count: number = 500): CreateTodoRequest[] {
  const todos: CreateTodoRequest[] = [];

  for (let i = 0; i < count; i++) {
    todos.push(generateTodoItem(i));
  }

  return todos;
}

/**
 * Generate sample data with specific distribution
 */
export function generateDistributedSampleData(): CreateTodoRequest[] {
  const todos: CreateTodoRequest[] = [];

  // Distribution targets (total 500)
  const distribution = {
    [TodoStatus.COMPLETED]: 250, // 50%
    [TodoStatus.PLANNED]: 100, // 20%
    [TodoStatus.IN_PROGRESS]: 75, // 15%
    [TodoStatus.COMPLETED_WITH_ERROR]: 75, // 15%
  };

  const priorityDistribution = {
    [TodoPriority.CRITICAL]: 75, // 15%
    [TodoPriority.HIGH]: 100, // 20%
    [TodoPriority.MEDIUM]: 175, // 35%
    [TodoPriority.LOW]: 150, // 30%
  };

  let index = 0;

  Object.entries(distribution).forEach(([status, count]) => {
    for (let i = 0; i < count; i++) {
      const todo = generateTodoItem(index++);
      todo.status = status as TodoStatus;

      // Assign priority based on distribution
      const priorityKeys = Object.keys(priorityDistribution) as TodoPriority[];
      const priorityIndex = Math.floor(Math.random() * priorityKeys.length);
      todo.priority = priorityKeys[priorityIndex];

      todos.push(todo);
    }
  });

  // Shuffle to mix up the order
  return todos.sort(() => Math.random() - 0.5);
}

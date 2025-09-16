export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  assignee?: string;
  dueDate?: string;
  tags?: string[];
  status: 'todo' | 'in-progress' | 'done';
  createdAt: string;
  updatedAt: string;
}

export interface Column {
  id: string;
  title: string;
  taskIds: string[];
}

export interface KanbanData {
  tasks: { [key: string]: Task };
  columns: { [key: string]: Column };
  columnOrder: string[];
}
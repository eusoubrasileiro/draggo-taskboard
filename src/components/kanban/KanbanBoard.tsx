import React, { useState } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import KanbanColumn from './KanbanColumn';
import TaskModal from './TaskModal';
import AddTaskModal from './AddTaskModal';
import { Task, KanbanData } from '@/types/kanban';
import { useToast } from '@/hooks/use-toast';

// Sample data
const initialData: KanbanData = {
  tasks: {
    'task-1': {
      id: 'task-1',
      title: 'Design new homepage',
      description: 'Create a modern and responsive homepage design that reflects our brand values and improves user engagement.',
      priority: 'high',
      status: 'todo',
      assignee: 'Sarah Johnson',
      dueDate: '2024-01-15',
      tags: ['design', 'ui', 'frontend'],
      createdAt: '2024-01-01T10:00:00Z',
      updatedAt: '2024-01-01T10:00:00Z',
    },
    'task-2': {
      id: 'task-2',
      title: 'Implement user authentication',
      description: 'Set up secure user authentication system with login, registration, and password reset functionality.',
      priority: 'high',
      status: 'in-progress',
      assignee: 'Mike Chen',
      dueDate: '2024-01-20',
      tags: ['backend', 'security', 'auth'],
      createdAt: '2024-01-02T09:30:00Z',
      updatedAt: '2024-01-05T14:20:00Z',
    },
    'task-3': {
      id: 'task-3',
      title: 'Write API documentation',
      description: 'Create comprehensive documentation for all API endpoints including examples and error handling.',
      priority: 'medium',
      status: 'done',
      assignee: 'Alex Rivera',
      dueDate: '2024-01-10',
      tags: ['documentation', 'api'],
      createdAt: '2024-01-03T11:15:00Z',
      updatedAt: '2024-01-08T16:45:00Z',
    },
    'task-4': {
      id: 'task-4',
      title: 'Set up CI/CD pipeline',
      description: 'Configure automated testing and deployment pipeline for better development workflow.',
      priority: 'medium',
      status: 'todo',
      assignee: 'Jordan Smith',
      tags: ['devops', 'automation'],
      createdAt: '2024-01-04T08:00:00Z',
      updatedAt: '2024-01-04T08:00:00Z',
    },
  },
  columns: {
    'todo': {
      id: 'todo',
      title: 'To Do',
      taskIds: ['task-1', 'task-4'],
    },
    'in-progress': {
      id: 'in-progress',
      title: 'In Progress',
      taskIds: ['task-2'],
    },
    'done': {
      id: 'done',
      title: 'Done',
      taskIds: ['task-3'],
    },
  },
  columnOrder: ['todo', 'in-progress', 'done'],
};

const KanbanBoard: React.FC = () => {
  const [data, setData] = useState<KanbanData>(initialData);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addModalColumnId, setAddModalColumnId] = useState('');
  const { toast } = useToast();

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const start = data.columns[source.droppableId];
    const finish = data.columns[destination.droppableId];

    if (start === finish) {
      // Moving within the same column
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      };

      setData({
        ...data,
        columns: {
          ...data.columns,
          [newColumn.id]: newColumn,
        },
      });
    } else {
      // Moving to a different column
      const startTaskIds = Array.from(start.taskIds);
      startTaskIds.splice(source.index, 1);
      const newStart = {
        ...start,
        taskIds: startTaskIds,
      };

      const finishTaskIds = Array.from(finish.taskIds);
      finishTaskIds.splice(destination.index, 0, draggableId);
      const newFinish = {
        ...finish,
        taskIds: finishTaskIds,
      };

      // Update task status
      const updatedTask = {
        ...data.tasks[draggableId],
        status: destination.droppableId as Task['status'],
        updatedAt: new Date().toISOString(),
      };

      setData({
        ...data,
        tasks: {
          ...data.tasks,
          [draggableId]: updatedTask,
        },
        columns: {
          ...data.columns,
          [newStart.id]: newStart,
          [newFinish.id]: newFinish,
        },
      });

      toast({
        title: "Task moved",
        description: `"${updatedTask.title}" moved to ${newFinish.title}`,
      });
    }
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  const handleAddTask = (columnId: string) => {
    setAddModalColumnId(columnId);
    setIsAddModalOpen(true);
  };

  const handleCreateTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTaskId = `task-${Date.now()}`;
    const now = new Date().toISOString();
    
    const newTask: Task = {
      ...taskData,
      id: newTaskId,
      createdAt: now,
      updatedAt: now,
    };

    const column = data.columns[addModalColumnId];
    const newColumn = {
      ...column,
      taskIds: [...column.taskIds, newTaskId],
    };

    setData({
      ...data,
      tasks: {
        ...data.tasks,
        [newTaskId]: newTask,
      },
      columns: {
        ...data.columns,
        [addModalColumnId]: newColumn,
      },
    });

    toast({
      title: "Task created",
      description: `"${newTask.title}" has been added to ${column.title}`,
    });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Project Kanban Board
          </h1>
          <p className="text-muted-foreground">
            Drag and drop tasks between columns to update their status
          </p>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-6 overflow-x-auto pb-4">
            {data.columnOrder.map((columnId) => {
              const column = data.columns[columnId];
              const tasks = column.taskIds.map((taskId) => data.tasks[taskId]);

              return (
                <KanbanColumn
                  key={column.id}
                  column={column}
                  tasks={tasks}
                  onTaskClick={handleTaskClick}
                  onAddTask={handleAddTask}
                />
              );
            })}
          </div>
        </DragDropContext>

        <TaskModal
          task={selectedTask}
          isOpen={isTaskModalOpen}
          onClose={() => {
            setIsTaskModalOpen(false);
            setSelectedTask(null);
          }}
        />

        <AddTaskModal
          isOpen={isAddModalOpen}
          onClose={() => {
            setIsAddModalOpen(false);
            setAddModalColumnId('');
          }}
          onAddTask={handleCreateTask}
          columnId={addModalColumnId}
        />
      </div>
    </div>
  );
};

export default KanbanBoard;
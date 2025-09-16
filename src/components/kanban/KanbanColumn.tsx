import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import TaskCard from './TaskCard';
import { Task, Column } from '@/types/kanban';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface KanbanColumnProps {
  column: Column;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onAddTask: (columnId: string) => void;
}

const getColumnStyle = (columnId: string) => {
  switch (columnId) {
    case 'todo':
      return {
        bg: 'bg-kanban-todo',
        border: 'border-kanban-todo-border',
        badge: 'bg-blue-500 text-white',
      };
    case 'in-progress':
      return {
        bg: 'bg-kanban-progress',
        border: 'border-kanban-progress-border',
        badge: 'bg-yellow-500 text-white',
      };
    case 'done':
      return {
        bg: 'bg-kanban-done',
        border: 'border-kanban-done-border',
        badge: 'bg-green-500 text-white',
      };
    default:
      return {
        bg: 'bg-muted',
        border: 'border-border',
        badge: 'bg-muted text-muted-foreground',
      };
  }
};

const KanbanColumn: React.FC<KanbanColumnProps> = ({ 
  column, 
  tasks, 
  onTaskClick,
  onAddTask 
}) => {
  const style = getColumnStyle(column.id);
  
  return (
    <Card className={`${style.bg} ${style.border} border-2 p-4 min-h-[600px] w-80 flex flex-col`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2 className="font-bold text-lg text-foreground">{column.title}</h2>
          <Badge className={`${style.badge} px-2 py-1 text-sm`}>
            {tasks.length}
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onAddTask(column.id)}
          className="text-muted-foreground hover:text-foreground hover:bg-background/50"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`
              flex-1 transition-colors duration-200 rounded-lg p-2
              ${snapshot.isDraggingOver ? 'bg-primary/10 border-2 border-dashed border-primary' : ''}
            `}
          >
            {tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                onClick={() => onTaskClick(task)}
              />
            ))}
            {provided.placeholder}
            
            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-3">
                  <Plus className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground text-sm">No tasks yet</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onAddTask(column.id)}
                  className="mt-2 text-xs"
                >
                  Add your first task
                </Button>
              </div>
            )}
          </div>
        )}
      </Droppable>
    </Card>
  );
};

export default KanbanColumn;
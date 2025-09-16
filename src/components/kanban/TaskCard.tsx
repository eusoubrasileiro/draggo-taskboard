import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Task } from '@/types/kanban';
import { Calendar, User, Flag } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  index: number;
  onClick: () => void;
}

const getPriorityColor = (priority: Task['priority']) => {
  switch (priority) {
    case 'high':
      return 'bg-destructive text-destructive-foreground';
    case 'medium':
      return 'bg-warning text-warning-foreground';
    case 'low':
      return 'bg-success text-success-foreground';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

const TaskCard: React.FC<TaskCardProps> = ({ task, index, onClick }) => {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={onClick}
          className={`
            mb-3 p-4 cursor-pointer transition-all duration-200 hover:shadow-floating
            bg-gradient-card border-border hover:border-primary/30
            ${snapshot.isDragging ? 'rotate-2 shadow-floating scale-105' : ''}
            ${snapshot.isDragging ? 'bg-card' : ''}
          `}
        >
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-card-foreground text-sm leading-tight">
                {task.title}
              </h3>
              <Badge 
                variant="secondary" 
                className={`${getPriorityColor(task.priority)} text-xs px-2 py-1 flex items-center gap-1`}
              >
                <Flag className="w-3 h-3" />
                {task.priority}
              </Badge>
            </div>
            
            {task.description && (
              <p className="text-muted-foreground text-xs line-clamp-2">
                {task.description}
              </p>
            )}
            
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-3">
                {task.assignee && (
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span className="truncate max-w-20">{task.assignee}</span>
                  </div>
                )}
                {task.dueDate && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
            
            {task.tags && task.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {task.tags.slice(0, 3).map((tag, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs px-2 py-0.5">
                    {tag}
                  </Badge>
                ))}
                {task.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs px-2 py-0.5">
                    +{task.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </Card>
      )}
    </Draggable>
  );
};

export default TaskCard;
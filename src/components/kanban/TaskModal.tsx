import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Task } from '@/types/kanban';
import { Calendar, User, Flag, Clock, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TaskModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
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

const getStatusColor = (status: Task['status']) => {
  switch (status) {
    case 'todo':
      return 'bg-kanban-todo text-foreground border-kanban-todo-border';
    case 'in-progress':
      return 'bg-kanban-progress text-foreground border-kanban-progress-border';
    case 'done':
      return 'bg-kanban-done text-foreground border-kanban-done-border';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

const TaskModal: React.FC<TaskModalProps> = ({ task, isOpen, onClose }) => {
  if (!task) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-gradient-card shadow-modal animate-scale-in">
        <DialogHeader className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <DialogTitle className="text-xl font-bold text-card-foreground leading-tight">
              {task.title}
            </DialogTitle>
            <div className="flex gap-2">
              <Badge 
                variant="secondary" 
                className={`${getPriorityColor(task.priority)} px-3 py-1 flex items-center gap-1`}
              >
                <Flag className="w-4 h-4" />
                {task.priority} priority
              </Badge>
              <Badge 
                variant="outline" 
                className={`${getStatusColor(task.status)} px-3 py-1`}
              >
                {task.status.replace('-', ' ')}
              </Badge>
            </div>
          </div>
          
          {task.description && (
            <DialogDescription className="text-muted-foreground text-base leading-relaxed">
              {task.description}
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Task Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {task.assignee && (
              <div className="flex items-center gap-3 p-3 bg-accent rounded-lg">
                <User className="w-5 h-5 text-accent-foreground" />
                <div>
                  <p className="text-sm font-medium text-accent-foreground">Assignee</p>
                  <p className="text-accent-foreground">{task.assignee}</p>
                </div>
              </div>
            )}
            
            {task.dueDate && (
              <div className="flex items-center gap-3 p-3 bg-accent rounded-lg">
                <Calendar className="w-5 h-5 text-accent-foreground" />
                <div>
                  <p className="text-sm font-medium text-accent-foreground">Due Date</p>
                  <p className="text-accent-foreground">
                    {new Date(task.dueDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Tags */}
          {task.tags && task.tags.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-muted-foreground" />
                <h4 className="font-medium text-card-foreground">Tags</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {task.tags.map((tag, idx) => (
                  <Badge key={idx} variant="outline" className="px-3 py-1">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="space-y-3 pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <h4 className="font-medium text-card-foreground">Timeline</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Created</p>
                <p className="text-card-foreground">
                  {new Date(task.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Last Updated</p>
                <p className="text-card-foreground">
                  {new Date(task.updatedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-6">
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskModal;
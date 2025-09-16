import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Task } from '@/types/kanban';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  columnId: string;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ 
  isOpen, 
  onClose, 
  onAddTask, 
  columnId 
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as Task['priority'],
    assignee: '',
    dueDate: '',
    tags: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) return;

    const status = columnId as Task['status'];
    const tags = formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [];

    onAddTask({
      title: formData.title,
      description: formData.description,
      priority: formData.priority,
      assignee: formData.assignee || undefined,
      dueDate: formData.dueDate || undefined,
      tags: tags.length > 0 ? tags : undefined,
      status,
    });

    // Reset form
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      assignee: '',
      dueDate: '',
      tags: '',
    });
    
    onClose();
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-gradient-card shadow-modal animate-scale-in">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-card-foreground">
            Add New Task
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Title *
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Enter task title..."
              required
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Describe the task..."
              rows={3}
              className="w-full resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority" className="text-sm font-medium">
                Priority
              </Label>
              <Select 
                value={formData.priority} 
                onValueChange={(value) => handleChange('priority', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="assignee" className="text-sm font-medium">
                Assignee
              </Label>
              <Input
                id="assignee"
                value={formData.assignee}
                onChange={(e) => handleChange('assignee', e.target.value)}
                placeholder="Assign to..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate" className="text-sm font-medium">
              Due Date
            </Label>
            <Input
              id="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(e) => handleChange('dueDate', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags" className="text-sm font-medium">
              Tags
            </Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => handleChange('tags', e.target.value)}
              placeholder="Enter tags separated by commas..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-gradient-primary text-primary-foreground hover:opacity-90"
            >
              Add Task
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskModal;
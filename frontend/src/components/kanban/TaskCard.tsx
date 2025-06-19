import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Task } from '../../types';
import { format, isToday, isTomorrow, isPast } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onClick: (task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ef4444'; // red-500
      case 'medium': return '#f59e0b'; // amber-500
      case 'low': return '#10b981'; // emerald-500
      default: return '#6b7280'; // gray-500
    }
  };

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500 text-white';
      case 'medium': return 'bg-amber-500 text-white';
      case 'low': return 'bg-emerald-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const formatDueDate = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'MMM d');
  };

  const getDueDateStyle = (date: Date) => {
    if (isPast(date) && !isToday(date)) {
      return 'text-red-600 bg-red-50';
    }
    if (isToday(date)) {
      return 'text-orange-600 bg-orange-50';
    }
    return 'text-gray-600 bg-gray-50';
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onClick(task)}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer group p-4"
    >
      {/* Priority Indicator */}
      <div className={`w-full h-1 rounded-full mb-3 ${getPriorityColor(task.priority)}`} />

      {/* Task Title */}
      <h3 className="text-sm font-semibold text-gray-900 mb-2 leading-5 group-hover:text-gray-700 transition-colors">
        {task.title}
      </h3>

      {/* Task Description */}
      {task.description && (
        <p className="text-xs text-gray-600 mb-3 line-clamp-2 leading-4">
          {task.description}
        </p>
      )}

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 shadow-sm"
            >
              {tag}
            </span>
          ))}
          {task.tags.length > 3 && (
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600 shadow-sm">
              +{task.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Due Date */}
      {task.dueDate && (
        <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium mb-3 ${getDueDateStyle(task.dueDate)}`}>
          {formatDueDate(task.dueDate)}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-3">
        {/* Assignees */}
        <div className="flex -space-x-1">
          {task.assignees.slice(0, 2).map((assignee) => (
            <img
              key={assignee.id}
              src={assignee.avatar}
              alt={assignee.name}
              className="w-6 h-6 rounded-full shadow-md ring-2 ring-white"
              title={assignee.name}
            />
          ))}
          {task.assignees.length > 2 && (
            <div className="w-6 h-6 rounded-full bg-gray-200 shadow-md ring-2 ring-white flex items-center justify-center">
              <span className="text-xs text-gray-600 font-medium">
                +{task.assignees.length - 2}
              </span>
            </div>
          )}
        </div>

        {/* Priority Badge */}
        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium shadow-sm ${getPriorityBadgeClass(task.priority)}`}>
          {task.priority}
        </span>
      </div>
    </div>
  );
};

export default TaskCard; 
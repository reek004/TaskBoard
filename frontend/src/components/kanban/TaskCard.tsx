import React from 'react';
import ReactMarkdown from 'react-markdown';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Task } from '../../types';
import { format, isToday, isTomorrow, isPast } from 'date-fns';
import { Calendar, User as UserIcon, Flag } from 'lucide-react';

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
      case 'high': return 'bg-red-100 border-red-200 text-red-800';
      case 'medium': return 'bg-yellow-100 border-yellow-200 text-yellow-800';
      case 'low': return 'bg-green-100 border-green-200 text-green-800';
      default: return 'bg-gray-100 border-gray-200 text-gray-800';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const formatDueDate = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'MMM d');
  };

  const getDueDateStyle = (date: Date) => {
    if (isPast(date) && !isToday(date)) {
      return 'text-red-600 bg-red-50 border-red-200';
    }
    if (isToday(date)) {
      return 'text-orange-600 bg-orange-50 border-orange-200';
    }
    return 'text-gray-600 bg-gray-50 border-gray-200';
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onClick(task)}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer group p-4 border border-gray-100"
    >
      {/* Header with Title and Priority */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900 leading-5 group-hover:text-gray-700 transition-colors break-words overflow-wrap-anywhere flex-1 mr-2">
        {task.title}
      </h3>
        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border ${getPriorityColor(task.priority)} flex-shrink-0`}>
          <Flag className={`w-3 h-3 ${getPriorityIcon(task.priority)}`} />
          <span className="capitalize">{task.priority}</span>
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <div className="text-xs text-gray-600 mb-3 line-clamp-2 leading-4 break-words prose prose-xs max-w-none">
          <ReactMarkdown 
            components={{
              // Customize markdown components for compact display
              p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
              h1: ({ children }) => <h1 className="text-xs font-semibold mb-1">{children}</h1>,
              h2: ({ children }) => <h2 className="text-xs font-semibold mb-1">{children}</h2>,
              h3: ({ children }) => <h3 className="text-xs font-semibold mb-1">{children}</h3>,
              h4: ({ children }) => <h4 className="text-xs font-semibold mb-1">{children}</h4>,
              h5: ({ children }) => <h5 className="text-xs font-semibold mb-1">{children}</h5>,
              h6: ({ children }) => <h6 className="text-xs font-semibold mb-1">{children}</h6>,
              ul: ({ children }) => <ul className="list-disc list-inside mb-1">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal list-inside mb-1">{children}</ol>,
              li: ({ children }) => <li className="mb-0">{children}</li>,
              code: ({ children }) => <code className="bg-gray-100 px-1 rounded text-xs">{children}</code>,
              strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
              em: ({ children }) => <em className="italic">{children}</em>,
            }}
          >
            {task.description}
          </ReactMarkdown>
        </div>
      )}

      {/* Creator Information */}
      <div className="flex items-center gap-2 mb-3 text-xs text-gray-500">
        <UserIcon className="w-3 h-3" />
        <span>Created by {task.creator.name}</span>
      </div>

      {/* Due Date */}
      {task.dueDate && (
        <div className="mb-3">
          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border ${getDueDateStyle(task.dueDate)}`}>
            <Calendar className="w-3 h-3" />
            <span>Due: {formatDueDate(task.dueDate)}</span>
          </div>
        </div>
      )}

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.slice(0, 2).map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
            >
              {tag}
            </span>
          ))}
          {task.tags.length > 2 && (
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
              +{task.tags.length - 2}
            </span>
          )}
        </div>
      )}

      {/* Assigned To Section */}
      <div className="border-t border-gray-100 pt-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-500">Assigned to:</span>
        <div className="flex -space-x-1">
          {task.assignees.slice(0, 2).map((assignee) => (
            <img
              key={assignee.id}
              src={assignee.avatar}
              alt={assignee.name}
                  className="w-5 h-5 rounded-full shadow-sm ring-2 ring-white"
              title={assignee.name}
            />
          ))}
          {task.assignees.length > 2 && (
                <div className="w-5 h-5 rounded-full bg-gray-200 shadow-sm ring-2 ring-white flex items-center justify-center">
              <span className="text-xs text-gray-600 font-medium">
                +{task.assignees.length - 2}
              </span>
                </div>
              )}
            </div>
          </div>
          
          {task.assignees.length > 0 && (
            <div className="text-xs text-gray-500">
              {task.assignees.length === 1 
                ? task.assignees[0].name
                : `${task.assignees.length} members`}
            </div>
          )}
        </div>

        {task.assignees.length === 0 && (
          <div className="text-xs text-gray-400 italic">Unassigned</div>
        )}
      </div>
    </div>
  );
};

export default TaskCard; 
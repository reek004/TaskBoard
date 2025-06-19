import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Task } from '../../types';
import { Calendar, User as UserIcon, Flag } from 'lucide-react';
import { getPriorityBadgeColor, getPriorityIconColor, formatDueDate, getDueDateStyle } from '../../utils/taskUtils';
import MarkdownRenderer from '../ui/MarkdownComponents';

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
        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border ${getPriorityBadgeColor(task.priority)} flex-shrink-0`}>
          <Flag className={`w-3 h-3 ${getPriorityIconColor(task.priority)}`} />
          <span className="capitalize">{task.priority}</span>
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <div className="text-xs text-gray-600 mb-3 line-clamp-2 leading-4 break-words prose prose-xs max-w-none">
          <MarkdownRenderer variant="compact">
            {task.description}
          </MarkdownRenderer>
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
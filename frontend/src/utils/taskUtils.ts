import { format, isToday, isTomorrow, isPast, isThisWeek } from 'date-fns';
import type { Priority } from '../types';

// Priority utilities
export const getPriorityLabel = (priority: Priority | 'all') => {
  switch (priority) {
    case 'all': return 'All Priorities';
    case 'high': return 'High Priority';
    case 'medium': return 'Medium Priority';
    case 'low': return 'Low Priority';
    default: return 'All Priorities';
  }
};

export const getPriorityIconColor = (priority: Priority | 'all') => {
  switch (priority) {
    case 'all': return 'text-gray-600';
    case 'high': return 'text-red-600';
    case 'medium': return 'text-yellow-600';
    case 'low': return 'text-green-600';
    default: return 'text-gray-600';
  }
};

export const getPriorityBadgeColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'bg-red-100 border-red-200 text-red-800';
    case 'medium': return 'bg-yellow-100 border-yellow-200 text-yellow-800';
    case 'low': return 'bg-green-100 border-green-200 text-green-800';
    default: return 'bg-gray-100 border-gray-200 text-gray-800';
  }
};

// Due date utilities
export type DueDateFilter = 'all' | 'overdue' | 'today' | 'tomorrow' | 'this-week' | 'no-date';

export const getDueDateLabel = (filter: DueDateFilter) => {
  switch (filter) {
    case 'all': return 'All Dates';
    case 'overdue': return 'Overdue';
    case 'today': return 'Today';
    case 'tomorrow': return 'Tomorrow';
    case 'this-week': return 'This Week';
    case 'no-date': return 'No Due Date';
    default: return 'All Dates';
  }
};

export const getDueDateIconColor = (filter: DueDateFilter) => {
  switch (filter) {
    case 'all': return 'text-gray-600';
    case 'overdue': return 'text-red-600';
    case 'today': return 'text-orange-600';
    case 'tomorrow': return 'text-blue-600';
    case 'this-week': return 'text-green-600';
    case 'no-date': return 'text-gray-400';
    default: return 'text-gray-600';
  }
};

export const formatDueDate = (date: Date) => {
  if (isToday(date)) return 'Today';
  if (isTomorrow(date)) return 'Tomorrow';
  return format(date, 'MMM d');
};

export const getDueDateStyle = (date: Date) => {
  if (isPast(date) && !isToday(date)) {
    return 'text-red-600 bg-red-50 border-red-200';
  }
  if (isToday(date)) {
    return 'text-orange-600 bg-orange-50 border-orange-200';
  }
  if (isTomorrow(date)) {
    return 'text-blue-600 bg-blue-50 border-blue-200';
  }
  if (isThisWeek(date)) {
    return 'text-green-600 bg-green-50 border-green-200';
  }
  return 'text-gray-600 bg-gray-50 border-gray-200';
};

// Assignee utilities
export const getAssigneeLabel = (assigneeId: string, users: any[]) => {
  if (assigneeId === 'all') return 'All Members';
  if (assigneeId === 'unassigned') return 'Unassigned';
  const user = users.find(u => u.id === assigneeId);
  return user ? user.name : 'All Members';
}; 
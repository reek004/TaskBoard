import React, { useState } from 'react';
import type { CreateTaskData, Priority, User } from '../../types';
import { mockUsers } from '../../utils/data';
import { X, ChevronDown, Flag, User as UserIcon } from 'lucide-react';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (taskData: CreateTaskData) => void;
  columnTitle?: string;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({
  isOpen,
  onClose,
  onAddTask,
  columnTitle,
}) => {
  const [formData, setFormData] = useState<CreateTaskData>({
    title: '',
    description: '',
    priority: 'medium',
    assignees: [],
  });
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
  const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title.trim()) {
      onAddTask(formData);
      // Reset form
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        assignees: [],
      });
      onClose();
    }
  };

  const handleCancel = () => {
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      assignees: [],
    });
    onClose();
  };

  const getPriorityLabel = (priority: Priority) => {
    switch (priority) {
      case 'high': return 'High';
      case 'medium': return 'Medium';
      case 'low': return 'Low';
      default: return 'Medium';
    }
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-yellow-600';
    }
  };

  const handleAssigneeToggle = (user: User) => {
    const isAssigned = formData.assignees.some(assignee => assignee.id === user.id);
    if (isAssigned) {
      setFormData({
        ...formData,
        assignees: formData.assignees.filter(assignee => assignee.id !== user.id),
      });
    } else {
      setFormData({
        ...formData,
        assignees: [...formData.assignees, user],
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
        {/* Close Button */}
        <button
          onClick={handleCancel}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Add New Task</h2>
          {columnTitle && (
            <p className="text-gray-600 mt-1">Adding to "{columnTitle}"</p>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Field */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Enter task title"
              required
              autoFocus
            />
          </div>

          {/* Description Field */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-colors"
              placeholder="Enter task description"
              rows={4}
            />
          </div>

          {/* Priority Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowPriorityDropdown(!showPriorityDropdown)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-left flex items-center justify-between hover:border-gray-400 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Flag className={`w-4 h-4 ${getPriorityColor(formData.priority)}`} />
                  <span>{getPriorityLabel(formData.priority)}</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showPriorityDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {showPriorityDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                  {(['high', 'medium', 'low'] as Priority[]).map((priority) => (
                    <button
                      key={priority}
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, priority });
                        setShowPriorityDropdown(false);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-2 first:rounded-t-lg last:rounded-b-lg"
                    >
                      <Flag className={`w-4 h-4 ${getPriorityColor(priority)}`} />
                      <span>{getPriorityLabel(priority)}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Assign to Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assign to
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowAssigneeDropdown(!showAssigneeDropdown)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-left flex items-center justify-between hover:border-gray-400 transition-colors"
              >
                <div className="flex items-center gap-2">
                  {formData.assignees.length > 0 ? (
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {formData.assignees.slice(0, 2).map((assignee) => (
                          <img
                            key={assignee.id}
                            src={assignee.avatar}
                            alt={assignee.name}
                            className="w-6 h-6 rounded-full border-2 border-white"
                          />
                        ))}
                        {formData.assignees.length > 2 && (
                          <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                            <span className="text-xs text-gray-600">+{formData.assignees.length - 2}</span>
                          </div>
                        )}
                      </div>
                      <span className="text-sm">
                        {formData.assignees.length === 1 
                          ? formData.assignees[0].name 
                          : `${formData.assignees.length} members`}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-gray-500">
                      <UserIcon className="w-4 h-4" />
                      <span>Select team member</span>
                    </div>
                  )}
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showAssigneeDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {showAssigneeDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                  {mockUsers.map((user) => {
                    const isAssigned = formData.assignees.some(assignee => assignee.id === user.id);
                    return (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => handleAssigneeToggle(user)}
                        className={`w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 first:rounded-t-lg last:rounded-b-lg ${isAssigned ? 'bg-blue-50' : ''}`}
                      >
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-6 h-6 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                        {isAssigned && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Add Task
            </button>
          </div>
        </form>
      </div>

      {/* Backdrop to close dropdowns */}
      {(showPriorityDropdown || showAssigneeDropdown) && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => {
            setShowPriorityDropdown(false);
            setShowAssigneeDropdown(false);
          }}
        />
      )}
    </div>
  );
};

export default AddTaskModal; 
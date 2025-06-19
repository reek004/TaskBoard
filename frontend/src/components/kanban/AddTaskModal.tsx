import React, { useState } from 'react';
import type { CreateTaskData, Priority, User } from '../../types';
import { mockUsers } from '../../utils/data';
import { X, ChevronDown, Flag, User as UserIcon, Calendar } from 'lucide-react';

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
    dueDate: undefined,
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
        dueDate: undefined,
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
      dueDate: undefined,
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
    <div className="fixed inset-0 backdrop-blur-[2px] bg-opacity-40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 border border-gray-100">
        {/* Modal Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
            <Flag className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Add New Task</h3>
            {columnTitle && (
              <p className="text-gray-600 mt-1">Adding to "{columnTitle}"</p>
            )}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Field */}
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-3">
              Task Title *
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-4 bg-gray-50 border-2 border-transparent rounded-xl hover:border-gray-300 focus:ring-0 focus:border-blue-500 focus:bg-white transition-all text-base placeholder-gray-400 outline-none"
              placeholder="Enter task title"
              required
              autoFocus
            />
          </div>

          {/* Description Field */}
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-3">
              Description
              <span className="text-gray-400 font-normal ml-2">(optional)</span>
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-4 bg-gray-50 border-2 border-transparent rounded-xl hover:border-gray-300 focus:ring-0 focus:border-blue-500 focus:bg-white transition-all text-base placeholder-gray-400 resize-none outline-none"
              placeholder="Enter task description"
              rows={4}
            />
          </div>

          {/* Priority Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Priority
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowPriorityDropdown(!showPriorityDropdown)}
                className="w-full px-4 py-4 bg-gray-50 border-2 border-transparent rounded-xl text-left flex items-center justify-between hover:border-gray-300 focus:border-blue-500 focus:bg-white transition-all outline-none"
              >
                <div className="flex items-center gap-2">
                  <Flag className={`w-4 h-4 ${getPriorityColor(formData.priority)}`} />
                  <span className="text-base">{getPriorityLabel(formData.priority)}</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showPriorityDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {showPriorityDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-10 overflow-hidden">
                  {(['high', 'medium', 'low'] as Priority[]).map((priority) => (
                    <button
                      key={priority}
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, priority });
                        setShowPriorityDropdown(false);
                      }}
                      className="w-full px-4 py-4 text-left hover:bg-gray-50 flex items-center gap-2 transition-colors"
                    >
                      <Flag className={`w-4 h-4 ${getPriorityColor(priority)}`} />
                      <span className="text-base">{getPriorityLabel(priority)}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Due Date Field */}
          <div>
            <label htmlFor="dueDate" className="block text-sm font-semibold text-gray-700 mb-3">
              Due Date
              <span className="text-gray-400 font-normal ml-2">(optional)</span>
            </label>
            <div className="relative rounded-xl">
              <Calendar className="absolute rounded-xl left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="date"
                id="dueDate"
                value={formData.dueDate ? formData.dueDate.toISOString().split('T')[0] : ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  dueDate: e.target.value ? new Date(e.target.value) : undefined 
                })}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-xl hover:border-gray-300 focus:ring-0 focus:border-blue-500 focus:bg-white transition-all text-base placeholder-gray-400 outline-none"
              />
            </div>
          </div>

          {/* Assign to Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Assign to
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowAssigneeDropdown(!showAssigneeDropdown)}
                className="w-full px-4 py-4 bg-gray-50 border-2 border-transparent rounded-xl text-left flex items-center justify-between hover:border-gray-300 focus:border-blue-500 focus:bg-white transition-all outline-none"
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
                      <span className="text-base">
                        {formData.assignees.length === 1 
                          ? formData.assignees[0].name 
                          : `${formData.assignees.length} members`}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-gray-500">
                      <UserIcon className="w-4 h-4" />
                      <span className="text-base">Select team member</span>
                    </div>
                  )}
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showAssigneeDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {showAssigneeDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-10 max-h-48 overflow-y-auto">
                  {mockUsers.map((user) => {
                    const isAssigned = formData.assignees.some(assignee => assignee.id === user.id);
                    return (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => handleAssigneeToggle(user)}
                        className={`w-full px-4 py-4 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors ${isAssigned ? 'bg-blue-50' : ''}`}
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
          <div className="flex justify-end gap-4 pt-8 border-t border-gray-100">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-3 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-all duration-200 hover:scale-105"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 flex items-center gap-2"
            >
              <Flag className="w-4 h-4" />
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
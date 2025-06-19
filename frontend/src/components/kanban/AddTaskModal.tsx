import React, { useState, useRef } from 'react';
import MarkdownRenderer from '../ui/MarkdownComponents';
import type { CreateTaskData, Priority, User } from '../../types';
import { mockUsers } from '../../utils/data';
import { ChevronDown, Flag, User as UserIcon, Calendar, Eye, Edit3 } from 'lucide-react';

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
  const [showMarkdownPreview, setShowMarkdownPreview] = useState(false);
  const dateInputRef = useRef<HTMLInputElement>(null);

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
    <div className="fixed inset-0 backdrop-blur-[2px] bg-opacity-40 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xs sm:max-w-lg md:max-w-2xl max-h-[95vh] overflow-hidden border border-gray-100">
        {/* Modal Header */}
        <div className="flex items-center gap-3 sm:gap-4 p-4 sm:p-6 md:p-8 pb-4 sm:pb-6 md:pb-8 border-b border-gray-100">
          <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
            <Flag className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 truncate">Add New Task</h3>
            {columnTitle && (
              <p className="text-sm sm:text-base text-gray-600 mt-1 truncate">Adding to "{columnTitle}"</p>
            )}
          </div>
        </div>

        {/* Form - Scrollable content */}
        <div className="overflow-y-auto max-h-[calc(95vh-140px)] p-4 sm:p-6 md:p-8 pt-0 scrollbar-hide">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Title Field */}
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                Task Title *
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-3 sm:px-4 sm:py-4 bg-gray-50 border-2 border-transparent rounded-xl hover:border-gray-300 focus:ring-0 focus:border-blue-500 focus:bg-white transition-all text-sm sm:text-base placeholder-gray-400 outline-none"
                placeholder="Enter task title"
                required
                autoFocus
              />
            </div>

            {/* Description Field */}
            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                Description
                <span className="text-gray-400 font-normal ml-2 hidden sm:inline">(optional, Markdown supported)</span>
                <span className="text-gray-400 font-normal ml-2 sm:hidden">(optional)</span>
              </label>
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                {formData.description && (
                  <button
                    type="button"
                    onClick={() => setShowMarkdownPreview(!showMarkdownPreview)}
                    className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 px-2 py-1 sm:px-3 sm:py-2 rounded-lg transition-all duration-200 hover:scale-105 cursor-pointer"
                  >
                    {showMarkdownPreview ? <Edit3 size={14} /> : <Eye size={14} />}
                    {showMarkdownPreview ? 'Edit' : 'Preview'}
                  </button>
                )}
              </div>
              
              {showMarkdownPreview ? (
                <div className="bg-gray-50 border-2 border-transparent rounded-xl p-3 sm:p-4 min-h-[100px] sm:min-h-[120px] text-sm sm:text-base">
                  <MarkdownRenderer variant="modal">{formData.description || ''}</MarkdownRenderer>
                </div>
              ) : (
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-3 sm:px-4 sm:py-4 bg-gray-50 border-2 border-transparent rounded-xl hover:border-gray-300 focus:ring-0 focus:border-blue-500 focus:bg-white transition-all text-sm sm:text-base placeholder-gray-400 resize-none outline-none"
                  placeholder="Enter task description (Markdown supported)"
                  rows={3}
                />
              )}
            </div>

            {/* Priority Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                Priority
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowPriorityDropdown(!showPriorityDropdown)}
                  className="w-full px-3 py-3 sm:px-4 sm:py-4 bg-gray-50 border-2 border-transparent rounded-xl text-left flex items-center justify-between hover:border-gray-300 focus:border-blue-500 focus:bg-white transition-all duration-200 hover:scale-105 outline-none cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Flag className={`w-4 h-4 ${getPriorityColor(formData.priority)}`} />
                    <span className="text-sm sm:text-base">{getPriorityLabel(formData.priority)}</span>
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
                        className="w-full px-3 py-3 sm:px-4 sm:py-4 text-left hover:bg-gray-50 flex items-center gap-2 transition-all duration-200 hover:scale-105 cursor-pointer"
                      >
                        <Flag className={`w-4 h-4 ${getPriorityColor(priority)}`} />
                        <span className="text-sm sm:text-base">{getPriorityLabel(priority)}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Due Date Field */}
            <div>
              <label htmlFor="dueDate" className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                Due Date
                <span className="text-gray-400 font-normal ml-2">(optional)</span>
              </label>
              <div 
                className="relative rounded-xl cursor-pointer"
                onClick={() => {
                  if (dateInputRef.current) {
                    dateInputRef.current.focus();
                    dateInputRef.current.showPicker?.();
                  }
                }}
              >
                <input
                  type="date"
                  id="dueDate"
                  value={formData.dueDate ? formData.dueDate.toISOString().split('T')[0] : ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    dueDate: e.target.value ? new Date(e.target.value) : undefined 
                  })}
                  className="w-full pl-10 sm:pl-12 pr-3 py-3 sm:pr-4 sm:py-4 bg-gray-50 border-2 border-transparent rounded-xl hover:border-gray-300 focus:ring-0 focus:border-blue-500 focus:bg-white transition-all text-sm sm:text-base placeholder-gray-400 outline-none cursor-pointer"
                  ref={dateInputRef}
                />
                <Calendar className="absolute rounded-xl left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>
            </div>

            {/* Assign to Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                Assign to
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowAssigneeDropdown(!showAssigneeDropdown)}
                  className="w-full px-3 py-3 sm:px-4 sm:py-4 bg-gray-50 border-2 border-transparent rounded-xl text-left flex items-center justify-between hover:border-gray-300 focus:border-blue-500 focus:bg-white transition-all duration-200 hover:scale-105 outline-none cursor-pointer"
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    {formData.assignees.length > 0 ? (
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="flex -space-x-1 sm:-space-x-2">
                          {formData.assignees.slice(0, 2).map((assignee) => (
                            <img
                              key={assignee.id}
                              src={assignee.avatar}
                              alt={assignee.name}
                              className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-white"
                            />
                          ))}
                          {formData.assignees.length > 2 && (
                            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                              <span className="text-xs text-gray-600">+{formData.assignees.length - 2}</span>
                            </div>
                          )}
                        </div>
                        <span className="text-sm sm:text-base truncate">
                          {formData.assignees.length === 1 
                            ? formData.assignees[0].name 
                            : `${formData.assignees.length} members`}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-gray-500">
                        <UserIcon className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm sm:text-base">Select team member</span>
                      </div>
                    )}
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${showAssigneeDropdown ? 'rotate-180' : ''}`} />
                </button>
                
                {showAssigneeDropdown && (
                  <div className="absolute bottom-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-10 max-h-40 sm:max-h-48 overflow-y-auto scrollbar-hide">
                    {mockUsers.map((user) => {
                      const isAssigned = formData.assignees.some(assignee => assignee.id === user.id);
                      return (
                        <button
                          key={user.id}
                          type="button"
                          onClick={() => handleAssigneeToggle(user)}
                          className={`w-full px-3 py-3 sm:px-4 sm:py-4 text-left hover:bg-gray-50 flex items-center gap-2 sm:gap-3 transition-all duration-200 hover:scale-105 ${isAssigned ? 'bg-blue-50' : ''} cursor-pointer`}
                        >
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900 text-sm sm:text-base truncate">{user.name}</div>
                            <div className="text-xs sm:text-sm text-gray-500 truncate">{user.email}</div>
                          </div>
                          {isAssigned && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4 pt-6 sm:pt-8 border-t border-gray-100">
              <button
                type="button"
                onClick={handleCancel}
                className="w-full sm:w-auto px-4 py-3 sm:px-6 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-all duration-200 hover:scale-105 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 sm:px-8 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Flag className="w-4 h-4" />
                Add Task
              </button>
            </div>
          </form>
        </div>
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
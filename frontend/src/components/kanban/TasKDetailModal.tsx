import React, { useState, useEffect, useRef } from 'react';
import MarkdownRenderer from '../ui/MarkdownComponents';
import type { Task, Priority } from '../../types';
import { mockUsers, addComment } from '../../utils/data';
import { useAuth } from '../../context/AuthContext';
import { 
  X, 
  Calendar,  
  Flag, 
  Eye, 
  Edit3, 
  Save,
  Trash2,
  MessageCircle,
  Send,
  ChevronDown
} from 'lucide-react';
import { format } from 'date-fns';

interface TaskDetailModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (taskId: string, updates: Partial<Task>) => void;
  onDelete: (taskId: string) => void;
  boardId: string;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  isOpen,
  onClose,
  onUpdate,
  onDelete,
  boardId,
}) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: task.title,
    description: task.description,
    priority: task.priority,
    assignees: task.assignees.map(a => a.id),
    dueDate: task.dueDate ? format(task.dueDate, 'yyyy-MM-dd') : '',
  });
  const [showMarkdownPreview, setShowMarkdownPreview] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
  const dateInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEditData({
      title: task.title,
      description: task.description,
      priority: task.priority,
      assignees: task.assignees.map(a => a.id),
      dueDate: task.dueDate ? format(task.dueDate, 'yyyy-MM-dd') : '',
    });
  }, [task]);

  if (!isOpen) return null;

  const handleSave = () => {
    const updates: Partial<Task> = {
      title: editData.title,
      description: editData.description,
      priority: editData.priority as Priority,
      assignees: editData.assignees.map(id => mockUsers.find(u => u.id === id)!).filter(Boolean),
      dueDate: editData.dueDate ? new Date(editData.dueDate) : undefined,
    };
    
    onUpdate(task.id, updates);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      onDelete(task.id);
      onClose();
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() && user) {
      const comment = addComment(boardId, task.id, newComment, user);
      if (comment) {
        // Update the task with the new comment
        const updatedComments = [...task.comments, comment];
        onUpdate(task.id, { comments: updatedComments });
        setNewComment('');
      }
    }
  };

  const handleDeleteComment = (commentId: string) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      const updatedComments = task.comments.filter(comment => comment.id !== commentId);
      onUpdate(task.id, { comments: updatedComments });
    }
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityLabel = (priority: Priority) => {
    switch (priority) {
      case 'high': return 'High';
      case 'medium': return 'Medium';
      case 'low': return 'Low';
      default: return 'Medium';
    }
  };

  const getPriorityIconColor = (priority: Priority) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-yellow-600';
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-[2px] bg-opacity-40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-gray-100">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-8 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
              <Flag className="w-6 h-6 text-white" />
            </div>
            <div>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.title}
                  onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                  className="text-2xl font-bold bg-gray-50 border-2 border-transparent rounded-xl hover:border-gray-300 focus:ring-0 focus:border-blue-500 focus:bg-white transition-all px-3 py-2 outline-none"
                />
              ) : (
                <h2 className="text-2xl font-bold text-gray-900">{task.title}</h2>
              )}
              <p className="text-gray-600 mt-1">Task Details</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="p-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer"
                >
                  <Save size={20} />
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-3 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-xl cursor-pointer"
                >
                  <X size={20} />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-3 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-xl cursor-pointer"
                >
                  <Edit3 size={20} />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-3 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-xl cursor-pointer"
                >
                  <Trash2 size={20} />
                </button>
                <button
                  onClick={onClose}
                  className="p-3 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-xl cursor-pointer"
                >
                  <X size={20} />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex h-[calc(90vh-120px)]">
          {/* Main Content */}
          <div className="flex-1 p-8 overflow-y-auto space-y-6 scrollbar-hide">
            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Description
                <span className="text-gray-400 font-normal ml-2">(optional)</span>
              </label>
              <div className="flex items-center justify-between mb-3">
                {isEditing && editData.description && (
                  <button
                    onClick={() => setShowMarkdownPreview(!showMarkdownPreview)}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105 cursor-pointer"
                  >
                    {showMarkdownPreview ? <Edit3 size={16} /> : <Eye size={16} />}
                    {showMarkdownPreview ? 'Edit' : 'Preview'}
                  </button>
                )}
              </div>
              
              {isEditing ? (
                showMarkdownPreview ? (
                  <div className="bg-gray-50 border-2 border-transparent rounded-xl p-4 min-h-[200px]">
                    <MarkdownRenderer>{editData.description}</MarkdownRenderer>
                  </div>
                ) : (
                  <textarea
                    value={editData.description}
                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                    className="w-full px-4 py-4 bg-gray-50 border-2 border-transparent rounded-xl hover:border-gray-300 focus:ring-0 focus:border-blue-500 focus:bg-white transition-all text-base placeholder-gray-400 resize-none outline-none"
                    placeholder="Add a description... (Markdown supported)"
                    rows={8}
                  />
                )
              ) : task.description ? (
                <div className="bg-gray-50 rounded-xl p-4">
                  <MarkdownRenderer>{task.description}</MarkdownRenderer>
                </div>
              ) : (
                <p className="text-gray-500 italic bg-gray-50 rounded-xl p-4">No description provided</p>
              )}
            </div>

            {/* Activity/Comments */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Activity</h3>
              
              {/* Add Comment */}
              <form onSubmit={handleAddComment} className="mb-6">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Write a comment..."
                      className="w-full px-4 py-4 bg-gray-50 border-2 border-transparent rounded-xl hover:border-gray-300 focus:ring-0 focus:border-blue-500 focus:bg-white transition-all text-base placeholder-gray-400 resize-none outline-none"
                      rows={3}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!newComment.trim()}
                    className="self-end px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </form>

              {/* Comments List */}
              <div className="space-y-4">
                {task.comments.length > 0 ? (
                  task.comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3 bg-gray-50 rounded-xl p-4">
                      <img
                        src={comment.author.avatar}
                        alt={comment.author.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-gray-900">
                              {comment.author.name}
                            </span>
                            <span className="text-xs text-gray-500">
                              {format(comment.createdAt, 'MMM d, h:mm a')}
                            </span>
                          </div>
                          {(user?.id === comment.author.id || user?.role === 'admin') && (
                            <button
                              onClick={() => handleDeleteComment(comment.id)}
                              className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-all duration-200 hover:scale-105 cursor-pointer"
                              title="Delete comment"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{comment.text}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-xl">
                    <MessageCircle className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">No comments yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-80 border-l border-gray-100 p-8 bg-gray-50 overflow-y-auto scrollbar-hide">
            <div className="space-y-6">
              {/* Priority */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Priority
                </label>
                {isEditing ? (
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowPriorityDropdown(!showPriorityDropdown)}
                      className="w-full px-4 py-4 bg-white border-2 border-transparent rounded-xl text-left flex items-center justify-between hover:border-gray-300 focus:border-blue-500 focus:bg-white transition-all duration-200 hover:scale-105 outline-none cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Flag className={`w-4 h-4 ${getPriorityIconColor(editData.priority as Priority)}`} />
                        <span className="text-base">{getPriorityLabel(editData.priority as Priority)}</span>
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
                              setEditData({ ...editData, priority });
                              setShowPriorityDropdown(false);
                            }}
                            className="w-full px-4 py-4 text-left hover:bg-gray-50 flex items-center gap-2 transition-all duration-200 hover:scale-105 cursor-pointer"
                          >
                            <Flag className={`w-4 h-4 ${getPriorityIconColor(priority)}`} />
                            <span className="text-base">{getPriorityLabel(priority)}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 px-4 py-3 bg-white rounded-xl">
                    <Flag className={`w-4 h-4 ${task.priority === 'high' ? 'text-red-600' : task.priority === 'medium' ? 'text-yellow-600' : 'text-green-600'}`} />
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                )}
              </div>

              {/* Assignees */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Assignees
                </label>
                {isEditing ? (
                  <div className="space-y-3 bg-white rounded-xl p-4 max-h-48 overflow-y-auto ">
                    {mockUsers.map((user) => (
                      <label key={user.id} className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                        <input
                          type="checkbox"
                          checked={editData.assignees.includes(user.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setEditData({
                                ...editData,
                                assignees: [...editData.assignees, user.id]
                              });
                            } else {
                              setEditData({
                                ...editData,
                                assignees: editData.assignees.filter(id => id !== user.id)
                              });
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-xs text-gray-500">{user.email}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-xl p-4 space-y-3">
                    {task.assignees.length > 0 ? (
                      task.assignees.map((assignee) => (
                        <div key={assignee.id} className="flex items-center gap-3">
                          <img
                            src={assignee.avatar}
                            alt={assignee.name}
                            className="w-6 h-6 rounded-full"
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{assignee.name}</div>
                            <div className="text-xs text-gray-500">{assignee.email}</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No assignees</p>
                    )}
                  </div>
                )}
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Due Date
                  <span className="text-gray-400 font-normal ml-2">(optional)</span>
                </label>
                {isEditing ? (
                  <div 
                    className="relative cursor-pointer"
                    onClick={() => {
                      if (dateInputRef.current) {
                        dateInputRef.current.focus();
                        dateInputRef.current.showPicker?.();
                      }
                    }}
                  >
                    <input
                      type="date"
                      value={editData.dueDate}
                      onChange={(e) => setEditData({ ...editData, dueDate: e.target.value })}
                      className="w-full pl-12 pr-4 py-4 bg-white border-2 border-transparent rounded-xl hover:border-gray-300 focus:ring-0 focus:border-blue-500 focus:bg-white transition-all outline-none cursor-pointer"
                      ref={dateInputRef}
                    />
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                  </div>
                ) : (
                  <div className="flex items-center gap-2 px-4 py-3 bg-white rounded-xl">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    {task.dueDate ? (
                      <span className="text-sm text-gray-700">
                        {format(task.dueDate, 'MMM d, yyyy')}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-500">No due date</span>
                    )}
                  </div>
                )}
              </div>

              {/* Created By */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Created By
                </label>
                <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl">
                  <img
                    src={task.creator.avatar}
                    alt={task.creator.name}
                    className="w-6 h-6 rounded-full"
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-900">{task.creator.name}</div>
                    <div className="text-xs text-gray-500">{task.creator.email}</div>
                  </div>
                </div>
              </div>

              {/* Metadata */}
              <div className="pt-4 border-t border-gray-200">
                <div className="space-y-2 text-xs text-gray-500 bg-white rounded-xl p-4">
                  <p><span className="font-medium">Created:</span> {format(task.createdAt, 'MMM d, yyyy h:mm a')}</p>
                  <p><span className="font-medium">Updated:</span> {format(task.updatedAt, 'MMM d, yyyy h:mm a')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop to close dropdown */}
      {showPriorityDropdown && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowPriorityDropdown(false)}
        />
      )}
    </div>
  );
};

export default TaskDetailModal; 
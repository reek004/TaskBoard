import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import type { Task, Priority } from '../../types';
import { mockUsers } from '../../utils/data';
import { 
  X, 
  Calendar, 
  Users as UsersIcon, 
  Flag, 
  Eye, 
  Edit3, 
  Save,
  Trash2,
  MessageCircle,
  Send
} from 'lucide-react';
import { format } from 'date-fns';

interface TaskDetailModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (taskId: string, updates: Partial<Task>) => void;
  onDelete: (taskId: string) => void;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  isOpen,
  onClose,
  onUpdate,
  onDelete,
}) => {
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
    if (newComment.trim()) {
      // In a real app, this would be handled by the parent component
      // For now, we'll just reset the comment field
      setNewComment('');
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            {isEditing ? (
              <input
                type="text"
                value={editData.title}
                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                className="text-xl font-semibold border border-gray-300 rounded px-2 py-1 flex-1"
              />
            ) : (
              <h2 className="text-xl font-semibold text-gray-900">{task.title}</h2>
            )}
          </div>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="p-2 text-green-600 hover:bg-green-100 rounded"
                >
                  <Save size={20} />
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-2 text-gray-400 hover:bg-gray-100 rounded"
                >
                  <X size={20} />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 text-gray-400 hover:bg-gray-100 rounded"
                >
                  <Edit3 size={20} />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-2 text-red-400 hover:bg-red-100 rounded"
                >
                  <Trash2 size={20} />
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:bg-gray-100 rounded"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex h-[calc(90vh-80px)]">
          {/* Main Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {/* Description */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-700">Description</h3>
                {isEditing && editData.description && (
                  <button
                    onClick={() => setShowMarkdownPreview(!showMarkdownPreview)}
                    className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
                  >
                    {showMarkdownPreview ? <Edit3 size={16} /> : <Eye size={16} />}
                    {showMarkdownPreview ? 'Edit' : 'Preview'}
                  </button>
                )}
              </div>
              
              {isEditing ? (
                showMarkdownPreview ? (
                  <div className="prose prose-sm max-w-none border border-gray-300 rounded-lg p-3 min-h-[200px]">
                    <ReactMarkdown>{editData.description}</ReactMarkdown>
                  </div>
                ) : (
                  <textarea
                    value={editData.description}
                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                    className="w-full h-48 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Add a description... (Markdown supported)"
                  />
                )
              ) : task.description ? (
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown>{task.description}</ReactMarkdown>
                </div>
              ) : (
                <p className="text-gray-500 italic">No description provided</p>
              )}
            </div>

            {/* Activity/Comments */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-4">Activity</h3>
              
              {/* Add Comment */}
              <form onSubmit={handleAddComment} className="mb-4">
                <div className="flex gap-3">
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Write a comment..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows={3}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!newComment.trim()}
                    className="self-end p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </form>

              {/* Comments List */}
              <div className="space-y-4">
                {task.comments.length > 0 ? (
                  task.comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <img
                        src={comment.author.avatar}
                        alt={comment.author.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-gray-900">
                              {comment.author.name}
                            </span>
                            <span className="text-xs text-gray-500">
                              {format(comment.createdAt, 'MMM d, h:mm a')}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700">{comment.text}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <MessageCircle className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">No comments yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-80 border-l border-gray-200 p-6 bg-gray-50">
            <div className="space-y-6">
              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Flag size={16} className="inline mr-1" />
                  Priority
                </label>
                {isEditing ? (
                  <select
                    value={editData.priority}
                    onChange={(e) => setEditData({ ...editData, priority: e.target.value as Priority })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                ) : (
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                )}
              </div>

              {/* Assignees */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <UsersIcon size={16} className="inline mr-1" />
                  Assignees
                </label>
                {isEditing ? (
                  <div className="space-y-2">
                    {mockUsers.map((user) => (
                      <label key={user.id} className="flex items-center gap-2">
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
                        <span className="text-sm text-gray-700">{user.name}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {task.assignees.length > 0 ? (
                      task.assignees.map((assignee) => (
                        <div key={assignee.id} className="flex items-center gap-2">
                          <img
                            src={assignee.avatar}
                            alt={assignee.name}
                            className="w-6 h-6 rounded-full"
                          />
                          <span className="text-sm text-gray-700">{assignee.name}</span>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar size={16} className="inline mr-1" />
                  Due Date
                </label>
                {isEditing ? (
                  <input
                    type="date"
                    value={editData.dueDate}
                    onChange={(e) => setEditData({ ...editData, dueDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : task.dueDate ? (
                  <p className="text-sm text-gray-700">
                    {format(task.dueDate, 'MMM d, yyyy')}
                  </p>
                ) : (
                  <p className="text-sm text-gray-500">No due date</p>
                )}
              </div>

              {/* Metadata */}
              <div className="pt-4 border-t border-gray-200">
                <div className="space-y-2 text-xs text-gray-500">
                  <p>Created: {format(task.createdAt, 'MMM d, yyyy h:mm a')}</p>
                  <p>Updated: {format(task.updatedAt, 'MMM d, yyyy h:mm a')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal; 
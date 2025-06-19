import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getBoards, createBoard, deleteBoard } from '../../utils/data';
import type { Board, CreateBoardData } from '../../types';
import { Plus, Search, Users, Calendar, MoreVertical, Trash2, Edit3, Kanban, Eye } from 'lucide-react';
import { format } from 'date-fns';

const BoardView: React.FC = () => {
  const [boards, setBoards] = useState<Board[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createFormData, setCreateFormData] = useState<CreateBoardData>({
    name: '',
    description: '',
  });
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { user, logout } = useAuth();

  useEffect(() => {
    loadBoards();
  }, []);

  const loadBoards = () => {
    setBoards(getBoards());
  };

  const filteredBoards = boards.filter(board =>
    board.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    board.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateBoard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !createFormData.name.trim()) return;

    createBoard(createFormData, user);
    setCreateFormData({ name: '', description: '' });
    setShowCreateModal(false);
    loadBoards();
  };

  const handleDeleteBoard = (boardId: string) => {
    if (window.confirm('Are you sure you want to delete this board? This action cannot be undone.')) {
      deleteBoard(boardId);
      loadBoards();
    }
    setActiveDropdown(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
        <div className="max-w-full px-6 lg:px-8">
          <div className="flex justify-between items-center h-22">
            <div className="flex items-center gap-4">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
                <Kanban className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">TaskBoard</h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={user?.avatar}
                  alt={user?.name}
                  className="w-8 h-8 rounded-full shadow-sm"
                />
                <span className="text-sm font-medium text-gray-700">{user?.name}</span>
              </div>
              <button
                onClick={logout}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content with top padding for fixed navbar */}
      <div className="pt-20">
        {/* Page Header */}
        <div className="bg-white shadow-md">
          <div className="max-w-full px-6 lg:px-8 py-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">My Boards</h2>
                <p className="text-base text-gray-600 mt-1">Manage and organize your projects</p>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
              >
                <Plus size={20} />
                New Board
              </button>
            </div>
          </div>
        </div>

        {/* Search and Content */}
        <div className="max-w-full px-6 lg:px-8 py-8">
          {/* Search */}
          <div className="mb-8">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search boards..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white focus:shadow-md transition-all"
              />
            </div>
          </div>

          {/* Boards Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {filteredBoards.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Board Name
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Team Members
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Last Updated
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredBoards.map((board) => (
                      <tr key={board.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Link
                            to={`/board/${board.id}`}
                            className="flex items-center group"
                          >
                            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                              <Kanban className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                {board.name}
                              </div>
                            </div>
                          </Link>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-600 max-w-xs truncate">
                            {board.description || '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex -space-x-2 mr-2">
                              {board.teamMembers.slice(0, 3).map((member) => (
                                <img
                                  key={member.id}
                                  src={member.avatar}
                                  alt={member.name}
                                  className="w-6 h-6 rounded-full shadow-sm ring-2 ring-white"
                                  title={member.name}
                                />
                              ))}
                              {board.teamMembers.length > 3 && (
                                <div className="w-6 h-6 rounded-full bg-gray-200 shadow-sm ring-2 ring-white flex items-center justify-center">
                                  <span className="text-xs text-gray-600">
                                    +{board.teamMembers.length - 3}
                                  </span>
                                </div>
                              )}
                            </div>
                            <span className="text-sm text-gray-500">
                              {board.teamMembers.length} member{board.teamMembers.length !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">
                            {format(board.createdAt, 'MMM d, yyyy')}
                          </div>
                          <div className="text-xs text-gray-400">
                            {format(board.createdAt, 'h:mm a')}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">
                            {format(board.updatedAt, 'MMM d, yyyy')}
                          </div>
                          <div className="text-xs text-gray-400">
                            {format(board.updatedAt, 'h:mm a')}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="relative">
                            <button
                              onClick={() => setActiveDropdown(activeDropdown === board.id ? null : board.id)}
                              className="inline-flex items-center p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              <MoreVertical size={16} />
                            </button>
                            {activeDropdown === board.id && (
                              <div className="absolute right-0 top-10 bg-white rounded-lg shadow-xl py-1 z-10 min-w-[120px] border border-gray-100">
                                <Link
                                  to={`/board/${board.id}`}
                                  onClick={() => setActiveDropdown(null)}
                                  className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                >
                                  <Eye size={14} />
                                  View
                                </Link>
                                <button
                                  onClick={() => setActiveDropdown(null)}
                                  className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                >
                                  <Edit3 size={14} />
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteBoard(board.id)}
                                  className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                >
                                  <Trash2 size={14} />
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-6">
                  <Kanban className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {searchTerm ? 'No boards found' : 'No boards yet'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm
                    ? 'Try adjusting your search terms'
                    : 'Get started by creating your first board'}
                </p>
                {!searchTerm && (
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                  >
                    <Plus size={20} />
                    Create Board
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Board Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 backdrop-blur-[2px] bg-opacity-40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 border border-gray-100">
            {/* Modal Header */}
            <div className="flex items-center gap-4 mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <Kanban className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Create New Board</h3>
                <p className="text-gray-600 mt-1">Set up a new workspace for your team</p>
              </div>
            </div>

            <form onSubmit={handleCreateBoard} className="space-y-6">
              <div>
                <label htmlFor="boardName" className="block text-sm font-semibold text-gray-700 mb-3">
                  Board Name *
                </label>
                <input
                  type="text"
                  id="boardName"
                  value={createFormData.name}
                  onChange={(e) => setCreateFormData({ ...createFormData, name: e.target.value })}
                  className="w-full px-4 py-4 bg-gray-50 border-2 border-transparent rounded-xl focus:ring-0 focus:border-blue-500 focus:bg-white transition-all text-base placeholder-gray-400"
                  placeholder="e.g., Marketing Campaign Q4"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="boardDescription" className="block text-sm font-semibold text-gray-700 mb-3">
                  Description
                  <span className="text-gray-400 font-normal ml-2">(optional)</span>
                </label>
                <textarea
                  id="boardDescription"
                  value={createFormData.description}
                  onChange={(e) => setCreateFormData({ ...createFormData, description: e.target.value })}
                  className="w-full px-4 py-4 bg-gray-50 border-2 border-transparent rounded-xl focus:ring-0 focus:border-blue-500 focus:bg-white transition-all text-base placeholder-gray-400 resize-none"
                  placeholder="Brief description of what this board will be used for..."
                  rows={4}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 pt-8 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setCreateFormData({ name: '', description: '' });
                  }}
                  className="px-6 py-3 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-all duration-200 hover:scale-105"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Create Board
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Click outside to close dropdown */}
      {activeDropdown && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setActiveDropdown(null)}
        />
      )}
    </div>
  );
};

export default BoardView; 
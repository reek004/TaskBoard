import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getBoards, createBoard, deleteBoard, updateBoard } from '../../utils/data';
import type { Board, CreateBoardData } from '../../types';
import { Plus, Search, MoreVertical, Trash2, Edit3, Kanban, Eye } from 'lucide-react';
import { format } from 'date-fns';
import BoardModal from './BoardModal';
import DropdownPortal from '../common/DropdownPortal';

const BoardView: React.FC = () => {
  const [boards, setBoards] = useState<Board[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingBoard, setEditingBoard] = useState<Board | null>(null);
  const [createFormData, setCreateFormData] = useState<CreateBoardData>({
    name: '',
    description: '',
  });
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const triggerRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const { user, logout } = useAuth();

  useEffect(() => {
    loadBoards();
  }, []);

  const loadBoards = () => {
    console.log(' BoardView: Loading boards...');
    const boardsData = getBoards();
    console.log(' BoardView: Received boards data:', boardsData);
    console.log(' BoardView: Number of boards:', boardsData.length);
    setBoards(boardsData);
  };

  const filteredBoards = boards.filter(board =>
    board.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    board.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateBoard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !createFormData.name.trim()) return;

    if (isEditMode && editingBoard) {
      // Update existing board
      updateBoard(editingBoard.id, {
        name: createFormData.name,
        description: createFormData.description,
      });
    } else {
      // Create new board
      createBoard(createFormData, user);
    }

    setCreateFormData({ name: '', description: '' });
    setShowCreateModal(false);
    setIsEditMode(false);
    setEditingBoard(null);
    loadBoards();
  };

  const handleEditBoard = (board: Board) => {
    setEditingBoard(board);
    setCreateFormData({
      name: board.name,
      description: board.description || '',
    });
    setIsEditMode(true);
    setShowCreateModal(true);
    setActiveDropdown(null);
  };

  const handleDeleteBoard = (boardId: string) => {
    if (window.confirm('Are you sure you want to delete this board? This action cannot be undone.')) {
      deleteBoard(boardId);
      loadBoards();
    }
    setActiveDropdown(null);
  };

  const handleModalClose = () => {
    setShowCreateModal(false);
    setCreateFormData({ name: '', description: '' });
    setIsEditMode(false);
    setEditingBoard(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
        <div className="max-w-full px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
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
                className="text-sm text-gray-500 hover:text-gray-700 transition-all duration-200 hover:scale-105 cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content with top padding for fixed navbar */}
      <div className="pt-16">
        {/* Page Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-full px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">My Boards</h2>
                <p className="text-base text-gray-600 mt-2">Manage and organize your projects</p>
              </div>
              <button
                onClick={() => {
                  setCreateFormData({ name: '', description: '' });
                  setIsEditMode(false);
                  setEditingBoard(null);
                  setShowCreateModal(true);
                }}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-md shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 inline-flex items-center gap-2 cursor-pointer"
              >
                <Plus size={20} />
                New Board
              </button>
            </div>
          </div>
        </div>

        {/* Search and Content */}
        <div className="bg-white shadow-md">
          <div className="max-w-full px-6 lg:px-8 py-4">
            {/* Search */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search boards..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-lg hover:border-gray-300 focus:ring-2 focus:ring-blue-500 focus:bg-white focus:shadow-md transition-all outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-6">
          <div className="max-w-full">
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
                                ref={(el) => {
                                  triggerRefs.current[board.id] = el;
                                }}
                                onClick={() => setActiveDropdown(activeDropdown === board.id ? null : board.id)}
                                className="inline-flex items-center p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:scale-105 cursor-pointer"
                              >
                                <MoreVertical size={16} />
                              </button>
                              
                              <DropdownPortal
                                isOpen={activeDropdown === board.id}
                                triggerRef={{ current: triggerRefs.current[board.id] }}
                                onClose={() => setActiveDropdown(null)}
                                className="py-1"
                              >
                                <Link
                                  to={`/board/${board.id}`}
                                  onClick={() => setActiveDropdown(null)}
                                  className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 cursor-pointer"
                                >
                                  <Eye size={14} />
                                  View
                                </Link>
                                <button
                                  onClick={() => handleEditBoard(board)}
                                  className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-all duration-200 hover:scale-105 flex items-center gap-2 cursor-pointer"
                                >
                                  <Edit3 size={14} />
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteBoard(board.id)}
                                  className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-all duration-200 hover:scale-105 flex items-center gap-2 cursor-pointer"
                                >
                                  <Trash2 size={14} />
                                  Delete
                                </button>
                              </DropdownPortal>
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
                      onClick={() => {
                        setCreateFormData({ name: '', description: '' });
                        setIsEditMode(false);
                        setEditingBoard(null);
                        setShowCreateModal(true);
                      }}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-md shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 inline-flex items-center gap-2 cursor-pointer"
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
      </div>

      {/* Create/Edit Board Modal */}
      <BoardModal
        isOpen={showCreateModal}
        isEditMode={isEditMode}
        formData={createFormData}
        onClose={handleModalClose}
        onSubmit={handleCreateBoard}
        onChange={setCreateFormData}
      />
    </div>
  );
};

export default BoardView; 
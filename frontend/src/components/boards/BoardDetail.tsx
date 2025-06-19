import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import type {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { 
  getBoardById, 
  createColumn, 
  updateColumn, 
  deleteColumn,
  createTask,
  updateTask,
  deleteTask,
  moveTask,
  reorderTasksInColumn
} from '../../utils/data';
import type { Board, Task, Column, CreateTaskData, CreateColumnData, Priority } from '../../types';
import { mockUsers } from '../../utils/data';
import KanbanColumn from '../kanban/KanbanColumn';
import TaskCard from '../kanban/TaskCard';
import TaskDetailModal from '../kanban/TasKDetailModal';
import { useAuth } from '../../context/AuthContext';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Plus, 
  Users,
  Kanban,
  Flag,
  ChevronDown,
  Calendar,
  User as UserIcon,
  X
} from 'lucide-react';
import { isToday, isTomorrow, isPast, isThisWeek } from 'date-fns';
import { 
  getPriorityLabel, 
  getPriorityIconColor, 
  getDueDateLabel, 
  getDueDateIconColor, 
  getAssigneeLabel,
  type DueDateFilter 
} from '../../utils/taskUtils';

const BoardDetail: React.FC = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const [board, setBoard] = useState<Board | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState<Priority | 'all'>('all');
  const [filterDueDate, setFilterDueDate] = useState<DueDateFilter>('all');
  const [filterAssignee, setFilterAssignee] = useState<string>('all');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showAddColumn, setShowAddColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
  const [showDueDateDropdown, setShowDueDateDropdown] = useState(false);
  const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    if (boardId) {
      loadBoard();
    }
  }, [boardId]);

  const loadBoard = () => {
    if (!boardId) return;
    
    const boardData = getBoardById(boardId);
    if (!boardData) {
      navigate('/');
      return;
    }
    
    setBoard(boardData);
    setLoading(false);
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setShowTaskModal(true);
  };

  const handleTaskUpdate = (taskId: string, updates: Partial<Task>) => {
    if (!boardId) return;
    
    updateTask(boardId, taskId, updates);
    loadBoard();
    
    // Update the selected task if it's the one being updated
    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask({ ...selectedTask, ...updates });
    }
  };

  const handleTaskDelete = (taskId: string) => {
    if (!boardId) return;
    
    deleteTask(boardId, taskId);
    loadBoard();
  };

  const handleAddTask = (columnId: string, taskData: CreateTaskData) => {
    if (!boardId || !user) return;
    
    createTask(boardId, columnId, taskData, user);
    loadBoard();
  };

  const handleAddColumn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!boardId || !newColumnTitle.trim()) return;
    
    const columnData: CreateColumnData = {
      title: newColumnTitle.trim(),
    };
    
    createColumn(boardId, columnData);
    setNewColumnTitle('');
    setShowAddColumn(false);
    loadBoard();
  };

  const handleEditColumn = (columnId: string, title: string) => {
    if (!boardId) return;
    
    updateColumn(boardId, columnId, { title });
    loadBoard();
  };

  const handleDeleteColumn = (columnId: string) => {
    if (!boardId) return;
    
    deleteColumn(boardId, columnId);
    loadBoard();
  };

  const getFilteredTasks = (tasks: Task[]): Task[] => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           task.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
      
      // Due date filter
      let matchesDueDate = true;
      if (filterDueDate !== 'all') {
        switch (filterDueDate) {
          case 'overdue':
            matchesDueDate = task.dueDate ? isPast(task.dueDate) && !isToday(task.dueDate) : false;
            break;
          case 'today':
            matchesDueDate = task.dueDate ? isToday(task.dueDate) : false;
            break;
          case 'tomorrow':
            matchesDueDate = task.dueDate ? isTomorrow(task.dueDate) : false;
            break;
          case 'this-week':
            matchesDueDate = task.dueDate ? isThisWeek(task.dueDate) : false;
            break;
          case 'no-date':
            matchesDueDate = !task.dueDate;
            break;
          default:
            matchesDueDate = true;
        }
      }
      
      // Assignee filter
      const matchesAssignee = filterAssignee === 'all' || 
        (filterAssignee === 'unassigned' ? task.assignees.length === 0 : 
         task.assignees.some(assignee => assignee.id === filterAssignee));
      
      return matchesSearch && matchesPriority && matchesDueDate && matchesAssignee;
    });
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || !board) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find the active task and its column
    let activeTask: Task | null = null;
    let activeColumn: Column | null = null;
    
    for (const column of board.columns) {
      const task = column.tasks.find(t => t.id === activeId);
      if (task) {
        activeTask = task;
        activeColumn = column;
        break;
      }
    }

    if (!activeTask || !activeColumn) return;

    // Find the over column
    let overColumn: Column | null = null;
    
    // Check if over a column directly
    overColumn = board.columns.find(col => col.id === overId) || null;
    
    // If not over a column, check if over a task
    if (!overColumn) {
      for (const column of board.columns) {
        if (column.tasks.find(t => t.id === overId)) {
          overColumn = column;
          break;
        }
      }
    }

    if (!overColumn || activeColumn.id === overColumn.id) return;

    // Move task to new column (at the end for now)
    if (boardId) {
      moveTask(boardId, activeId, activeColumn.id, overColumn.id, overColumn.tasks.length);
      loadBoard();
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    
    const { active, over } = event;
    if (!over || !board || !boardId) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    // Find the active task and its column
    let activeTask: Task | null = null;
    let activeColumn: Column | null = null;
    let activeIndex = -1;
    
    for (const column of board.columns) {
      const index = column.tasks.findIndex(t => t.id === activeId);
      if (index !== -1) {
        activeTask = column.tasks[index];
        activeColumn = column;
        activeIndex = index;
        break;
      }
    }

    if (!activeTask || !activeColumn) return;

    // Find the over task and its position
    let overColumn: Column | null = null;
    let overIndex = -1;
    
    for (const column of board.columns) {
      const index = column.tasks.findIndex(t => t.id === overId);
      if (index !== -1) {
        overColumn = column;
        overIndex = index;
        break;
      }
    }

    // If same column, reorder tasks
    if (overColumn && activeColumn.id === overColumn.id) {
      const newTasks = arrayMove(activeColumn.tasks, activeIndex, overIndex);
      const taskIds = newTasks.map(task => task.id);
      reorderTasksInColumn(boardId, activeColumn.id, taskIds);
      loadBoard();
    }
  };

  const clearAllFilters = () => {
    setFilterPriority('all');
    setFilterDueDate('all');
    setFilterAssignee('all');
    setSearchTerm('');
  };

  const hasActiveFilters = filterPriority !== 'all' || filterDueDate !== 'all' || filterAssignee !== 'all' || searchTerm.trim() !== '';

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!board) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Board not found</h2>
          <Link to="/" className="text-blue-600 hover:text-blue-700">
            Return to boards
          </Link>
        </div>
      </div>
    );
  }

  const activeTask = activeId ? 
    board.columns.flatMap(col => col.tasks).find(task => task.id === activeId) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
        <div className="max-w-full px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-6">
              <Link
                to="/"
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
              >
                <ArrowLeft size={20} />
              </Link>
              <div className="flex items-center gap-4">
                <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
                  <Kanban className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">TaskBoard</h1>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              {/* Team Members */}
              <div className="flex items-center gap-3">
                <Users size={16} className="text-gray-400" />
                <div className="flex -space-x-2">
                  {board.teamMembers.slice(0, 3).map((member) => (
                    <img
                      key={member.id}
                      src={member.avatar}
                      alt={member.name}
                      className="w-8 h-8 rounded-full shadow-sm"
                      title={member.name}
                    />
                  ))}
                  {board.teamMembers.length > 3 && (
                    <div className="w-8 h-8 rounded-full bg-gray-200 shadow-sm flex items-center justify-center">
                      <span className="text-xs text-gray-600">
                        +{board.teamMembers.length - 3}
                      </span>
                    </div>
                  )}
                </div>
              </div>

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

      {/* Board Header with Title */}
      <div className="pt-16 bg-white shadow-sm">
        <div className="max-w-full px-6 lg:px-8 py-6">
          <div className="max-w-full">
            <h2 className="text-3xl font-bold text-gray-900">{board.name}</h2>
            {board.description && (
              <p className="text-base text-gray-600 mt-2">{board.description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow-b-lg">
        <div className="max-w-full px-6 lg:px-8 py-4">
          <div className="flex flex-col gap-4">
            {/* First Row - Search and Clear Filters */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-lg hover:border-gray-300 focus:ring-2 focus:ring-blue-500 focus:bg-white focus:shadow-md transition-all outline-none"
                />
              </div>
              
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={16} />
                  Clear Filters
                </button>
              )}
            </div>
            
            {/* Second Row - Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-3">
              <Filter size={16} className="text-gray-400" />
              
              {/* Priority Filter */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowPriorityDropdown(!showPriorityDropdown)}
                  className="px-4 py-3 bg-gray-50 border-2 border-transparent rounded-lg text-left flex items-center justify-between hover:border-gray-300 focus:border-blue-500 focus:bg-white focus:shadow-md transition-all outline-none min-w-[140px]"
                >
                  <div className="flex items-center gap-2">
                    <Flag className={`w-4 h-4 ${getPriorityIconColor(filterPriority)}`} />
                    <span className="text-sm">{getPriorityLabel(filterPriority)}</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showPriorityDropdown ? 'rotate-180' : ''}`} />
                </button>
                
                {showPriorityDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-10 overflow-hidden">
                    {(['all', 'high', 'medium', 'low'] as (Priority | 'all')[]).map((priority) => (
                      <button
                        key={priority}
                        type="button"
                        onClick={() => {
                          setFilterPriority(priority);
                          setShowPriorityDropdown(false);
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-2 transition-colors"
                      >
                        <Flag className={`w-4 h-4 ${getPriorityIconColor(priority)}`} />
                        <span className="text-sm">{getPriorityLabel(priority)}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Due Date Filter */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowDueDateDropdown(!showDueDateDropdown)}
                  className="px-4 py-3 bg-gray-50 border-2 border-transparent rounded-lg text-left flex items-center justify-between hover:border-gray-300 focus:border-blue-500 focus:bg-white focus:shadow-md transition-all outline-none min-w-[140px]"
                >
                  <div className="flex items-center gap-2">
                    <Calendar className={`w-4 h-4 ${getDueDateIconColor(filterDueDate)}`} />
                    <span className="text-sm">{getDueDateLabel(filterDueDate)}</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showDueDateDropdown ? 'rotate-180' : ''}`} />
                </button>
                
                {showDueDateDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-10 overflow-hidden">
                    {(['all', 'overdue', 'today', 'tomorrow', 'this-week', 'no-date'] as DueDateFilter[]).map((dateFilter) => (
                      <button
                        key={dateFilter}
                        type="button"
                        onClick={() => {
                          setFilterDueDate(dateFilter);
                          setShowDueDateDropdown(false);
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-2 transition-colors"
                      >
                        <Calendar className={`w-4 h-4 ${getDueDateIconColor(dateFilter)}`} />
                        <span className="text-sm">{getDueDateLabel(dateFilter)}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Assignee Filter */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowAssigneeDropdown(!showAssigneeDropdown)}
                  className="px-4 py-3 bg-gray-50 border-2 border-transparent rounded-lg text-left flex items-center justify-between hover:border-gray-300 focus:border-blue-500 focus:bg-white focus:shadow-md transition-all outline-none min-w-[140px]"
                >
                  <div className="flex items-center gap-2">
                    {filterAssignee === 'all' || filterAssignee === 'unassigned' ? (
                      <UserIcon className="w-4 h-4 text-gray-600" />
                    ) : (
                      <img
                        src={mockUsers.find(u => u.id === filterAssignee)?.avatar}
                        alt="Assignee"
                        className="w-4 h-4 rounded-full"
                      />
                    )}
                    <span className="text-sm">{getAssigneeLabel(filterAssignee, mockUsers)}</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showAssigneeDropdown ? 'rotate-180' : ''}`} />
                </button>
                
                {showAssigneeDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-10 overflow-hidden max-h-64 overflow-y-auto">
                    <button
                      type="button"
                      onClick={() => {
                        setFilterAssignee('all');
                        setShowAssigneeDropdown(false);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-2 transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-gray-600" />
                      <span className="text-sm">All Members</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setFilterAssignee('unassigned');
                        setShowAssigneeDropdown(false);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-2 transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">Unassigned</span>
                    </button>
                    {mockUsers.map((teamMember) => (
                      <button
                        key={teamMember.id}
                        type="button"
                        onClick={() => {
                          setFilterAssignee(teamMember.id);
                          setShowAssigneeDropdown(false);
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-2 transition-colors"
                      >
                        <img
                          src={teamMember.avatar}
                          alt={teamMember.name}
                          className="w-4 h-4 rounded-full"
                        />
                        <span className="text-sm">{teamMember.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="bg-gray-50 p-6">
        <div className="w-full">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <div className="flex gap-6 overflow-x-auto pb-6">
              {board.columns
                .sort((a, b) => a.order - b.order)
                .map((column) => {
                  const filteredTasks = getFilteredTasks(column.tasks);
                  return (
                    <KanbanColumn
                      key={column.id}
                      column={column}
                      tasks={filteredTasks}
                      onTaskClick={handleTaskClick}
                      onAddTask={handleAddTask}
                      onEditColumn={handleEditColumn}
                      onDeleteColumn={handleDeleteColumn}
                    />
                  );
                })}

              {/* Add Column */}
              <div className="flex-shrink-0 w-80">
                {showAddColumn ? (
                  <div className="bg-white rounded-lg shadow-md p-4">
                    <form onSubmit={handleAddColumn} className="space-y-3">
                      <input
                        type="text"
                        value={newColumnTitle}
                        onChange={(e) => setNewColumnTitle(e.target.value)}
                        placeholder="Enter column title"
                        className="w-full px-3 py-2 bg-gray-50 rounded-lg hover:border-gray-300 focus:ring-2 focus:ring-blue-500 focus:bg-white focus:shadow-md transition-all outline-none"
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          className="px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-semibold rounded-md shadow-lg hover:shadow-xl transition-all duration-200  whitespace-nowrap"
                        >
                          Add Column
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowAddColumn(false);
                            setNewColumnTitle('');
                          }}
                          className="px-4 py-3 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold transition-all duration-200  text-sm whitespace-nowrap"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowAddColumn(true)}
                    className="w-full h-fit p-6 text-base bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-gray-600 shadow-md hover:shadow-lg"
                  >
                    <Plus className="h-5 w-5 mr-2 inline" />
                    Add another list
                  </button>
                )}
              </div>
            </div>

            <DragOverlay>
              {activeTask ? (
                <TaskCard task={activeTask} onClick={() => {}} />
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          isOpen={showTaskModal}
          onClose={() => {
            setShowTaskModal(false);
            setSelectedTask(null);
          }}
          onUpdate={handleTaskUpdate}
          onDelete={handleTaskDelete}
          boardId={boardId!}
        />
      )}

      {/* Backdrop to close dropdowns */}
      {(showPriorityDropdown || showDueDateDropdown || showAssigneeDropdown) && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => {
            setShowPriorityDropdown(false);
            setShowDueDateDropdown(false);
            setShowAssigneeDropdown(false);
          }}
        />
      )}
    </div>
  );
};

export default BoardDetail; 
import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { Column, Task, CreateTaskData } from '../../types';
import TaskCard from './TaskCard';
import AddTaskModal from './AddTaskModal';
import { Plus, MoreHorizontal, Edit, Trash2,} from 'lucide-react';

interface KanbanColumnProps {
  column: Column;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onAddTask: (columnId: string, taskData: CreateTaskData) => void;
  onEditColumn: (columnId: string, title: string) => void;
  onDeleteColumn: (columnId: string) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  column,
  tasks,
  onTaskClick,
  onAddTask,
  onEditColumn,
  onDeleteColumn,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(column.title);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);

  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  const handleEditSubmit = () => {
    if (editTitle.trim() && editTitle !== column.title) {
      onEditColumn(column.id, editTitle.trim());
    } else {
      setEditTitle(column.title);
    }
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setEditTitle(column.title);
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEditSubmit();
    } else if (e.key === 'Escape') {
      handleEditCancel();
    }
  };

  const handleAddTask = (taskData: CreateTaskData) => {
    onAddTask(column.id, taskData);
  };

  const handleDeleteColumn = () => {
    if (window.confirm(`Are you sure you want to delete the "${column.title}" column? All tasks in this column will be deleted.`)) {
      onDeleteColumn(column.id);
    }
    setShowDropdown(false);
  };

  return (
    <>
      <div className="flex-shrink-0 w-full sm:w-80">
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 h-fit">
          {/* Column Header */}
          <div className="p-6 pb-4">
            <div className="flex items-center justify-between">
              {isEditing ? (
                <div className="flex items-center gap-2 w-full">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onKeyDown={handleKeyPress}
                    onBlur={handleEditSubmit}
                    className="flex-1 px-3 py-2 text-base font-semibold border border-gray-300 rounded-lg bg-gray-100 min-w-0"
                    autoFocus
                  />
                  <button
                    onClick={handleEditSubmit}
                    className="px-2 py-2 bg-gray-800 text-white text-xs font-medium rounded-lg hover:bg-gray-900 transition-colors whitespace-nowrap"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">{column.title}</h3>
                    <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full font-medium">
                      {tasks.length}
                    </span>
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => setShowDropdown(!showDropdown)}
                      className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                    {showDropdown && (
                      <div className="absolute right-0 top-8 bg-white rounded-lg shadow-xl py-1 z-10 min-w-[120px]">
                        <button
                          onClick={() => {
                            setIsEditing(true);
                            setShowDropdown(false);
                          }}
                          className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                        >
                          <Edit className="h-4 w-4" />
                          Edit
                        </button>
                        <button
                          onClick={handleDeleteColumn}
                          className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Tasks Container */}
          <div
            ref={setNodeRef}
            className="px-6 pb-6 space-y-4"
          >
            <SortableContext items={tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onClick={() => onTaskClick(task)}
                />
              ))}
            </SortableContext>

            {/* Add Task Button */}
            <button
              onClick={() => setShowAddTaskModal(true)}
              className="w-full flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors text-sm justify-start"
            >
              <Plus className="h-4 w-4" />
              Add a card
            </button>
          </div>
        </div>
      </div>

      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={showAddTaskModal}
        onClose={() => setShowAddTaskModal(false)}
        onAddTask={handleAddTask}
        columnTitle={column.title}
      />
    </>
  );
};

export default KanbanColumn; 
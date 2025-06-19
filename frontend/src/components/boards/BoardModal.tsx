import React from 'react';
import type { CreateBoardData } from '../../types';
import { Plus, Edit3, Kanban } from 'lucide-react';

interface BoardModalProps {
  isOpen: boolean;
  isEditMode: boolean;
  formData: CreateBoardData;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (data: CreateBoardData) => void;
}

const BoardModal: React.FC<BoardModalProps> = ({
  isOpen,
  isEditMode,
  formData,
  onClose,
  onSubmit,
  onChange,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-[2px] bg-opacity-40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 border border-gray-100">
        {/* Modal Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
            <Kanban className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">
              {isEditMode ? 'Edit Board' : 'Create New Board'}
            </h3>
            <p className="text-gray-600 mt-1">
              {isEditMode ? 'Update your board details' : 'Set up a new workspace for your team'}
            </p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label htmlFor="boardName" className="block text-sm font-semibold text-gray-700 mb-3">
              Board Name *
            </label>
            <input
              type="text"
              id="boardName"
              value={formData.name}
              onChange={(e) => onChange({ ...formData, name: e.target.value })}
              className="w-full px-4 py-4 bg-gray-50 border-2 border-transparent rounded-xl hover:border-gray-300 focus:ring-0 focus:border-blue-500 focus:bg-white transition-all text-base placeholder-gray-400 outline-none"
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
              value={formData.description}
              onChange={(e) => onChange({ ...formData, description: e.target.value })}
              className="w-full px-4 py-4 bg-gray-50 border-2 border-transparent rounded-xl hover:border-gray-300 focus:ring-0 focus:border-blue-500 focus:bg-white transition-all text-base placeholder-gray-400 resize-none outline-none"
              placeholder="Brief description of what this board will be used for..."
              rows={4}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-8 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-all duration-200 hover:scale-105 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 flex items-center gap-2 cursor-pointer"
            >
              {isEditMode ? (
                <>
                  <Edit3 className="w-4 h-4" />
                  Update Board
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Create Board
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BoardModal; 
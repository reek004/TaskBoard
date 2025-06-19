import type { Board, Task, Column, User, Comment, CreateBoardData, CreateTaskData, CreateColumnData } from '../types';

// Mock users
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=3b82f6&color=fff',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=10b981&color=fff',
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Bob+Johnson&background=f59e0b&color=fff',
  },
];

// Mock data for initial boards
const mockBoards: Board[] = [
  {
    id: '1',
    name: 'Website Redesign',
    description: 'Complete redesign of company website',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
    teamMembers: mockUsers,
    owner: mockUsers[0],
    columns: [
      {
        id: 'col-1',
        title: 'To Do',
        order: 0,
        tasks: [
          {
            id: 'task-1',
            title: 'Design new homepage layout',
            description: '# Homepage Design\n\nCreate a modern, responsive layout for the homepage that includes:\n- Hero section\n- Feature highlights\n- Testimonials\n- CTA sections',
            priority: 'high',
            assignees: [mockUsers[0], mockUsers[1]],
            creator: mockUsers[0],
            dueDate: new Date('2024-02-01'),
            createdAt: new Date('2024-01-15'),
            updatedAt: new Date('2024-01-15'),
            comments: [],
            attachments: [],
          },
          {
            id: 'task-2',
            title: 'Setup development environment',
            description: 'Configure development tools and environments for the project.',
            priority: 'medium',
            assignees: [mockUsers[2]],
            creator: mockUsers[1],
            createdAt: new Date('2024-01-16'),
            updatedAt: new Date('2024-01-16'),
            comments: [],
            attachments: [],
          },
        ],
      },
      {
        id: 'col-2',
        title: 'In Progress',
        order: 1,
        tasks: [
          {
            id: 'task-3',
            title: 'Implement navigation component',
            description: 'Build responsive navigation with mobile menu support.',
            priority: 'high',
            assignees: [mockUsers[1]],
            creator: mockUsers[0],
            dueDate: new Date('2024-01-25'),
            createdAt: new Date('2024-01-17'),
            updatedAt: new Date('2024-01-20'),
            comments: [],
            attachments: [],
          },
        ],
      },
      {
        id: 'col-3',
        title: 'Done',
        order: 2,
        tasks: [
          {
            id: 'task-4',
            title: 'Project planning meeting',
            description: 'Initial project planning and requirement gathering.',
            priority: 'medium',
            assignees: mockUsers,
            creator: mockUsers[0],
            createdAt: new Date('2024-01-10'),
            updatedAt: new Date('2024-01-15'),
            comments: [],
            attachments: [],
          },
        ],
      },
    ],
  },
  {
    id: '2',
    name: 'Mobile App Development',
    description: 'iOS and Android app development',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-18'),
    teamMembers: [mockUsers[0], mockUsers[2]],
    owner: mockUsers[1],
    columns: [
      {
        id: 'col-4',
        title: 'To Do',
        order: 0,
        tasks: [
          {
            id: 'task-5',
            title: 'User authentication flow',
            description: 'Implement login, signup, and password reset functionality.',
            priority: 'high',
            assignees: [mockUsers[0]],
            creator: mockUsers[1],
            dueDate: new Date('2024-02-05'),
            createdAt: new Date('2024-01-12'),
            updatedAt: new Date('2024-01-12'),
            comments: [],
            attachments: [],
          },
        ],
      },
      {
        id: 'col-5',
        title: 'In Progress',
        order: 1,
        tasks: [],
      },
      {
        id: 'col-6',
        title: 'Done',
        order: 2,
        tasks: [],
      }
    ],
  },
];

// Data storage utilities
const BOARDS_KEY = 'taskboard_boards';
const NEXT_ID_KEY = 'taskboard_next_id';

export const initializeData = () => {
  console.log('🔧 Initializing data...');
  const existingBoards = localStorage.getItem(BOARDS_KEY);
  const existingNextId = localStorage.getItem(NEXT_ID_KEY);
  
  console.log('📦 Existing boards in localStorage:', existingBoards ? 'Found' : 'Not found');
  console.log('🔢 Existing next ID in localStorage:', existingNextId);
  
  if (!existingBoards) {
    console.log('💾 Setting initial mock boards to localStorage');
    localStorage.setItem(BOARDS_KEY, JSON.stringify(mockBoards));
    console.log('✅ Mock boards saved. Count:', mockBoards.length);
  }
  if (!existingNextId) {
    console.log('💾 Setting initial next ID to localStorage');
    localStorage.setItem(NEXT_ID_KEY, '1000');
  }
  
  // Verify the data was saved
  const verifyBoards = localStorage.getItem(BOARDS_KEY);
  console.log('🔍 Verification - boards in localStorage:', verifyBoards ? 'Present' : 'Missing');
  if (verifyBoards) {
    try {
      const parsed = JSON.parse(verifyBoards);
      console.log('🔍 Verification - parsed boards count:', parsed.length);
    } catch (e) {
      console.error('❌ Error parsing boards:', e);
    }
  }
};

export const getNextId = (): string => {
  const currentId = parseInt(localStorage.getItem(NEXT_ID_KEY) || '1000');
  const nextId = currentId + 1;
  localStorage.setItem(NEXT_ID_KEY, nextId.toString());
  return nextId.toString();
};

export const getBoards = (): Board[] => {
  console.log('📋 Getting boards from localStorage...');
  const boards = localStorage.getItem(BOARDS_KEY);
  console.log('📦 Raw boards data:', boards ? 'Found' : 'Not found');
  
  if (boards) {
    try {
      const parsed = JSON.parse(boards);
      console.log('✅ Successfully parsed boards. Count:', parsed.length);
      const processedBoards = parsed.map((board: any) => ({
        ...board,
        createdAt: new Date(board.createdAt),
        updatedAt: new Date(board.updatedAt),
        columns: board.columns.map((col: any) => ({
          ...col,
          tasks: col.tasks.map((task: any) => ({
            ...task,
            createdAt: new Date(task.createdAt),
            updatedAt: new Date(task.updatedAt),
            dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
          })),
        })),
      }));
      console.log('🔄 Processed boards count:', processedBoards.length);
      return processedBoards;
    } catch (e) {
      console.error('❌ Error parsing boards from localStorage:', e);
      return [];
    }
  }
  console.log('⚠️ No boards found in localStorage, returning empty array');
  return [];
};

export const saveBoards = (boards: Board[]) => {
  localStorage.setItem(BOARDS_KEY, JSON.stringify(boards));
};

export const getBoardById = (id: string): Board | undefined => {
  const boards = getBoards();
  return boards.find(board => board.id === id);
};

export const createBoard = (data: CreateBoardData, owner: User): Board => {
  const newBoard: Board = {
    id: getNextId(),
    name: data.name,
    description: data.description,
    createdAt: new Date(),
    updatedAt: new Date(),
    teamMembers: [owner],
    owner,
    columns: [
      {
        id: getNextId(),
        title: 'To Do',
        order: 0,
        tasks: [],
      },
      {
        id: getNextId(),
        title: 'In Progress',
        order: 1,
        tasks: [],
      },
      {
        id: getNextId(),
        title: 'Done',
        order: 2,
        tasks: [],
      },
    ],
  };

  const boards = getBoards();
  boards.push(newBoard);
  saveBoards(boards);
  return newBoard;
};

export const updateBoard = (id: string, updates: Partial<Board>): Board | null => {
  const boards = getBoards();
  const boardIndex = boards.findIndex(board => board.id === id);
  
  if (boardIndex === -1) return null;
  
  boards[boardIndex] = { ...boards[boardIndex], ...updates, updatedAt: new Date() };
  saveBoards(boards);
  return boards[boardIndex];
};

export const deleteBoard = (id: string): boolean => {
  const boards = getBoards();
  const filteredBoards = boards.filter(board => board.id !== id);
  
  if (filteredBoards.length === boards.length) return false;
  
  saveBoards(filteredBoards);
  return true;
};

export const createColumn = (boardId: string, data: CreateColumnData): Column | null => {
  const boards = getBoards();
  const board = boards.find(b => b.id === boardId);
  
  if (!board) return null;
  
  const newColumn: Column = {
    id: getNextId(),
    title: data.title,
    order: board.columns.length,
    tasks: [],
  };
  
  board.columns.push(newColumn);
  board.updatedAt = new Date();
  saveBoards(boards);
  return newColumn;
};

export const updateColumn = (boardId: string, columnId: string, updates: Partial<Column>): Column | null => {
  const boards = getBoards();
  const board = boards.find(b => b.id === boardId);
  
  if (!board) return null;
  
  const columnIndex = board.columns.findIndex(col => col.id === columnId);
  if (columnIndex === -1) return null;
  
  board.columns[columnIndex] = { ...board.columns[columnIndex], ...updates };
  board.updatedAt = new Date();
  saveBoards(boards);
  return board.columns[columnIndex];
};

export const deleteColumn = (boardId: string, columnId: string): boolean => {
  const boards = getBoards();
  const board = boards.find(b => b.id === boardId);
  
  if (!board) return false;
  
  const originalLength = board.columns.length;
  board.columns = board.columns.filter(col => col.id !== columnId);
  
  if (board.columns.length === originalLength) return false;
  
  // Reorder remaining columns
  board.columns.forEach((col, index) => {
    col.order = index;
  });
  
  board.updatedAt = new Date();
  saveBoards(boards);
  return true;
};

export const createTask = (boardId: string, columnId: string, data: CreateTaskData, creator: User): Task | null => {
  const boards = getBoards();
  const board = boards.find(b => b.id === boardId);
  
  if (!board) return null;
  
  const column = board.columns.find(col => col.id === columnId);
  if (!column) return null;
  
  const newTask: Task = {
    id: getNextId(),
    title: data.title,
    description: data.description || '',
    priority: data.priority,
    assignees: data.assignees,
    creator: creator,
    dueDate: data.dueDate,
    createdAt: new Date(),
    updatedAt: new Date(),
    comments: [],
    attachments: [],
  };
  
  column.tasks.push(newTask);
  board.updatedAt = new Date();
  saveBoards(boards);
  return newTask;
};

export const updateTask = (boardId: string, taskId: string, updates: Partial<Task>): Task | null => {
  const boards = getBoards();
  const board = boards.find(b => b.id === boardId);
  
  if (!board) return null;
  
  for (const column of board.columns) {
    const taskIndex = column.tasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
      column.tasks[taskIndex] = { 
        ...column.tasks[taskIndex], 
        ...updates, 
        updatedAt: new Date() 
      };
      board.updatedAt = new Date();
      saveBoards(boards);
      return column.tasks[taskIndex];
    }
  }
  
  return null;
};

export const deleteTask = (boardId: string, taskId: string): boolean => {
  const boards = getBoards();
  const board = boards.find(b => b.id === boardId);
  
  if (!board) return false;
  
  for (const column of board.columns) {
    const originalLength = column.tasks.length;
    column.tasks = column.tasks.filter(task => task.id !== taskId);
    
    if (column.tasks.length !== originalLength) {
      board.updatedAt = new Date();
      saveBoards(boards);
      return true;
    }
  }
  
  return false;
};

export const moveTask = (boardId: string, taskId: string, sourceColumnId: string, targetColumnId: string, targetIndex: number): boolean => {
  const boards = getBoards();
  const board = boards.find(b => b.id === boardId);
  
  if (!board) return false;
  
  const sourceColumn = board.columns.find(col => col.id === sourceColumnId);
  const targetColumn = board.columns.find(col => col.id === targetColumnId);
  
  if (!sourceColumn || !targetColumn) return false;
  
  const taskIndex = sourceColumn.tasks.findIndex(task => task.id === taskId);
  if (taskIndex === -1) return false;
  
  const [task] = sourceColumn.tasks.splice(taskIndex, 1);
  targetColumn.tasks.splice(targetIndex, 0, task);
  
  board.updatedAt = new Date();
  saveBoards(boards);
  return true;
};

export const addComment = (boardId: string, taskId: string, text: string, author: User): Comment | null => {
  const boards = getBoards();
  const board = boards.find(b => b.id === boardId);
  
  if (!board) return null;
  
  for (const column of board.columns) {
    const task = column.tasks.find(t => t.id === taskId);
    if (task) {
      const newComment: Comment = {
        id: getNextId(),
        text: text.trim(),
        author: author,
        createdAt: new Date(),
      };
      
      task.comments.push(newComment);
      task.updatedAt = new Date();
      board.updatedAt = new Date();
      saveBoards(boards);
      return newComment;
    }
  }
  
  return null;
}; 
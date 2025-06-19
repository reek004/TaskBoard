export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  }
  
  export interface Task {
    id: string;
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    assignees: User[];
    dueDate?: Date;
    createdAt: Date;
    updatedAt: Date;
    comments: Comment[];
    attachments: string[];
    tags?: string[];
  }
  
  export interface Comment {
    id: string;
    text: string;
    author: User;
    createdAt: Date;
  }
  
  export interface Column {
    id: string;
    title: string;
    tasks: Task[];
    order: number;
  }
  
  export interface Board {
    id: string;
    name: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
    teamMembers: User[];
    columns: Column[];
    owner: User;
  }
  
  export interface AuthUser {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  }
  
  export interface AuthState {
    user: AuthUser | null;
    isAuthenticated: boolean;
    loading: boolean;
  }
  
  export type Priority = 'low' | 'medium' | 'high';
  
  export interface CreateTaskData {
    title: string;
    description?: string;
    priority: Priority;
    assignees: string[];
    dueDate?: Date;
  }
  
  export interface CreateBoardData {
    name: string;
    description?: string;
  }
  
  export interface CreateColumnData {
    title: string;
  } 
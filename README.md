# TaskBoard application assignment : Emitrr

A modern, responsive task management application built with React, TypeScript, and Tailwind CSS. This frontend application provides a comprehensive kanban board interface for team collaboration and project management.

## 🚀 Live Demo
This project is deployed and available at: [Live Link](https://task-board-omega-five.vercel.app)



## 🚀 Features

### 🔐 Authentication System (Mock Implementation)
- **Mock Login**: Basic login form that accepts any email/password combination
- **Mock Registration**: User signup with name, email, and password (no validation)
- **Local Storage Session**: User session stored in browser's local storage
- **Protected Routes**: Automatic redirection for unauthenticated users
- **Basic Profile**: Auto-generated user profiles with avatar from email/name
- **⚠️ Note**: This is a frontend-only demo with no real authentication, password hashing, or backend validation

### 📋 Board Management
- **Create Boards**: Set up new project boards with custom names and descriptions
- **Board Overview**: View all accessible boards in a clean grid layout
- **Board Details**: Access individual board views with full kanban 

### 🎯 Kanban Board Interface
- **Drag & Drop**: Intuitive task movement between columns using @dnd-kit
- **Custom Columns**: Create, edit, and organize workflow columns
- **Column Management**: Reorder columns to match your workflow
- **Visual Status Tracking**: Clear visual representation of task progress

### ✅ Task Management
- **Create Tasks**: Add new tasks with rich details and metadata
- **Task Details**: Comprehensive task view with full information
- **Priority Levels**: Set task priorities (Low, Medium, High) with visual indicators
- **Due Dates**: Schedule tasks with date-based organization
- **Task Assignment**: Assign tasks to team members
- **Task Comments**: Add comments and notes for collaboration
- **File Attachments**: Attach files and documents to tasks
- **Tags System**: Organize tasks with custom tags

### 👥 User & Team Features
- **Team Members**: Add and manage board collaborators
- **User Assignment**: Assign multiple users to tasks

### 🎨 User Interface
- **Modern Design**: Clean, professional interface built with Tailwind CSS
- **Responsive Layout**: Optimized for desktop, tablet, and mobile devices
- **Dark/Light Theme**: Adaptive color scheme
- **Intuitive Navigation**: User-friendly routing with React Router
- **Loading States**: Smooth loading indicators and transitions
- **Error Handling**: Graceful error states and user feedback

### 🔧 Technical Features
- **TypeScript**: Full type safety and enhanced developer experience
- **React 19**: Latest React features and performance optimizations
- **Vite**: Fast development server and optimized builds
- **Component Architecture**: Modular, reusable component design
- **Context API**: Centralized state management for authentication
- **Local Storage**: Persistent data storage for offline capability
- **ESLint**: Code quality and consistency enforcement

## 🛠 Technology Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 4.x
- **Drag & Drop**: @dnd-kit/core, @dnd-kit/sortable
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Markdown**: react-markdown for rich text rendering

## 🏃‍♂️ Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

### Development Server
The application will be available at `http://localhost:5173` when running in development mode.

## 📁 Project Structure
```
src/
├── components/          # React components
│   ├── auth/           # Authentication components
│   ├── boards/         # Board management components
│   ├── kanban/         # Kanban board components
│   ├── common/         # Shared components
│   └── ui/             # UI components
├── context/            # React context providers
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── App.tsx            # Main application component
```

## 🚀 Deployment
This project is configured for deployment on Vercel with the included `vercel.json` configuration file.

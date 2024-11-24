# Kanban Project Management

---

## Overview
KanbanPemWebAPI is a backend project designed to manage tasks in a Kanban-style project management system. This API supports task creation, updating, and status tracking, and is suitable for integration with frontend applications.

## Getting Started

### Prerequisites
Before cloning and running this application, ensure the following are installed on your system:
- Node.js (Version 16.x or later recommended)
- npm (Node Package Manager, included with Node.js)
- Git (for cloning the repository)

### Cloning the Repository
1. Open your terminal or command prompt.
2. Run the following command to clone the repository
```
git clone https://github.com/iZcy/KanbanPemWebAPI.git
```
3. Navigate to the project directory:
```
cd KanbanPemWebAPI
```

### Installing Dependencies
To install the required packages:
```
npm install
```

### Configuration
Ensure the environment is properly configured. Example of ```.env``` configuration:
```
NODE_ENV="development"
PORT=3500
DB_URI="{Redacted}"
```

### Running the Application
1. Start the development server:
```
npm run dev
```
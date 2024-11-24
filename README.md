# Kanban Project Management API

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

### Accessing Endpoint
The API will run on ```http://localhost:3500``` by default (or the port specified in the ```.env``` file). Open this URL in your browser or test endpoints using tools like Postman or ```curl```.

## API Endpoints
1. ```/auth```: Authenticate and access their boards.
2. ```/board```: Manage top-level project boards.
3. ```/list```: Organize workflow stages using
4. ```/card```: Manage tasks.
5. ```/comment```: Collaborate through task-related comments.

## Project Structure
```
KanbanPemWebAPI/
│  
├── api/                
│   ├── controllers/    # Handles API request/response logic
│   ├── helper/         # Reusable utility functions
│   ├── logs/           # Stores application logs
│   ├── middleware/     # Middleware functions for validation and authentication
│   ├── models/         # Database schema definitions
│   └── routes/         # Maps API routes to controllers
│
└── index.js            # Main entry point for the application

```

## Credits
1. [Yitzhak](https://github.com/iZcy)
2. [Ovie](https://github.com/Khairazzz)
3. [Abe](https://github.com/abeputra)
4. [Fawwaz](https://github.com/sulaimanfawwazak)
5. [Nibroos Aurore Majiid Haryanto (22/494882/TK/54329)](https://github.com/potreic)
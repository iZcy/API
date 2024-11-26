# 📋 Kanban Board Management Back-End Source Code 🚀

## 🌟 Overview
KanbanPemWebAPI is a powerful backend solution designed to revolutionize project management through an intuitive Kanban-style workflow. This robust API empowers teams to:
- 🔄 Track task progress seamlessly
- 📊 Manage project boards with ease
- 💬 Collaborate through integrated commenting systems
- 🔒 Secure authentication and access control

## 🛠 Getting Started

### 📋 Prerequisites
Ensure your development environment is equipped with:
- 🟢 Node.js (Version 16.x or later recommended)
- 📦 npm (Node Package Manager, bundled with Node.js)
- 🌐 Git (for repository cloning and version control)

### 🚀 Quick Setup

#### 1. Clone the Repository
```bash
# Clone with HTTPS
git clone https://github.com/iZcy/KanbanPemWebAPI.git
```
```
# Navigate to project directory
cd KanbanPemWebAPI
```

#### 2. Install Dependencies
```bash
# Install all required packages
npm install
```

#### 3. Configuration Magic ✨
Create a `.env` file with the following configuration:
```env
# Environment Settings
NODE_ENV="development"

# Server Configuration
PORT=3500

# Database Connection
DB_URI="{Your Secure Database URI}"
```

#### 4. Launch the Application
```bash
# Start development server
npm run dev
```

## 🌐 API Endpoint Playground

### Authentication 🔐
- `/auth`: Secure user authentication and board access

### Project Management 📈
- `/board`: Create, update, and manage project boards
- `/list`: Define and organize workflow stages
- `/card`: Comprehensive task management
- `/comment`: Team collaboration through task comments

## 🗂 Intelligent Project Structure
```
KanbanPemWebAPI/
│
├── api/                
│   ├── controllers/    # 🧠 Smart request handling
│   ├── helper/         # 🛠 Utility toolbox
│   ├── logs/           # 📝 Application logging
│   ├── middleware/     # 🚧 Validation & security
│   ├── models/         # 📊 Data schema definitions
│   └── routes/         # 🗺 API route mapping
│
└── index.js            # 🚪 Application entry point
```

## 🤝 Meet the Innovators

### Core Development Team
1. 👨‍💻 [Yitzhak Edmund Tio Manalu](https://github.com/iZcy)
2. 👩‍💻 [Ovie Khaira Zayyan](https://github.com/Khairazzz)
3. 👨‍💻 [⁠Emir Abe Putra Agastha](https://github.com/abeputra)
4. 👨‍💻 [Sulaiman Fawwaz Abdillah Karim](https://github.com/sulaimanfawwazak)
5. 👩‍💻 [Nibroos Aurore Majiid Haryanto](https://github.com/potreic)

## 🆘 Support
For questions, issues, or collaboration, please [open an issue](https://github.com/iZcy/KanbanPemWebAPI/issues) or contact the maintainers.

## 🌟 Wanna See the Sunny Part?
Here's our [interface code](https://github.com/iZcy/KanbanPemWebInterface)

## 🎥 Project Video
[Watch our presentation and explanation](https://drive.google.com/drive/folders/1OH5PfHBzO9_7NqgYZbYJSbeO8D3T9Fs4?usp=sharing)

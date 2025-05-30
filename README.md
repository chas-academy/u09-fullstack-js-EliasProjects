[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/k7YdU7jd)

# Task Management System

A full-stack task management application built with React.js and Node.js, featuring team collaboration, task tracking, and real-time updates.

## Features

- User authentication and authorization
- Task creation, assignment, and tracking
- Team collaboration and management
- Real-time updates
- Responsive design
- Admin dashboard
- Search functionality
- Role-based access control

## Tech Stack

### Frontend
- React.js
- Material-UI
- Redux Toolkit
- React Router
- Axios
- PWA support

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Socket.io (for real-time features)

## Project Structure

```
task-management-system/
├── frontend/           # React frontend application
├── backend/           # Node.js backend application
└── README.md         # Project documentation
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. Set up environment variables:
   - Create `.env` files in both frontend and backend directories
   - Configure necessary environment variables

4. Start the development servers:
   ```bash
   # Start backend server
   cd backend
   npm run dev

   # Start frontend server
   cd ../frontend
   npm start
   ```

## API Documentation

API documentation is available via Insomnia. Import the `insomnia-collection.json` file to view all available endpoints.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License.

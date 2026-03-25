# Codev-Play

A collection of classic mini games built for developers to practice full-stack development skills. This monorepo contains both backend and frontend implementations of various games.

## Games Collection

- **Pac-Man** - Classic arcade maze chase game
- **Rock Paper Scissors** - Traditional hand game with online multiplayer
- **Chess** - Strategic board game with real-time gameplay
- **Tic-Tac-Toe** - Classic X and O grid game
- **Snake** - Navigate and grow your snake
- **Connect Four** - Drop pieces to connect four in a row
- **Tetris** - Stack falling blocks to clear lines
- **Pong** - Classic two-player paddle game
- **Minesweeper** - Logic-based puzzle game
- **Memory Match** - Card matching memory game

## Project Structure

```
codev-play/
├── backend/          # Node.js + Express API
│   ├── src/
│   ├── package.json
│   └── TASK.md      # Backend implementation tasks
├── frontend/         # Next.js + React UI
│   ├── src/
│   ├── package.json
│   └── TASK.md      # Frontend implementation tasks
└── README.md
```

## Technology Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **CORS** - Cross-origin resource sharing
- **Socket.io** (to be added) - Real-time communication

### Frontend
- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React** - UI library

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

The backend API will run on `http://localhost:5000`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on `http://localhost:4000`

## Development Workflow

Each game implementation is tracked in the respective `TASK.md` files in the backend and frontend folders. These files contain step-by-step tickets for implementing each game feature.

### Task Management
1. Check `backend/TASK.md` and `frontend/TASK.md` for available tasks
2. Pick a task to work on
3. Implement the feature
4. Test thoroughly
5. Mark task as complete

## Learning Goals

This project helps developers practice:
- RESTful API design
- Real-time communication with WebSockets
- State management
- Game logic implementation
- TypeScript development
- Full-stack integration
- Testing strategies
- UI/UX design

## Contributing

This is a practice project for developers to learn and experiment. Feel free to:
- Implement games from the task list
- Add new games
- Improve existing implementations
- Write tests
- Enhance documentation

## License

MIT

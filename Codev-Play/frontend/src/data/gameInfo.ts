type Game = {
  name: string;
  image: string;
  description: string;
  genre: string[];
  howToPlay: string;
};

export const gameInfo: Record<string, Game> = {
  pacman: {
    name: "Pacman",
    image: "/pacman.png",
    description:
      "Eat an infinite number of dots in underwater mazes while avoiding the sea creatures that want to stop you! Gobble up the power stars to turn the tables and eat the creatures instead. It's classic arcade dot munching action!",
    genre: ["Action & Adventure", "Classics"],
    howToPlay:
      "Use arrow keys to navigate Pacman through the maze and collect all the pellets!",
  },
  chess: {
    name: "Chess",
    image: "/chess.png",
    description:
      "Engage in the timeless battle of wits in Chess, the strategic game of kings and queens. Move your pieces across the board to control territory, plan attacks, and outsmart your opponent. Every move matters as you seek to protect your king while capturing the enemy's. Test your foresight, patience, and tactical thinking in this classic game that has challenged minds for centuries.",
    genre: ["Strategy", "Classics"],
    howToPlay:
      "Use your mouse to select and move pieces. Follow chess rules to capture the opponent’s pieces and checkmate the king.",
  },
  tictactoe: {
    name: "Tictactoe",
    image: "/tictactoe.png",
    description:
      "Step into the world of Tictactoe, the simple yet cunning game of Xs and Os. Plan your moves carefully on a 3x3 grid as you attempt to align three marks in a row. Every choice counts, whether blocking your opponent or setting up your victory. A game that’s quick to play but full of strategic potential, perfect for honing your mind and challenging friends in casual duels.",
    genre: ["Strategy", "Casuals"],
    howToPlay:
      "Click on an empty cell to place your X or O. Align three marks in a row to win.",
  },
  tetris: {
    name: "Tetris",
    image: "/tetris.png",
    description:
      "Dive into the fast-paced world of Tetris, where falling blocks challenge your reflexes and strategy. Rotate and position each tetromino to complete horizontal lines before the stack reaches the top. The pace quickens as you progress, testing your speed, precision, and planning. It’s an addictive puzzle experience that has captivated players around the globe for decades, offering endless opportunities to beat your high score.",
    genre: ["Puzzle", "Arcade"],
    howToPlay:
      "Use arrow keys to move and rotate the blocks. Complete horizontal lines to clear them and score points.",
  },
  snake: {
    name: "Snake",
    image: "/snake.png",
    description:
      "Take control of the ever-growing Snake in this classic arcade challenge. Navigate through tight corridors and open spaces, consuming apples to grow longer while avoiding collisions with walls and your own tail. Each bite makes the snake more powerful but also more dangerous to maneuver. Test your timing, precision, and reflexes in a game where one wrong move can end your run. Can you become the longest snake of them all?",
    genre: ["Arcade", "Survival"],
    howToPlay:
      "Use arrow keys to move the snake. Eat apples to grow longer and avoid crashing into walls or yourself.",
  },
  minesweeper: {
    name: "Minesweeper",
    image: "/minesweeper.png",
    description:
      "Enter the strategic world of Minesweeper, where logic and deduction guide every click. Uncover tiles to reveal numbers indicating how many mines surround them, and use this information to clear the board safely. One wrong step triggers an explosion, ending your game. Challenge your analytical skills and patience as you carefully plan every move, balancing risk and reward in this classic puzzle game that has tested players for generations.",
    genre: ["Puzzle", "Strategy"],
    howToPlay:
      "Click on tiles to reveal them. Use numbers to deduce where mines are located. Flag mines with right-click.",
  },
};

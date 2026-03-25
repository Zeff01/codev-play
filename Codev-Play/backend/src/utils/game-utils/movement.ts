import type { Position, Direction } from "@/types/game.type";

export function moveEntity(entity: Position[], direction: Direction): Position[] {
  const newHead: Position = { ...entity[0] };

  switch (direction) {
    case "UP":
      newHead.y -= 1;
      break;
    case "DOWN":
      newHead.y += 1;
      break;
    case "LEFT":
      newHead.x -= 1;
      break;
    case "RIGHT":
      newHead.x += 1;
      break;
  }

  return [newHead, ...entity.slice(0, -1)];
}


export interface Point {
  x: number;
  y: number;
}

export type direction = "up" | "down" | "left" | "right"; 

export interface Snake {
  head: Point;
  body: Point[];
  direction: direction;
  maxSize: number;
}

export function createSnake(x: number, y: number): Snake {
  let head = {x,y};
  let body = [] as Point[];
  let direction = "right" as direction;
  let maxSize = 4;

  return {head, body, direction, maxSize};
}

export function update(snake: Snake): Snake {
  return snake;
}

export function grow(snake: Snake): Snake {
  let newSnake = Object.assign({}, snake);
  newSnake.maxSize += 1;
  return newSnake;
}

function directionToPoint(direction: direction): Point {
  if (direction == "up") {
    return {x: 0, y: -1};
  } else if (direction == "left") {
    return {x: -1, y: 0};
  } else if (direction == "right") {
    return {x: 1, y: 0};
  } else {
    return {x: 0, y: 1}; 
  }
}

export function turn(snake: Snake, direction: direction): Snake {
  let dir = snake.direction;
  if (direction == "up" && dir != "down") {
    let newSnake = Object.assign({}, snake); 
    newSnake.direction = direction;
    return newSnake;
  } else if (direction == "down" && dir != "up") {
    let newSnake = Object.assign({}, snake); 
    newSnake.direction = direction;
    return newSnake;
  } else if (direction == "left" && dir != "right") {
    let newSnake = Object.assign({}, snake); 
    newSnake.direction = direction; 
    return newSnake;
  } else if (direction == "right" && dir != "left") {
    let newSnake = Object.assign({}, snake); 
    newSnake.direction = direction; 
    return newSnake;
  }  
  return snake;
}

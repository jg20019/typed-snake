const WIDTH = 500;
const HEIGHT = 500;
const SQUARE_SIZE = 10;

type Point = [number, number];

function collides(point: Point, otherPoints: Point[]): boolean {
  for(const otherPoint of otherPoints) {
    if (point[0] == otherPoint[0] && point[1] == otherPoint[1]) {
      return true;
    }
  }
  return false;
}

type direction = "up" | "down" | "left" | "right"; 

interface Snake {
  head: Point;
  body: Point[];
  direction: direction;
  maxSize: number;
}

function createSnake(x: number, y: number): Snake {
  let head = [x, y] as Point;
  let body = [] as Point[];
  let direction = "right" as direction;
  let maxSize = 4;

  return {head, body, direction, maxSize};
}

function hitSelf(snake: Snake): boolean {
  return collides(snake.head, snake.body);
}

function getSegments(snake: Snake): Point[] {
  return snake.body.concat([snake.head]);
}

function updateSnake(snake: Snake): Snake {
  const [dx, dy] = directionToPoint(snake.direction);
  const [x,y] = snake.head;
  const head = [x + dx, y + dy];
  const body = snake.body.concat([snake.head]);
  if (body.length > snake.maxSize) {
    body.shift();
  }
  const result = Object.assign({}, snake, {head, body});
  return result;
}

function grow(snake: Snake): Snake {
  let newSnake = Object.assign({}, snake);
  newSnake.maxSize += 1;
  return newSnake;
}

function directionToPoint(direction: direction): Point {
  if (direction == "up") {
    return [0, -1];
  } else if (direction == "left") {
    return [-1, 0];
  } else if (direction == "right") {
    return [1, 0];
  } else {
    return [0, 1];
  }
}

function turn(snake: Snake, direction: direction): Snake {
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

function generateFood(segments: Point[]): Point{
  let maxX = WIDTH / SQUARE_SIZE;
  let maxY = HEIGHT / SQUARE_SIZE;
  let x = Math.floor(Math.random() * maxX);
  let y = Math.floor(Math.random() * maxY);
  
  while(collides([x,y], segments)) {
    x = Math.floor(Math.random() * maxX);
    y = Math.floor(Math.random() * maxY);
  } 

  return [x,y]
}



interface Model {
  snake: Snake;
  food: Point;
  ctx: CanvasRenderingContext2D; 
  running: boolean;
  dt: number;
  last: number;
};

let model: Model; 

function drawBackground(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
}

function drawSnake(ctx: CanvasRenderingContext2D, snake: Snake) {
  const {head, body} = snake;
  const segments = [head].concat(body) as Point[];

  segments.forEach(([x, y]) => {
    ctx.fillStyle = "green"; 
    ctx.fillRect(x * SQUARE_SIZE, y * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
  });
}

function drawFood(ctx: CanvasRenderingContext2D, food: Point) {
  ctx.fillStyle = "red"; 
  const [x, y] = food;
  ctx.fillRect(x * SQUARE_SIZE, y * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
}

function run() {
  const app = document.getElementById("app");

  const canvas= document.createElement("canvas");
  const ctx = canvas.getContext('2d');

  canvas.width = WIDTH;
  canvas.height = HEIGHT;

  app?.appendChild(canvas);

  if (ctx) {
    const snake = createSnake(WIDTH / SQUARE_SIZE / 2, HEIGHT / SQUARE_SIZE / 2);
    const segments = getSegments(snake); 
    const food = generateFood(segments);
    model = {ctx, snake, food, last: 0, dt: 0, running: true};
    gameLoop(); 
  } else {
    console.log('Error: Failed to get context'); 
  }
}

function render(model: Model) {
  const {ctx, snake, food} = model;
  drawBackground(ctx);
  drawFood(ctx, food);
  drawSnake(ctx, snake);
}

function update(model: Model): Model {
  let snake = updateSnake(model.snake);
  const [x,y] = snake.head;

  // collision detection
  if (x * SQUARE_SIZE < 0 || x * SQUARE_SIZE >= WIDTH - SQUARE_SIZE || y * SQUARE_SIZE < 0 || y * SQUARE_SIZE >= HEIGHT - SQUARE_SIZE) {
    return Object.assign({}, model, {snake, running: false});
  } else if (hitSelf(snake)) {
    return Object.assign({}, model, {snake, running: false});
  } else if (collides(model.food, [snake.head])) {
    snake = grow(snake);
    const food = generateFood(getSegments(snake));
    return Object.assign({}, model, {snake, food});
  }
  return Object.assign({}, model, {snake});
}

document.addEventListener('keypress', function (event) {
  if (event.key == "w") {
    model.snake = turn(model.snake, "up"); 
  } else if (event.key == "a") {
    model.snake = turn(model.snake, "left"); 
  } else if (event.key == "s") {
    model.snake = turn(model.snake, "down"); 
  } else if (event.key == "d") {
    model.snake = turn(model.snake, "right"); 
  } 
});

function step(timestamp: number): Model {
  model.dt += timestamp - model.last;
  model.last = timestamp;
  if (model.dt >= 30) {
    model.dt -= 30; 
    return update(model);
  } 
  return model;
}

function gameLoop() {
  render(model);
  if (model.running) {
    requestAnimationFrame((timestamp) => {
      model = step(timestamp);
      gameLoop();
    });
  } else {
    console.log('game over');
  }
}


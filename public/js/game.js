"use strict";
var WIDTH = 500;
var HEIGHT = 500;
var SQUARE_SIZE = 10;
var game = document.getElementById("game");
var canvas = document.createElement("canvas");
var ctx = canvas.getContext('2d');
canvas.width = WIDTH;
canvas.height = HEIGHT;
game === null || game === void 0 ? void 0 : game.appendChild(canvas);
var scoreEl = document.getElementById('score');
var highScoreEl = document.getElementById('highScore');
function collides(point, otherPoints) {
    for (var _i = 0, otherPoints_1 = otherPoints; _i < otherPoints_1.length; _i++) {
        var otherPoint = otherPoints_1[_i];
        if (point[0] == otherPoint[0] && point[1] == otherPoint[1]) {
            return true;
        }
    }
    return false;
}
function createSnake(x, y) {
    var head = [x, y];
    var body = [];
    var direction = "right";
    var maxSize = 4;
    return { head: head, body: body, direction: direction, maxSize: maxSize };
}
function hitSelf(snake) {
    return collides(snake.head, snake.body);
}
function getSegments(snake) {
    return snake.body.concat([snake.head]);
}
function updateSnake(snake) {
    var _a = directionToPoint(snake.direction), dx = _a[0], dy = _a[1];
    var _b = snake.head, x = _b[0], y = _b[1];
    var head = [x + dx, y + dy];
    var body = snake.body.concat([snake.head]);
    if (body.length > snake.maxSize) {
        body.shift();
    }
    var result = Object.assign({}, snake, { head: head, body: body });
    return result;
}
function grow(snake) {
    var newSnake = Object.assign({}, snake);
    newSnake.maxSize += 1;
    return newSnake;
}
function directionToPoint(direction) {
    if (direction == "up") {
        return [0, -1];
    }
    else if (direction == "left") {
        return [-1, 0];
    }
    else if (direction == "right") {
        return [1, 0];
    }
    else {
        return [0, 1];
    }
}
function turn(snake, direction) {
    var dir = snake.direction;
    if (direction == "up" && dir != "down") {
        var newSnake = Object.assign({}, snake);
        newSnake.direction = direction;
        return newSnake;
    }
    else if (direction == "down" && dir != "up") {
        var newSnake = Object.assign({}, snake);
        newSnake.direction = direction;
        return newSnake;
    }
    else if (direction == "left" && dir != "right") {
        var newSnake = Object.assign({}, snake);
        newSnake.direction = direction;
        return newSnake;
    }
    else if (direction == "right" && dir != "left") {
        var newSnake = Object.assign({}, snake);
        newSnake.direction = direction;
        return newSnake;
    }
    return snake;
}
function generateFood(segments) {
    var maxX = (WIDTH / SQUARE_SIZE) - SQUARE_SIZE * 3;
    var maxY = (HEIGHT / SQUARE_SIZE) - SQUARE_SIZE * 3;
    var x = SQUARE_SIZE * 3 + Math.floor(Math.random() * maxX);
    var y = SQUARE_SIZE * 3 + Math.floor(Math.random() * maxY);
    while (collides([x, y], segments)) {
        x = SQUARE_SIZE * 3 + Math.floor(Math.random() * maxX);
        y = SQUARE_SIZE * 3 + Math.floor(Math.random() * maxY);
    }
    return [x, y];
}
;
var model;
function drawBackground(ctx) {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
}
function drawSnake(ctx, snake) {
    var head = snake.head, body = snake.body;
    var segments = [head].concat(body);
    segments.forEach(function (_a) {
        var x = _a[0], y = _a[1];
        ctx.fillStyle = "green";
        ctx.fillRect(x * SQUARE_SIZE, y * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
    });
}
function drawFood(ctx, food) {
    ctx.fillStyle = "red";
    var x = food[0], y = food[1];
    ctx.fillRect(x * SQUARE_SIZE, y * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
}
function initModel() {
    // Initializes model and returns true if successfully initialize
    if (ctx) {
        var snake = createSnake(WIDTH / SQUARE_SIZE / 2, HEIGHT / SQUARE_SIZE / 2);
        var segments = getSegments(snake);
        var food = generateFood(segments);
        model = { ctx: ctx, snake: snake, food: food, last: 0, dt: 0, running: true, score: 0, highScore: 0 };
        return true;
    }
    else {
        return false;
    }
}
function resetModel() {
    var snake = createSnake(WIDTH / SQUARE_SIZE / 2, HEIGHT / SQUARE_SIZE / 2);
    var segments = getSegments(snake);
    var food = generateFood(segments);
    model = Object.assign({}, model, { snake: snake, food: food, last: 0, dt: 0, running: true, score: 0 });
    return true;
}
function run() {
    if (initModel()) {
        gameLoop();
    }
    else {
        console.log('Error: Failed to get context');
    }
}
function render(model) {
    var ctx = model.ctx, snake = model.snake, food = model.food, score = model.score, highScore = model.highScore;
    drawBackground(ctx);
    if (scoreEl) {
        scoreEl.innerText = "Score: " + score;
    }
    if (highScoreEl) {
        highScoreEl.innerText = "High Score: " + highScore;
    }
    if (model.running) {
        drawFood(ctx, food);
        drawSnake(ctx, snake);
    }
    else {
        ctx.font = "40px monospace";
        ctx.textAlign = "center";
        ctx.fillStyle = "white";
        ctx.fillText("Game Over", WIDTH / 2, HEIGHT / 2);
        ctx.font = "20px monospace";
        ctx.fillText("[Press any key to place again]", WIDTH / 2, HEIGHT / 2 + 50);
    }
}
function increaseScore(model) {
    var score = model.score, highScore = model.highScore;
    var newScore = score + 1;
    var newHighScore = Math.max(newScore, highScore);
    return [newScore, newHighScore];
}
function update(model) {
    if (!model.running) {
        return model;
    }
    var snake = updateSnake(model.snake);
    var _a = snake.head, x = _a[0], y = _a[1];
    // collision detection
    if (x * SQUARE_SIZE < 0 || x * SQUARE_SIZE >= WIDTH - SQUARE_SIZE || y * SQUARE_SIZE < 0 || y * SQUARE_SIZE >= HEIGHT - SQUARE_SIZE) {
        return Object.assign({}, model, { snake: snake, running: false });
    }
    else if (hitSelf(snake)) {
        return Object.assign({}, model, { snake: snake, running: false });
    }
    else if (collides(model.food, [snake.head])) {
        snake = grow(snake);
        var _b = increaseScore(model), score = _b[0], highScore = _b[1];
        var food = generateFood(getSegments(snake));
        return Object.assign({}, model, { score: score, highScore: highScore, snake: snake, food: food });
    }
    return Object.assign({}, model, { snake: snake });
}
document.addEventListener('keypress', function (event) {
    if (!model.running) {
        resetModel();
    }
    else if (event.key == "w") {
        model.snake = turn(model.snake, "up");
    }
    else if (event.key == "a") {
        model.snake = turn(model.snake, "left");
    }
    else if (event.key == "s") {
        model.snake = turn(model.snake, "down");
    }
    else if (event.key == "d") {
        model.snake = turn(model.snake, "right");
    }
});
function step(timestamp) {
    if (model.last == 0) {
        model.dt = 0;
    }
    else {
        model.dt += timestamp - model.last;
    }
    model.last = timestamp;
    if (model.dt >= 30) {
        model.dt -= 30;
        return update(model);
    }
    return model;
}
function gameLoop() {
    render(model);
    requestAnimationFrame(function (timestamp) {
        model = step(timestamp);
        gameLoop();
    });
}

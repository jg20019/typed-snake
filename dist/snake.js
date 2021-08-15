"use strict";
exports.__esModule = true;
exports.turn = exports.grow = exports.update = exports.createSnake = void 0;
function createSnake(x, y) {
    var head = { x: x, y: y };
    var body = [];
    var direction = "right";
    var maxSize = 4;
    return { head: head, body: body, direction: direction, maxSize: maxSize };
}
exports.createSnake = createSnake;
function update(snake) {
    return snake;
}
exports.update = update;
function grow(snake) {
    var newSnake = Object.assign({}, snake);
    newSnake.maxSize += 1;
    return newSnake;
}
exports.grow = grow;
function directionToPoint(direction) {
    if (direction == "up") {
        return { x: 0, y: -1 };
    }
    else if (direction == "left") {
        return { x: -1, y: 0 };
    }
    else if (direction == "right") {
        return { x: 1, y: 0 };
    }
    else {
        return { x: 0, y: 1 };
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
exports.turn = turn;

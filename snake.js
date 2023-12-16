class Snake {
	constructor(x, y, size, speed) {
		this.x = x;
		this.y = y;
		this.size = size;
		this.tail = [{ x: x, y: y }];
		this.moveY = 1;
		this.moveX = 0;
		this.speed = speed;
	}
	append() {
		let newHead;
		if (this.moveY == 1) {
			newHead = {
				x: this.tail[this.tail.length - 1].x,
				y: this.tail[this.tail.length - 1].y + this.speed,
			};
		} else if (this.moveY == -1) {
			newHead = {
				x: this.tail[this.tail.length - 1].x,
				y: this.tail[this.tail.length - 1].y - this.speed,
			};
		} else if (this.moveX == 1) {
			newHead = {
				x: this.tail[this.tail.length - 1].x + this.speed,
				y: this.tail[this.tail.length - 1].y,
			};
		} else if (this.moveX == -1) {
			newHead = {
				x: this.tail[this.tail.length - 1].x - this.speed,
				y: this.tail[this.tail.length - 1].y,
			};
		}
		return newHead;
	}
	move() {
		let newHead = this.append();
		this.tail.shift();
		this.tail.push(newHead);
	}
	isTouching() {
		let targets = this.tail.slice(0, this.tail.length - 1);
		let head = this.tail[this.tail.length - 1];
		let touching = false;
		targets.forEach((ele) => {
			if (ele.x == head.x && ele.y == head.y) {
				touching = true;
				return;
			}
		});
		if (touching) {
			return true;
		}
		if (
			head.x < 0 ||
			head.y < 0 ||
			head.x > canvas.width ||
			head.y > canvas.height - footerSize
		) {
			return true;
		}
		return false;
	}
}

class Apple {
	constructor(size) {
		this.size = size;
		this.refresh();
	}
	refresh() {
		this.x =
			Math.floor((canvas.width * Math.random()) / this.size) * this.size;
		this.y =
			Math.floor(
				((canvas.height - footerSize) * Math.random()) / this.size
			) * this.size;
	}
}

let canvas = document.getElementById("canvas");
let canvasCtx = canvas.getContext("2d");
let isOver = false;

const fps = 24;
const snakeSize = 40;
const snakeSpeed = 300;
const appleSize = 20;
const footerSize = 50;
var interval;
var snake;
var apple;

let createRect = (color, x, y, w, h) => {
	canvasCtx.fillStyle = color;
	canvasCtx.fillRect(x, y, w, h);
};
function launch() {
	let sps = Math.floor(snakeSpeed / fps);
	snake = new Snake(20, 20, snakeSize, sps);
	apple = new Apple(appleSize);
	interval = setInterval(gameLoop, 1000 / fps);
	isOver = false;
}
launch();

function gameLoop() {
	update();
	draw();
}

function checkApple(apple, snake) {
	let head = snake.tail[snake.tail.length - 1];
	if (
		head.x >= apple.x - snake.size &&
		head.x <= apple.x + apple.size &&
		head.y >= apple.y - snake.size &&
		head.y <= apple.y + apple.size
	) {
		next = snake.append();
		snake.tail.push(next);
		apple.refresh();
	}
}

function update() {
	snake.move();
	if (snake.isTouching()) {
		isOver = true;
		clearInterval(interval);
		return;
	}
	checkApple(apple, snake);
}

function draw() {
	createRect("black", 0, 0, canvas.width, canvas.height);
	createRect("darkblue", 0, 0, canvas.width, canvas.height - footerSize);
	createRect("red", apple.x, apple.y, apple.size, apple.size);

	for (i = 0; i < snake.tail.length; i++) {
		createRect(
			"white",
			snake.tail[i].x,
			snake.tail[i].y,
			snake.size,
			snake.size
		);
	}
	canvasCtx.font = "50px serif";
	canvasCtx.fillStyle = "green";
	canvasCtx.fillText(`score: ${snake.tail.length}`, 0, canvas.height);
	if (isOver) {
		drawGameOver();
	}
}

function drawGameOver() {
	canvasCtx.font = "50px serif";
	canvasCtx.fillStyle = "orange";
	canvasCtx.fillText("Game Over", canvas.width / 2 - 100, canvas.height / 2);
}

window.addEventListener("keydown", (event) => {
	if (isOver) {
		launch();
		return;
	}

	let code = event.key;
	switch (code) {
		case "j":
			if (snake.moveY != -1) {
				snake.moveX = 0;
				snake.moveY = 1;
			}
			break;
		case "k":
			if (snake.moveY != 1) {
				snake.moveX = 0;
				snake.moveY = -1;
			}
			break;
		case "h":
			if (snake.moveX != 1) {
				snake.moveX = -1;
				snake.moveY = 0;
			}
			break;
		case "l":
			if (snake.moveX != -1) {
				snake.moveX = 1;
				snake.moveY = 0;
			}
			break;
	}
});

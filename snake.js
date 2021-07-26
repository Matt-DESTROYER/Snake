document.getElementById("menu").hidden = false;
document.getElementById("game-screen").hidden = true;

function sliderChange() {
	document.getElementById("slider-value").textContent = document.getElementById("snakeSize").value;
}

class Point {
	constructor(x, y) {
		this._x = x;
		this._y = y;
	}
	get x() {
		return this._x;
	}
	get y() {
		return this._y;
	}
	set x(value) {
		this._x = value;
	}
	set y(value) {
		this._y = value;
	}
}

function Snake() {
	document.getElementById("menu").hidden = true;
	document.getElementById("game-screen").hidden = false;

	let canvas = document.getElementById("game-screen");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	let ctx = canvas.getContext("2d");

	ctx.font = "20px Arial";

	let loop,
		blockSize = parseInt(document.getElementById("snakeSize").value),
		w = Math.floor(canvas.width / blockSize),
		h = Math.floor(canvas.height / blockSize),
		snake = [new Point(Math.floor(w / 3) * blockSize, Math.floor(h / 2) * blockSize)],
		canMove = true,
		gameOver = false,
		dir = 0,
		score = 0,
		apple = new Point(Math.floor(w / 3) * 2 * blockSize, Math.floor(h / 2) * blockSize);

	function random(min, max) {
		return Math.floor(Math.random() * max) + min;
	}

	function randomApplePos() {
		apple = new Point(random(0, Math.floor(canvas.width / blockSize)) * blockSize, random(0, Math.floor(canvas.height / blockSize)) * blockSize);
		for (let i = 0; i < snake.length; i++) {
			if (apple.x === snake[i].x && apple.y === snake[i].y) {
				return randomApplePos();
			}
		}
	}

	function rect(x, y, width, height, colour) {
		ctx.beginPath();
		ctx.fillStyle = colour;
		ctx.rect(x, y, width, height);
		ctx.fill();
		ctx.closePath();
	}

	document.addEventListener("keydown", function (e) {
		e = e || window.event;
		if (!gameOver) {
			if (canMove) {
				switch (e.keyCode) {
					// up
					case 87:
					case 38:
						if (dir !== 2) {
							dir = 1;
						}
						canMove = false;
						break;
					// down
					case 83:
					case 40:
						if (dir !== 1) {
							dir = 2;
						}
						canMove = false;
						break;
					// left
					case 65:
					case 37:
						if (dir !== 4) {
							dir = 3;
						}
						canMove = false;
						break;
					// right
					case 68:
					case 39:
						if (dir !== 3) {
							dir = 4;
						}
						canMove = false;
						break;
					default:
						break;
				}
			}
		}
		switch (e.keyCode) {
			case 82:
				w = Math.floor(canvas.width / blockSize);
				h = Math.floor(canvas.height / blockSize);
				snake = [new Point(Math.floor(w / 3) * blockSize, Math.floor(h / 2) * blockSize)];
				canMove = true;
				gameOver = false;
				dir = 0;
				score = 0;
				apple = new Point(Math.floor(w / 3) * 2 * blockSize, Math.floor(h / 2) * blockSize);
				break;
			case 77:
				clearInterval(loop);
				document.getElementById("menu").hidden = false;
				document.getElementById("game-screen").hidden = true;
				break;
			default:
				break;
		}
	});

	loop = setInterval(function () {
		// clear canvas
		rect(0, 0, canvas.width, canvas.height, "black");
		if (!gameOver) {
			// snake body
			for (let i = snake.length - 1; i > 0; i--) {
				snake[i].x = snake[i - 1].x;
				snake[i].y = snake[i - 1].y;
				rect(snake[i].x, snake[i].y, blockSize, blockSize, "lightgreen");
			}
			// apple
			rect(apple.x, apple.y, blockSize, blockSize, "red");
			// snake head
			switch (dir) {
				case 1:
					snake[0].y -= blockSize;
					break;
				case 2:
					snake[0].y += blockSize;
					break;
				case 3:
					snake[0].x -= blockSize;
					break;
				case 4:
					snake[0].x += blockSize;
					break;
				default:
					break;
			}
			canMove = true;
			if (snake[0].x < 0 || snake[0].x + blockSize > canvas.width || snake[0].y < 0 || snake[0].y + blockSize > canvas.height) {
				gameOver = true;
			}
			if (snake[0].x === apple.x && snake[0].y === apple.y) {
				snake.push(new Point(0, 0));
				score++;
				randomApplePos();
			}
			for (let i = 1; i < snake.length; i++) {
				if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
					gameOver = true;
				}
			}
			rect(snake[0].x, snake[0].y, blockSize, blockSize, "green");
			ctx.fillStyle = "white";
			ctx.fillText("Score: " + score, 10, 25);
		} else {
			ctx.fillStyle = "white";
			ctx.fillText("Game Over!", canvas.width / 2 - 50, canvas.height / 6 * 2);
			ctx.fillText("Final score: " + score, canvas.width / 2 - 60, canvas.height / 6 * 3);
			ctx.fillText("Press 'r' to restart", canvas.width / 2 - 75, canvas.height / 6 * 4);
			ctx.fillText("Press 'm' to return to the menu", canvas.width / 2 - 125, canvas.height / 6 * 5);
		}
	}, 100);
}

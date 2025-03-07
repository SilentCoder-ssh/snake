import "./style.css";
import "virtual:uno.css";

const canva = document.querySelector("#game")! as HTMLCanvasElement;
const scoreDisplay = document.querySelector(
  "#score-counter"
)! as HTMLSpanElement;

const context = canva.getContext("2d")!;
const width = canva.width;
const height = canva.height;

// -- Initialisation
const boxSize = 20;
const gameSpeed = 100;
let score = 0;

let snake = [{ x: 9 * boxSize, y: 10 * boxSize }];
let direction = "RIGHT";
let game: number | null = null;

// -- Functions
function drawBox(x: number, y: number, color: string) {
  context.fillStyle = color;
  context.fillRect(x, y, boxSize, boxSize);
}

function spawnFood() {
  return {
    x: Math.floor(Math.random() * (width / boxSize)) * boxSize,
    y: Math.floor(Math.random() * (height / boxSize)) * boxSize,
  };
}

let food = spawnFood();

document.addEventListener("keydown", changeDirection);

function changeDirection(e: KeyboardEvent) {
  if (e.key === "ArrowLeft" && direction !== "RIGHT") {
    direction = "LEFT";
  } else if (e.key === "ArrowUp" && direction !== "DOWN") {
    direction = "UP"; 
  } else if (e.key === "ArrowRight" && direction !== "LEFT") {
    direction = "RIGHT"; 
  } else if (e.key === "ArrowDown" && direction !== "UP") {
    direction = "DOWN"; 
  }
}

function collisionWithBody(
  head: { x: number; y: number },
  body: { x: number; y: number }[]
) {
  for (let i = 0; i < body.length; i++) {
    if (head.x === body[i].x && head.y === body[i].y) return true;
  }
  return false;
}

// -- Function principale drawGame
function drawGame() {
  // 1. Effacer le Canvas
  context.clearRect(0, 0, width, height);

  // 2. Dessiner la nourriture
  drawBox(food.x, food.y, "red");

  // 3. Coordonnée de la tête du serpent
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  // 4. Mise à jour de la position selon la direction
  if (direction === "LEFT") snakeX -= boxSize;
  if (direction === "RIGHT") snakeX += boxSize;
  if (direction === "UP") snakeY -= boxSize;
  if (direction === "DOWN") snakeY += boxSize;

  // 5. Vérifier que le serpent mange la nourriture
  if (snakeX === food.x && snakeY === food.y) {
    score++;
    scoreDisplay.textContent = score.toString();
    food = spawnFood();
  } else {
    snake.pop()
  }

  let newHead = { x: snakeX, y: snakeY };

  // 6. Collision avec les murs
  if (snakeX < 0 || snakeX >= width || snakeY < 0 || snakeY >= height) {
    clearInterval(game!);
    alert(`Game over ! Votre score est de : ${score}`);
    return;
  }

  // 7. Collision avec le corps
  if (collisionWithBody(newHead, snake)) {
    clearInterval(game!);
    alert(`Game over ! Votre score est de : ${score}`);
    return;
  }

  // 8. On ajoute la nouvelle tête au début du tableau
  snake.unshift(newHead);

  // 9. Dessiner le serpent
  for (let i = 0; i < snake.length; i++) {
    drawBox(snake[i].x, snake[i].y, i === 0 ? "lime" : "green");
  }
}

// -- Lancer la boucle
game = setInterval(drawGame, gameSpeed);

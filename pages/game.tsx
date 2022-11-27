// Adapted from https://github.com/marcmll/next-snake
import { FormEvent, useState, useEffect, useRef } from "react";
import useInterval from "@use-it/interval";
import Page from "../components/core/Page";

const LETTERS = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
] as const;

type UppercaseLetter = typeof LETTERS[number];

type Letter = {
  x: number;
  y: number;
  char: UppercaseLetter;
};

type Velocity = {
  dx: number;
  dy: number;
};

const title = "Pruna - Hunter";

const WIDTH = 500;
const HEIGHT = 380;
const GRID_SIZE = 20;

const NUM_LETTERS = 5;
const GAME_DELAY = 100;

export default function Game() {
  // Canvas Settings
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Game State

  const [countDown, setCountDown] = useState(4);
  const [running, setRunning] = useState(false);
  const [isLost, setIsLost] = useState(false);
  const [inventory, setInventory] = useState<UppercaseLetter[]>([]);
  const [snake, setSnake] = useState<{
    head: { x: number; y: number };
    trail: Array<any>;
  }>({
    head: { x: 12, y: 9 },
    trail: [],
  });
  const [letters, setLetters] = useState<Letter[]>([]);
  const [oldVelocity, setOldVelocity] = useState<Velocity | null>(null);
  const [velocity, setVelocity] = useState<Velocity>({ dx: 0, dy: 0 });
  const [previousVelocity, setPreviousVelocity] = useState<Velocity>({
    dx: 0,
    dy: 0,
  });

  const clearCanvas = (ctx: CanvasRenderingContext2D) =>
    ctx.clearRect(-1, -1, WIDTH + 2, HEIGHT + 2);

  const randomLetter = (): Letter => {
    const x = Math.floor(Math.random() * (WIDTH / GRID_SIZE));
    const y = Math.floor(Math.random() * (HEIGHT / GRID_SIZE));
    // Check if random position interferes with snake head or trail
    if (
      (snake.head.x === x && snake.head.y === y) ||
      snake.trail.some((snakePart) => snakePart.x === x && snakePart.y === y)
    ) {
      return randomLetter();
    }

    const index = Math.floor(Math.random() * LETTERS.length);
    if (inventory.includes(LETTERS[index])) return randomLetter();
    else return { x, y, char: LETTERS[index] };
  };

  // Initialise state and start countdown
  const startGame = () => {
    setIsLost(false);
    setInventory([]);
    setSnake({
      head: { x: 12, y: 9 },
      trail: [],
    });
    const apples: Letter[] = [];
    for (let i = 0; i < NUM_LETTERS; i++) apples.push(randomLetter());

    setLetters(apples);
    setVelocity({ dx: 0, dy: -1 });
    setRunning(true);
    setCountDown(3);
    // loadPhoto();  // Will load the images from the IPFS files.
  };
      
  // Reset state and check for highscore
  const gameOver = () => {
    setIsLost(true);
    setRunning(false);
    setVelocity({ dx: 0, dy: 0 });
    setCountDown(4);
  };

  const fillRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number
  ) => {
    ctx.fillRect(x, y, w, h);
  };

  const strokeRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number
  ) => {
    ctx.strokeRect(x + 0.5, y + 0.5, w, h);
  };

  const drawSnake = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = "#0170F3";
    ctx.strokeStyle = "#003779";

    fillRect(
      ctx,
      snake.head.x * GRID_SIZE,
      snake.head.y * GRID_SIZE,
      GRID_SIZE,
      GRID_SIZE
    );

    strokeRect(
      ctx,
      snake.head.x * GRID_SIZE,
      snake.head.y * GRID_SIZE,
      GRID_SIZE,
      GRID_SIZE
    );

    snake.trail.forEach((snakePart) => {
      fillRect(
        ctx,
        snakePart.x * GRID_SIZE,
        snakePart.y * GRID_SIZE,
        GRID_SIZE,
        GRID_SIZE
      );

      strokeRect(
        ctx,
        snakePart.x * GRID_SIZE,
        snakePart.y * GRID_SIZE,
        GRID_SIZE,
        GRID_SIZE
      );
    });
  };

  function drawApple(apple: Letter, ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "#DC3030"; // '#38C172' // '#F4CA64'
    ctx.strokeStyle = "#881A1B"; // '#187741' // '#8C6D1F

    if (
      apple &&
      typeof apple.x !== "undefined" &&
      typeof apple.y !== "undefined"
    ) {
      fillRect(
        ctx,
        apple.x * GRID_SIZE,
        apple.y * GRID_SIZE,
        GRID_SIZE,
        GRID_SIZE
      );

      strokeRect(
        ctx,
        apple.x * GRID_SIZE,
        apple.y * GRID_SIZE,
        GRID_SIZE,
        GRID_SIZE
      );
    }
  }

  // Update snake.head, snake.trail and apple positions. Check for collisions.
  const updateSnake = () => {
    // Check for collision with walls
    const nextHeadPosition = {
      x: snake.head.x + velocity.dx,
      y: snake.head.y + velocity.dy,
    };

    if (
      nextHeadPosition.x < 0 ||
      nextHeadPosition.y < 0 ||
      nextHeadPosition.x >= WIDTH / GRID_SIZE ||
      nextHeadPosition.y >= HEIGHT / GRID_SIZE
    ) {
      gameOver();
    }

    // Check for collision with apple
    for (let i = 0; i < letters.length; i++) {
      if (
        nextHeadPosition.x === letters[i].x &&
        nextHeadPosition.y === letters[i].y
      ) {
        setInventory([...inventory, letters[i].char]);

        let applesTemp = [...letters];
        let item = { ...applesTemp[i] };
        const { x, y, char } = randomLetter();
        item.x = x;
        item.y = y;
        item.char = char;
        applesTemp[i] = item;
        setLetters(applesTemp);
      }
    }

    const updatedSnakeTrail = [...snake.trail, { ...snake.head }];
    // Remove trail history beyond snake trail length (score + 2)
    while (updatedSnakeTrail.length > inventory.length + 2)
      updatedSnakeTrail.shift();
    // Check for snake colliding with itsself
    if (
      updatedSnakeTrail.some(
        (snakePart) =>
          snakePart.x === nextHeadPosition.x &&
          snakePart.y === nextHeadPosition.y
      )
    )
      gameOver();

    // Update state
    setPreviousVelocity({ ...velocity });
    setSnake({
      head: { ...nextHeadPosition },
      trail: [...updatedSnakeTrail],
    });
  };

   // Update snake.head, snake.trail and apple positions. Check for collisions.
   const spellWord = () => {
      // Check for collision with walls
      const nextHeadPosition = {
        x: snake.head.x + velocity.dx,
        y: snake.head.y + velocity.dy,
      };
  };

  // Render Hook
  useEffect(() => {
    const canvas = canvasRef?.current;
    const ctx = canvas?.getContext("2d");

    if (ctx && !isLost) {
      clearCanvas(ctx);
      for (const apple of letters) drawApple(apple, ctx);
      drawSnake(ctx);
    }
  }, [snake]);

  // Game Update
  useInterval(
    () => {
      if (!isLost) {
        updateSnake();
      }
    },
    running && countDown === 0 ? GAME_DELAY : null
  );

  // Countdown Interval
  useInterval(
    () => {
      setCountDown((prevCountDown) => prevCountDown - 1);
    },
    countDown > 0 && countDown < 4 ? 800 : null
  );

  // Event Listener: Key Presses
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      let velocityDelta = { dx: 0, dy: 0 };

      switch (e.key) {
        case "ArrowRight":
          velocityDelta = { dx: 1, dy: 0 };
          break;
        case "ArrowLeft":
          velocityDelta = { dx: -1, dy: 0 };
          break;
        case "ArrowDown":
          velocityDelta = { dx: 0, dy: 1 };
          break;
        case "ArrowUp":
          velocityDelta = { dx: 0, dy: -1 };
          break;
        case "p":
          if (oldVelocity) {
            console.log(oldVelocity);
            velocityDelta = oldVelocity;
            setOldVelocity(null);
          } else {
            setOldVelocity(velocity);
            setVelocity(velocityDelta);
          }
          location.href="./spell"
          break;
        default:
          break;
      }

      if (
        !(
          previousVelocity.dx + velocityDelta.dx === 0 &&
          previousVelocity.dy + velocityDelta.dy === 0
        )
      ) {
        setVelocity(velocityDelta);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [previousVelocity]);

  return (
    <Page title={title} logo>
      <div className="flex flex-col items-center pt-10 space-y-7">
        <img src={require("../components/dog.jpg").default}/>
        <canvas
          ref={canvasRef}
          width={WIDTH + 1}
          height={HEIGHT + 1}
          className="bg-white border-4 border-black shadow-md"
        />
        <div className="text-black text-3xl flex flex-col items-center font-source-code-pro space-y-4">
          <p>LETTERS: [{inventory.toString()}]</p>
          {
            <button className="focus:outline-none" onClick={startGame}>
              {countDown === 4 ? (
                <span className="shadow-md rounded-lg border-2 py-1 px-4">
                  START
                </span>
              ) : (
                countDown
              )}
            </button>
          }
        </div>
      </div>
    </Page>
  );
}

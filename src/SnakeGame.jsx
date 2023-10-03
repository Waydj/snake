// src/SnakeGame.js
import { useState, useEffect } from "react";
import styled from "styled-components";
import { Cell } from "./Cell";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f0f0f0;
`;

const GameContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(20, 30px);
  /* gap: 1px; */
  background-color: #fff;
  padding: 10px;
  border-radius: 8px;
`;

const Background = styled.div`
  position: absolute;
  width: 100vw;
  height: 100vh;
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.8);
  display: ${(props) => (props.isGameOver ? "flex" : "none")};
  align-items: center;
  justify-content: center;
  top: 0;
  left: 0;
`;

const GameOverContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const GameOverText = styled.p`
  color: white;
  font-size: 32px;
  font-weight: 700;
`;

const StartButton = styled.button`
  padding: 10px;
  font-size: 16px;
  margin-top: 20px;
`;

const SnakeGame = () => {
  const [snake, setSnake] = useState([{ x: 0, y: 0 }]);
  const [food, setFood] = useState({ x: 10, y: 10 });
  const [direction, setDirection] = useState("RIGHT");
  const [isGameOver, setIsGameOver] = useState(false);

  const startGame = () => {
    setSnake([{ x: 0, y: 0 }]);
    setFood({ x: 10, y: 10 });
    setDirection("RIGHT");
    setIsGameOver(false);
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      switch (e.key) {
        case "ArrowUp":
          setDirection("UP");
          break;
        case "ArrowDown":
          setDirection("DOWN");
          break;
        case "ArrowLeft":
          setDirection("LEFT");
          break;
        case "ArrowRight":
          setDirection("RIGHT");
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  useEffect(() => {
    const updateGame = () => {
      if (isGameOver) {
        clearInterval(gameInterval);
        return;
      }

      // Логика обновления игры
      const newSnake = [...snake];
      const head = { ...newSnake[0] };

      switch (direction) {
        case "UP":
          head.y -= 1;
          break;
        case "DOWN":
          head.y += 1;
          break;
        case "LEFT":
          head.x -= 1;
          break;
        case "RIGHT":
          head.x += 1;
          break;
        default:
          break;
      }

      // Проверка на столкновение с границами
      if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20) {
        setIsGameOver(true);
        return;
      }

      // Проверка на столкновение с самой собой
      if (newSnake.some((cell) => cell.x === head.x && cell.y === head.y)) {
        setIsGameOver(true);
        return;
      }

      newSnake.unshift(head);

      // Проверка на столкновение с едой
      if (head.x === food.x && head.y === food.y) {
        // Генерация новых координат для еды
        const newFood = {
          x: Math.floor(Math.random() * 20),
          y: Math.floor(Math.random() * 20),
        };
        setFood(newFood);
      } else {
        newSnake.pop();
      }

      setSnake(newSnake);
    };

    const gameInterval = setInterval(updateGame, 300);

    return () => {
      clearInterval(gameInterval);
    };
  }, [snake, food, direction, isGameOver]);

  return (
    <Container>
      <Background isGameOver={isGameOver}>
        {isGameOver && (
          <GameOverContainer>
            <GameOverText>Game Over!</GameOverText>
            <StartButton onClick={startGame}>Start Again</StartButton>
          </GameOverContainer>
        )}
      </Background>
      <GameContainer>
        {Array.from({ length: 20 }).map((_, rowIndex) =>
          Array.from({ length: 20 }).map((_, colIndex) => {
            const isFood = food.x === colIndex && food.y === rowIndex;
            const isSnake = snake.some(
              (cell) => cell.x === colIndex && cell.y === rowIndex
            );

            return (
              <Cell
                key={`${rowIndex}-${colIndex}`}
                isFood={isFood}
                isSnake={isSnake}
              />
            );
          })
        )}
      </GameContainer>
    </Container>
  );
};

export default SnakeGame;

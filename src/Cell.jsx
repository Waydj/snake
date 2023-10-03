import styled from "styled-components";

const StyledCell = styled.div`
  width: 30px;
  height: 30px;
  background-color: ${(props) =>
    props.isFood ? "#ff802c" : props.isSnake ? "#413636" : "#8a789f"};
`;

export const Cell = ({ isFood, isSnake }) => {
  return <StyledCell isFood={isFood} isSnake={isSnake} />;
};

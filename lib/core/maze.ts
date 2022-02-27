import { NodeType } from "types";
import { generateRandomNumberFromRange } from "utils/arrayUtils";
import { timeout } from "utils/timingUtils";

const getNeighbours = (grid: NodeType[][], node: { x: number; y: number }) => {
  let neighbours: { x: number; y: number }[] = [];

  let directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  for (let i = 0; i < 4; i++) {
    let ny = node.y + directions[i][0];
    let nx = node.x + directions[i][1];
    if (
      ny >= 0 &&
      nx >= 0 &&
      ny < grid.length &&
      nx < grid[0].length &&
      grid[ny][nx] === NodeType.Wall
    ) {
      neighbours.push({
        x: nx,
        y: ny,
      });
    }
  }

  return neighbours;
};

export const recursiveDivision = async (
  grid: NodeType[][],
  rowStart: number,
  rowEnd: number,
  colStart: number,
  colEnd: number,
  orientation: "horizontal" | "vertical",
  surroundingWalls: boolean,
  handleSetNode: (row: number, col: number, type: NodeType) => void
) => {
  if (rowEnd < rowStart || colEnd < colStart) {
    return;
  }

  let _grid: NodeType[][] = Array.from({ length: grid.length }, () =>
    Array.from({ length: grid[0].length }, () => NodeType.Normal)
  );

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      _grid[i][j] = grid[i][j];
    }
  }

  if (!surroundingWalls) {
    for (let i = 0; i < _grid.length; i++) {
      for (let j = 0; j < _grid[0].length; j++) {
        if (
          i === 0 ||
          j === 0 ||
          i === _grid.length - 1 ||
          j === _grid[0].length - 1
        ) {
          if (_grid[i][j] === NodeType.Start) {
            _grid[1][1] = NodeType.Start;
            handleSetNode(1, 1, NodeType.Start);
          } else if (_grid[i][j] === NodeType.End) {
            _grid[14][38] = NodeType.End;
            handleSetNode(14, 38, NodeType.End);
          }

          handleSetNode(i, j, NodeType.Wall);
          _grid[i][j] = NodeType.Wall;
          await timeout(5);
        }
      }
    }

    surroundingWalls = true;
  }

  if (orientation === "horizontal") {
    let possibleRows: number[] = [];
    for (let number = rowStart; number <= rowEnd; number += 2) {
      possibleRows.push(number);
    }

    let possibleCols = [];
    for (let number = colStart - 1; number <= colEnd + 1; number += 2) {
      possibleCols.push(number);
    }

    let randomRowIndex = Math.floor(Math.random() * possibleRows.length);
    let randomColIndex = Math.floor(Math.random() * possibleCols.length);

    let currentRow = possibleRows[randomRowIndex];
    let colRandom = possibleCols[randomColIndex];
    for (let i = 0; i < _grid.length; i++) {
      for (let j = 0; j < _grid[0].length; j++) {
        if (
          i === currentRow &&
          j !== colRandom &&
          j >= colStart - 1 &&
          j <= colEnd + 1
        ) {
          if (_grid[i][j] === NodeType.Normal) {
            handleSetNode(i, j, NodeType.Wall);
            _grid[i][j] === NodeType.Wall;
            await timeout(5);
          }
        }
      }
    }

    if (currentRow - 2 - rowStart > colEnd - colStart) {
      await recursiveDivision(
        grid,
        rowStart,
        currentRow - 2,
        colStart,
        colEnd,
        orientation,
        surroundingWalls,
        handleSetNode
      );
    } else {
      await recursiveDivision(
        grid,
        rowStart,
        currentRow - 2,
        colStart,
        colEnd,
        "vertical",
        surroundingWalls,
        handleSetNode
      );
    }

    if (rowEnd - currentRow + 2 > colEnd - colStart) {
      await recursiveDivision(
        grid,
        currentRow + 2,
        rowEnd,
        colStart,
        colEnd,
        orientation,
        surroundingWalls,
        handleSetNode
      );
    } else {
      await recursiveDivision(
        grid,
        currentRow + 2,
        rowEnd,
        colStart,
        colEnd,
        "vertical",
        surroundingWalls,
        handleSetNode
      );
    }
  } else {
    let possibleCols: number[] = [];
    for (let number = colStart; number <= colEnd; number += 2) {
      possibleCols.push(number);
    }

    let possibleRows: number[] = [];
    for (let number = rowStart - 1; number <= rowEnd + 1; number += 2) {
      possibleRows.push(number);
    }

    let randomRowIndex = Math.floor(Math.random() * possibleRows.length);
    let randomColIndex = Math.floor(Math.random() * possibleCols.length);

    let currentCol = possibleCols[randomColIndex];
    let rowRandom = possibleRows[randomRowIndex];
    for (let i = 0; i < _grid.length; i++) {
      for (let j = 0; j < _grid[0].length; j++) {
        if (
          j === currentCol &&
          i !== rowRandom &&
          i >= rowStart - 1 &&
          i <= rowEnd + 1
        ) {
          if (_grid[i][j] === NodeType.Normal) {
            handleSetNode(i, j, NodeType.Wall);
            _grid[i][j] === NodeType.Wall;
            await timeout(2);
          }
        }
      }
    }

    if (rowEnd - rowStart > currentCol - 2 - colStart) {
      await recursiveDivision(
        grid,
        rowStart,
        rowEnd,
        colStart,
        currentCol - 2,
        "horizontal",
        surroundingWalls,
        handleSetNode
      );
    } else {
      await recursiveDivision(
        grid,
        rowStart,
        rowEnd,
        colStart,
        currentCol - 2,
        orientation,
        surroundingWalls,
        handleSetNode
      );
    }

    if (rowEnd - rowStart > currentCol - 2 - colStart) {
      await recursiveDivision(
        grid,
        rowStart,
        rowEnd,
        currentCol + 2,
        colEnd,
        "horizontal",
        surroundingWalls,
        handleSetNode
      );
    } else {
      await recursiveDivision(
        grid,
        rowStart,
        rowEnd,
        currentCol + 2,
        colEnd,
        orientation,
        surroundingWalls,
        handleSetNode
      );
    }
  }
};

const DIR_HORIZONTAL = "horizontal";
const DIR_VERTICAL = "vertical";
export const prims = async (
  grid: NodeType[][],
  handleSetNode: (row: number, col: number, type: NodeType) => void
) => {
  let visited = Array.from({ length: grid.length }, () =>
    Array.from({ length: grid[0].length }, () => false)
  );

  let _grid: NodeType[][] = Array.from({ length: grid.length }, () =>
    Array.from({ length: grid[0].length }, () => NodeType.Normal)
  );

  for (let i = 0; i < _grid.length; i++) {
    for (let j = 0; j < _grid[0].length; j++) {
      _grid[i][j] = NodeType.Wall;
      handleSetNode(i, j, NodeType.Wall);
    }
  }

  // x-y
  let frontier = new Set<string>();

  // set start
  _grid[0][0] = NodeType.Start;
  handleSetNode(0, 0, NodeType.Start);

  visited[0][0] = true;
  let startNeighbours = getNeighbours(_grid, { x: 0, y: 0 });
  startNeighbours.forEach((i) => {
    visited[i.y][i.x] = true;
    frontier.add(`${i.x}-${i.y}`);
  });

  const analyseWall = (x: number, y: number) => {
    // analyseWall
    const orientation = x % 2 === 1 ? DIR_HORIZONTAL : DIR_VERTICAL;

    // get next cell
    let newCell = { x: x, y: y + 1 };
    if (y === visited.length - 1) {
      return {
        shouldOpen: false,
        newCell: {
          x: 1,
          y: 1,
        },
      };
    }
    if (orientation === DIR_HORIZONTAL) {
      newCell = { x: x + 1, y: y };
      if (x === visited[0].length - 1) {
        return {
          shouldOpen: false,
          newCell: {
            x: 1,
            y: 1,
          },
        };
      }
    }

    // check should open
    let shouldOpen = false;
    shouldOpen = !visited[newCell.y][newCell.x];

    if (!shouldOpen) {
      newCell = { x: x, y: y - 1 };
      if (orientation === DIR_HORIZONTAL) {
        newCell = { x: x - 1, y: y };
      }
      shouldOpen = !visited[newCell.y][newCell.x];
    }

    return { shouldOpen, newCell };
  };

  while (frontier.size > 0) {
    const max = frontier.size;
    const idx = Math.floor(Math.random() * max);
    const randomEle = Array.from(frontier)[idx];
    frontier.delete(randomEle);
    const [x, y] = randomEle.split("-").map((i) => parseInt(i));
    const { shouldOpen, newCell } = analyseWall(x, y);

    if (shouldOpen) {
      _grid[y][x] = NodeType.Normal;
      handleSetNode(y, x, NodeType.Normal);

      _grid[newCell.y][newCell.x] = NodeType.Normal;
      handleSetNode(newCell.y, newCell.x, NodeType.Normal);

      visited[y][x] = true;
      visited[newCell.y][newCell.x] = true;
      let startNeighbours = getNeighbours(_grid, newCell);
      startNeighbours.forEach((i) => {
        visited[i.y][i.x] = true;
        frontier.add(`${i.x}-${i.y}`);
      });
    } else {
      _grid[y][x] = NodeType.Wall;
      handleSetNode(y, x, NodeType.Wall);
    }

    await timeout(5);
  }

  await timeout(10);
  // set end
  _grid[_grid.length - 2][_grid[0].length - 1] = NodeType.End;
  handleSetNode(_grid.length - 2, _grid[0].length - 1, NodeType.End);
};

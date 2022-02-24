import { NodeType } from "types";
import { generateRandomNumberFromRange } from "utils/arrayUtils";
import { timeout } from "utils/timingUtils";

type Cell = {
  gridX: number;
  gridY: number;
  isWalkable: boolean;
};

const generateGrid = (grid: NodeType[][]) => {
  let newGrid: Cell[][] = Array.from(Array(grid.length), (_) =>
    Array(grid[0].length).fill({})
  );

  let startingCoords: { x: number; y: number } | null = null;
  let endCoords: { x: number; y: number } | null = null;

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      newGrid[i][j] = {
        gridX: j,
        gridY: i,
        isWalkable: [NodeType.Normal, NodeType.End].includes(grid[i][j]),
      };

      if (grid[i][j] === NodeType.Start) {
        startingCoords = {
          y: i,
          x: j,
        };
      } else if (grid[i][j] === NodeType.End) {
        endCoords = {
          y: i,
          x: j,
        };
      }
    }
  }

  return {
    newGrid,
    startingCoords,
    endCoords,
  };
};
const stringify = (cell: Cell) => `${cell.gridX}-${cell.gridY}`;
const getNeighbours = (grid: Cell[][], node: Cell) => {
  let neighbours: Cell[] = [];

  let directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  for (let i = 0; i < 4; i++) {
    let ny = node.gridY + directions[i][0];
    let nx = node.gridX + directions[i][1];
    if (ny >= 0 && nx >= 0 && ny < grid.length && nx < grid[0].length) {
      neighbours.push(grid[ny][nx]);
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
            await timeout(5);
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

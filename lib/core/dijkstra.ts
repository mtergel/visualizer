import { NodeType } from "types";
import { timeout } from "utils/timingUtils";
import Heap from "./heap";

type Cell = {
  gridX: number;
  gridY: number;
  isWalkable: boolean;
  parent: Cell | null;
  distance: number; // distance from a node to the root
};

const stringify = (cell: Cell) => `${cell.gridX}-${cell.gridY}`;
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
        parent: null,
        distance: Infinity,
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

const dijkstra = async (
  grid: NodeType[][],
  handleSetVisited: (row: number, col: number, val: boolean) => void
) => {
  const { newGrid, startingCoords, endCoords } = generateGrid(grid);

  if (startingCoords == null || endCoords == null) {
    throw new Error("no start or end");
  }
  const frontier = new Heap<Cell>((a, b) => a.distance < b.distance);

  // hash set
  const closedSet: {
    [key: string]: boolean | undefined;
  } = {};

  // as y-x
  let path = new Set<string>();

  const findPath = (node: Cell) => {
    if (node.parent) {
      findPath(node.parent);
      path.add(`${node.gridY}-${node.gridX}`);
    }
  };

  newGrid[startingCoords.y][startingCoords.x].distance = 0;
  frontier.push(newGrid[startingCoords.y][startingCoords.x]);
  closedSet[stringify(newGrid[startingCoords.y][startingCoords.x])] = true;
  handleSetVisited(startingCoords.y, startingCoords.x, true);

  while (!frontier.isEmpty()) {
    const curr = frontier.pop();
    if (curr.gridX === endCoords.x && curr.gridY === endCoords.y) {
      path.add(`${startingCoords.y}-${startingCoords.x}`);
      findPath(curr);
      return path;
    }

    let neighbors = getNeighbours(newGrid, curr);
    neighbors.forEach((neighbor) => {
      const neighborKey = stringify(neighbor);
      if (!neighbor.isWalkable || closedSet[neighborKey]) {
        return;
      }
      const minDistance = Math.min(neighbor.distance, curr.distance + 1);
      if (!closedSet[neighborKey]) {
        neighbor.parent = curr;
        neighbor.distance = minDistance;
        frontier.push(neighbor);
        closedSet[neighborKey] = true;
        handleSetVisited(neighbor.gridY, neighbor.gridX, true);
      }
    });
    await timeout(20);
  }

  return path;
};

export default dijkstra;

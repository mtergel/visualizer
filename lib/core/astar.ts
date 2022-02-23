import { NodeType } from "types";
import { timeout } from "utils/timingUtils";
import Heap from "./heap";

type Cell = {
  gridX: number;
  gridY: number;
  isWalkable: boolean;

  gCost: number;
  hCost: number;
  parent: Cell | null;
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
        gCost: Infinity,
        hCost: Infinity,
        isWalkable: [NodeType.Normal, NodeType.End].includes(grid[i][j]),
        parent: null,
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

// gCost - cost of path from the start node to n
// hCost - heuristic cost estimated cost of the cheapest path from n to goal

const astar = async (
  grid: NodeType[][],
  handleSetVisited: (row: number, col: number, val: boolean) => void
) => {
  const { startingCoords, endCoords, newGrid } = generateGrid(grid);

  if (startingCoords === null || endCoords === null) {
    throw new Error("no start or end");
  }

  // string list

  const openFrontier = new Heap<Cell>(
    (a, b) => a.gCost + a.hCost < b.gCost + b.hCost
  );

  const closedSet: { [key: string]: true } = {};

  //stores the contents of the frontier to allow for fast retrieval of f-score
  const openSet: { [key: string]: number | undefined } = {};

  // as y-x
  let path = new Set<string>();

  const findPath = (node: Cell) => {
    if (node.parent) {
      findPath(node.parent);
      path.add(`${node.gridY}-${node.gridX}`);
    }
  };

  newGrid[startingCoords.y][startingCoords.x].gCost = 0;
  newGrid[startingCoords.y][startingCoords.x].hCost = Infinity;

  openFrontier.push(newGrid[startingCoords.y][startingCoords.x]);
  openSet[stringify(newGrid[startingCoords.y][startingCoords.x])] = 0;

  while (!openFrontier.isEmpty()) {
    const curr = openFrontier.pop();
    const currKey = stringify(curr);
    openSet[currKey] = undefined;
    if (closedSet[currKey]) {
      continue;
    }
    closedSet[currKey] = true;
    handleSetVisited(curr.gridY, curr.gridX, true);
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

      const newCost = curr.gCost + getDistance(curr, neighbor);
      if (!openSet[neighborKey] || newCost < openSet[neighborKey]!) {
        neighbor.parent = curr;
        neighbor.gCost = newCost;
        neighbor.hCost = getDistance(
          neighbor,
          newGrid[endCoords.y][endCoords.x]
        );
        openFrontier.push(neighbor);
        openSet[neighborKey] = newCost;
      }
    });
    await timeout(20);
  }

  return path;
};

const getDistance = (nodeA: Cell, nodeB: Cell) => {
  return (
    2 *
    (Math.abs(nodeB.gridX - nodeA.gridX) + Math.abs(nodeB.gridY - nodeA.gridY))
  );
};
export default astar;

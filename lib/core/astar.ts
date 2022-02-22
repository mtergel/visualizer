import { NodeType } from "types";
import { timeout } from "utils/timingUtils";

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

const stringToCoords = (input: string) => {
  let coords = input.split("-");

  return { y: parseInt(coords[0]), x: parseInt(coords[1]) };
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

// gCost - cost of path from the start node to n
// hCost - heuristic cost estimated cost of the cheapest path from n to goal

const astar = async (
  grid: NodeType[][],
  visited: Boolean[][],
  handleSetVisited: (row: number, col: number, val: boolean) => void
) => {
  const { startingCoords, endCoords, newGrid } = generateGrid(grid);

  if (startingCoords === null || endCoords === null) {
    throw new Error("no start or end");
  }

  // string list
  let openSet: Cell[] = [];
  let _visited = visited.map((arr) => arr.slice());

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

  openSet.push(newGrid[startingCoords.y][startingCoords.x]);

  while (openSet.length > 0) {
    let node = openSet[0];
    for (let i = 1; i < openSet.length; i++) {
      let fCost = node.gCost + node.hCost;
      let comp = openSet[i].gCost + openSet[i].hCost;
      if (comp <= fCost && openSet[i].hCost < node.hCost) {
        node = openSet[i];
      }
    }
    let removeLowest = openSet.findIndex(
      (i) => i.gridX === node.gridX && i.gridY === node.gridY
    );
    openSet.splice(removeLowest, 1);

    handleSetVisited(node.gridY, node.gridX, true);
    _visited[node.gridY][node.gridX] = true;

    if (node.gridX === endCoords.x && node.gridY === endCoords.y) {
      path.add(`${startingCoords.y}-${startingCoords.x}`);
      findPath(newGrid[node.gridY][node.gridX]);
      return path;
    }

    let neighbours = getNeighbours(newGrid, node);
    neighbours.forEach((neighbour) => {
      if (!neighbour.isWalkable || _visited[neighbour.gridY][neighbour.gridX]) {
        return;
      }

      let newCost = node.gCost + getDistance(node, neighbour);
      const containsNeighbour = openSet.findIndex(
        (i) => neighbour.gridX === i.gridX && neighbour.gridY === i.gridY
      );

      if (newCost < neighbour.gCost || containsNeighbour !== -1) {
        neighbour.gCost = newCost;
        neighbour.hCost = getDistance(
          neighbour,
          newGrid[endCoords.y][endCoords.x]
        );
        neighbour.parent = node;

        if (containsNeighbour === -1) {
          openSet.push(neighbour);
        }
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

import { NodeType } from "types";
import { timeout } from "utils/timingUtils";

let directions = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

type BFSCell = {
  x: number;
  y: number;
  val: NodeType;
  parent: BFSCell | null;
};

const findSE = (grid: NodeType[][]) => {
  let start = null;
  let end = null;

  let newGrid: BFSCell[][] = Array.from(Array(grid.length), (_) =>
    Array(grid[0].length).fill({})
  );

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (!start && grid[i][j] === NodeType.Start) {
        start = {
          y: i,
          x: j,
          val: grid[i][j],
          parent: null,
        };
      }

      if (!end && grid[i][j] === NodeType.End) {
        end = {
          y: i,
          x: j,
          val: grid[i][j],
          parent: null,
        };
      }

      newGrid[i][j] = {
        x: j,
        y: i,
        val: grid[i][j],
        parent: null,
      };
    }
  }

  if (!start || !end) {
    throw new Error("Start, end node not found");
  }
  return [start, end, newGrid] as [
    start: BFSCell,
    end: BFSCell,
    newGrid: BFSCell[][]
  ];
};

function arrayEquals(a: number[], b: number[]) {
  return (
    Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val === b[index])
  );
}

export const bfs = async (
  grid: NodeType[][],
  visited: Boolean[][],
  handleSetVisited: (row: number, col: number, val: boolean) => void
) => {
  let q = [] as BFSCell[]; // Queue
  let _visited = visited.map((arr) => arr.slice());
  let [start, end, newGrid] = findSE(grid);
  const _end = [end.y, end.x];
  // as y-x
  let path = new Set<string>();

  const findPath = (node: BFSCell) => {
    if (node.parent) {
      findPath(node.parent);
      path.add(`${node.y}-${node.x}`);
    }
  };

  // add starting node to queuer
  q.push(start);

  // Mark as visited
  handleSetVisited(start.y, start.x, true);
  _visited[start.y][start.x] = true;

  while (q.length > 0) {
    let p = q.shift() as BFSCell;

    if (arrayEquals([p.y, p.x], _end)) {
      break;
    }

    // check 4 directions
    for (let i = 0; i < 4; i++) {
      let ny = p.y + directions[i][0];
      let nx = p.x + directions[i][1];

      if (
        ny >= 0 &&
        nx >= 0 &&
        ny < grid.length &&
        nx < grid[0].length &&
        !_visited[ny][nx] &&
        (grid[ny][nx] === NodeType.Normal || grid[ny][nx] === NodeType.End)
      ) {
        // Mark as visited
        handleSetVisited(ny, nx, true);
        _visited[ny][nx] = true;

        // set its parent
        newGrid[ny][nx] = {
          ...newGrid[ny][nx],
          parent: p,
        };

        q.push(newGrid[ny][nx]);

        // Destination is reached.
        if (arrayEquals([ny, nx], _end)) {
          path.add(`${start.y}-${start.x}`);
          findPath(newGrid[ny][nx]);
          return path;
        }
      }
    }
    await timeout(10);
  }

  return path;
};

export const dfs = async (
  grid: NodeType[][],
  visited: Boolean[][],
  handleSetVisited: (row: number, col: number, val: boolean) => void
) => {
  let q = [] as BFSCell[]; // Stack
  let _visited = visited.map((arr) => arr.slice());
  let [start, end, newGrid] = findSE(grid);
  const _end = [end.y, end.x];
  // as y-x
  let path = new Set<string>();

  const findPath = (node: BFSCell) => {
    if (node.parent) {
      findPath(node.parent);
      path.add(`${node.y}-${node.x}`);
    }
  };

  // add starting node to queuer
  q.push(start);

  // Mark as visited
  handleSetVisited(start.y, start.x, true);
  _visited[start.y][start.x] = true;

  while (q.length > 0) {
    let p = q.pop() as BFSCell;

    // check 4 directions
    for (let i = 0; i < 4; i++) {
      let ny = p.y + directions[i][0];
      let nx = p.x + directions[i][1];

      if (
        ny >= 0 &&
        nx >= 0 &&
        ny < grid.length &&
        nx < grid[0].length &&
        !_visited[ny][nx] &&
        (grid[ny][nx] === NodeType.Normal || grid[ny][nx] === NodeType.End)
      ) {
        // set its parent
        newGrid[ny][nx] = {
          ...newGrid[ny][nx],
          parent: p,
        };
        q.push(newGrid[ny][nx]);

        // Mark as visited
        handleSetVisited(ny, nx, true);
        _visited[ny][nx] = true;

        // Destination is reached.
        if (arrayEquals([ny, nx], _end)) {
          path.add(`${start.y}-${start.x}`);
          findPath(newGrid[ny][nx]);
          return path;
        }
      }
    }
    await timeout(10);
  }

  return path;
};

import { NodeType } from "types";
import { timeout } from "utils/timingUtils";

let directions = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

type Cell = {
  x: number;
  y: number;
  val: NodeType;
  parent: Cell | null;
  distance: number; // distance from a node to the root
};

const findSE = (grid: NodeType[][]) => {
  let start = null;
  let end = null;

  let newGrid: Cell[][] = Array.from(Array(grid.length), (_) =>
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
          distance: 0,
        };
      }

      if (!end && grid[i][j] === NodeType.End) {
        end = {
          y: i,
          x: j,
          val: grid[i][j],
          parent: null,
          distance: Infinity,
        };
      }

      newGrid[i][j] = {
        x: j,
        y: i,
        val: grid[i][j],
        parent: null,
        distance: grid[i][j] === NodeType.Start ? 0 : Infinity,
      };
    }
  }

  if (!start || !end) {
    throw new Error("Start, end node not found");
  }
  return [start, end, newGrid] as [start: Cell, end: Cell, newGrid: Cell[][]];
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
  let q = [] as Cell[]; // Queue
  let _visited = visited.map((arr) => arr.slice());
  let [start, end, newGrid] = findSE(grid);
  const _end = [end.y, end.x];
  // as y-x
  let path = new Set<string>();

  const findPath = (node: Cell) => {
    if (node.parent) {
      findPath(node.parent);
      path.add(`${node.y}-${node.x}`);
    }
  };

  // add starting node to queue
  q.push(start);

  // Mark as visited
  handleSetVisited(start.y, start.x, true);
  _visited[start.y][start.x] = true;

  while (q.length > 0) {
    let p = q.shift() as Cell;

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
  let q = [] as Cell[]; // Stack
  let _visited = visited.map((arr) => arr.slice());
  let [start, end, newGrid] = findSE(grid);
  const _end = [end.y, end.x];
  // as y-x
  let path = new Set<string>();

  const findPath = (node: Cell) => {
    if (node.parent) {
      findPath(node.parent);
      path.add(`${node.y}-${node.x}`);
    }
  };

  // add starting node to queue
  q.push(start);

  // Mark as visited
  handleSetVisited(start.y, start.x, true);
  _visited[start.y][start.x] = true;

  while (q.length > 0) {
    let p = q.pop() as Cell;

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

type PriortyQueItem = {
  element: Cell;
  priorty: number;
};
export const dijkstra = async (
  grid: NodeType[][],
  visited: Boolean[][],
  handleSetVisited: (row: number, col: number, val: boolean) => void
) => {
  let q = [] as PriortyQueItem[]; // Queue

  let _visited = visited.map((arr) => arr.slice());
  let [start, end, newGrid] = findSE(grid);
  const _end = [end.y, end.x];

  // as y-x
  let path = new Set<string>();

  const findPath = (node: Cell) => {
    if (node.parent) {
      findPath(node.parent);
      console.log(node.distance);
      path.add(`${node.y}-${node.x}`);
    }
  };

  // add starting node to queue
  q.push({
    element: start,
    priorty: 0,
  });

  while (q.length > 0) {
    const current = q.shift() as PriortyQueItem;

    // Mark as visited
    handleSetVisited(current.element.y, current.element.x, true);
    _visited[current.element.y][current.element.x] = true;

    if (arrayEquals([current.element.y, current.element.x], _end)) {
      path.add(`${start.y}-${start.x}`);
      findPath(newGrid[current.element.y][current.element.x]);
      break;
    }

    // check 4 directions
    for (let i = 0; i < 4; i++) {
      let ny = current.element.y + directions[i][0];
      let nx = current.element.x + directions[i][1];

      if (
        ny >= 0 &&
        nx >= 0 &&
        ny < grid.length &&
        nx < grid[0].length &&
        !_visited[ny][nx] &&
        (grid[ny][nx] === NodeType.Normal || grid[ny][nx] === NodeType.End)
      ) {
        const minDistance = Math.min(
          newGrid[ny][nx].distance,
          current.element.distance + 1
        );

        if (minDistance !== newGrid[ny][nx].distance) {
          // update
          newGrid[ny][nx] = {
            ...newGrid[ny][nx],
            distance: minDistance,
            parent: current.element,
          };

          const findInQue = q.findIndex(
            (i) =>
              i.element.x === newGrid[ny][nx].x &&
              i.element.y === newGrid[ny][nx].y
          );
          if (findInQue >= 0) {
            q[findInQue].priorty = minDistance;
          }
        }

        // check if newGrid[ny][nx] is in q
        const findNeighor = q.findIndex(
          (i) =>
            i.element.x === newGrid[ny][nx].x &&
            i.element.y === newGrid[ny][nx].y
        );
        if (findNeighor === -1) {
          // set parent
          newGrid[ny][nx] = {
            ...newGrid[ny][nx],
            parent: current.element,
          };

          q.push({
            element: newGrid[ny][nx],
            priorty: newGrid[ny][nx].distance,
          });
        }

        // change this later
        q.sort((a, b) => a.priorty - b.priorty);
      }
    }
    await timeout(10);
  }

  return path;
};

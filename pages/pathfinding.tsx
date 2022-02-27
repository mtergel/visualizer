import { AiFillCar } from "@react-icons/all-files/ai/AiFillCar";
import { FaFlagCheckered } from "@react-icons/all-files/fa/FaFlagCheckered";
import { GiMaze } from "@react-icons/all-files/gi/GiMaze";
import { HiCog } from "@react-icons/all-files/hi/HiCog";
import { HiOutlineInformationCircle } from "@react-icons/all-files/hi/HiOutlineInformationCircle";
import clsx from "clsx";
import Button from "components/Button/Button";
import Dialog, { DialogClose, DialogTitle } from "components/Dialog/Dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "components/Dropdown/Dropdown";
import IconButton from "components/IconButton/IconButton";
import astar from "core/astar";
import dijkstra from "core/dijkstra";
import { prims, recursiveDivision } from "core/maze";
import { bfs, dfs } from "core/pathfinding";
import memoize from "memoize-one";
import React, { memo, useCallback, useState } from "react";
import { areEqual, FixedSizeGrid as Grid } from "react-window";
import { NodeType } from "types";
import { useImmer } from "use-immer";

interface PathFindingProps {}

enum AlgoKey {
  "ASTAR" = "A*",
  "DIJKSTRA" = "Dijkstra's pathfinder",
  "BFS" = "Breadth First Search",
  "DFS" = "Depth First Search",
}

enum MazeKey {
  "RECURSIVE" = "Recursive Division",
  "PRIM" = "Randomized Prims",
}

type StateType = "INIT" | "FINDING" | "FINISHED";
const ROWS = 16;
const COLS = 40;

type DragNode = {
  type: NodeType;
  row: number;
  col: number;
  initRow: number;
  initCol: number;
};

const DraggableNodes = [NodeType.Start, NodeType.End];

let initialGrid = Array.from({ length: ROWS }, () =>
  Array.from({ length: COLS }, () => NodeType.Normal)
);

let initialVisited = Array.from({ length: ROWS }, () =>
  Array.from({ length: COLS }, () => false)
);

initialGrid[2][4] = NodeType.Start;
initialGrid[12][18] = NodeType.End;

const wallColor = "bg-slate-600 dark:bg-gray-600";
const pathColor = "bg-indigo-300 dark:bg-indigo-400";
const visitedColor = "bg-orange-300/70 dark:bg-orange-200/90";

const RenderNodeType: React.FC<{ nodeType: NodeType }> = ({ nodeType }) => {
  switch (nodeType) {
    case NodeType.Start: {
      return <AiFillCar className="h-6 w-6 text-black dark:text-white" />;
    }

    case NodeType.End: {
      return <FaFlagCheckered className="h-6 w-6 text-black dark:text-white" />;
    }

    default: {
      return null;
    }
  }
};

const legendData = [
  {
    name: "Start",
    render: <RenderNodeType nodeType={NodeType.Start} />,
  },
  {
    name: "End",
    render: <RenderNodeType nodeType={NodeType.End} />,
  },
  {
    name: "Wall",
    render: <div className={clsx("h-6 w-6", wallColor)} />,
  },
  {
    name: "Visited",
    render: <div className={clsx("h-6 w-6", visitedColor)} />,
  },
  {
    name: "Path",
    render: <div className={clsx("h-6 w-6", pathColor)} />,
  },
];

const createItemData = memoize(
  (
    grid,
    isMouseDown,
    dragNode,
    visited,
    path,
    state,
    handleSetNode,
    handleSetDragNode
  ) => ({
    grid,
    isMouseDown,
    dragNode,
    visited,
    path,
    state,
    handleSetNode,
    handleSetDragNode,
  })
);

const PathFinding: React.FC<PathFindingProps> = () => {
  const [grid, setGrid] = useImmer(initialGrid);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [dragNode, setDragNode] = useState<DragNode | null>(null);
  const [selectedAlgo, setSelectedAlgo] = useState<AlgoKey>(AlgoKey.ASTAR);
  const [visited, setVisited] = useImmer(initialVisited);
  const [path, setPath] = useState<Set<string>>(new Set());
  const [state, setState] = useState<StateType>("INIT");
  const [loading, setLoading] = useState(false);

  const handleSetDragNode = useCallback((node: DragNode | null) => {
    setDragNode(node);
  }, []);

  const handleSetNode = useCallback(
    (row: number, col: number, type: NodeType) => {
      setGrid((draft) => {
        draft[row][col] = type;
      });
    },
    // eslint-disable-next-line
    []
  );

  const handleSetVisited = useCallback(
    (row: number, col: number, value: boolean) => {
      setVisited((draft) => {
        draft[row][col] = value;
      });
    },
    // eslint-disable-next-line
    []
  );

  const itemData = createItemData(
    grid,
    isMouseDown,
    dragNode,
    visited,
    path,
    state,
    handleSetNode,
    handleSetDragNode
  );

  const handleStart = async () => {
    setState("FINDING");
    switch (selectedAlgo) {
      case AlgoKey.ASTAR: {
        let path = await astar(grid, handleSetVisited);
        setPath(path);
        break;
      }
      case AlgoKey.BFS: {
        let path = await bfs(grid, visited, handleSetVisited);
        setPath(path);
        break;
      }
      case AlgoKey.DFS: {
        let path = await dfs(grid, visited, handleSetVisited);
        setPath(path);
        break;
      }
      case AlgoKey.DIJKSTRA: {
        let path = await dijkstra(grid, handleSetVisited);
        setPath(path);
        break;
      }
    }
    setState("FINISHED");
  };

  const handleAgain = () => {
    setPath(new Set());
    setVisited(initialVisited);
    setState("INIT");
  };

  const handleClearWalls = useCallback(
    () => {
      setGrid((draft) => {
        // draft[row][col] = value;
        for (let i = 0; i < draft.length; i++) {
          for (let j = 0; j < draft[0].length; j++) {
            if (draft[i][j] === NodeType.Wall) {
              draft[i][j] = NodeType.Normal;
            }
          }
        }
        return draft;
      });
    },
    // eslint-disable-next-line
    []
  );

  const handleGenerateMaze = async (input: MazeKey) => {
    setLoading(true);
    handleClearWalls();
    setVisited(initialVisited);
    setState("INIT");

    switch (input) {
      case MazeKey.RECURSIVE: {
        await recursiveDivision(
          grid,
          2,
          grid.length - 3,
          2,
          grid[0].length - 3,
          "vertical",
          false,
          handleSetNode
        );
        break;
      }
      case MazeKey.PRIM: {
        await prims(grid, handleSetNode);
        break;
      }
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="h-[4.5rem] bg-skin-secondary border-b">
        <div className="max-w-screen-2xl mx-auto flex items-center h-full px-4 lg:px-[60px]">
          <div className="flex items-center flex-grow gap-3">
            <TutorialInfo />
            {state === "INIT" && (
              <div className="flex flex-grow gap-3">
                <div className="gap-2 items-center hidden md:flex">
                  <select
                    aria-label="select pathfinding algorithm"
                    value={selectedAlgo}
                    onChange={(e) =>
                      setSelectedAlgo(e.currentTarget.value as AlgoKey)
                    }
                    className="bg-transparent border border-skin-base rounded-lg font-semibold focus:outline-none focus:border-transparent focus:ring focus:ring-indigo-500 dark:focus:ring-indigo-300"
                  >
                    {Object.entries(AlgoKey).map((pair) => (
                      <option
                        key={pair[0]}
                        value={pair[1]}
                        className="font-normal text-sm bg-skin-base text-skin-base"
                      >
                        {pair[1]}
                      </option>
                    ))}
                  </select>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        disabled={loading}
                        leftIcon={<GiMaze />}
                        variant="outline"
                      >
                        Maze
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent sideOffset={4}>
                      <DropdownMenuItem
                        onClick={() => handleGenerateMaze(MazeKey.RECURSIVE)}
                        disabled={loading}
                      >
                        {MazeKey.RECURSIVE}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleGenerateMaze(MazeKey.PRIM)}
                        disabled={loading}
                      >
                        {MazeKey.PRIM}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button
                    disabled={loading}
                    variant="outline"
                    onClick={handleClearWalls}
                  >
                    Clear walls
                  </Button>
                </div>
                <Dialog
                  contentClassname="flex flex-col"
                  content={
                    <div className="h-full flex flex-col">
                      <div className="pt-5 px-6 pb-4 flex-grow">
                        <DialogTitle className="dialog-title">
                          Options
                        </DialogTitle>
                        <div className="flex flex-col gap-3 my-3">
                          <div className="flex flex-col w-full">
                            <label
                              htmlFor="pathalgo"
                              className="text-sm text-skin-muted mb-1"
                            >
                              Pathfinding algorithm:
                            </label>
                            <select
                              id="pathalgo"
                              aria-label="select pathfinding algorithm"
                              value={selectedAlgo}
                              onChange={(e) =>
                                setSelectedAlgo(
                                  e.currentTarget.value as AlgoKey
                                )
                              }
                              className="bg-transparent border border-skin-base rounded-lg font-semibold focus:outline-none focus:border-transparent focus:ring focus:ring-indigo-500 dark:focus:ring-indigo-300"
                            >
                              {Object.entries(AlgoKey).map((pair) => (
                                <option
                                  key={pair[0]}
                                  value={pair[1]}
                                  className="font-normal text-sm bg-skin-base text-skin-base"
                                >
                                  {pair[1]}
                                </option>
                              ))}
                            </select>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                disabled={loading}
                                leftIcon={<GiMaze />}
                                variant="outline"
                              >
                                Maze
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent sideOffset={4}>
                              <DialogClose asChild>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleGenerateMaze(MazeKey.RECURSIVE)
                                  }
                                  disabled={loading}
                                >
                                  {MazeKey.RECURSIVE}
                                </DropdownMenuItem>
                              </DialogClose>
                              <DialogClose asChild>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleGenerateMaze(MazeKey.PRIM)
                                  }
                                  disabled={loading}
                                >
                                  {MazeKey.PRIM}
                                </DropdownMenuItem>
                              </DialogClose>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          <Button
                            isDisabled={loading}
                            variant="outline"
                            onClick={handleClearWalls}
                          >
                            Clear walls
                          </Button>
                        </div>
                      </div>
                      <div className="bg-skin-offset px-6 pb-4 w-full">
                        <DialogClose asChild>
                          <Button
                            onClick={handleStart}
                            isFullWidth
                            color="primary"
                            className="px-8"
                            isDisabled={loading}
                          >
                            Search
                          </Button>
                        </DialogClose>
                      </div>
                    </div>
                  }
                >
                  <IconButton
                    aria-label="settings"
                    icon={<HiCog />}
                    color="primary"
                    className="md:hidden"
                  />
                </Dialog>
                <div className="flex-grow" />
                <Button
                  isDisabled={loading}
                  onClick={handleStart}
                  color="primary"
                >
                  Search
                </Button>
              </div>
            )}
            {state === "FINDING" && (
              <>
                <p className="text-sm">{selectedAlgo}</p>
                <div className="flex-grow" />
                <p className="text-sm">Finding...</p>
              </>
            )}
            {state === "FINISHED" && (
              <>
                <p className="text-sm">{selectedAlgo}</p>
                <div className="flex-grow" />
                <Button color="primary" onClick={handleAgain}>
                  New
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="flex-grow">
        <div
          className={clsx(
            "h-full w-full flex items-center justify-center select-none",
            dragNode && "cursor-grabbing"
          )}
          onMouseDown={() => setIsMouseDown(true)}
          onMouseUp={() => setIsMouseDown(false)}
        >
          <Grid
            columnCount={COLS}
            columnWidth={30}
            height={480}
            rowCount={ROWS}
            rowHeight={30}
            width={1200}
            itemData={itemData}
          >
            {Cell}
          </Grid>
        </div>
      </div>
    </div>
  );
};

const Cell = memo((props: any) => {
  const {
    grid,
    isMouseDown,
    dragNode,
    visited,
    path,
    state,
    handleSetNode,
    handleSetDragNode,
  }: {
    grid: NodeType[][];
    isMouseDown: boolean;
    dragNode: DragNode | null;
    visited: Boolean[][];
    path: Set<string>;
    state: StateType;
    handleSetNode: (row: number, col: number, type: NodeType) => void;
    handleSetDragNode: (node: DragNode | null) => void;
  } = props.data;
  const { columnIndex, rowIndex }: { columnIndex: number; rowIndex: number } =
    props;
  const cell = grid[rowIndex][columnIndex];
  const handleMouseOver = () => {
    if (isMouseDown) {
      if (dragNode) {
        handleSetDragNode({
          ...dragNode,
          col: columnIndex,
          row: rowIndex,
        });
      } else if (cell === NodeType.Normal) {
        handleSetNode(rowIndex, columnIndex, NodeType.Wall);
      } else if (cell === NodeType.Wall) {
        handleSetNode(rowIndex, columnIndex, NodeType.Normal);
      }
    }
  };
  const handleMouseDown = () => {
    if (cell === NodeType.Normal) {
      handleSetNode(rowIndex, columnIndex, NodeType.Wall);
    } else if (cell === NodeType.Wall) {
      handleSetNode(rowIndex, columnIndex, NodeType.Normal);
    } else if (DraggableNodes.includes(cell)) {
      handleSetDragNode({
        type: cell,
        col: columnIndex,
        row: rowIndex,
        initRow: rowIndex,
        initCol: columnIndex,
      });
    }
  };

  const handleMouseUp = () => {
    if (dragNode && isMouseDown) {
      if (DraggableNodes.includes(cell)) {
        handleSetDragNode(null);
        return;
      }

      handleSetNode(dragNode.initRow, dragNode.initCol, NodeType.Normal);
      handleSetNode(rowIndex, columnIndex, dragNode.type);
      handleSetDragNode(null);
    }
  };

  const isDraggingNodeHere =
    dragNode && rowIndex === dragNode.row && columnIndex === dragNode.col;

  const getNodeColor = () => {
    if (path.has(`${rowIndex}-${columnIndex}`)) {
      return pathColor;
    }

    if (visited[rowIndex][columnIndex]) {
      return visitedColor;
    }

    return null;
  };

  const canEdit = state === "INIT";

  return (
    <div
      style={props.style}
      onMouseDown={canEdit ? handleMouseDown : undefined}
      onMouseOver={canEdit ? handleMouseOver : undefined}
      onMouseUp={canEdit ? handleMouseUp : undefined}
      className={clsx(
        "border-t border-l border-slate-800 dark:border-slate-500 flex items-center justify-center transition-colors",
        rowIndex === ROWS - 1 && "border-b",
        columnIndex === COLS - 1 && "border-r",
        !isDraggingNodeHere && cell === NodeType.Wall && wallColor,
        canEdit && DraggableNodes.includes(cell) && "cursor-grab",
        isDraggingNodeHere && "bg-gray-400 dark:bg-gray-100/20 opacity-60",
        getNodeColor()
      )}
    >
      {isDraggingNodeHere ? (
        <RenderNodeType nodeType={dragNode.type} />
      ) : (
        <RenderNodeType nodeType={cell} />
      )}
    </div>
  );
}, areEqual);

Cell.displayName = "GridCell";

const TutorialInfo: React.FC<{}> = () => {
  return (
    <Dialog
      contentClassname="flex flex-col"
      content={
        <div className="h-full flex flex-col">
          <div className="pt-5 px-6 pb-4 flex-grow">
            <DialogTitle className="dialog-title">Tutorial</DialogTitle>
            <ul className="dialog-description">
              <li>You can drag start and end nodes to move them around</li>
              <li>
                You can draw walls using your mouse/touch or generate a maze
              </li>
              <li>You can select a pathfinding algorithm</li>
              <li className="mt-2">When you are ready click find path!</li>
            </ul>

            <div className="flex flex-col gap-6 my-3">
              <div>
                <p className="text-sm mb-2 font-semibold">Cell legend</p>
                <div className="grid grid-cols-2 gap-2">
                  {legendData.map((i) => (
                    <div className="flex items-center gap-2" key={i.name}>
                      {i.render}
                      <p className="text-sm text-skin-muted">{i.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <IconButton aria-label="info" icon={<HiOutlineInformationCircle />} />
    </Dialog>
  );
};

export default PathFinding;

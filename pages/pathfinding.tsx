import { AiFillCar } from "@react-icons/all-files/ai/AiFillCar";
import { FaFlagCheckered } from "@react-icons/all-files/fa/FaFlagCheckered";
import clsx from "clsx";
import Button from "components/Button/Button";
import memoize from "memoize-one";
import React, { memo, useCallback, useState } from "react";
import { areEqual, FixedSizeGrid as Grid } from "react-window";
import { useImmer } from "use-immer";

interface PathFindingProps {}

enum AlgoKey {
  "DIJKSTRA" = "Dijkstra",
}

const ROWS = 16;
const COLS = 40;

const enum NodeType {
  "Normal",
  "Start",
  "End",
  "Wall",
}
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

initialGrid[4][4] = NodeType.Start;
initialGrid[12][36] = NodeType.End;

const wallColor = "bg-gray-400 dark:bg-gray-500";

const createItemData = memoize(
  (grid, isMouseDown, dragNode, handleSetNode, handleSetDragNode) => ({
    grid,
    isMouseDown,
    dragNode,
    handleSetNode,
    handleSetDragNode,
  })
);

const PathFinding: React.FC<PathFindingProps> = () => {
  const [grid, setGrid] = useImmer(initialGrid);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [dragNode, setDragNode] = useState<DragNode | null>(null);
  const [selectedAlgo, setSelectedAlgo] = useState<AlgoKey>(AlgoKey.DIJKSTRA);
  const [visited, setVisited] = useImmer(initialVisited);

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

  const itemData = createItemData(
    grid,
    isMouseDown,
    dragNode,
    handleSetNode,
    handleSetDragNode
  );

  const handleStart = () => {};

  return (
    <div className="flex flex-col h-full">
      <div className="h-[4.5rem] bg-skin-secondary border-b">
        <div className="max-w-screen-2xl mx-auto flex items-center h-full px-4 md:px-[60px]">
          <div className="items-center flex-grow gap-3 hidden sm:flex">
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
          </div>

          <Button
            onClick={handleStart}
            color="primary"
            className="px-8 w-full sm:w-auto"
          >
            Visualize
          </Button>
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
    handleSetNode,
    handleSetDragNode,
  }: {
    grid: NodeType[][];
    isMouseDown: boolean;
    dragNode: DragNode | null;
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
      }
    }
  };
  const handleMouseDown = () => {
    if (cell === NodeType.Normal) {
      handleSetNode(rowIndex, columnIndex, NodeType.Wall);
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

  return (
    <div
      style={props.style}
      onMouseDown={handleMouseDown}
      onMouseOver={handleMouseOver}
      onMouseUp={handleMouseUp}
      className={clsx(
        "border-t border-l flex items-center justify-center transition-colors",
        props.rowIndex === ROWS - 1 && "border-b",
        props.columnIndex === COLS - 1 && "border-r",
        !isDraggingNodeHere && cell === NodeType.Wall && wallColor,
        DraggableNodes.includes(cell) && "cursor-grab",
        isDraggingNodeHere && "bg-gray-400 dark:bg-gray-100/20 opacity-60"
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

const RenderNodeType: React.FC<{ nodeType: NodeType }> = ({ nodeType }) => {
  switch (nodeType) {
    case NodeType.Start: {
      return <AiFillCar className="h-7 w-7 dark:text-indigo-300" />;
    }

    case NodeType.End: {
      return (
        <FaFlagCheckered className="h-6 w-6 text-green-700 dark:text-green-300" />
      );
    }

    default: {
      return null;
    }
  }
};

Cell.displayName = "GridCell";
export default PathFinding;

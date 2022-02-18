import { AiFillCar } from "@react-icons/all-files/ai/AiFillCar";
import { FaFlagCheckered } from "@react-icons/all-files/fa/FaFlagCheckered";
import clsx from "clsx";
import IconButton from "components/IconButton/IconButton";
import memoize from "memoize-one";
import React, { memo, useState } from "react";
import { areEqual, FixedSizeGrid as Grid } from "react-window";
import { RiPencilRuler2Line } from "@react-icons/all-files/ri/RiPencilRuler2Line";
import * as Toolbar from "@radix-ui/react-toolbar";

interface PathFindingProps {}

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

initialGrid[4][4] = NodeType.Start;
initialGrid[12][36] = NodeType.End;

const wallColor = "bg-gray-400 dark:bg-gray-500";

const createItemData = memoize(
  (grid, isMouseDown, dragNode, handleSetGrid, handleSetDragNode) => ({
    grid,
    isMouseDown,
    dragNode,
    handleSetGrid,
    handleSetDragNode,
  })
);

const PathFinding: React.FC<PathFindingProps> = () => {
  const [grid, setGrid] = useState(initialGrid);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [dragNode, setDragNode] = useState<DragNode | null>(null);

  const handleSetGrid = (grid: NodeType[][]) => {
    setGrid(grid);
  };
  const handleSetDragNode = (node: DragNode | null) => {
    setDragNode(node);
  };

  const itemData = createItemData(
    grid,
    isMouseDown,
    dragNode,
    handleSetGrid,
    handleSetDragNode
  );

  return (
    <div className="flex flex-col h-full">
      <div className="h-[4.5rem] bg-skin-secondary border-b">
        <div className="max-w-screen-2xl mx-auto flex items-center h-full px-4 md:px-[60px]"></div>
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
    handleSetGrid,
    handleSetDragNode,
  }: {
    grid: NodeType[][];
    isMouseDown: boolean;
    dragNode: DragNode | null;
    handleSetGrid: (grid: NodeType[][]) => void;
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
        let copy = [...grid];
        copy[rowIndex][columnIndex] = NodeType.Wall;
        handleSetGrid(copy);
      }
    }
  };
  const handleMouseDown = () => {
    if (cell === NodeType.Normal) {
      // set normal to wall
      let copy = [...grid];
      copy[rowIndex][columnIndex] = NodeType.Wall;
      handleSetGrid(copy);
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

      let copy = [...grid];
      copy[dragNode.initRow][dragNode.initCol] = NodeType.Normal;
      copy[rowIndex][columnIndex] = dragNode.type;
      handleSetGrid(copy);
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

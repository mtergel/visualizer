import { AiFillCar } from "@react-icons/all-files/ai/AiFillCar";
import clsx from "clsx";
import memoize from "memoize-one";
import { memo, useState } from "react";
import { areEqual, FixedSizeGrid as Grid } from "react-window";
import { FaFlagCheckered } from "@react-icons/all-files/fa/FaFlagCheckered";

interface PathFindingProps {}

const ROWS = 16;
const COLS = 40;

const enum NodeType {
  "Normal" = 0,
  "Start",
  "End",
}

let initialGrid = Array.from({ length: ROWS }, () =>
  Array.from({ length: COLS }, () => NodeType.Normal)
);

initialGrid[4][4] = NodeType.Start;
initialGrid[12][36] = NodeType.End;

const wallColor = "bg-skin-secondary";

const createItemData = memoize((grid) => ({
  grid,
}));

const PathFinding: React.FC<PathFindingProps> = () => {
  const [grid, setGrid] = useState(initialGrid);
  const itemData = createItemData(grid);

  return (
    <div className="flex flex-col h-full">
      <div className="h-[4.5rem] bg-skin-secondary border-b">
        <div className="max-w-screen-2xl mx-auto flex items-center h-full px-4 md:px-[60px]">
          SUB HEADER
        </div>
      </div>
      <div className="flex-grow">
        <div className="h-full w-full flex items-center justify-center">
          <Grid
            columnCount={COLS}
            columnWidth={36}
            height={576}
            rowCount={ROWS}
            rowHeight={36}
            width={1440}
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
  const { grid }: { grid: NodeType[][] } = props.data;
  const { columnIndex, rowIndex }: { columnIndex: number; rowIndex: number } =
    props;
  const cell = grid[rowIndex][columnIndex];
  return (
    <div
      style={props.style}
      className={clsx(
        "border-t border-l flex items-center justify-center",
        props.rowIndex === ROWS - 1 && "border-b",
        props.columnIndex === COLS - 1 && "border-r"
      )}
    >
      {cell === NodeType.Start && (
        <AiFillCar className="h-7 w-7 dark:text-indigo-300" />
      )}

      {cell === NodeType.End && (
        <FaFlagCheckered className="h-6 w-6 text-green-700 dark:text-green-300" />
      )}
    </div>
  );
}, areEqual);

Cell.displayName = "GridCell";
export default PathFinding;

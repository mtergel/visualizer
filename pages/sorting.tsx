import { HiCog } from "@react-icons/all-files/hi/HiCog";
import { HiOutlineInformationCircle } from "@react-icons/all-files/hi/HiOutlineInformationCircle";
import clsx from "clsx";
import Button from "components/Button/Button";
import Dialog, {
  DialogClose,
  DialogDescription,
  DialogTitle,
} from "components/Dialog/Dialog";
import IconButton from "components/IconButton/IconButton";
import Slider from "components/Slider/Slider";
import Tooltip from "components/Tooltip/Tooltip";
import {
  bubbleSort,
  checkSorted,
  insertionSort,
  selectionSort,
} from "core/sorting";
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useResizeDetector } from "react-resize-detector";
import { UIArray } from "types";
import { generateRandomArray } from "utils/arrayUtils";

interface SortingProps {}

const ARRAY_MAX = 600;
const ARRAY_INIT = 100;
const ARRAY_LOWER = 1;
const ARRAY_UPPER = 100;

enum AlgoKey {
  "BUBBLE" = "Bubble Sort",
  "SELECTION" = "Selection Sort",
  "INSERTION" = "Insertion Sort",
  "MERGE" = "Merge Sort",
  "QUICK" = "Quick Sort",
  "HEAP" = "Heap Sort",
}

type StateType = "INIT" | "SORTING" | "CHECKING" | "FINISHED";

const Sorting: React.FC<SortingProps> = () => {
  const [randomArray, setRandomArray] = useState<UIArray | null>(null);
  const [arrayLen, setArrayLen] = useState(ARRAY_INIT);
  const [sortingAlgo, setSortingAlgo] = useState<AlgoKey>(AlgoKey.BUBBLE);
  const [looking, setLooking] = useState<string[]>([]);
  const { width, height, ref } = useResizeDetector();
  const [state, setState] = useState<StateType>("INIT");
  const [time, setTime] = useState<number>();

  let DEFAULT_TIMEOUT = 1;
  if (arrayLen > 100) {
    DEFAULT_TIMEOUT = 0;
  } else if (arrayLen > 40) {
    DEFAULT_TIMEOUT = 5;
  } else {
    DEFAULT_TIMEOUT = 40;
  }

  useEffect(() => {
    const generated = generateRandomArray(ARRAY_INIT, ARRAY_LOWER, ARRAY_UPPER);
    setRandomArray(generated);
  }, []);

  const handleGenerateNew = useCallback((len) => {
    const generated = generateRandomArray(len, ARRAY_LOWER, ARRAY_UPPER);
    setRandomArray(generated);
  }, []);

  const handleAlgoChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSortingAlgo(e.currentTarget.value as AlgoKey);
  };

  const handleSort = useCallback(async () => {
    if (randomArray) {
      const callback = (looking: string[], arr: UIArray) => {
        setLooking(looking);
        setRandomArray(arr);
        return state === "INIT";
      };
      setState("SORTING");

      let t0 = performance.now();
      // if (sortingAlgo === AlgoKey.BUBBLE) {

      // }
      let sortedArr: UIArray = [];
      switch (sortingAlgo) {
        case AlgoKey.BUBBLE: {
          sortedArr = await bubbleSort(randomArray, callback, DEFAULT_TIMEOUT);
          break;
        }
        case AlgoKey.SELECTION: {
          sortedArr = await selectionSort(
            randomArray,
            callback,
            DEFAULT_TIMEOUT
          );
          break;
        }
        case AlgoKey.INSERTION: {
          sortedArr = await insertionSort(
            randomArray,
            callback,
            DEFAULT_TIMEOUT
          );
          break;
        }
      }

      let t1 = performance.now();
      setTime(t1 - t0);
      setState("CHECKING");
      const checkCallback = (looking: string[]) => {
        setLooking(looking);
      };

      await checkSorted(sortedArr, checkCallback, DEFAULT_TIMEOUT + 10);
      setState("FINISHED");
    }
  }, [randomArray, state, DEFAULT_TIMEOUT, sortingAlgo]);

  let activeColor = "bg-indigo-500 dark:bg-indigo-300";
  if (state === "CHECKING") {
    activeColor = "bg-teal-500 dark:bg-teal-300";
  } else if (state === "FINISHED") {
    activeColor = "bg-emerald-500 dark:bg-emerald-300";
  }

  return (
    <div className="flex flex-col h-full">
      <div className="h-[4.5rem] bg-skin-secondary border-b">
        <div className="max-w-screen-2xl mx-auto flex items-center h-full px-4 md:px-[60px]">
          {state === "INIT" && (
            <SortOptionsToolbar
              arrayLen={arrayLen}
              sortingAlgo={sortingAlgo}
              handleAlgoChange={handleAlgoChange}
              handleGenerateNew={handleGenerateNew}
              handleSort={handleSort}
              setArrayLen={setArrayLen}
            />
          )}
          {state === "SORTING" && <p className="text-sm">Sorting...</p>}
          {state === "CHECKING" && <p className="text-sm">Checking...</p>}
          {state === "FINISHED" && (
            <div className="flex items-center gap-3">
              <Tooltip
                openDelay={100}
                contentClassname="py-1 px-2 text-sm"
                content={
                  <p>
                    This value is not an accurate presentation of the algorithm.
                  </p>
                }
              >
                <div className="flex items-center gap-1">
                  <HiOutlineInformationCircle />
                  <p>Sorted in: {time ? `${time}ms` : "Not timed."}</p>
                </div>
              </Tooltip>

              <Button
                color="primary"
                onClick={() => {
                  handleGenerateNew(arrayLen);
                  setState("INIT");
                }}
              >
                New
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="flex-grow pt-4">
        <div className="max-w-screen-2xl mx-auto h-full px-4 md:px-[56px]">
          <div
            className="h-full w-full flex items-end justify-around"
            ref={ref}
          >
            {width && height && randomArray ? (
              randomArray.map((i) => (
                <div
                  key={i.id}
                  style={{
                    height: `${i.value}%`,
                    width: `${100 / randomArray.length}%`,
                  }}
                  className={clsx(
                    " rounded-t-full flex-shrink-0",
                    looking.includes(i.id)
                      ? activeColor
                      : "bg-black bg-opacity-10 dark:bg-white dark:bg-opacity-20"
                  )}
                />
              ))
            ) : (
              <div>Loading...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface SortOptionsToolbarProps {
  setArrayLen: Dispatch<SetStateAction<number>>;
  handleGenerateNew: (len: any) => void;
  sortingAlgo: AlgoKey;
  handleAlgoChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  arrayLen: number;
  handleSort: () => Promise<void>;
}
const SortOptionsToolbar: React.FC<SortOptionsToolbarProps> = ({
  sortingAlgo,
  arrayLen,
  handleAlgoChange,
  handleGenerateNew,
  handleSort,
  setArrayLen,
}) => {
  return (
    <>
      <div className="items-center flex-grow gap-3 hidden sm:flex">
        <div className="max-w-[200px] w-full flex-shrink-0 flex flex-col">
          <label htmlFor="arrayLength" className="text-xs text-skin-muted">
            Size
          </label>
          <Slider
            id="arrayLength"
            min={10}
            max={ARRAY_MAX}
            step={10}
            onValueChange={(val) => {
              setArrayLen(val[0]);
              handleGenerateNew(val[0]);
            }}
            name="Array length"
            value={[arrayLen]}
          />
        </div>
        <select
          aria-label="select sorting algorithm"
          value={sortingAlgo}
          onChange={handleAlgoChange}
          className="h-10 bg-transparent border border-skin-base rounded-lg font-semibold focus:outline-none focus:border-transparent focus:ring focus:ring-indigo-500 dark:focus:ring-indigo-300"
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

      <div className="flex-shrink-0 flex items-center justify-end gap-2 w-full sm:w-auto">
        <Dialog
          contentClassname="flex flex-col"
          content={
            <div className="h-full flex flex-col">
              <div className="pt-5 px-6 pb-4 flex-grow">
                <DialogTitle className="dialog-title">Sort options</DialogTitle>
                <DialogDescription className="dialog-description">
                  You can tweak the settings of the visualization here.
                </DialogDescription>
                <div className="flex flex-col gap-6 my-3">
                  <div className="w-full flex-shrink-0 flex flex-col">
                    <label className="text-sm text-skin-muted">Size</label>
                    <Slider
                      min={10}
                      max={ARRAY_MAX}
                      step={10}
                      onValueChange={(val) => {
                        setArrayLen(val[0]);
                        handleGenerateNew(val[0]);
                      }}
                      name="Array length"
                      value={[arrayLen]}
                    />
                  </div>
                  <select
                    aria-label="select sorting algorithm"
                    value={sortingAlgo}
                    onChange={handleAlgoChange}
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
              </div>
              <div className="bg-skin-offset px-6 pb-4 w-full">
                <DialogClose asChild>
                  <Button
                    onClick={handleSort}
                    isFullWidth
                    color="primary"
                    className="px-8"
                  >
                    Sort
                  </Button>
                </DialogClose>
              </div>
            </div>
          }
        >
          <IconButton
            color="primary"
            aria-label="settings"
            className="inline-flex sm:hidden"
            icon={<HiCog />}
          />
        </Dialog>

        <Button
          onClick={handleSort}
          color="primary"
          className="px-8 w-full sm:w-auto"
        >
          Sort
        </Button>
      </div>
    </>
  );
};

export default Sorting;

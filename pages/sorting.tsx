import Button from "components/Button/Button";
import IconButton from "components/IconButton/IconButton";
import Slider from "components/Slider/Slider";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useResizeDetector } from "react-resize-detector";
import { generateRandomArray } from "utils/arrayUtils";
import { HiCog } from "@react-icons/all-files/hi/HiCog";
import Dialog, {
  DialogClose,
  DialogDescription,
  DialogTitle,
} from "components/Dialog/Dialog";

interface SortingProps {}

const ARRAY_MAX = 200;
const ARRAY_LEN = 100;
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

const Sorting: React.FC<SortingProps> = () => {
  const [randomArray, setRandomArray] = useState<
    { id: string; value: number }[] | null
  >(null);
  const [arrayLen, setArrayLen] = useState(ARRAY_LEN);
  const [sortingAlgo, setSortingAlgo] = useState<AlgoKey>(AlgoKey.BUBBLE);
  const { width, height, ref } = useResizeDetector();

  useEffect(() => {
    setRandomArray(generateRandomArray(ARRAY_LEN, ARRAY_LOWER, ARRAY_UPPER));
  }, []);

  const handleGenerateNew = useCallback(() => {
    setRandomArray(generateRandomArray(arrayLen, ARRAY_LOWER, ARRAY_UPPER));
  }, [arrayLen]);

  const handleAlgoChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSortingAlgo(e.currentTarget.value as AlgoKey);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="h-[4.5rem] bg-skin-secondary border-b">
        <div className="max-w-screen-2xl mx-auto flex items-center h-full px-4 md:px-[60px]">
          <div className="items-center flex-grow gap-3 hidden sm:flex">
            <div className="max-w-[144px] w-full flex-shrink-0 flex flex-col">
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
                  handleGenerateNew();
                }}
                name="Array length"
                value={[arrayLen]}
              />
            </div>
            <label htmlFor=""></label>
            <select
              aria-label="select sorting algorithm"
              value={sortingAlgo}
              onChange={handleAlgoChange}
              className="h-10 bg-transparent border border-skin-base rounded-lg font-semibold focus:ring focus:ring-gray-300"
            >
              {Object.entries(AlgoKey).map((pair) => (
                <option key={pair[0]} value={pair[1]} className="font-normal">
                  {pair[1]}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-shrink-0 flex items-center justify-end gap-2">
            <Dialog
              contentClassname="flex flex-col"
              content={
                <div className="h-full flex flex-col">
                  <div className="pt-5 px-6 pb-4 flex-grow">
                    <DialogTitle className="dialog-title">
                      Sort options
                    </DialogTitle>
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
                            handleGenerateNew();
                          }}
                          name="Array length"
                          value={[arrayLen]}
                        />
                      </div>
                      <select
                        aria-label="select sorting algorithm"
                        value={sortingAlgo}
                        onChange={handleAlgoChange}
                        className="bg-transparent border border-skin-base rounded-lg font-semibold focus:ring focus:ring-gray-300"
                      >
                        {Object.entries(AlgoKey).map((pair) => (
                          <option
                            key={pair[0]}
                            value={pair[1]}
                            className="font-normal"
                          >
                            {pair[1]}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="bg-skin-offset px-6 pb-4 w-full">
                    <DialogClose asChild>
                      <Button isFullWidth color="primary" className="px-8">
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

            <Button color="primary" className="px-8">
              Sort
            </Button>
          </div>
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
                  className="bg-black bg-opacity-10 dark:bg-white dark:bg-opacity-20 rounded-t-full flex-shrink-0"
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

export default Sorting;

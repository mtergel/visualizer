import Button from "components/Button/Button";
import Slider from "components/Slider/Slider";
import { useCallback, useEffect, useState } from "react";
import { useResizeDetector } from "react-resize-detector";
import { generateRandomArray } from "utils/arrayUtils";

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
  const { width, height, ref } = useResizeDetector();

  useEffect(() => {
    setRandomArray(generateRandomArray(ARRAY_LEN, ARRAY_LOWER, ARRAY_UPPER));
  }, []);

  const handleGenerateNew = useCallback(() => {
    setRandomArray(generateRandomArray(arrayLen, ARRAY_LOWER, ARRAY_UPPER));
  }, [arrayLen]);

  return (
    <div className="flex flex-col h-full">
      <div className="h-16 bg-skin-secondary border-b">
        <div className="max-w-screen-2xl mx-auto flex items-center h-full px-4 md:px-[60px]">
          <div className="flex items-center flex-grow gap-3">
            <Button variant="outline" onClick={handleGenerateNew}>
              Generate
            </Button>
            <div className="max-w-[144px] w-full flex-shrink-0">
              <Slider
                min={10}
                max={ARRAY_MAX}
                step={10}
                onValueChange={(val) => {
                  setArrayLen(val[0]);
                  handleGenerateNew();
                }}
                name="array_length"
                value={[arrayLen]}
              />
            </div>
          </div>

          <div className="flex-shrink-0 flex items-center justify-end">
            <Button color="primary">Sort</Button>
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

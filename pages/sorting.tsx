import Button from "components/Button/Button";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useResizeDetector } from "react-resize-detector";
import { generateRandomArray } from "utils/arrayUtils";

interface SortingProps {}

const ARRAY_MAX = 200;
const ARRAY_LEN = 100;
const ARRAY_LOWER = 1;
const ARRAY_UPPER = 100;

const Sorting: React.FC<SortingProps> = () => {
  const [randomArray, setRandomArray] = useState<
    { id: string; value: number }[] | null
  >(null);
  const { width, height, ref } = useResizeDetector();

  useEffect(() => {
    setRandomArray(generateRandomArray(ARRAY_LEN, ARRAY_LOWER, ARRAY_UPPER));
  }, []);

  const handleGenerateNew = useCallback(() => {
    setRandomArray(generateRandomArray(ARRAY_LEN, ARRAY_LOWER, ARRAY_UPPER));
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="h-16 bg-skin-secondary border-b">
        <div className="max-w-screen-2xl mx-auto flex items-center h-full px-4 md:px-[56px]">
          <Button variant="outline" onClick={handleGenerateNew}>
            Generate New
          </Button>
          <div className="flex-grow flex items-center justify-end">
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
                    width: `${100 / ARRAY_LEN}%`,
                  }}
                  className="bg-gray-400 rounded-t-full flex-shrink-0"
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

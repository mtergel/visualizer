import Button from "components/Button/Button";
import { generateRandomArray } from "utils/arrayUtils";
interface SortingProps {}

/**
 * TODO:
 * 1. Array initializer
 *
 */

const Sorting: React.FC<SortingProps> = () => {
  const randomArray = generateRandomArray(100, 0, 100);
  return (
    <div className="flex flex-col">
      <div className="h-16 bg-skin-secondary border-b">
        <div className="max-w-screen-2xl mx-auto flex items-center h-full px-4 md:px-[56px]">
          <Button variant="outline">Generate New</Button>
          <div className="flex-grow flex items-center justify-end">
            <Button color="primary">Sort</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sorting;

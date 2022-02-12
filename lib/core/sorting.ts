import { UIArray } from "types";
import { timeout } from "utils/timingUtils";

export const checkSorted = async (
  arr: UIArray,
  callback: (looking: string[]) => void,
  delay: number
) => {
  let viewed: string[] = [];
  if (arr.length == 0 || arr.length == 1) {
    return true;
  }

  viewed.push(arr[0].id);
  callback([...viewed]);
  await timeout(delay);

  for (let i = 1; i < arr.length; i++) {
    viewed.push(arr[i].id);
    callback([...viewed]);
    await timeout(delay);
    if (arr[i - 1].value > arr[i].value) {
      return false;
    }
  }
  callback([...viewed]);
  return true;
};

export const bubbleSort = async (
  arr: UIArray,
  callback: (looking: string[], arr: UIArray) => void,
  delay: number
) => {
  let swapped = false;
  let _arr = [...arr];

  for (let i = 0; i < _arr.length; i++) {
    for (let j = 0; j < _arr.length - i - 1; j++) {
      callback([_arr[j].id, _arr[j + 1].id], _arr);
      await timeout(delay);
      if (_arr[j].value > _arr[j + 1].value) {
        [_arr[j], _arr[j + 1]] = [_arr[j + 1], _arr[j]];
        callback([_arr[j].id, _arr[j + 1].id], _arr);
        await timeout(delay);
        swapped = true;
      }
      callback([_arr[j].id, _arr[j + 1].id], _arr);
      await timeout(delay);
    }

    if (swapped === false) {
      break; // no swaps occured array is sorted already
    }
  }
  callback([], _arr);
  return _arr;
};

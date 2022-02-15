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

export const selectionSort = async (
  arr: UIArray,
  callback: (looking: string[], arr: UIArray) => void,
  delay: number
) => {
  let _arr = [...arr];
  let minPos = 0;

  for (let i = 0; i < _arr.length - 1; i++) {
    minPos = i;
    for (let j = i + 1; j < _arr.length; j++) {
      callback([_arr[j].id, _arr[minPos].id], _arr);
      await timeout(delay);
      if (_arr[j].value < _arr[minPos].value) {
        minPos = j;
      }
    }

    if (minPos != i) {
      [_arr[minPos], _arr[i]] = [_arr[i], _arr[minPos]];
      callback([_arr[minPos].id, _arr[i].id], _arr);
      await timeout(delay);
    }
  }

  callback([], _arr);
  return _arr;
};

export const insertionSort = async (
  arr: UIArray,
  callback: (looking: string[], arr: UIArray) => void,
  delay: number
) => {
  let _arr = [...arr];

  for (let i = 1; i < _arr.length; i++) {
    let current = _arr[i];
    let j = i - 1;

    callback([current.id, _arr[j].id], _arr);
    await timeout(delay);

    while (j >= 0 && current.value < _arr[j].value) {
      callback([current.id, _arr[j].id], _arr);
      await timeout(delay);

      [_arr[j + 1], _arr[j]] = [_arr[j], _arr[j + 1]];
      j--;
    }
  }

  callback([], _arr);
  return _arr;
};

// main merge
export const mergeSort = async (
  arr: UIArray,
  callback: (looking: string[], arr: UIArray) => void,
  delay: number
) => {
  let _arr = [...arr];
  await mergeSortHelper(_arr, callback, delay, 0, _arr.length);
  callback([], _arr);
  return _arr;
};

// divider
const mergeSortHelper = async (
  arr: UIArray,
  callback: (looking: string[], arr: UIArray) => void,
  delay: number,
  l: number,
  r: number
) => {
  if (r - l < 2) return;

  let mid = l + Math.floor((r - l) / 2);
  await mergeSortHelper(arr, callback, delay, l, mid);
  await mergeSortHelper(arr, callback, delay, mid, r);
  await merger(arr, callback, delay, l, mid, r);
};

const merger = async (
  arr: UIArray,
  callback: (looking: string[], arr: UIArray) => void,
  delay: number,
  leftIndex: number,
  mid: number,
  rightIndex: number
) => {
  let result = [];
  let l = leftIndex,
    r = mid;
  while (l < mid && r < rightIndex) {
    callback([arr[l].id, arr[r].id], arr);
    await timeout(delay);
    if (arr[l].value < arr[r].value) {
      result.push(arr[l++]);
    } else {
      result.push(arr[r++]);
    }
  }
  result = result.concat(arr.slice(l, mid)).concat(arr.slice(r, rightIndex));
  for (let i = 0; i < rightIndex - leftIndex; i++) {
    arr[leftIndex + i] = {
      id: arr[leftIndex + i].id,
      value: result[i].value,
    };

    callback([arr[leftIndex + i].id], arr);
    await timeout(delay);
  }
};

// main merge
export const quickSort = async (
  arr: UIArray,
  callback: (looking: string[], arr: UIArray) => void,
  delay: number
) => {
  let _arr = [...arr];
  await quickSortHelper(_arr, callback, delay, 0, _arr.length - 1);
  callback([], _arr);
  return _arr;
};
const quickSortHelper = async (
  arr: UIArray,
  callback: (looking: string[], arr: UIArray) => void,
  delay: number,
  l: number,
  r: number
) => {
  if (l < r) {
    let pi = await qPartition(arr, callback, delay, l, r);

    await quickSortHelper(arr, callback, delay, l, pi - 1);
    await quickSortHelper(arr, callback, delay, pi + 1, r);
  }
};

const qPartition = async (
  arr: UIArray,
  callback: (looking: string[], arr: UIArray) => void,
  delay: number,
  l: number,
  r: number
) => {
  let pivot = arr[r];
  let i = l - 1;
  for (let j = l; j <= r - 1; j++) {
    callback([arr[j].id, pivot.id], arr);
    await timeout(delay);
    if (arr[j].value < pivot.value) {
      i++;
      callback([arr[j].id, arr[i].id, pivot.id], arr);
      await timeout(delay);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  callback([arr[i + 1].id, arr[r].id], arr);
  await timeout(delay);
  [arr[i + 1], arr[r]] = [arr[r], arr[i + 1]];
  return i + 1;
};

export const heapSort = async (
  arr: UIArray,
  callback: (looking: string[], arr: UIArray) => void,
  delay: number
) => {
  let _arr = [...arr];
  let n = _arr.length;

  const maxHeapify = async (n: number, i: number) => {
    let largest = i;
    let l = 2 * i + 1;
    let r = 2 * i + 2;

    if (l < n) {
      callback([_arr[l].id, _arr[largest].id], _arr);
      await timeout(delay);
      if (_arr[l].value > _arr[largest].value) {
        largest = l;
      }
    }

    if (r < n) {
      callback([_arr[r].id, _arr[largest].id], _arr);
      await timeout(delay);
      if (_arr[r].value > _arr[largest].value) {
        largest = r;
      }
    }

    if (largest != i) {
      [_arr[i], _arr[largest]] = [_arr[largest], _arr[i]];
      await maxHeapify(n, largest);
    }
  };

  // Build heap
  for (let i = Math.floor(n / 2 - 1); i >= 0; i--) {
    await maxHeapify(n, i);
  }

  for (let i = n - 1; i >= 0; i--) {
    callback([_arr[0].id, _arr[i].id], _arr);
    await timeout(delay);
    [_arr[0], _arr[i]] = [_arr[i], _arr[0]];

    await maxHeapify(i, 0);
  }

  callback([], _arr);
  return _arr;
};

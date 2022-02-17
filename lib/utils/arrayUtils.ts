import { nanoid } from "nanoid";
import { UIArray, UIArrayElement } from "types";

/**
 * Generates an array of integers with random values inclusive from lowerBound to upperBound
 * @param length {Number} The length of the generated array
 * @param lowerBound {Number} Lower bound number inclusive
 * @param upperBound {Number} Upper bound number inclusive
 * @returns {Array.<{id: string, value: number}>} Returns generated random number
 *
 * @example <caption>Example:</caption>
 * generateRandomArray(100, 0, 100);
 */
export const generateRandomArray = (
  length: number,
  lowerBound: number,
  upperBound: number
): Array<{ id: string; value: number }> => {
  return Array.from({ length }, () => ({
    id: nanoid(),
    value: generateRandomNumberFromRange(lowerBound, upperBound),
  }));
};

/**
 * Generates a random number from lower to upper values.
 * @param lower {Number} Lower bound number inclusive
 * @param upper {Number} Upper bound number inclusive
 * @returns {Number} Returns generated random number
 *
 * @example <caption>Example:</caption>
 * generateRandomNumberFromRange(0, 100);
 */
export const generateRandomNumberFromRange = (
  lower: number,
  upper: number
): number => {
  lower = Math.ceil(lower);
  upper = Math.floor(upper);
  return Math.floor(Math.random() * (upper - lower + 1) + lower);
};

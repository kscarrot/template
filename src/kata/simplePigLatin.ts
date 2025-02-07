/**
 * @link https://www.codewars.com/kata/520b9d2ad5c005041100000f/train/typescript
 */
export const pigIt = (a: string): string =>
  a
    .split(' ')
    .map((word) => (/\w+/g.test(word) ? `${word.slice(1)}${word.at(0)}ay` : word))
    .join(' ')

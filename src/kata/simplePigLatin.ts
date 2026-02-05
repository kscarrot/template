/**
 * @link https://www.codewars.com/kata/520b9d2ad5c005041100000f/train/typescript
 */
export function pigIt(a: string): string {
  return a
    .split(' ')
    .map(word => (/\w+/.test(word) ? `${word.slice(1)}${word.at(0)}ay` : word))
    .join(' ')
}

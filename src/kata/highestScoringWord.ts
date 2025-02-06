/**
 * @link https://www.codewars.com/kata/57eb8fcdf670e99d9b000272/train/typescript
 * @mark 两个知识点
 * 1. ascii 映射到数值 charCodeAt
 * 2. reduce 除了 sum外还可以用max逻辑 可以少考虑sort的逻辑 (参考solutions调整)
 */

export const high = (str: string): string => {
  const calcWordValue = (word: string) => [...word].reduce((sum, char) => (sum += char.charCodeAt(0) - 96), 0)
  return str.split(' ').reduce((max, word) => (calcWordValue(word) > calcWordValue(max) ? word : max))
}

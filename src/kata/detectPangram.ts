/**
 *  @link https://www.codewars.com/kata/545cedaa9943f7fe7b000048/train/typescript
 *  @mark Set构造时传入可迭代对象,可以直接将所有元素逐个添加 可以利用这一点减少字符串转数组用来迭代的步骤
 */
export const isPangram = (phrase: string): boolean => {
  return new Set(phrase.toLocaleLowerCase().match(/[^a-z]/g)).size === 26
}

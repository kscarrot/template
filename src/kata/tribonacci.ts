/**
 * @link https://www.codewars.com/kata/556deca17c58da83c00002db/train/typescript
 * @description
 * 改参数并从0开始正向计数 规避类型问题 result.slice(0, n)是一个通用逻辑
 * https://www.codewars.com/kata/reviews/5dcf9b2375ffe300014eca53/groups/5dfa75394ebc2000012938d0
 */
export function tribonacci([a, b, c]: [number, number, number], n: number): number[] {
  let result = [a, b, c]

  if (n < 3) {
    return result.slice(0, n)
  }

  for (let index = 3; index < n; index++) {
    // fn = f(n-1)+f(n-2)+f(n-3)
    result.push((result.at(-1) as number) + (result.at(-2) as number) + (result.at(-3) as number))
  }
  return result
}

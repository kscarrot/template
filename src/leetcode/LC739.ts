/**
 * @link: https://leetcode.cn/problems/daily-temperatures/
 * @description: 给定一个整数数组 temperatures ，表示每天的温度，返回一个数组 answer ，其中 answer[i] 是指在第 i 天之后，才会有更高的温度。如果气温在这之后都不会升高，请在该位置用 0 来代替。
 * @param {number[]} temperatures
 * @return {number[]}
 */
function dailyTemperatures(temperatures: number[]): number[] {
  // 存索引差
  const result: number[] = new Array(temperatures.length).fill(0)
  // 存索引
  const stack: number[] = []
  for (let i = temperatures.length - 1; i >= 0; i--) {
    while (stack.length > 0 && temperatures[stack.at(-1) as number] <= temperatures[i]) {
      stack.pop()
    }

    if (stack.length > 0) {
      result[i] = (stack.at(-1) as number) - i
    }
    stack.push(i)
  }
  return result
}

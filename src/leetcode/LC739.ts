/**
 * @name: 每日温度
 * @level: 中等
 * @link: https://leetcode.cn/problems/daily-temperatures
 * @description: 请根据每日 气温 列表，重新生成一个列表，要求其对应位置的输出为：需要再等待多少天才能等到一个更高的气温。
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

import { memo } from './utils'

/**
 * @name: 第 N 个泰波那契数
 * @level: 简单
 * @link: https://leetcode.cn/problems/n-th-tribonacci-number
 * @description: 泰波那契序列 Tn 定义如下：
 * @param {number} n
 * @return {number}
 */
function tribonacci(n: number): number {
  const dfs = memo(
    (n: number): number => dfs(n - 1) + dfs(n - 2) + dfs(n - 3),
    {
      0: 0,
      1: 1,
      2: 1,
    },
    (n: number) => n.toString(),
  )

  return dfs(n)
}

export { tribonacci }

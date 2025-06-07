/**
 * @link: https://leetcode.cn/problems/min-cost-climbing-stairs/
 * @description: 数组的每个下标作为一个阶梯，第 i 个阶梯对应着一个非负数的体力花费值 cost[i]（下标从 0 开始）。
 * @param {number[]} cost
 * @return {number}
 */
function minCostClimbingStairs(cost: number[]): number {
  const n = cost.length
  if (n <= 1) return 0
  const dp = Array(n + 1).fill(0)
  for (let i = 2; i <= n; i++) {
    dp[i] = Math.min(dp[i - 1] + cost[i - 1], dp[i - 2] + cost[i - 2])
  }
  return dp[n]
}

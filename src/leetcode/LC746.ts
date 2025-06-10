/**
 * @name: 使用最小花费爬楼梯
 * @level: 简单
 * @link: https://leetcode.cn/problems/min-cost-climbing-stairs
 * @description: 给你一个整数数组 cost ，其中 cost[i] 是从楼梯第 i 个台阶向上爬需要支付的费用。一旦你支付此费用，即可选择向上爬一个或者两个台阶。
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

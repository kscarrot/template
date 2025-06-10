import { cacheFn } from './utils'
/**
 * @name: 爬楼梯
 * @level: 简单
 * @link: https://leetcode.cn/problems/climbing-stairs
 * @description: 假设你正在爬楼梯。需要 n 阶你才能到达楼顶。每次你可以爬 1 或 2 个台阶。你有多少种不同的方法可以爬到楼顶呢？
 * @param {number} n
 * @return {number}
 */
function climbStairs(n: number): number {
  const dfs = cacheFn(
    (n: number): number => {
      return dfs(n - 1) + dfs(n - 2)
    },
    // 缓存Key是字符串
    (n: number) => n.toString(),
    // 初始值
    {
      0: 1,
      1: 1,
    },
  )
  return dfs(n)
}

// 递归改动态规划
function climbStairs_Dp(n: number): number {
  const dp = Array(n + 1).fill(0)
  dp[0] = 1
  dp[1] = 1
  for (let i = 2; i <= n; i++) dp[i] = dp[i - 1] + dp[i - 2]
  return dp[n]
}

export { climbStairs, climbStairs_Dp }

import { cacheFn } from './utils'
/**
 * @link: https://leetcode.cn/problems/house-robber/
 * @description: 打家劫舍，不能偷相邻的房屋，求最大金额
 * @param {number[]} nums
 * @return {number}
 */
function rob(nums: number[]): number {
  const dfs = cacheFn(
    (index: number): number => {
      if (index < 0) return 0
      return Math.max(dfs(index - 1), dfs(index - 2) + nums[index])
    },
    (index: number) => index,
  )
  return dfs(nums.length - 1)
}

function rob_Dp(nums: number[]): number {
  const dp = Array(nums.length).fill(0)
  dp[0] = nums[0]
  dp[1] = Math.max(nums[0], nums[1])
  for (let i = 2; i < nums.length; i++) {
    dp[i] = Math.max(dp[i - 1], dp[i - 2] + nums[i])
  }
  return dp[nums.length - 1]
}

export { rob, rob_Dp }

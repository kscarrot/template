import { memo } from './utils'
/**
 * @name: 打家劫舍
 * @level: 中等
 * @link: https://leetcode.cn/problems/house-robber
 * @description: 你是一个专业的小偷，计划偷窃沿街的房屋。每间房内都藏有一定的现金，影响你偷窃的唯一制约因素就是相邻的房屋装有相互连通的防盗系统，如果两间相邻的房屋在同一晚上被小偷闯入，系统会自动报警。
 * @param {number[]} nums
 * @return {number}
 */
function rob(nums: number[]): number {
  const dfs = memo(
    // 递推式
    (index: number): number => Math.max(dfs(index - 1), dfs(index - 2) + nums[index]),
    // 初始值
    {
      '-2': 0,
      '-1': 0,
    },
    // 缓存key
    (index: number) => index.toString(),
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

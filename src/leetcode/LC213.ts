import { rob as rob1 } from './LC198'

/**
 * @name: 打家劫舍 II
 * @level: 中等
 * @link: https://leetcode.cn/problems/house-robber-ii
 * @description: 你是一个专业的小偷，计划偷窃沿街的房屋，每间房内都藏有一定的现金。这个地方所有的房屋都 围成一圈 ，这意味着第一个房屋和最后一个房屋是紧挨着的。同时，相邻的房屋装有相互连通的防盗系统，如果两间相邻的房屋在同一夜被小偷闯入，系统会自动报警 。
 * @param {number[]} nums
 * @return {number}
 */
function rob(nums: number[]): number {
  const n = nums.length
  // 环形 抢第一家 不抢最后一家
  const rob1st = nums[0] + rob1(nums.slice(2, n - 1))
  // 环形 不抢第一家 抢最后一家
  const rob2nd = rob1(nums.slice(1))
  return Math.max(rob1st, rob2nd)
}

export { rob }

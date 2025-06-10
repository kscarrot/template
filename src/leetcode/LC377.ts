/**
 * @name: 组合总和 Ⅳ
 * @level: 中等
 * @link: https://leetcode.cn/problems/combination-sum-iv
 * @description: 给你一个由 不同 整数组成的数组 nums ，和一个目标整数 target 。请你从 nums 中找出并返回总和为 target 的元素组合的个数。
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
function combinationSum4(nums: number[], target: number): number {
  if (nums.length === 1 && nums[0] !== target) return 0
  const dp = Array(target + 1).fill(0)
  dp[0] = 1
  for (let i = 1; i <= target; i++) {
    dp[i] = nums.filter((x) => x <= i).reduce((sumI, x) => sumI + dp[i - x], 0)
  }
  return dp[target]
}

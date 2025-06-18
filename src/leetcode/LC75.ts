/**
 * @name: 颜色分类
 * @level: 中等
 * @link: https://leetcode.cn/problems/sort-colors
 * @description: 给定一个包含红色、白色和蓝色、共 n 个元素的数组 nums ，原地对它们进行排序，使得相同颜色的元素相邻，并按照红色、白色、蓝色顺序排列。
 * @param {number[]} nums
 * @return {void}
 */
function sortColors(nums: number[]): number[] {
  let left = 0
  let right = nums.length - 1
  let i = 0
  while (i <= right) {
    if (nums[i] === 0) {
      // 白色需要向前
      ;[nums[i], nums[left]] = [nums[left], nums[i]]
      left++
      i++
    } else if (nums[i] === 2) {
      //  蓝色结尾向后移动
      ;[nums[i], nums[right]] = [nums[right], nums[i]]
      //  换过来的元素颜色是不知道的 不能直接i++ 需要再判断一次
      right--
      //  注意：交换后i位置的新值可能是0、1或2，所以不能i++，需要重新检查
    } else {
      //白色中间色
      i++
    }
  }
  return nums
}

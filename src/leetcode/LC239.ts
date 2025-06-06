/**
 * @link: https://leetcode.cn/problems/sliding-window-maximum/
 * @description: 给你一个整数数组 nums，有一个大小为 k 的滑动窗口从数组的最左侧移动到数组的最右侧。你只可以看到在滑动窗口内的 k 个数字。滑动窗口每次只向右移动一位。
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
function maxSlidingWindow(nums: number[], k: number): number[] {
  // 结果里存值
  const result: number[] = []
  // 队列里存下标
  const queue: number[] = []

  for (let i = 0; i < nums.length; i++) {
    //把队列里比当前元素小的都弹出
    while (queue.length > 0 && nums[i] > nums[queue[queue.length - 1]]) {
      queue.pop()
    }
    queue.push(i)
    if (i - queue[0] >= k) {
      queue.shift()
    }
    if (i >= k - 1) {
      result.push(nums[queue[0]])
    }
  }
  return result
}

export default maxSlidingWindow

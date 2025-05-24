import { ListNode } from './leetcode-types'

/**
 * @link: https://leetcode.cn/problems/linked-list-cycle/
 * @description: 给定一个链表，判断链表中是否有环。
 * @param {ListNode} head
 * @return {boolean}
 * @summary
 *  使用快慢游标，如果快慢游标相遇，则有环
 *  会不会出现快指针刚好越过慢指针的情况呢
 *  答案是无需考虑,因为如果有环,两个游标都会进环,这时他们的相对速度是1,一定会相遇
 *
 */

function hasCycle(head: ListNode | null): boolean {
  // 初始化
  let slowCursor: ListNode | null = head
  let fastCursor: ListNode | null = head

  while (fastCursor && fastCursor.next) {
    // 慢游标每次走一步
    slowCursor = slowCursor?.next || null
    // 快游标每次走两步
    fastCursor = fastCursor?.next?.next || null
    if (fastCursor === slowCursor) return true
  }
  // 快游标访问到末尾且没有相遇,则无环
  return false
}

export default hasCycle

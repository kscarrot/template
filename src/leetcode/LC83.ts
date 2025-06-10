import type { ListNode } from './leetcode-types'

/**
 * @name: 删除排序链表中的重复元素
 * @level: 简单
 * @link: https://leetcode.cn/problems/remove-duplicates-from-sorted-list
 * @description: 给定一个已排序的链表的头 head ，删除所有重复的元素，使每个元素只出现一次。
 *  @param {ListNode | null} head
 *  @return {ListNode | null}
 */
function deleteDuplicates(head: ListNode | null): ListNode | null {
  if (!head) return null
  if (!head.next) return head

  let prevCursor: ListNode | null = head
  let currentCursor: ListNode | null = head.next

  while (prevCursor) {
    while (currentCursor && prevCursor.val === currentCursor.val) {
      currentCursor = currentCursor?.next || null
    }
    prevCursor.next = currentCursor
    prevCursor = currentCursor
    currentCursor = currentCursor?.next || null
  }
  return head
}

export default deleteDuplicates

import { ListNode } from './utils'

/**
 * @name: 删除排序链表中的重复元素 II
 * @level: 中等
 * @link: https://leetcode.cn/problems/remove-duplicates-from-sorted-list-ii
 * @description: 给定一个已排序的链表的头 head ，删除原始链表中所有重复数字的节点，只留下不同的数字。
 * @param {ListNode | null} head
 * @return {ListNode | null}
 */
function deleteDuplicates(head: ListNode | null): ListNode | null {
  if (!head) return null
  if (!head.next) return head

  let headNode = new ListNode(NaN)
  headNode.next = head

  let prevCursor: ListNode | null = headNode
  let currentCursor: ListNode | null = head

  while (currentCursor) {
    if (currentCursor.val === currentCursor.next?.val) {
      //找到下一个不同的值为止
      while (currentCursor.val === currentCursor.next?.val) {
        currentCursor = currentCursor.next
      }
      currentCursor = currentCursor.next
      if (!currentCursor) {
        ;(prevCursor as unknown as ListNode).next = null
        break
      }
    } else {
      // 唯一值 游标后移
      prevCursor.next = currentCursor
      prevCursor = currentCursor
      currentCursor = currentCursor.next
    }
  }

  return headNode.next
}

export default deleteDuplicates

import { ListNode } from './utils'
/**
 * @link: https://leetcode.cn/problems/insertion-sort-list
 * @description: 给定单个链表的头 head ，使用 插入排序 对链表进行排序，并返回 排序后链表的头
 * @param {ListNode | null} head
 * @return {ListNode | null}
 */

function sortList(head: ListNode | null): ListNode | null {
  if (!head) return null
  if (!head.next) return head

  let newHeadNode = new ListNode(NaN)
  newHeadNode.next = null
  const intertIntoSortedList = (insetNode: ListNode) => {
    let prevCursor: ListNode | null = newHeadNode
    let currentCursor: ListNode | null = newHeadNode.next

    // 单元素直接插入 返回
    if (!currentCursor) {
      newHeadNode.next = insetNode
      return
    }

    while (currentCursor) {
      // 比当前元素小 在当前元素前插入
      if (insetNode.val < currentCursor.val) {
        prevCursor.next = insetNode
        insetNode.next = currentCursor
        return
      } else {
        // 比当前元素大 游标后移
        prevCursor = currentCursor
        currentCursor = currentCursor.next
        if (!currentCursor) {
          prevCursor.next = insetNode
          return
        }
      }
    }
  }

  let originCursor: ListNode | null = head
  while (originCursor) {
    intertIntoSortedList(new ListNode(originCursor.val))
    originCursor = originCursor.next
  }

  return newHeadNode.next
}

export default sortList

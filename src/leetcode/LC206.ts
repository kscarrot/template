import type { ListNode } from './leetcode-types'

/**
 * @link: https://leetcode.cn/problems/reverse-linked-list
 * @description: 给你单链表的头节点 head ，请你反转链表，并返回反转后的链表。
 * @param {ListNode | null} head
 * @return {ListNode | null}
 */
function reverseList(head: ListNode | null): ListNode | null {
  if (!head) return null
  if (!head.next) return head

  let prevCursor: ListNode | null = null
  let currentCursor: ListNode | null = head
  let nextCursor: ListNode | null = head.next

  while (nextCursor) {
    currentCursor.next = prevCursor
    let nextNextCursor: ListNode | null = nextCursor.next
    nextCursor.next = currentCursor
    prevCursor = currentCursor
    currentCursor = nextCursor
    nextCursor = nextNextCursor
  }
  return currentCursor
}

export default reverseList

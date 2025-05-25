import type { ListNode } from './leetcode-types'

/**
 * @link: https://leetcode.cn/problems/middle-of-the-linked-list/
 * @description: 给你单链表的头结点 head ，请你找出并返回链表的中间结点。
 * 如果有两个中间结点，则返回第二个中间结点。
 * @param {ListNode} head
 * @return {ListNode}
 */
function middleNode(head: ListNode | null): ListNode | null {
  if (!head) return null
  if (!head.next) return head

  let slowCursor: ListNode | null = head
  let fastCursor: ListNode | null = head
  let prevCursor: ListNode | null = null

  while (fastCursor && fastCursor.next) {
    prevCursor = slowCursor
    slowCursor = slowCursor?.next || null
    fastCursor = fastCursor?.next?.next || null
  }
  ;(prevCursor as unknown as ListNode).next = null
  return slowCursor
}

export default middleNode

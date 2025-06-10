import type { ListNode } from './leetcode-types'

/**
 * @name: 链表的中间结点
 * @level: 简单
 * @link: https://leetcode.cn/problems/middle-of-the-linked-list
 * @description: 给定一个头结点为 head 的非空单链表，返回链表的中间结点。
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

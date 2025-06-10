import type { ListNode } from './leetcode-types'

/**
 * @name: 删除链表的中间节点
 * @level: 中等
 * @link: https://leetcode.cn/problems/delete-the-middle-node-of-a-linked-list
 * @description: 给你一个下标从 0 开始的链表，删除链表的中间节点，并返回删除后的链表的头节点。
 * @param {ListNode} head
 * @return {ListNode}
 */

function deleteMiddle(head: ListNode | null): ListNode | null {
  let result = head
  if (!head) return null
  if (!head.next) return null

  // 创建一个虚拟头节点
  let headNode = {
    val: NaN,
    next: head,
  }

  let prevCursor: ListNode | null = headNode
  let slowCursor: ListNode | null = head
  let fastCursor: ListNode | null = head

  while (fastCursor && fastCursor.next) {
    prevCursor = prevCursor?.next || null
    slowCursor = slowCursor?.next || null
    fastCursor = fastCursor?.next?.next || null
  }

  ;(prevCursor as unknown as ListNode).next = slowCursor?.next || null

  return result
}

export default deleteMiddle

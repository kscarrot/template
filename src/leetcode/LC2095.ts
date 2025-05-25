import type { ListNode } from './leetcode-types'

/**
 * @link: https://leetcode.cn/problems/delete-the-middle-node-of-a-linked-list/
 * @description: 给你一个链表的头节点 head 。删除 链表的 中间节点 ，并返回修改后的链表的头节点 head
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

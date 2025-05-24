import { ListNode } from './leetcode-types'

/**
 * @link: https://leetcode.cn/problems/linked-list-cycle-ii/
 * @description: 给定一个链表，返回链表开始入环的第一个节点。 如果链表无环，则返回 null。
 * @param {ListNode} head
 * @return {ListNode}
 */

function detectCycle(head: ListNode | null): ListNode | null {
  // 空链表直接返回
  if (!head) return null
  // 单节点自成环
  if (head?.next === head) return head
  // 单节点无环
  if (!head?.next) return null

  let slowCursor: ListNode | null = head
  let fastCursor: ListNode | null = head

  while (fastCursor && fastCursor.next) {
    // 慢游标每次走一步
    slowCursor = slowCursor?.next || null
    // 快游标每次走两步
    fastCursor = fastCursor?.next?.next || null
    if (fastCursor === slowCursor) break
  }

  let cursor: ListNode | null = head
  while (cursor !== slowCursor) {
    cursor = cursor?.next || null
    slowCursor = slowCursor?.next || null
  }
  return cursor
}
export default detectCycle

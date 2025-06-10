import { ListNode } from './utils'

/**
 * @name: 删除链表的倒数第 N 个结点
 * @level: 中等
 * @link: https://leetcode.cn/problems/remove-nth-node-from-end-of-list
 * @description: 给你一个链表，删除链表的倒数第 n 个结点，并且返回链表的头结点。
 * @param {ListNode | null} head
 * @param {number} n
 * @return {ListNode | null}
 */
function removeNthFromEnd(head: ListNode | null, n: number): ListNode | null {
  if (!head) return null

  /** 初始化虚拟头节点 */
  let headNode = new ListNode(NaN)
  headNode.next = head

  let prevCursor: ListNode | null = headNode
  let slowCursor: ListNode | null = head
  let fastCursor: ListNode | null = head

  /** 快指针先走n步 */
  for (let i = 0; i < n; i++) {
    fastCursor = fastCursor?.next || null
  }

  while (fastCursor) {
    prevCursor = slowCursor
    slowCursor = slowCursor?.next || null
    fastCursor = fastCursor?.next || null
  }

  ;(prevCursor as unknown as ListNode).next = slowCursor?.next || null
  return headNode.next
}

export default removeNthFromEnd

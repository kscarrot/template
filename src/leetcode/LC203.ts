import { ListNode } from './utils'

/**
 * @name: 移除链表元素
 * @level: 简单
 * @link: https://leetcode.cn/problems/remove-linked-list-elements
 * @description: 给你一个链表的头节点 head 和一个整数 val ，请你删除链表中所有满足 Node.val == val 的节点，并返回 新的头节点 。
 * @param {ListNode | null} head
 * @param {number} val
 * @return {ListNode | null}
 */
function removeElements(head: ListNode | null, val: number): ListNode | null {
  if (!head) return null
  if (!head.next) return head.val === val ? null : head

  let headNode = new ListNode(NaN)
  headNode.next = head

  let prevCursor: ListNode | null = headNode
  let currentCursor: ListNode | null = head

  while (currentCursor) {
    if (currentCursor.val === val) {
      ;(prevCursor as unknown as ListNode).next = currentCursor.next
      currentCursor = currentCursor.next
    } else {
      prevCursor = prevCursor?.next || null
      currentCursor = currentCursor.next
    }
  }

  return headNode.next
}

export default removeElements

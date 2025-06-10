import type { ListNode } from './leetcode-types'

/**
 * @name: 合并两个有序链表
 * @level: 简单
 * @link: https://leetcode.cn/problems/merge-two-sorted-lists
 * @description: 将两个升序链表合并为一个新的 升序 链表并返回。新链表是通过拼接给定的两个链表的所有节点组成的。
 * @param {ListNode} list1
 * @param {ListNode} list2
 * @return {ListNode}
 */
function mergeTwoLists(list1: ListNode | null, list2: ListNode | null): ListNode | null {
  // 两个链表至少有一个元素
  if (!list1) return list2
  if (!list2) return list1

  // 初始化游标
  let p1: ListNode | null = list1
  let p2: ListNode | null = list2
  let newHeadNode = null
  let newTailNode = null

  if (p1.val <= p2.val) {
    newHeadNode = p1
    newTailNode = p1
    p1 = p1.next
  } else {
    newHeadNode = p2
    newTailNode = p2
    p2 = p2.next
  }

  while (p1 && p2) {
    if (p1.val <= p2.val) {
      newTailNode.next = p1
      newTailNode = newTailNode.next
      p1 = p1.next
    } else {
      newTailNode.next = p2
      newTailNode = newTailNode.next
      p2 = p2.next
    }
  }
  if (!p1) {
    newTailNode.next = p2
  }
  if (!p2) {
    newTailNode.next = p1
  }
  return newHeadNode
}

export default mergeTwoLists

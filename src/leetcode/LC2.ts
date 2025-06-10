import { ListNode } from './utils'

/**
 * @name: 两数相加
 * @level: 中等
 * @link: https://leetcode.cn/problems/add-two-numbers
 * @description: 给你两个 非空 的链表，表示两个非负的整数。它们每位数字都是按照 逆序 的方式存储的，并且每个节点只能存储 一位 数字。
 * 请你将两个数相加，并以相同形式返回一个表示和的链表。
 * @param {ListNode | null} l1
 * @param {ListNode | null} l2
 * @return {ListNode | null}
 */
function addTwoNumbers(l1: ListNode | null, l2: ListNode | null): ListNode | null {
  const headNode = new ListNode(NaN)
  let tail = headNode
  let carry = 0
  while (l1 || l2) {
    let l1_val = l1 ? l1.val : 0
    let l2_val = l2 ? l2.val : 0
    let sum = l1_val + l2_val + carry
    carry = sum >= 10 ? 1 : 0
    tail.next = new ListNode(sum % 10)
    tail = tail.next
    l1 = l1 ? l1.next : null
    l2 = l2 ? l2.next : null
  }
  // 两个列表遍历完之后还有进位需要再加一个节点
  carry ? (tail.next = new ListNode(1)) : (tail.next = null)
  return headNode.next
}

export default addTwoNumbers

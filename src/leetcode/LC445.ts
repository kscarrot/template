import { ListNode } from './utils'
import addTwoNumbersInverse from './LC2'
import reverseList from './LC206'

/**
 * @name: 两数相加 II
 * @level: 中等
 * @link: https://leetcode.cn/problems/add-two-numbers-ii
 * @description: 给你两个 非空 链表来代表两个非负整数。数字最高位位于链表开始位置。它们的每个节点只存储一位数字。将这两数相加会返回一个新的链表。
 * @param {ListNode | null} l1
 * @param {ListNode | null} l2
 * @return {ListNode | null}
 */
function addTwoNumbers(l1: ListNode | null, l2: ListNode | null): ListNode | null {
  let l1Inverse = reverseList(l1)
  let l2Inverse = reverseList(l2)
  let result = addTwoNumbersInverse(l1Inverse, l2Inverse)
  return reverseList(result)
}

export default addTwoNumbers

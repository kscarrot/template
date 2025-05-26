import { ListNode } from './utils'
import middleNode from './LC876'
import reverseList from './LC206'

/**
 * @link: https://leetcode.cn/problems/palindrome-linked-list/
 * @description: 给你一个单链表的头节点 head ，请你判断该链表是否为回文链表。如果是，返回 true ；否则，返回 false
 * @param {ListNode | null} head
 * @return {boolean}
 */
function isPalindrome(head: ListNode | null): boolean {
  if (!head) return true
  if (!head.next) return true

  let middleHead = middleNode(head)
  let rightHead = reverseList(middleHead)

  while (head && rightHead) {
    if (head.val !== rightHead.val) return false
    head = head.next
    rightHead = rightHead.next
  }
  return true
}

export default isPalindrome

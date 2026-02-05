import type { ListNode } from './utils'
import mergeTwoLists from './LC21'
import middleNode from './LC876'

/**
 * @link: https://leetcode.cn/problems/sort-list
 * @description: 给你链表的头结点 head ，请将其按 升序 排列并返回 排序后的链表
 * @param {ListNode | null} head
 * @return {ListNode | null}
 */

function sortList(head: ListNode | null): ListNode | null {
  if (!head)
    return null
  if (!head.next)
    return head
  const middleHead = middleNode(head)
  return mergeTwoLists(sortList(head), sortList(middleHead))
}

export default sortList

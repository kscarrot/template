import type { ListNode } from './leetcode-types'
import { chunkArray } from './utils'
import mergeTwoLists from './LC21'

/**
 * @name: 合并 K 个升序链表
 * @level: 困难
 * @link: https://leetcode.cn/problems/merge-k-sorted-lists
 * @description: 给你一个链表数组，每个链表都已经按升序排列。请你将所有链表合并到一个升序链表中，返回合并后的链表。
 * @param {Array<ListNode | null>} lists
 * @return {ListNode | null}
 * @summary 这里使用分治法，将链表数组分成两两一组，然后合并，最后返回合并后的链表
 */
function mergeKLists(lists: Array<ListNode | null>): ListNode | null {
  if (lists.length === 0) return null
  if (lists.length === 1) return lists[0]
  const chunkedLists = chunkArray(lists, 2)
  const mergedLists = chunkedLists.map((chunk) => mergeTwoLists(chunk[0], chunk[1] || null))
  return mergeKLists(mergedLists)
}

export default mergeKLists

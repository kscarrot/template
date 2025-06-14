import { TreeNode } from './leetcode-types'

/**
 * @name: 相同的树
 * @level: 简单
 * @link: https://leetcode.cn/problems/same-tree
 * @description: 给你两棵二叉树的根节点 p 和 q ，编写一个函数来检验这两棵树是否相同。
 * @param {TreeNode} p
 * @param {TreeNode} q
 * @return {boolean}
 */
function isSameTree(p: TreeNode | null, q: TreeNode | null): boolean {
  if (!p && !q) return true
  if (!p || !q) return false
  if (p.val !== q.val) return false
  return isSameTree(p.left, q.left) && isSameTree(p.right, q.right)
}

export { isSameTree }

import { TreeNode } from './leetcode-types'
import { levelOrder } from './LC102'

/**
 * @name: 二叉树的层序遍历 II
 * @level: 中等
 * @link: https://leetcode.cn/problems/binary-tree-level-order-traversal-ii
 * @description: 给你二叉树的根节点 root ，返回其节点值 自底向上的层序遍历 。 （即按从叶子节点所在层到根节点所在的层，逐层从左向右遍历）
 * @param {TreeNode} root
 * @return {number[][]}
 */
function levelOrderBottom(root: TreeNode | null): number[][] {
  if (!root) return []
  const result = levelOrder(root)
  return result.reverse()
}

export { levelOrderBottom }

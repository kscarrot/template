import { TreeNode } from './leetcode-types'

/**
 * @name: 完全二叉树的节点个数
 * @level: 简单
 * @link: https://leetcode.cn/problems/count-complete-tree-nodes
 * @description: 给你一棵 完全二叉树 的根节点 root ，求出该树的节点个数。
 * @param {TreeNode} root
 * @return {number}
 */
function countNodes(root: TreeNode | null): number {
  if (!root) return 0
  return countNodes(root.left) + countNodes(root.right) + 1
}

export { countNodes }

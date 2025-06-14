import { TreeNode } from './leetcode-types'

/**
 * @name: 二叉树的最大深度
 * @level: 简单
 * @link: https://leetcode.cn/problems/maximum-depth-of-binary-tree
 * @description: 给定一个二叉树，找出其最大深度。
 * @param {TreeNode} root
 * @return {number}
 */
function maxDepth(root: TreeNode | null): number {
  if (!root) return 0
  return Math.max(maxDepth(root.left), maxDepth(root.right)) + 1
}

export { maxDepth }

import { NTreeNode } from './leetcode-types'
/**
 * @name: N 叉树的最大深度
 * @level: 简单
 * @link: https://leetcode.cn/problems/maximum-depth-of-n-ary-tree
 * @description: 给定一个 N 叉树，找到其最大深度。
 * @param {NTreeNode} root
 * @return {number}
 */
function maxDepth(root: NTreeNode | null): number {
  if (!root) return 0
  if (root.children.length === 0) return 1
  return Math.max(...root.children.map((child) => maxDepth(child))) + 1
}

export { maxDepth }

import { TreeNode } from './leetcode-types'
import { levelOrder } from './LC102'

/**
 * @name: 二叉树的右视图
 * @level: 中等
 * @link: https://leetcode.cn/problems/binary-tree-right-side-view
 * @description: 给定一个二叉树的 根节点 root，想象自己站在它的右侧，按照从顶部到底部的顺序，返回从右侧所能看到的节点值。
 * @param {TreeNode} root
 * @return {number[]}
 */
function rightSideView(root: TreeNode | null): number[] {
  if (!root) return []
  const result = levelOrder(root)
  return result.map((level) => level[level.length - 1])
}

export { rightSideView }

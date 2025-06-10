import { NTreeNode } from './leetcode-types'

/**
 * @name: N 叉树的层序遍历
 * @level: 中等
 * @link: https://leetcode.cn/problems/n-ary-tree-level-order-traversal
 * @description: 给定一个 N 叉树，返回其节点值的层序遍历。（即从左到右，逐层遍历）。
 * @param {NTreeNode} root
 * @return {number[][]}
 */
function levelOrder(root: NTreeNode | null): number[][] {
  if (!root) return []
  const result: number[][] = []
  let queue: NTreeNode[] = [root]
  while (queue.length > 0) {
    const nextLevel: NTreeNode[] = []
    const currentLevelValues: number[] = []
    for (const node of queue) {
      currentLevelValues.push(node.val)
      for (const child of node.children) {
        nextLevel.push(child)
      }
    }
    queue = nextLevel
    result.push(currentLevelValues)
  }
  return result
}

export { levelOrder }

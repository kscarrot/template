import { TreeNode } from './leetcode-types'

/**
 * @name: 二叉树的层序遍历
 * @level: 中等
 * @link: https://leetcode.cn/problems/binary-tree-level-order-traversal
 * @description: 给你二叉树的根节点 root ，返回其节点值的 层序遍历 。 （即逐层地，从左到右访问所有节点）。
 * @param {TreeNode} root
 * @return {number[][]}
 */
function levelOrder(root: TreeNode | null): number[][] {
  if (!root) return []
  const result: number[][] = []
  let queue: Array<TreeNode | null> = [root]
  while (queue.length > 0) {
    const nextLevel: Array<TreeNode | null> = []
    const currentLevelValues: Array<number> = []
    for (const node of queue) {
      if (node) {
        currentLevelValues.push(node.val)
        if (node.left) nextLevel.push(node.left)
        if (node.right) nextLevel.push(node.right)
      }
    }
    queue = nextLevel
    result.push(currentLevelValues)
  }

  return result
}

export { levelOrder }

import { TreeNode } from './leetcode-types'

/**
 * @name: 二叉树的后序遍历
 * @level: 简单
 * @link: https://leetcode.cn/problems/binary-tree-postorder-traversal
 * @description: 给你一棵二叉树的根节点 root ，返回其节点值的 后序遍历 。
 * @param {TreeNode} root
 * @return {number[]}
 */
function postorderTraversal(root: TreeNode | null): number[] {
  const result: number[] = []
  const dfs = (root: TreeNode | null) => {
    if (!root) return
    dfs(root.left)
    dfs(root.right)
    result.push(root.val)
  }
  dfs(root)
  return result
}

export { postorderTraversal }

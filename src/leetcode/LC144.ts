import { TreeNode } from './leetcode-types'

/**
 * @link: https://leetcode.cn/problems/binary-tree-preorder-traversal/
 * @description: 给你二叉树的根节点 root ，返回它节点值的 前序 遍历。
 * @param {TreeNode} root
 * @return {number[]}
 */
function preorderTraversal(root: TreeNode | null): number[] {
  const result: number[] = []
  const dfs = (root: TreeNode | null) => {
    if (!root) return
    result.push(root.val)
    dfs(root.left)
    dfs(root.right)
  }
  dfs(root)
  return result
}

export { preorderTraversal }

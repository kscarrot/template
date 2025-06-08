import { TreeNode } from './leetcode-types'

/**
 * @link: https://leetcode.cn/problems/binary-tree-inorder-traversal/
 * @description: 给定一个二叉树的根节点 root ，返回 它的 中序 遍历 。
 * @param {TreeNode} root
 * @return {number[]}
 */
function inorderTraversal(root: TreeNode | null): number[] {
  const result: number[] = []
  const dfs = (root: TreeNode | null) => {
    if (!root) return
    dfs(root.left)
    result.push(root.val)
    dfs(root.right)
  }
  dfs(root)
  return result
}

export { inorderTraversal }

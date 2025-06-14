import { TreeNode } from './leetcode-types'

/**
 * @name: 从中序与后序遍历序列构造二叉树
 * @level: 中等
 * @link: https://leetcode.cn/problems/construct-binary-tree-from-inorder-and-postorder-traversal
 * @description: 给定两个整数数组 inorder 和 postorder ，其中 inorder 是二叉树的中序遍历， postorder 是同一棵树的后序遍历，请你构造并返回这棵二叉树。
 * @param {number[]} inorder
 * @param {number[]} postorder
 * @return {TreeNode | null}
 */
function buildTree(inorder: number[], postorder: number[]): TreeNode | null {
  if (inorder.length === 0 || postorder.length === 0) return null
  // 后序遍历的最后一个元素是根节点
  const root = new TreeNode(postorder[postorder.length - 1])
  // 找到根节点在中序遍历中的位置
  const rootIndex = inorder.indexOf(postorder[postorder.length - 1])
  // 递归构建左子树
  root.left = buildTree(inorder.slice(0, rootIndex), postorder.slice(0, rootIndex))
  root.right = buildTree(inorder.slice(rootIndex + 1), postorder.slice(rootIndex, -1))
  return root
}

export { buildTree }

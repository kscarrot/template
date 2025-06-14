import { TreeNode } from './leetcode-types'

/**
 * @name: 从前序与中序遍历序列构造二叉树
 * @level: 中等
 * @link: https://leetcode.cn/problems/construct-binary-tree-from-preorder-and-inorder-traversal
 * @description: 给定两个整数数组 preorder 和 inorder ，其中 preorder 是二叉树的先序遍历， inorder 是同一棵树的中序遍历，请构造二叉树并返回其根节点。
 * @param {number[]} preorder
 * @param {number[]} inorder
 * @return {TreeNode | null}
 */
function buildTree(preorder: number[], inorder: number[]): TreeNode | null {
  if (preorder.length === 0 || inorder.length === 0) return null
  // 先序遍历的第一个元素是根节点
  const root = new TreeNode(preorder[0])
  // 找到根节点在中序遍历中的位置
  const rootIndex = inorder.indexOf(preorder[0])
  // 递归构建左子树
  root.left = buildTree(preorder.slice(1, rootIndex + 1), inorder.slice(0, rootIndex))
  // 递归构建右子树
  root.right = buildTree(preorder.slice(rootIndex + 1), inorder.slice(rootIndex + 1))
  return root
}

export { buildTree }

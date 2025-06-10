import { NTreeNode } from './leetcode-types'

/**
 * @name: N 叉树的前序遍历
 * @level: 简单
 * @link: https://leetcode.cn/problems/n-ary-tree-preorder-traversal
 * @description: 给定一个 n 叉树的根节点 root ，返回 其节点值的 前序遍历 。
 * @param {NTreeNode} root
 * @return {number[]}
 */
function preorder(root: NTreeNode | null): number[] {
  const result: number[] = []
  const dfs = (root: NTreeNode | null) => {
    if (!root) return
    result.push(root.val)
    for (const child of root.children) {
      dfs(child)
    }
  }
  dfs(root)
  return result
}

export { preorder }

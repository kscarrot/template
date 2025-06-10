import { NTreeNode } from './leetcode-types'

/**
 * @name: N 叉树的后序遍历
 * @level: 简单
 * @link: https://leetcode.cn/problems/n-ary-tree-postorder-traversal
 * @description: 给定一个 n 叉树的根节点 root ，返回 其节点值的 后序遍历 。
 * @param {NTreeNode} root
 * @return {number[]}
 */
function postorder(root: NTreeNode | null): number[] {
  const result: number[] = []
  const dfs = (root: NTreeNode | null) => {
    if (!root) return
    for (const child of root.children) {
      dfs(child)
    }
    result.push(root.val)
  }
  dfs(root)
  return result
}

export { postorder }

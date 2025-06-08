import { NTreeNode } from './leetcode-types'

/**
 * @link: https://leetcode.cn/problems/n-ary-tree-postorder-traversal/
 * @description: 给定一个 N 叉树，返回其节点值的 后序 遍历。
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

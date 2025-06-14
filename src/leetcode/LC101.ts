import { TreeNode } from './leetcode-types'

/**
 * @name: 对称二叉树
 * @level: 简单
 * @link: https://leetcode.cn/problems/symmetric-tree
 * @description: 给你一个二叉树的根节点 root ， 检查它是否轴对称。
 * @param {TreeNode} root
 * @return {boolean}
 */
function isSymmetric(root: TreeNode | null): boolean {
  if (!root) return true
  // 判断两棵树是否镜像对称
  const isMirror = (left: TreeNode | null, right: TreeNode | null): boolean => {
    if (!left && !right) return true
    if (!left || !right) return false
    // 值相等，且左右子树镜像对称
    return left.val === right.val && isMirror(left.left, right.right) && isMirror(left.right, right.left)
  }
  return isMirror(root.left, root.right)
}

export { isSymmetric }

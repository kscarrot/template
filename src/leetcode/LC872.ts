import { TreeNode } from './leetcode-types'

/**
 * @name: 叶子相似的树
 * @level: 简单
 * @link: https://leetcode.cn/problems/leaf-similar-trees
 * @description: 判断两个树的叶子序列是否相同
 * @param {TreeNode} root1
 * @param {TreeNode} root2
 * @return {boolean}
 */
function leafSimilar(root1: TreeNode | null, root2: TreeNode | null): boolean {
  if (!root1 && !root2) return true
  const leafs1 = getLeafs(root1)
  const leafs2 = getLeafs(root2)
  if (leafs1.length !== leafs2.length) return false
  return leafs1.every((leaf, index) => leaf === leafs2[index])
}

function getLeafs(root: TreeNode | null): number[] {
  if (!root) return []
  if (!root.left && !root.right) return [root.val]
  return [...getLeafs(root.left), ...getLeafs(root.right)]
}

export { leafSimilar }

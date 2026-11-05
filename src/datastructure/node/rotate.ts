import type { BinaryTreeNode } from 'src/datastructure/node/TreeNode'

/**
 * 左旋：当前节点下沉为右孩子的左孩子，右孩子升上来
 * ```
 *     x                y
 *    / \              / \
 *   A   y     =>     x   C
 *      / \          / \
 *     B   C        A   B
 * ```
 * 不会更新树的 root 引用，旋转根节点时需由调用方处理
 * @returns 升上来的新子树根
 */
export function rotateLeft<N extends BinaryTreeNode<unknown, N>>(node: N): N {
  const y = node.right
  if (!y)
    throw new Error('rotateLeft: node has no right child')

  const p = node.parent
  node.right = y.left
  if (y.left)
    y.left.parent = node

  y.left = node
  node.parent = y

  y.parent = p
  if (p) {
    if (p.left === node)
      p.left = y
    else
      p.right = y
  }
  return y
}

/**
 * 右旋：当前节点下沉为左孩子的右孩子，左孩子升上来
 * ```
 *       y            x
 *      / \          / \
 *     x   C   =>   A   y
 *    / \              / \
 *   A   B            B   C
 * ```
 * 不会更新树的 root 引用，旋转根节点时需由调用方处理
 * @returns 升上来的新子树根
 */
export function rotateRight<N extends BinaryTreeNode<unknown, N>>(node: N): N {
  const x = node.left
  if (!x)
    throw new Error('rotateRight: node has no left child')

  const p = node.parent
  node.left = x.right
  if (x.right)
    x.right.parent = node

  x.right = node
  node.parent = x

  x.parent = p
  if (p) {
    if (p.left === node)
      p.left = x
    else
      p.right = x
  }
  return x
}

/**
 * 把 node 上提一层：是左孩子则对父节点右旋，是右孩子则对父节点左旋
 * 不会更新树的 root 引用，旋转根节点时需由调用方处理
 * @returns node
 */
export function rotateUp<N extends BinaryTreeNode<unknown, N>>(node: N): N {
  const p = node.parent
  if (!p)
    throw new Error('rotateUp: node is already root')

  if (p.left === node)
    rotateRight(p)
  else
    rotateLeft(p)
  return node
}

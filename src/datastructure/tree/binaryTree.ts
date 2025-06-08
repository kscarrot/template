import { BinaryTreeNode } from 'src/datastructure/node'

export function valuesToBinaryTree<T>(values: Array<T | null>): BinaryTreeNode<T> | null {
  if (values.length === 0) return null
  const root = new BinaryTreeNode(values[0] as T)
  const binaryTreeBuilder = (root: BinaryTreeNode<T>, index: number, values: Array<T | null>) => {
    const leftIndex = 2 * index + 1
    const rightIndex = 2 * index + 2
    if (leftIndex < values.length && values[leftIndex] !== null) {
      root.left = binaryTreeBuilder(new BinaryTreeNode(values[leftIndex] as T, root), leftIndex, values)
    }
    if (rightIndex < values.length && values[rightIndex] !== null) {
      root.right = binaryTreeBuilder(new BinaryTreeNode(values[rightIndex] as T, root), rightIndex, values)
    }
    return root
  }
  return binaryTreeBuilder(root, 0, values)
}

export const TraverseType = {
  /** 前序遍历 */
  PRE_ORDER: 'preOrder',
  /** 中序遍历 */
  IN_ORDER: 'inOrder',
  /** 后序遍历 */
  POST_ORDER: 'postOrder',
} as const

export function* traverse(
  root: BinaryTreeNode<number> | null,
  type: ValueOf<typeof TraverseType> = TraverseType.IN_ORDER,
) {
  function* order(root: BinaryTreeNode<number> | null): Generator<number> {
    if (root) {
      if (type === TraverseType.PRE_ORDER) yield root.value
      yield* order(root.left)
      if (type === TraverseType.IN_ORDER) yield root.value
      yield* order(root.right)
      if (type === TraverseType.POST_ORDER) yield root.value
    }
  }
  yield* order(root)
}

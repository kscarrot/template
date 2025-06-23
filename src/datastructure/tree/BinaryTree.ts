import { BinaryTreeNode } from 'src/datastructure/node'

export function valuesToBinaryTree<T>(values: Array<T | null>): BinaryTreeNode<T> | null {
  // 如果数组为空，则返回 null
  if (values.length === 0) return null
  // 创建根节点
  const root = new BinaryTreeNode(values[0] as T)
  // 创建二叉树
  const binaryTreeBuilder = (root: BinaryTreeNode<T>, index: number, values: Array<T | null>) => {
    const leftIndex = 2 * index + 1
    const rightIndex = 2 * index + 2
    // 如果左子节点存在，则创建左子节点
    if (leftIndex < values.length && values[leftIndex] !== null) {
      root.left = binaryTreeBuilder(new BinaryTreeNode(values[leftIndex] as T, root), leftIndex, values)
    }
    // 如果右子节点存在，则创建右子节点
    if (rightIndex < values.length && values[rightIndex] !== null) {
      root.right = binaryTreeBuilder(new BinaryTreeNode(values[rightIndex] as T, root), rightIndex, values)
    }
    return root
  }
  // 构建二叉树
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

export function* traverse<T>(
  root: BinaryTreeNode<T> | null,
  type: ValueOf<typeof TraverseType> = TraverseType.IN_ORDER,
) {
  function* order(root: BinaryTreeNode<T> | null): Generator<T> {
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

interface BinaryTreeADT<T> {
  size: number
  isEmpty: boolean
  print: (options?: { showNull: boolean }) => void
  [Symbol.iterator]: () => Generator<T>
}

export class BinaryTree<T> implements BinaryTreeADT<T> {
  #root: BinaryTreeNode<T> | null = null
  #size: number = 0

  constructor(values: Array<T | null>) {
    this.#root = valuesToBinaryTree(values)
    this.#size = values.filter(Boolean).length
  }

  get size() {
    return this.#size
  }

  get isEmpty() {
    return this.#size === 0
  }

  [Symbol.iterator] = () => traverse(this.#root)

  print(options = { showNull: false }) {
    const { showNull } = options

    if (this.isEmpty) {
      console.log('(空树)')
      return
    }

    const visualizeNode = (node: BinaryTreeNode<T> | null, prefix: string = '', isLast: boolean = true): void => {
      if (!node) {
        if (showNull) {
          console.log(`${prefix}${isLast ? '└─' : '├─'}null`)
        }
        return
      }

      const currentPrefix = isLast ? '└─' : '├─'
      console.log(`${prefix}${currentPrefix}${node.value}`)

      const newPrefix = prefix + (isLast ? '   ' : '│  ')

      // 先处理右子节点（为了正确的显示顺序）
      if (node.right) {
        visualizeNode(node.right, newPrefix, node.left === null)
      } else if (showNull) {
        visualizeNode(null, newPrefix, node.left === null)
      }

      // 再处理左子节点
      if (node.left) {
        visualizeNode(node.left, newPrefix, true)
      } else if (showNull) {
        visualizeNode(null, newPrefix, true)
      }
    }

    visualizeNode(this.#root)
  }
}

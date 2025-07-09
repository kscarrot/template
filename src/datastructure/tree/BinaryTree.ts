import { BinaryTreeNode } from 'src/datastructure/node'
import { BinaryTreeADT } from 'src/datastructure/ADT'

/**
 * @description 将数组转换为二叉树
 * @param values 数组
 * @returns 二叉树的根节点
 */
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

/**
 * @description 遍历二叉树
 * @param root 二叉树的根节点
 * @param type 遍历类型
 * @returns 遍历结果
 */
export function* traverseBinaryTreeNode<T>(
  root: BinaryTreeNode<T> | null,
  type: ValueOf<typeof TraverseType> = TraverseType.IN_ORDER,
) {
  function* order(root: BinaryTreeNode<T> | null): Generator<BinaryTreeNode<T>> {
    if (root) {
      if (type === TraverseType.PRE_ORDER) yield root
      yield* order(root.left)
      if (type === TraverseType.IN_ORDER) yield root
      yield* order(root.right)
      if (type === TraverseType.POST_ORDER) yield root
    }
  }
  yield* order(root)
}

export function* traverseBinaryTree<T>(
  root: BinaryTreeNode<T> | null,
  type: ValueOf<typeof TraverseType> = TraverseType.IN_ORDER,
) {
  for (const node of traverseBinaryTreeNode(root, type)) {
    yield node.value
  }
}

/**
 * @description 二叉树
 * @template T 二叉树的节点类型
 */
export class BinaryTree<T> implements BinaryTreeADT<T> {
  root: BinaryTreeNode<T> | null = null
  size: number = 0

  constructor(values: Array<T | null>) {
    this.root = valuesToBinaryTree(values)
    this.size = values.filter(Boolean).length
  }

  get isEmpty() {
    return this.size === 0
  }

  [Symbol.iterator] = () => traverseBinaryTree(this.root)

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

    visualizeNode(this.root)
  }
}

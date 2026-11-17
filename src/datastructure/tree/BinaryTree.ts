import type { TraverseType } from 'src/algorithm/tree/traverse'
import type { TreeADT } from 'src/datastructure/ADT'
import type { BinaryItem, BinaryNil } from 'src/datastructure/Node'
import { E_TraverseType, traverseBinaryTreeNode } from 'src/algorithm/tree/traverse'
import { createBinaryNil, createBinaryNode, isNil } from 'src/datastructure/Node'
import { mapGenerator } from 'src/util/Iter'

/** 子树高度，哨兵是 0，叶子是 1 */
export function heightOf<T, Meta>(node: BinaryItem<T, Meta>): number {
  return isNil(node)
    ? 0
    : 1 + Math.max(heightOf(node.left), heightOf(node.right))
}

/** 子树节点数 */
export function countNodes<T, Meta>(node: BinaryItem<T, Meta>): number {
  return traverseBinaryTreeNode(node).reduce(count => count + 1, 0)
}

/**
 * 二叉树。空位都指向同一个哨兵 nil
 * @template Meta 节点上的附加数据，比如 AVL 的高度、树堆的优先级
 */
export class BinaryTree<T, Meta = EmptyMeta> implements TreeADT<T> {
  protected readonly nil: BinaryNil = createBinaryNil()
  root: BinaryItem<T, Meta> = this.nil
  protected _size = 0

  /** 按层序数组建树，null 表示空位，挂在空位下面的值不会被建出 */
  static from<T>(values: Array<T | null>) {
    const tree = new BinaryTree<T>()
    const build = (index: number, parent: BinaryItem<T>): BinaryItem<T> => {
      const value = values[index]
      if (index >= values.length || value === null)
        return tree.nil
      const node = createBinaryNode<T>(value, {}, parent, tree.nil, tree.nil)
      node.left = build(2 * index + 1, node)
      node.right = build(2 * index + 2, node)
      tree._size++
      return node
    }
    tree.root = build(0, tree.nil)
    return tree
  }

  get size() {
    return this._size
  }

  get isEmpty() {
    return this._size === 0
  }

  get height() {
    return heightOf(this.root)
  }

  traverseNodes = (type: TraverseType = E_TraverseType.IN_ORDER) => traverseBinaryTreeNode(this.root, type);

  [Symbol.iterator] = () => mapGenerator(this.traverseNodes(), node => node.value)

  search = (value: T) => this.traverseNodes().some(node => node.value === value)

  print(options = { showNull: false }) {
    const { showNull } = options
    if (this.isEmpty) {
      console.log('(空树)')
      return
    }

    const visualizeNode = (node: BinaryItem<T, Meta>, prefix = '', isLast = true): void => {
      const branch = isLast ? '└─' : '├─'
      if (isNil(node)) {
        if (showNull)
          console.log(`${prefix}${branch}null`)
        return
      }
      console.log(`${prefix}${branch}${node.value}`)
      const childPrefix = prefix + (isLast ? '   ' : '│  ')
      // 先右后左，打印出来右子树在上
      visualizeNode(node.right, childPrefix, isNil(node.left))
      visualizeNode(node.left, childPrefix, true)
    }

    visualizeNode(this.root)
  }
}

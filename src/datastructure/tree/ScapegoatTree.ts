import type { BinaryItem, BinaryNode } from 'src/datastructure/Node'
import type { compareFunction } from 'src/util/Comparator'
import { isNil } from 'src/datastructure/Node'
import { traverseBinaryTreeNode } from 'src/datastructure/traverse'
import { BinarySearchTree } from 'src/datastructure/tree/BinarySearchTree'
import { countNodes } from 'src/datastructure/tree/BinaryTree'

function depthOf<T>(node: BinaryNode<T>): number {
  let depth = 0
  let current = node
  while (!isNil(current.parent)) {
    current = current.parent
    depth++
  }
  return depth
}

/**
 * 替罪羊树：不旋转，容忍一定程度的不平衡，超过阈值就把子树重建为最小高度
 * - 插入：新节点深度超过 log_{1/α}(maxSize) 时，找到路径上第一个失衡的祖先（替罪羊）并重建它的子树
 * - 删除：节点数降到 α × maxSize 以下时重建整棵树
 */
export class ScapegoatTree<T> extends BinarySearchTree<T> {
  /** 平衡系数，取值 [0.5, 1)：越小越平衡，重建也越频繁 */
  private readonly alpha: number
  /** 上次整树重建以来的最大节点数 */
  private maxSize = 0

  constructor(options: {
    comparator?: compareFunction<T>
    alpha?: number
  } = {}) {
    super(options.comparator)
    const alpha = options.alpha ?? 0.7
    if (!(alpha >= 0.5 && alpha < 1))
      throw new Error(`ScapegoatTree: alpha must be in [0.5, 1), got ${alpha}`)
    this.alpha = alpha
  }

  override insert(value: T): this {
    const node = this.insertNode(value)
    this.maxSize = Math.max(this.maxSize, this.size)
    // 新节点太深：重建路径上的替罪羊子树
    if (this.isTooDeep(node))
      this.rebuild(this.findScapegoat(node))
    return this
  }

  override delete(value: T): this {
    super.delete(value)
    if (!isNil(this.root) && this.size < this.alpha * this.maxSize) {
      // 节点数降得太多：重建整棵树，并以当前节点数重新计算 maxSize
      this.rebuild(this.root)
      this.maxSize = this.size
    }
    return this
  }

  /** 深度超过 log_{1/α}(maxSize)；用乘方比较以避开对数在整数边界上的浮点误差 */
  private isTooDeep(node: BinaryNode<T>): boolean {
    return (1 / this.alpha) ** depthOf(node) > this.maxSize
  }

  /**
   * 从新插入的节点往上，找第一个「某个孩子的子树大小 > α × 自身子树大小」的祖先
   * 子树大小按「孩子 + 兄弟 + 1」递推，只需统计兄弟子树，总开销与替罪羊子树大小成正比
   */
  private findScapegoat(node: BinaryNode<T>): BinaryNode<T> {
    let child = node
    let childSize = 1
    while (!isNil(child.parent)) {
      const parent = child.parent
      const sibling = parent.left === child
        ? parent.right
        : parent.left
      const parentSize = childSize + countNodes(sibling) + 1
      // parent 失衡：它就是替罪羊
      if (childSize > this.alpha * parentSize)
        return parent
      child = parent
      childSize = parentSize
    }
    throw new Error(`ScapegoatTree: no scapegoat found above a node at depth ${depthOf(node)}`)
  }

  /**
   * 把按中序排列的节点连成高度最小的树：取中点为根，左右两半递归
   * 会覆盖每个节点原有的 parent / left / right
   */
  private buildBalanced(nodes: BinaryNode<T>[], start: number, end: number, parent: BinaryItem<T>): BinaryItem<T> {
    if (start > end)
      return this.nil
    const mid = Math.floor((start + end) / 2)
    const node = nodes[mid]
    node.parent = parent
    node.left = this.buildBalanced(nodes, start, mid - 1, node)
    node.right = this.buildBalanced(nodes, mid + 1, end, node)
    return node
  }

  /** 把子树重建为高度最小的形状，复用原节点且中序不变，新子树根接回原来的位置 */
  private rebuild(subtreeRoot: BinaryNode<T>): void {
    const parent = subtreeRoot.parent
    const isLeftChild = !isNil(parent) && parent.left === subtreeRoot
    const nodes = traverseBinaryTreeNode(subtreeRoot).toArray()
    const top = this.buildBalanced(nodes, 0, nodes.length - 1, parent)
    if (isNil(parent))
      this.root = top
    else if (isLeftChild)
      parent.left = top
    else
      parent.right = top
  }
}

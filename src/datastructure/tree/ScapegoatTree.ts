import type { BinaryTreeNode } from 'src/datastructure/node/TreeNode'
import type { compareFunction } from 'src/util/Comparator'
import { BinarySearchTree } from 'src/datastructure/tree/BinarySearchTree'
import { traverseBinaryTreeNode } from 'src/datastructure/tree/BinaryTree'

function depthOf<T>(node: BinaryTreeNode<T>): number {
  let depth = 0
  let current = node
  while (current.parent) {
    current = current.parent
    depth++
  }
  return depth
}

/**
 * 把按中序排列的节点连成高度最小的树：取中点为根，左右两半递归
 * 会覆盖每个节点原有的 parent / left / right
 * @returns 新树的根，nodes 为空时为 null
 */
function buildBalanced<T>(nodes: BinaryTreeNode<T>[]): BinaryTreeNode<T> | null {
  const build = (start: number, end: number, parent: BinaryTreeNode<T> | null): BinaryTreeNode<T> | null => {
    if (start > end) {
      // 区间为空：没有节点
      return null
    }
    else {
      // 取中点为根，左右两半递归成左右子树
      const mid = Math.floor((start + end) / 2)
      const node = nodes[mid]
      node.parent = parent
      node.left = build(start, mid - 1, node)
      node.right = build(mid + 1, end, node)
      return node
    }
  }
  return build(0, nodes.length - 1, null)
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

  constructor(values: Array<T> = [], comparator?: compareFunction<T>, alpha = 0.7) {
    super([], comparator)
    if (!(alpha >= 0.5 && alpha < 1))
      throw new Error(`ScapegoatTree: alpha must be in [0.5, 1), got ${alpha}`)
    this.alpha = alpha
    for (const value of values)
      this.insert(value)
  }

  override insert(value: T): this {
    const node = this.insertNode(value)
    this.maxSize = Math.max(this.maxSize, this.size)
    if (this.isTooDeep(node)) {
      // 新节点太深：重建路径上的替罪羊子树
      this.rebuild(this.findScapegoat(node))
    }
    else {
      // 深度在允许范围内：无需重建
    }
    return this
  }

  override delete(value: T): this {
    super.delete(value)
    if (this.root && this.size < this.alpha * this.maxSize) {
      // 节点数降得太多：重建整棵树，并以当前节点数重新计算 maxSize
      this.rebuild(this.root)
      this.maxSize = this.size
    }
    else {
      // 树已空，或节点数仍在允许范围内：无需重建
    }
    return this
  }

  /** 深度超过 log_{1/α}(maxSize)；用乘方比较以避开对数在整数边界上的浮点误差 */
  private isTooDeep(node: BinaryTreeNode<T>): boolean {
    return (1 / this.alpha) ** depthOf(node) > this.maxSize
  }

  /**
   * 从新插入的节点往上，找第一个「某个孩子的子树大小 > α × 自身子树大小」的祖先
   * 子树大小按「孩子 + 兄弟 + 1」递推，只需统计兄弟子树，总开销与替罪羊子树大小成正比
   */
  private findScapegoat(node: BinaryTreeNode<T>): BinaryTreeNode<T> {
    let child = node
    let childSize = 1
    while (child.parent) {
      const parent = child.parent
      const sibling = parent.left === child
        ? parent.right
        : parent.left
      const parentSize = childSize + this.getNodeSize(sibling) + 1
      if (childSize > this.alpha * parentSize) {
        // parent 失衡：它就是替罪羊
        return parent
      }
      else {
        // parent 仍平衡：继续往上找
        child = parent
        childSize = parentSize
      }
    }
    throw new Error(`ScapegoatTree: no scapegoat found above a node at depth ${depthOf(node)}`)
  }

  /** 把子树重建为高度最小的形状，复用原节点且中序不变，新子树根接回原来的位置 */
  private rebuild(subtreeRoot: BinaryTreeNode<T>): void {
    const subtreeParent = subtreeRoot.parent
    const isLeftChild = subtreeParent?.left === subtreeRoot

    const top = buildBalanced([
      ...traverseBinaryTreeNode(subtreeRoot),
    ]) as BinaryTreeNode<T>
    top.parent = subtreeParent
    if (!subtreeParent) {
      // 重建的是整棵树：新子树根成为树根
      this.root = top
    }
    else if (isLeftChild) {
      // 原子树是左孩子：接回父节点的左侧
      subtreeParent.left = top
    }
    else {
      // 原子树是右孩子：接回父节点的右侧
      subtreeParent.right = top
    }
  }
}

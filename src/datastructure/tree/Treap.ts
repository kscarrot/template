import type { compareFunction } from 'src/util/Comparator'
import { TreapNode } from 'src/datastructure/node/TreeNode'
import { BinarySearchTree } from 'src/datastructure/tree/BinarySearchTree'

/**
 * 树堆：按值是二叉搜索树，按随机优先级是最小堆，期望树高 O(log n)
 * 结构只由 merge 和 split 维护，不旋转
 * - merge：两棵树按中序前后拼接。优先级更小的根留下，另一棵递归并进它靠向对方的那一侧
 * - split：按中序位置切开，前 k 个节点和其余的
 * - splitV：按值切开，小于 value 的和大于等于 value 的
 * 调用方保证 merge 的左树每个值都不大于右树
 */
export class Treap<T> extends BinarySearchTree<T, TreapNode<T>> {
  private readonly random: () => number

  constructor(options: {
    comparator?: compareFunction<T>
    random?: () => number
  } = {}) {
    super(options.comparator)
    this.random = options.random ?? Math.random
  }

  protected createNode(value: T, parent: TreapNode<T> | null): TreapNode<T> {
    return new TreapNode(value, this.random(), parent)
  }

  /**
   * 把 left 的中序接在 right 前面
   * 优先级相等时右树的根留下
   */
  merge(left: TreapNode<T> | null, right: TreapNode<T> | null): TreapNode<T> | null {
    if (!left) {
      return right
    }
    else if (!right) {
      return left
    }
    else if (left.priority < right.priority) {
      // 左根优先级更高：它当根，右树并进它的右子树
      this.link(left, 'right', this.merge(left.right, right))
      return left.resize()
    }
    else {
      // 右根优先级更高或相同：它当根，左树并进它的左子树
      this.link(right, 'left', this.merge(left, right.left))
      return right.resize()
    }
  }

  /** 按中序位置切开：左结果是前 k 个节点，右结果是剩下的 */
  split(treap: TreapNode<T> | null, k: number): [TreapNode<T> | null, TreapNode<T> | null] {
    if (!treap) {
      return [null, null]
    }
    else if (this.getNodeSize(treap.left) < k) {
      // 当前节点属于前 k 个：右子树按剩余名额继续切
      const [leftPart, rightPart] = this.split(treap.right, k - this.getNodeSize(treap.left) - 1)
      this.link(treap, 'right', leftPart)
      treap.resize()
      return [
        this.cut(treap),
        this.cut(rightPart),
      ]
    }
    else {
      // 当前节点属于后半：左子树切出前 k 个
      const [leftPart, rightPart] = this.split(treap.left, k)
      this.link(treap, 'left', rightPart)
      treap.resize()
      return [
        this.cut(leftPart),
        this.cut(treap),
      ]
    }
  }

  /** 按值切开：左结果都小于 value，右结果都大于等于 value */
  splitV(treap: TreapNode<T> | null, value: T): [TreapNode<T> | null, TreapNode<T> | null] {
    if (!treap) {
      return [null, null]
    }
    else if (this.comparator.lt(treap.value, value)) {
      // 当前节点小于 value：归左半，右子树继续切
      const [leftPart, rightPart] = this.splitV(treap.right, value)
      this.link(treap, 'right', leftPart)
      treap.resize()
      return [
        this.cut(treap),
        this.cut(rightPart),
      ]
    }
    else {
      // 当前节点大于等于 value：归右半，左子树继续切
      const [leftPart, rightPart] = this.splitV(treap.left, value)
      this.link(treap, 'left', rightPart)
      treap.resize()
      return [
        this.cut(leftPart),
        this.cut(treap),
      ]
    }
  }

  override insert(value: T): this {
    const node = this.createNode(value, null)
    const [left, right] = this.split(this.root, this.getRank(value))
    this.root = this.merge(this.merge(left, node), right)
    this.adoptRoot()
    return this
  }

  override delete(value: T): this {
    if (this.search(value)) {
      // 值存在时，getRank 正好是它最后一次出现的中序位置
      this.deleteKth(this.getRank(value))
    }
    else {
      // 值不存在：按 rank 去删会删掉前驱，这里保持树不变
    }
    return this
  }

  /** 删掉中序第 k 个节点，k 从 1 计 */
  deleteKth(k: number): T | null {
    /** 断两次再合并完成删除 */
    const [left, rest] = this.split(this.root, k - 1)
    const [removed, right] = this.split(rest, 1)
    this.root = this.merge(left, right)
    this.adoptRoot()
    return removed?.value ?? null
  }

  /** 直接读缓存的子树大小；null 是 0 */
  protected override getNodeSize(currentNode: TreapNode<T> | null): number {
    return currentNode?.size ?? 0
  }

  /** 接上孩子并写好父指针；child 为空时只是断开这一侧 */
  private link(parent: TreapNode<T>, side: 'left' | 'right', child: TreapNode<T> | null): void {
    parent[side] = child
    if (child) {
      child.parent = parent
    }
    else {
      // 这一侧没有孩子
    }
  }

  /** split 的结果是一棵独立的树，根不再有父节点 */
  private cut(node: TreapNode<T> | null): TreapNode<T> | null {
    if (node) {
      node.parent = null
      return node
    }
    else {
      return null
    }
  }

  /** 用根的 size 作为树的大小，并保证根没有父节点 */
  private adoptRoot(): void {
    if (this.root) {
      this.root.parent = null
      this.size = this.root.size
    }
    else {
      this.size = 0
    }
  }
}

import type { BinaryItem, BinaryNode } from 'src/datastructure/Node'
import type { compareFunction } from 'src/util/Comparator'
import { isNil } from 'src/datastructure/Node'
import { BinarySearchTree } from 'src/datastructure/tree/BinarySearchTree'

/**
 * priority 参与最小堆序，size 是子树节点数
 * merge / split 和旋转都会改写 left / right，调用 resize 后 size 才有效
 */
export interface TreapMeta {
  readonly priority: number
  size: number
}

export type TreapItem<T> = BinaryItem<T, TreapMeta>
export type TreapNode<T> = BinaryNode<T, TreapMeta>

export interface TreapOptions<T> {
  comparator?: compareFunction<T>
  random?: () => number
}

/** 缓存的子树大小，哨兵是 0 */
export function sizeOf<T>(node: TreapItem<T>) {
  return isNil(node)
    ? 0
    : node.meta.size
}

export function resize<T>(node: TreapNode<T>) {
  node.meta.size = 1 + sizeOf(node.left) + sizeOf(node.right)
  return node
}

/**
 * 树堆：按值是二叉搜索树，按随机优先级是最小堆，期望树高 O(log n)
 * 结构只由 merge 和 split 维护，不旋转
 * - merge：两棵树按中序前后拼接。优先级更小的根留下，另一棵递归并进它靠向对方的那一侧
 * - split：按中序位置切开，前 k 个节点和其余的
 * - splitV：按值切开，小于 value 的和大于等于 value 的
 * 调用方保证 merge 的左树每个值都不大于右树
 */
export class Treap<T> extends BinarySearchTree<T, TreapMeta> {
  private readonly random: () => number

  constructor(options: TreapOptions<T> = {}) {
    super(options.comparator)
    this.random = options.random ?? Math.random
  }

  protected override createMeta(): TreapMeta {
    return {
      priority: this.random(),
      size: 1,
    }
  }

  protected override subtreeSize(node: TreapItem<T>) {
    return sizeOf(node)
  }

  /**
   * 把 left 的中序接在 right 前面
   * 优先级相等时右树的根留下
   */
  merge(left: TreapItem<T>, right: TreapItem<T>): TreapItem<T> {
    if (isNil(left))
      return right
    if (isNil(right))
      return left
    if (left.meta.priority < right.meta.priority) {
      // 左根优先级更高：它当根，右树并进它的右子树
      this.link(left, 'right', this.merge(left.right, right))
      return resize(left)
    }
    // 右根优先级更高或相同：它当根，左树并进它的左子树
    this.link(right, 'left', this.merge(left, right.left))
    return resize(right)
  }

  /** 按中序位置切开：左结果是前 k 个节点，右结果是剩下的 */
  split(treap: TreapItem<T>, k: number): [TreapItem<T>, TreapItem<T>] {
    if (isNil(treap))
      return [this.nil, this.nil]
    if (sizeOf(treap.left) < k) {
      // 当前节点属于前 k 个：右子树按剩余名额继续切
      const [leftPart, rightPart] = this.split(treap.right, k - sizeOf(treap.left) - 1)
      this.link(treap, 'right', leftPart)
      resize(treap)
      return [
        this.cut(treap),
        this.cut(rightPart),
      ]
    }
    // 当前节点属于后半：左子树切出前 k 个
    const [leftPart, rightPart] = this.split(treap.left, k)
    this.link(treap, 'left', rightPart)
    resize(treap)
    return [
      this.cut(leftPart),
      this.cut(treap),
    ]
  }

  /** 按值切开：左结果都小于 value，右结果都大于等于 value */
  splitV(treap: TreapItem<T>, value: T): [TreapItem<T>, TreapItem<T>] {
    if (isNil(treap))
      return [this.nil, this.nil]
    if (this.comparator.lt(treap.value, value)) {
      // 当前节点小于 value：归左半，右子树继续切
      const [leftPart, rightPart] = this.splitV(treap.right, value)
      this.link(treap, 'right', leftPart)
      resize(treap)
      return [
        this.cut(treap),
        this.cut(rightPart),
      ]
    }
    // 当前节点大于等于 value：归右半，左子树继续切
    const [leftPart, rightPart] = this.splitV(treap.left, value)
    this.link(treap, 'left', rightPart)
    resize(treap)
    return [
      this.cut(leftPart),
      this.cut(treap),
    ]
  }

  override insert(value: T): this {
    const node = this.createNode(value, this.nil)
    const [left, right] = this.split(this.root, this.getRank(value))
    this.root = this.merge(this.merge(left, node), right)
    this.adoptRoot()
    return this
  }

  override delete(value: T): this {
    // 值存在时，getRank 正好是它最后一次出现的中序位置；值不存在时按 rank 去删会删掉前驱
    if (this.search(value))
      this.deleteKth(this.getRank(value))
    return this
  }

  /** 删掉中序第 k 个节点，k 从 1 计 */
  deleteKth(k: number): T | null {
    // 断两次再合并完成删除
    const [left, rest] = this.split(this.root, k - 1)
    const [removed, right] = this.split(rest, 1)
    this.root = this.merge(left, right)
    this.adoptRoot()
    return isNil(removed)
      ? null
      : removed.value
  }

  /** 接上孩子并写好父指针；child 是哨兵时只是断开这一侧 */
  private link(parent: TreapNode<T>, side: 'left' | 'right', child: TreapItem<T>): void {
    parent[side] = child
    if (!isNil(child))
      child.parent = parent
  }

  /** split 的结果是一棵独立的树，根的 parent 指向哨兵 */
  private cut(node: TreapItem<T>): TreapItem<T> {
    if (!isNil(node))
      node.parent = this.nil
    return node
  }

  /** 用根的 size 作为树的大小，并让根的 parent 指向哨兵 */
  private adoptRoot(): void {
    this.cut(this.root)
    this._size = sizeOf(this.root)
  }
}

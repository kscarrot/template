import type { TreapItem, TreapMeta, TreapNode, TreapOptions } from 'src/datastructure/tree/Treap'
import { isNil } from 'src/datastructure/Node'
import { BinarySearchTree } from 'src/datastructure/tree/BinarySearchTree'
import { rotateUp } from 'src/datastructure/tree/rotate'
import { resize, sizeOf } from 'src/datastructure/tree/Treap'

/**
 * 旋转树堆：和 Treap 一样按值是二叉搜索树、按优先级是最小堆，但用旋转维持堆序
 * - 插入：按二叉搜索树挂成叶子，优先级比父节点更高就上提，直到堆序满足
 * - 删除：反复把优先级更高的孩子转上来，目标沉到叶子后再摘除。
 *   两个孩子优先级相同时上提左孩子。不用后继覆盖值，否则值会和优先级拆开
 * 期望树高 O(log n)。旋转之后沿被改写的节点调用 resize，size 仍然是 O(1) 读取
 */
export class TreapRotate<T> extends BinarySearchTree<T, TreapMeta> {
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

  override insert(value: T): this {
    const node = this.insertNode(value)
    // 先把新叶子算进沿途的 size，再旋转；旋转只改变参与的两个节点
    this.refreshUp(node)
    this.bubble(node)
    return this
  }

  override delete(value: T): this {
    const node = this.searchNode(value)
    if (!isNil(node)) {
      // 命中：旋成叶子再摘除，值和优先级一起离开
      this.sink(node)
      this.detach(node)
      this._size--
    }
    return this
  }

  /** 优先级比父节点更高时一路上提 */
  private bubble(node: TreapNode<T>): void {
    while (!isNil(node.parent) && node.meta.priority < node.parent.meta.priority) {
      // 子节点优先级更高：上提一层。先重算沉下去的父节点，再重算升上来的节点
      const parent = node.parent
      rotateUp(node)
      resize(parent)
      resize(node)
    }
    // 已经到根：接上树根引用
    if (isNil(node.parent))
      this.root = node
  }

  /** 把 node 旋转成叶子：每次上提优先级更高的孩子 */
  private sink(node: TreapNode<T>): void {
    while (!isNil(node.left) || !isNil(node.right)) {
      const child = this.childToPromote(node)
      rotateUp(child)
      // node 现在在 child 下面，先算 node 再算 child
      resize(node)
      resize(child)
      // 孩子升成了根：接上树根引用
      if (isNil(child.parent))
        this.root = child
    }
  }

  /**
   * 决定删除时该上提哪个孩子，调用方保证 node 至少有一个孩子
   * 只有一个孩子时只能上提它；两个都在时上提优先级更高（数值更小）的，相等时取左
   */
  private childToPromote(node: TreapNode<T>): TreapNode<T> {
    const { left, right } = node
    if (isNil(left))
      return right as TreapNode<T>
    if (isNil(right))
      return left
    return left.meta.priority <= right.meta.priority
      ? left
      : right
  }

  /** 摘除一个叶子，并沿父链重算 size */
  private detach(node: TreapNode<T>): void {
    const parent = node.parent
    if (isNil(parent))
      this.root = this.nil
    else if (parent.left === node)
      parent.left = this.nil
    else
      parent.right = this.nil
    node.parent = this.nil
    this.refreshUp(parent)
  }

  /** 从 node 沿父链重算 size。调用前孩子的 size 必须已经正确 */
  private refreshUp(node: TreapItem<T>): void {
    let current = node
    while (!isNil(current)) {
      resize(current)
      current = current.parent
    }
  }
}

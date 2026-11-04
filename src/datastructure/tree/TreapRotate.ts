import type { BinaryTreeNode } from 'src/datastructure/node/TreeNode'
import type { compareFunction } from 'src/util/Comparator'
import { TreapNode } from 'src/datastructure/node/TreeNode'
import { BinarySearchTree } from 'src/datastructure/tree/BinarySearchTree'

/**
 * 旋转树堆：和 Treap 一样按值是二叉搜索树、按优先级是最小堆，但用旋转维持堆序
 * - 插入：按二叉搜索树挂成叶子，优先级比父节点更高就上提，直到堆序满足
 * - 删除：反复把优先级更高的孩子转上来，目标沉到叶子后再摘除。
 *   两个孩子优先级相同时上提左孩子。不用后继覆盖值，否则值会和优先级拆开
 * 期望树高 O(log n)。旋转之后沿被改写的节点调用 resize，size 仍然是 O(1) 读取
 */
export class TreapRotate<T> extends BinarySearchTree<T> {
  override root: TreapNode<T> | null = null
  private readonly random: () => number

  constructor(values: Array<T> = [], comparator?: compareFunction<T>, random: () => number = Math.random) {
    super([], comparator)
    this.random = random
    for (const value of values)
      this.insert(value)
  }

  override insert(value: T): this {
    const node = this.insertNode(value)
    if (node instanceof TreapNode) {
      // 先把新叶子算进沿途的 size，再旋转；旋转只改变参与的两个节点
      this.refreshUp(node)
      this.bubble(node)
    }
    else {
      throw new Error('TreapRotate: expected a TreapNode')
    }
    return this
  }

  override delete(value: T): this {
    const node = this.searchNode(value, this.root)
    if (node instanceof TreapNode) {
      // 命中：旋成叶子再摘除，值和优先级一起离开
      this.sink(node)
      this.detach(node)
      this.size--
    }
    else {
      // 未命中：树不变
    }
    return this
  }

  protected override createNode(value: T, parent: BinaryTreeNode<T> | null): TreapNode<T> {
    const priority = this.random()
    if (!Number.isFinite(priority)) {
      throw new TypeError(`TreapRotate: priority must be a finite number, got ${priority}`)
    }
    else if (parent instanceof TreapNode || parent === null) {
      return new TreapNode(value, priority, parent)
    }
    else {
      throw new Error('TreapRotate: expected a TreapNode')
    }
  }

  /** 直接读缓存的子树大小；null 是 0 */
  protected override getNodeSize(currentNode: TreapNode<T> | null): number {
    return currentNode?.size ?? 0
  }

  /** 优先级比父节点更高时一路上提 */
  private bubble(node: TreapNode<T>): void {
    while (node.parent && node.priority < node.parent.priority) {
      // 子节点优先级更高：上提一层。先重算沉下去的父节点，再重算升上来的节点
      const parent = node.parent
      node.rotateUp()
      parent.resize()
      node.resize()
    }
    if (!node.parent) {
      // 已经到根：接上树根引用
      this.root = node
    }
    else {
      // 父节点优先级更高或相同：堆序已满足
    }
  }

  /** 把 node 旋转成叶子：每次上提优先级更高的孩子 */
  private sink(node: TreapNode<T>): void {
    while (node.left || node.right) {
      const child = this.childToPromote(node)
      child.rotateUp()
      // node 现在在 child 下面，先算 node 再算 child
      node.resize()
      child.resize()
      if (!child.parent) {
        // 孩子升成了根：接上树根引用
        this.root = child
      }
      else {
        // 孩子上面还有节点：树根不变
      }
    }
  }

  /**
   * 决定删除时该上提哪个孩子
   * 只有一个孩子时只能上提它；两个都在时上提优先级更高（数值更小）的，相等时取左
   */
  private childToPromote(node: TreapNode<T>): TreapNode<T> {
    if (node.left && node.right) {
      if (node.left.priority <= node.right.priority) {
        return node.left
      }
      else {
        return node.right
      }
    }
    else if (node.left) {
      return node.left
    }
    else if (node.right) {
      return node.right
    }
    else {
      throw new Error('TreapRotate: leaf has no child to promote')
    }
  }

  /** 摘除一个叶子，并沿父链重算 size */
  private detach(node: TreapNode<T>): void {
    const parent = node.parent
    if (!parent) {
      // 叶子就是根：树变空
      this.root = null
    }
    else if (parent.left === node) {
      // 摘除左孩子
      parent.left = null
    }
    else {
      // 摘除右孩子
      parent.right = null
    }
    node.parent = null
    this.refreshUp(parent)
  }

  /** 从 node 沿父链重算 size。调用前孩子的 size 必须已经正确 */
  private refreshUp(node: TreapNode<T> | null): void {
    let current = node
    while (current) {
      current.resize()
      current = current.parent
    }
  }
}

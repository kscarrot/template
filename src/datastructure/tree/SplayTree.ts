// SplayTree.ts
import { BinarySearchTree } from 'src/datastructure/tree/BinarySearchTree'
import { BinaryTreeNode } from 'src/datastructure/node/TreeNode'
import { BinaryTreeADT } from 'src/datastructure/ADT'
import { Comparator } from 'src/util/Comparator'
import type { compareFunction } from 'src/util/Comparator'

export class SplayTree<T> extends BinarySearchTree<T> implements BinaryTreeADT<T> {
  constructor(values: Array<T> = [], comparator?: compareFunction<T>) {
    super([])
    this.comparator = new Comparator(comparator)
    for (const value of values) {
      this.insert(value)
    }
  }
  /**
   * 右旋操作 (顺时针旋转)
   * y            x
   * / \          / \
   * x   C  =>    A   y
   * / \              / \
   *A   B            B   C
   * @param y 要旋转的节点 (轴心)
   */
  private rotateRight(y: BinaryTreeNode<T>): void {
    const x = y.left!
    const B = x.right
    const p = y.parent

    // 更新父节点指针
    if (p) {
      if (p.left === y) {
        p.left = x
      } else {
        p.right = x
      }
    } else {
      this.root = x // 如果 y 是根，x 成为新根
    }
    x.parent = p

    // 旋转 y 和 x
    y.parent = x
    x.right = y

    // 移动 x 的原右子树 B
    y.left = B
    if (B) {
      B.parent = y
    }
  }

  /**
   * 左旋操作 (逆时针旋转)
   * x            y
   * / \          / \
   * A   y  =>    x   C
   * / \      / \
   * B   C    A   B
   * @param x 要旋转的节点 (轴心)
   */
  private rotateLeft(x: BinaryTreeNode<T>): void {
    const y = x.right!
    const B = y.left
    const p = x.parent

    // 更新父节点指针
    if (p) {
      if (p.left === x) {
        p.left = y
      } else {
        p.right = y
      }
    } else {
      this.root = y // 如果 x 是根，y 成为新根
    }
    y.parent = p

    // 旋转 x 和 y
    x.parent = y
    y.left = x

    // 移动 y 的原左子树 B
    x.right = B
    if (B) {
      B.parent = x
    }
  }

  /**
   * 伸展操作：将节点 x 移动到树根
   * @param x 要伸展的节点
   */
  private splay(x: BinaryTreeNode<T>): void {
    while (x.parent) {
      const p = x.parent
      const g = p.parent // 祖父节点

      if (!g) {
        // Zig (单旋)
        if (p.left === x) {
          this.rotateRight(p)
        } else {
          this.rotateLeft(p)
        }
      } else {
        if (g.left === p && p.left === x) {
          // Zig-Zig (左-左情况)
          this.rotateRight(g)
          this.rotateRight(p)
        } else if (g.right === p && p.right === x) {
          // Zig-Zig (右-右情况)
          this.rotateLeft(g)
          this.rotateLeft(p)
        } else if (g.left === p && p.right === x) {
          // Zig-Zag (左-右情况)
          this.rotateLeft(p)
          this.rotateRight(g)
        } else {
          // Zig-Zag (右-左情况)
          this.rotateRight(p)
          this.rotateLeft(g)
        }
      }
    }
    this.root = x // 最后，x 成为根节点
  }

  /**
   * 重写 insertNode 方法，添加伸展功能
   * @param value 要插入的值
   * @param parentNode 父节点
   * @returns 插入的节点
   */
  protected override insertNode(value: T, parentNode: BinaryTreeNode<T> | null = null): BinaryTreeNode<T> {
    // 调用父类的 insertNode 方法
    const insertedNode = super.insertNode(value, parentNode)

    // 伸展插入的节点到根部
    this.splay(insertedNode)

    return insertedNode
  }

  /**
   * 简化的 insert 方法，委托给 insertNode
   * @param value 要插入的值
   * @param parentNode 父节点
   */
  override insert(value: T): this {
    this.insertNode(value)
    return this
  }

  override search(value: T): boolean {
    const { node, lastNode } = this.searchNodeWithLastVisited(value, this.root)

    if (node) {
      // 找到了节点，伸展到根部
      this.splay(node)
      return true
    } else if (lastNode) {
      // 没找到，伸展最后访问的节点到根部
      // 这也是伸展树的一个特性，可以让后续相关的查找更快
      this.splay(lastNode)
      return false
    }

    // 树为空的情况
    return false
  }

  /**
   * @override 重写删除方法，添加伸展功能
   * @param value 要删除的值
   */
  override delete(value: T): this {
    if (!this.root) return this

    // 使用父类的 searchNodeWithLastVisited 方法查找
    const { node, lastNode } = this.searchNodeWithLastVisited(value, this.root)

    if (!node) {
      // 如果没找到要删除的节点，伸展最后访问的节点到根部
      if (lastNode) {
        this.splay(lastNode)
      }
      return this
    }

    // 伸展要删除的节点到根部
    this.splay(node)

    // 现在要删除的节点已经是根节点了
    const leftSubtree = this.root.left
    const rightSubtree = this.root.right

    if (!leftSubtree) {
      // 如果没有左子树，右子树直接成为新的树
      this.root = rightSubtree
      if (rightSubtree) {
        rightSubtree.parent = null
      }
    } else {
      // 断开左子树与原根的连接
      leftSubtree.parent = null

      // 找到左子树中的最大节点
      const maxInLeft = this.searchMaxNode(leftSubtree)

      // 将这个最大节点伸展到左子树的根
      // 注意：这里是在左子树这个局部范围内进行 splay
      // 为了简化，我们先将 this.root 指向左子树，操作完再接回右子树
      this.root = leftSubtree
      if (maxInLeft) {
        this.splay(maxInLeft)
      }

      // 现在，maxInLeft 成了新的根（原左子树的根）
      // 因为它是最大的，所以它没有右子节点
      // 我们可以安全地将原右子树挂在它的右边
      this.root.right = rightSubtree
      if (rightSubtree) {
        rightSubtree.parent = this.root
      }
    }

    this.size--
    return this
  }
}

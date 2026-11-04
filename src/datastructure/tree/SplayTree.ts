import type { BinaryTreeNode } from 'src/datastructure/node/TreeNode'
import { BinarySearchTree } from 'src/datastructure/tree/BinarySearchTree'

export class SplayTree<T> extends BinarySearchTree<T> {
  override insert(value: T): this {
    this.root = this.splay(this.insertNode(value))
    return this
  }

  override search(value: T): boolean {
    return this.access(value) !== null
  }

  /** 目标被伸展到根后，拼接它的左右子树作为新树 */
  override delete(value: T): this {
    const node = this.access(value)
    if (!node)
      return this
    this.root = this.join(node.left, node.right)
    this.size--
    return this
  }

  /**
   * 按 BST 路径查找 value，并把最后访问的节点伸展到根
   * 命中时最后访问的就是目标本身，未命中时是 value 若插入时的父节点
   * @returns 命中的节点，未命中为 null
   */
  private access(value: T): BinaryTreeNode<T> | null {
    const { node, lastNode } = this.searchNodeWithLastVisited(value, this.root)
    if (lastNode)
      this.root = this.splay(lastNode)
    return node
  }

  /**
   * 拼接两棵子树，要求 left 中的值都不大于 right 中的值
   * 把 left 的最大值伸展到 left 的根，它此时没有右孩子，正好挂上 right
   * @returns 拼接后的根
   */
  private join(left: BinaryTreeNode<T> | null, right: BinaryTreeNode<T> | null): BinaryTreeNode<T> | null {
    if (!left) {
      if (right)
        right.parent = null
      return right
    }
    left.parent = null
    const root = this.splay(this.searchMaxNode(left) as BinaryTreeNode<T>)
    root.right = right
    if (right)
      right.parent = root
    return root
  }

  /**
   * 伸展：把 x 一路上提到它所在树的根
   * - Zig：x 的父节点是根，上提 x 一次
   * - Zig-Zig：x 与父节点同侧，先上提父节点，再上提 x
   * - Zig-Zag：x 与父节点异侧，连续上提 x 两次
   * 不会更新 this.root，由调用方赋值
   * @returns x，即伸展后的根
   */
  private splay(x: BinaryTreeNode<T>): BinaryTreeNode<T> {
    while (x.parent) {
      const parent = x.parent
      const grandparent = parent.parent
      if (grandparent) {
        const isZigZig = (grandparent.left === parent) === (parent.left === x)
        if (isZigZig)
          parent.rotateUp()
        else
          x.rotateUp()
      }
      x.rotateUp()
    }
    return x
  }
}

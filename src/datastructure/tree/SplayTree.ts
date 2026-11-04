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
    if (node) {
      // 命中：node 已在根上，拼接它的左右子树替换掉它
      this.root = this.join(node.left, node.right)
      this.size--
    }
    else {
      // 未命中：access 已把最后访问的节点伸展到根，树中没有可删的节点
    }
    return this
  }

  /**
   * 按 BST 路径查找 value，并把最后访问的节点伸展到根
   * 命中时最后访问的就是目标本身，未命中时是 value 若插入时的父节点
   * @returns 命中的节点，未命中为 null
   */
  private access(value: T): BinaryTreeNode<T> | null {
    const { node, lastNode } = this.searchNodeWithLastVisited(value, this.root)
    if (lastNode) {
      // 访问过节点：把最后访问的节点伸展到根
      this.root = this.splay(lastNode)
    }
    else {
      // 空树：没有访问任何节点，无需伸展
    }
    return node
  }

  /**
   * 拼接两棵子树，要求 left 中的值都不大于 right 中的值
   * @returns 拼接后的根
   */
  private join(left: BinaryTreeNode<T> | null, right: BinaryTreeNode<T> | null): BinaryTreeNode<T> | null {
    if (left && right) {
      // 两侧都有：把 left 的最大值伸展到根，它此时没有右孩子，正好挂上 right
      left.parent = null
      const root = this.splay(this.searchMaxNode(left) as BinaryTreeNode<T>)
      root.right = right
      right.parent = root
      return root
    }
    else if (left) {
      // 只有左侧：left 直接成为新树
      left.parent = null
      return left
    }
    else if (right) {
      // 只有右侧：right 直接成为新树
      right.parent = null
      return right
    }
    else {
      // 两侧都空：结果是空树
      return null
    }
  }

  /**
   * 伸展：把 x 一路上提到它所在树的根
   * 不会更新 this.root，由调用方赋值
   * @returns x，即伸展后的根
   */
  private splay(x: BinaryTreeNode<T>): BinaryTreeNode<T> {
    while (x.parent) {
      const parent = x.parent
      const grandparent = parent.parent
      const isZigZig = grandparent !== null && (grandparent.left === parent) === (parent.left === x)
      if (!grandparent) {
        // Zig：父节点是根，上提 x 一次
        x.rotateUp()
      }
      else if (isZigZig) {
        // Zig-Zig：x 与父节点同侧，先上提父节点，再上提 x
        parent.rotateUp()
        x.rotateUp()
      }
      else {
        // Zig-Zag：x 与父节点异侧，连续上提 x 两次
        x.rotateUp()
        x.rotateUp()
      }
    }
    return x
  }
}

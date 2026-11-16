import type { BinaryItem, BinaryNode } from 'src/datastructure/Node'
import { isNil } from 'src/datastructure/Node'
import { rotateUp } from 'src/datastructure/rotate'
import { BinarySearchTree } from 'src/datastructure/tree/BinarySearchTree'

export class SplayTree<T> extends BinarySearchTree<T> {
  /** 最近一次 searchNode 走到的最后一个节点；空树时是哨兵 */
  #lastVisited: BinaryItem<T> = this.nil

  override insert(value: T): this {
    this.root = this.splay(this.insertNode(value))
    return this
  }

  override search = (value: T) => !isNil(this.access(value))

  /** 目标被伸展到根后，拼接它的左右子树作为新树 */
  override delete(value: T): this {
    const node = this.access(value)
    if (!isNil(node)) {
      // 命中：node 已在根上，拼接它的左右子树替换掉它
      this.root = this.join(node.left, node.right)
      this._size--
    }
    // 未命中：access 已把最后访问的节点伸展到根，树中没有可删的节点
    return this
  }

  /** 查找时记下路径终点，供未命中时的伸展使用 */
  protected override searchNode(value: T) {
    let node = this.root
    this.#lastVisited = this.root
    while (!isNil(node)) {
      this.#lastVisited = node
      switch (this.comparator.compare(value, node.value)) {
        case 0:
          return node
        case -1:
          node = node.left
          break
        case 1:
          node = node.right
          break
      }
    }
    return node
  }

  /**
   * 按 BST 路径查找 value，并把路径上最后走到的节点伸展到根
   * @returns 命中的节点；没找到是哨兵
   */
  private access(value: T): BinaryItem<T> {
    const node = this.searchNode(value)
    // 命中时 #lastVisited 就是 node；未命中时是路径终点；空树时是哨兵
    if (!isNil(this.#lastVisited))
      this.root = this.splay(this.#lastVisited)
    return node
  }

  /**
   * 拼接两棵子树，要求 left 中的值都不大于 right 中的值
   * @returns 拼接后的根
   */
  private join(left: BinaryItem<T>, right: BinaryItem<T>): BinaryItem<T> {
    if (isNil(left)) {
      if (!isNil(right))
        right.parent = this.nil
      return right
    }
    left.parent = this.nil
    // 把 left 的最大值伸展到根，它此时没有右孩子，正好挂上 right
    const root = this.splay(this.maxNode(left))
    root.right = right
    if (!isNil(right))
      right.parent = root
    return root
  }

  /**
   * 伸展：把 x 一路上提到它所在树的根
   * 不会更新 this.root，由调用方赋值
   * @returns x，即伸展后的根
   */
  private splay(x: BinaryNode<T>): BinaryNode<T> {
    while (!isNil(x.parent)) {
      const parent = x.parent
      const grandparent = parent.parent
      if (isNil(grandparent)) {
        // Zig：父节点是根，上提 x 一次
        rotateUp(x)
      }
      else if ((grandparent.left === parent) === (parent.left === x)) {
        // Zig-Zig：x 与父节点同侧，先上提父节点，再上提 x
        rotateUp(parent)
        rotateUp(x)
      }
      else {
        // Zig-Zag：x 与父节点异侧，连续上提 x 两次
        rotateUp(x)
        rotateUp(x)
      }
    }
    return x
  }
}

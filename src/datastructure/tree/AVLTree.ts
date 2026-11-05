import { rotateLeft, rotateRight } from 'src/datastructure/node/rotate'
import { AVLNode } from 'src/datastructure/node/TreeNode'
import { BinarySearchTree } from 'src/datastructure/tree/BinarySearchTree'

/**
 * AVL 树：按值是二叉搜索树，每个节点的平衡因子都在 [-1, 1]
 * 平衡因子 = 左子树高度 - 右子树高度，叶子高度为 1
 * - 插入：按二叉搜索树挂成叶子，从新节点沿父链往上，失衡就旋转
 * - 删除：按二叉搜索树摘除，从被摘除节点的父节点沿父链往上同样处理
 * 旋转之后先重算沉下去的节点高度，再重算升上来的节点。树高 O(log n)
 */
export class AVLTree<T> extends BinarySearchTree<T, AVLNode<T>> {
  protected createNode(value: T, parent: AVLNode<T> | null): AVLNode<T> {
    return new AVLNode(value, parent)
  }

  override insert(value: T): this {
    const node = this.insertNode(value)
    // 新叶子的高度已经是 1，从它往上把沿途高度和平衡补齐
    this.rebalanceUp(node)
    return this
  }

  override delete(value: T): this {
    const node = this.searchNode(value, this.root)
    if (node) {
      // 命中：摘除后从父节点往上恢复平衡。两个孩子时摘的是后继，父节点仍在原节点的祖先链上
      const { parent } = this.removeNode(node)
      this.rebalanceUp(parent)
    }
    else {
      // 未命中：树不变
    }
    return this
  }

  /**
   * 从 node 沿父链往上更新高度，失衡就旋转
   * 插入时一次旋转就会把子树高度恢复原状；删除时高度可能下降，所以要一直走到根
   */
  private rebalanceUp(node: AVLNode<T> | null): void {
    let current = node
    while (current) {
      const top = this.rebalance(current)
      current = top.parent
    }
  }

  /** 重算高度；平衡因子超出 [-1, 1] 时旋转，返回这棵子树新的根 */
  private rebalance(node: AVLNode<T>): AVLNode<T> {
    node.updateHeight()
    const balance = node.balanceFactor()
    if (balance > 1) {
      // 左重
      const left = node.left
      if (!left)
        throw new Error('AVLTree: missing left child')
      if (left.balanceFactor() < 0) {
        // 左孩子右倾：先左旋左孩子，再右旋当前节点
        this.finishRotation(left, rotateLeft(left))
      }
      else {
        // 左孩子左倾或平衡：一次右旋
      }
      return this.finishRotation(node, rotateRight(node))
    }
    else if (balance < -1) {
      // 右重
      const right = node.right
      if (!right)
        throw new Error('AVLTree: missing right child')
      if (right.balanceFactor() > 0) {
        // 右孩子左倾：先右旋右孩子，再左旋当前节点
        this.finishRotation(right, rotateRight(right))
      }
      else {
        // 右孩子右倾或平衡：一次左旋
      }
      return this.finishRotation(node, rotateLeft(node))
    }
    else {
      // 平衡因子在 [-1, 1]：只更新了高度
      return node
    }
  }

  /** 先重算沉下去的节点，再重算升上来的节点 */
  private finishRotation(demoted: AVLNode<T>, promoted: AVLNode<T>): AVLNode<T> {
    demoted.updateHeight()
    promoted.updateHeight()
    if (!promoted.parent) {
      // 升上来的节点没有父节点：它是新的树根
      this.root = promoted
    }
    else {
      // 上面还有父节点：树根不变
    }
    return promoted
  }
}

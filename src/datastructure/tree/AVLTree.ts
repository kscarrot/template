import type { BinaryItem, BinaryNode } from 'src/datastructure/Node'
import { isNil } from 'src/datastructure/Node'
import { BinarySearchTree } from 'src/datastructure/tree/BinarySearchTree'
import { rotateLeft, rotateRight } from 'src/datastructure/tree/rotate'

/** height 是缓存的子树高度，叶子为 1。旋转会改写 left / right，调用 updateHeight 后才有效 */
export interface AVLMeta { height: number }

type AVLItem<T> = BinaryItem<T, AVLMeta>
type AVLNode<T> = BinaryNode<T, AVLMeta>

/** 缓存的子树高度，哨兵是 0 */
function heightOf<T>(node: AVLItem<T>) {
  return isNil(node)
    ? 0
    : node.meta.height
}

function updateHeight<T>(node: AVLNode<T>) {
  node.meta.height = 1 + Math.max(heightOf(node.left), heightOf(node.right))
}

/** 左子树高度减去右子树高度 */
function balanceFactor<T>(node: AVLNode<T>) {
  return heightOf(node.left) - heightOf(node.right)
}

/**
 * AVL 树：按值是二叉搜索树，每个节点的平衡因子都在 [-1, 1]
 * 平衡因子 = 左子树高度 - 右子树高度，叶子高度为 1
 * - 插入：按二叉搜索树挂成叶子，从新节点沿父链往上，失衡就旋转
 * - 删除：按二叉搜索树摘除，从被摘除节点的父节点沿父链往上同样处理
 * 旋转之后先重算沉下去的节点高度，再重算升上来的节点。树高 O(log n)
 */
export class AVLTree<T> extends BinarySearchTree<T, AVLMeta> {
  protected override createMeta(): AVLMeta {
    return { height: 1 }
  }

  override insert(value: T): this {
    // 新叶子的高度已经是 1，从它往上把沿途高度和平衡补齐
    this.rebalanceUp(this.insertNode(value))
    return this
  }

  override delete(value: T): this {
    const node = this.searchNode(value)
    if (!isNil(node)) {
      // 命中：摘除后从父节点往上恢复平衡。两个孩子时摘的是后继，父节点仍在原节点的祖先链上
      const { parent } = this.removeNode(node)
      this.rebalanceUp(parent)
    }
    return this
  }

  /**
   * 从 node 沿父链往上更新高度，失衡就旋转
   * 插入时一次旋转就会把子树高度恢复原状；删除时高度可能下降，所以要一直走到根
   */
  private rebalanceUp(node: AVLItem<T>): void {
    let current = node
    while (!isNil(current))
      current = this.rebalance(current).parent
  }

  /** 重算高度；平衡因子超出 [-1, 1] 时旋转，返回这棵子树新的根 */
  private rebalance(node: AVLNode<T>): AVLNode<T> {
    updateHeight(node)
    const balance = balanceFactor(node)
    if (balance > 1) {
      // 左重：左子树高度至少是 2，左孩子一定是数据节点
      const left = node.left as AVLNode<T>
      if (balanceFactor(left) < 0) {
        // 左孩子右倾：先左旋左孩子，再右旋当前节点
        this.finishRotation(left, rotateLeft(left))
      }
      return this.finishRotation(node, rotateRight(node))
    }
    if (balance < -1) {
      // 右重：右子树高度至少是 2，右孩子一定是数据节点
      const right = node.right as AVLNode<T>
      if (balanceFactor(right) > 0) {
        // 右孩子左倾：先右旋右孩子，再左旋当前节点
        this.finishRotation(right, rotateRight(right))
      }
      return this.finishRotation(node, rotateLeft(node))
    }
    // 平衡因子在 [-1, 1]：只更新了高度
    return node
  }

  /** 先重算沉下去的节点，再重算升上来的节点 */
  private finishRotation(demoted: AVLNode<T>, promoted: AVLNode<T>): AVLNode<T> {
    updateHeight(demoted)
    updateHeight(promoted)
    if (isNil(promoted.parent))
      this.root = promoted
    return promoted
  }
}

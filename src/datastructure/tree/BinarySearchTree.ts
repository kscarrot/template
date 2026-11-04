import type { SearchTreeADT } from 'src/datastructure/ADT'
import type { compareFunction } from 'src/util/Comparator'
import { BinaryTreeNode } from 'src/datastructure/node/TreeNode'
import { BinaryTree } from 'src/datastructure/tree/BinaryTree'
import { Comparator } from 'src/util/Comparator'

export interface RemovedNodeInfo<T> {
  removed: BinaryTreeNode<T>
  child: BinaryTreeNode<T> | null
  parent: BinaryTreeNode<T> | null
}

export class BinarySearchTree<T> extends BinaryTree<T> implements SearchTreeADT<T> {
  comparator: Comparator<T>

  /**
   * 构造时会逐个调用 this.insert，此时子类的字段初始化器还没执行；
   * 子类若有带初始值的字段，需自定义构造函数：先 super([], comparator)，赋值字段后再插入
   */
  constructor(values: Array<T> = [], comparator?: compareFunction<T>) {
    /** 搜索树有顺序 不适用按索引的初始化 */
    super([])
    this.comparator = new Comparator(comparator)
    for (const value of values) {
      this.insert(value)
    }
  }

  protected searchMinNode(currentNode: BinaryTreeNode<T> | null): BinaryTreeNode<T> | null {
    let minNode = currentNode
    while (minNode?.left) {
      minNode = minNode.left
    }
    return minNode
  }

  getMin(): T | null {
    const minNode = this.searchMinNode(this.root)
    return minNode?.value ?? null
  }

  protected searchMaxNode(currentNode: BinaryTreeNode<T> | null): BinaryTreeNode<T> | null {
    let maxNode = currentNode
    while (maxNode?.right) {
      maxNode = maxNode.right
    }
    return maxNode
  }

  getMax(): T | null {
    const maxNode = this.searchMaxNode(this.root)
    return maxNode?.value ?? null
  }

  /** 创建新节点，子类可重写以使用带额外字段的节点类型 */
  protected createNode(value: T, parent: BinaryTreeNode<T> | null): BinaryTreeNode<T> {
    return new BinaryTreeNode(value, parent
      ? { parent }
      : {})
  }

  /** 按 BST 规则挂上一个新叶子并返回它，重复值放到右侧 */
  protected insertNode(value: T): BinaryTreeNode<T> {
    let parent: BinaryTreeNode<T> | null = null
    let current = this.root
    while (current) {
      parent = current
      current = this.comparator.lt(value, current.value)
        ? current.left
        : current.right
    }

    const node = this.createNode(value, parent)
    if (!parent)
      this.root = node
    else if (this.comparator.lt(value, parent.value))
      parent.left = node
    else
      parent.right = node
    this.size++
    return node
  }

  insert(value: T) {
    this.insertNode(value)
    return this
  }

  protected searchNode(value: T, currentNode: BinaryTreeNode<T> | null): BinaryTreeNode<T> | null {
    const result = this.searchNodeWithLastVisited(value, currentNode)
    return result.node
  }

  /**
   * 从 currentNode 开始按 BST 路径查找 value，同时记录路径上最后访问的节点
   * @param value 要查找的值
   * @param currentNode 查找起点（通常是根节点）
   * @returns
   * - node：值等于 value 的节点，未找到为 null
   * - lastNode：找到时就是 node 本身；未找到时是路径走到尽头前的最后一个节点
   *   （即 value 若插入时的父节点）；起点为 null 时也为 null
   */
  protected searchNodeWithLastVisited(
    value: T,
    currentNode: BinaryTreeNode<T> | null,
  ): {
    node: BinaryTreeNode<T> | null
    lastNode: BinaryTreeNode<T> | null
  } {
    if (currentNode === null) {
      return {
        node: null,
        lastNode: null,
      }
    }

    let lastNode = currentNode
    while (currentNode) {
      lastNode = currentNode

      switch (this.comparator.compare(value, currentNode.value)) {
        case 0:
          return {
            node: currentNode,
            lastNode,
          }
        case 1:
          currentNode = currentNode.right
          break
        case -1:
          currentNode = currentNode.left
          break
      }
    }

    return {
      node: null,
      lastNode,
    }
  }

  search(value: T) {
    return this.searchNode(value, this.root) !== null
  }

  delete(value: T) {
    const node = this.searchNode(value, this.root)
    if (node)
      this.removeNode(node)
    return this
  }

  /**
   * 从树上删除 node：有两个孩子时用后继的值覆盖 node，转为摘除后继
   * @returns
   * - removed：被物理摘除的节点（两个孩子时是后继，否则是 node 本身）
   * - child：顶替 removed 位置的孩子，可能为 null
   * - parent：removed 原来的父节点，平衡回溯从这里开始
   */
  protected removeNode(node: BinaryTreeNode<T>): RemovedNodeInfo<T> {
    let removed = node
    if (node.left && node.right) {
      removed = this.searchMinNode(node.right) as BinaryTreeNode<T>
      node.value = removed.value
    }

    const parent = removed.parent
    const child = removed.left ?? removed.right
    if (!parent)
      this.root = child
    else if (parent.left === removed)
      parent.left = child
    else
      parent.right = child
    if (child)
      child.parent = parent
    this.size--
    return { removed, child, parent }
  }

  protected getNodeSize(currentNode: BinaryTreeNode<T> | null): number {
    if (currentNode === null) {
      return 0
    }
    else if (currentNode.isLeaf) {
      return 1
    }
    else {
      return 1 + this.getNodeSize(currentNode.left) + this.getNodeSize(currentNode.right)
    }
  }

  protected getKthNode(currentNode: BinaryTreeNode<T> | null, index: number): BinaryTreeNode<T> | null {
    if (currentNode === null) {
      return null
    }
    // 比当前节点小的节点数 index = k - 1
    const leftSize = this.getNodeSize(currentNode.left)
    if (leftSize > index) {
      return this.getKthNode(currentNode.left, index)
    }
    else if (leftSize < index) {
      /**
       * 当前节点不是第k个节点，需要继续在右子树中查找
       * 前往右子树的过程中,需要减去左子树的节点数
       */
      return this.getKthNode(currentNode.right, index - leftSize - 1)
    }
    else {
      /** 当前节点就是第k个节点 */
      return currentNode
    }
  }

  getKth(k: number): T | null {
    const node = this.getKthNode(this.root, k - 1)
    return node?.value ?? null
  }

  protected getNodeRank(currentNode: BinaryTreeNode<T> | null, value: T): number {
    if (currentNode === null) {
      return 0
    }
    if (this.comparator.lt(value, currentNode.value)) {
      return this.getNodeRank(currentNode.left, value)
    }
    else {
      const leftSize = this.getNodeSize(currentNode.left)
      return this.getNodeRank(currentNode.right, value) + leftSize + 1
    }
  }

  getRank(value: T): number {
    return this.getNodeRank(this.root, value)
  }

  getPrev(value: T) {
    return this.getKth(this.getRank(value) - 1)
  }

  getNext(value: T) {
    return this.getKth(this.getRank(value) + 1)
  }
}

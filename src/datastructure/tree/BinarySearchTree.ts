import type { SearchTreeADT } from 'src/datastructure/ADT'
import type { BinaryItem, BinaryNode, EmptyMeta } from 'src/datastructure/Node'
import type { compareFunction } from 'src/util/Comparator'
import { createBinaryNode, isNil } from 'src/datastructure/Node'
import { BinaryTree, countNodes } from 'src/datastructure/tree/BinaryTree'
import { Comparator } from 'src/util/Comparator'

export interface RemovedNodeInfo<T, Meta> {
  /** 被物理摘除的节点：两个孩子时是后继，否则是目标本身 */
  removed: BinaryNode<T, Meta>
  /** 顶替 removed 位置的孩子，可能是哨兵 */
  child: BinaryItem<T, Meta>
  /** removed 原来的父节点，平衡回溯从这里开始 */
  parent: BinaryItem<T, Meta>
}

/** 二叉搜索树。重复值放到右侧 */
export class BinarySearchTree<T, Meta = EmptyMeta> extends BinaryTree<T, Meta> implements SearchTreeADT<T> {
  protected readonly comparator: Comparator<T>

  constructor(comparator?: compareFunction<T>) {
    super()
    this.comparator = new Comparator(comparator)
  }

  /** 新节点的附加数据。Meta 不是空对象的子类必须重写 */
  protected createMeta(): Meta {
    return {} as Meta
  }

  protected createNode(value: T, parent: BinaryItem<T, Meta>): BinaryNode<T, Meta> {
    return createBinaryNode(value, this.createMeta(), parent, this.nil, this.nil)
  }

  /** 按数组顺序逐个插入。比较器在构造时传入 */
  from(values: readonly T[]) {
    for (const value of values)
      this.insert(value)
    return this
  }

  protected minNode(node: BinaryNode<T, Meta>) {
    let current = node
    while (!isNil(current.left))
      current = current.left
    return current
  }

  protected maxNode(node: BinaryNode<T, Meta>) {
    let current = node
    while (!isNil(current.right))
      current = current.right
    return current
  }

  getMin() {
    return isNil(this.root)
      ? null
      : this.minNode(this.root).value
  }

  getMax() {
    return isNil(this.root)
      ? null
      : this.maxNode(this.root).value
  }

  /** 沿 BST 路径查找 value；找到返回节点，没找到返回哨兵 */
  protected searchNode(value: T) {
    let node = this.root
    while (!isNil(node)) {
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

  override search = (value: T) => !isNil(this.searchNode(value))

  /** 按 BST 规则挂上一个新叶子并返回它 */
  protected insertNode(value: T) {
    /** 按照小于放左边，大于放右边，找到合适的父节点 */
    let parent: BinaryItem<T, Meta> = this.nil
    let current = this.root
    while (!isNil(current)) {
      parent = current
      current = this.comparator.lt(value, current.value)
        ? current.left
        : current.right
    }

    /** 创建新节点并挂接到父节点 */
    const node = this.createNode(value, parent)

    /** 如果父节点是哨兵，则新节点成为根节点 */
    if (isNil(parent)) {
      this.root = node
    }
    /** 如果新值小于父节点，则挂接到父节点的左边 */
    else if (this.comparator.lt(value, parent.value)) {
      parent.left = node
    }
    /** 如果新值大于父节点，则挂接到父节点的右边 */
    else {
      parent.right = node
    }

    this._size++
    return node
  }

  insert(value: T) {
    this.insertNode(value)
    return this
  }

  delete(value: T) {
    const node = this.searchNode(value)
    if (!isNil(node))
      this.removeNode(node)
    return this
  }

  /** 有两个孩子时用后继的值覆盖 node，转为摘除后继。meta 留在原位置 */
  protected removeNode(node: BinaryNode<T, Meta>): RemovedNodeInfo<T, Meta> {
    let removed = node

    /**
     * 左右子树都有删掉节点了会没有地方挂
     * 这里在右子树上找最小的节点（后继）来替换删除的节点
     */
    if (!isNil(node.left) && !isNil(node.right)) {
      removed = this.minNode(node.right)
      node.value = removed.value
    }

    /**  到这里 removed 最多只有一个孩子 */
    const parent = removed.parent
    const child = isNil(removed.left)
      ? removed.right
      : removed.left

    /** 用 child 顶替 removed 在父节点上的位置 */
    if (isNil(parent)) {
      /** 删的是根则 child 成为新根 */
      this.root = child
    }
    else {
      if (parent.left === removed)
        /** 删的是左孩子则左孩子指向 child */
        parent.left = child
      else
        /** 删的是右孩子则右孩子指向 child */
        parent.right = child
    }

    // child 是哨兵时不能写 parent；是真节点则认新父
    if (!isNil(child))
      child.parent = parent
    this._size--
    return { removed, child, parent }
  }

  /** 子树节点数。缓存了子树大小的子类重写它 */
  protected subtreeSize(node: BinaryItem<T, Meta>) {
    return countNodes(node)
  }

  /** 中序第 k 个，k 从 1 开始 */
  getKth(k: number) {
    let node = this.root
    let index = k - 1
    while (!isNil(node)) {
      const leftSize = this.subtreeSize(node.left)
      if (index < leftSize) {
        node = node.left
      }
      else if (index > leftSize) {
        index -= leftSize + 1
        node = node.right
      }
      else {
        return node.value
      }
    }
    return null
  }

  /** 小于等于 value 的节点个数 */
  getRank(value: T) {
    let rank = 0
    let node = this.root
    while (!isNil(node)) {
      if (this.comparator.lt(value, node.value)) {
        node = node.left
      }
      else {
        rank += this.subtreeSize(node.left) + 1
        node = node.right
      }
    }
    return rank
  }

  getPrev(value: T) {
    return this.getKth(this.getRank(value) - 1)
  }

  getNext(value: T) {
    return this.getKth(this.getRank(value) + 1)
  }
}

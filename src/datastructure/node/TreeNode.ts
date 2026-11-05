/**
 * 普通节点的孩子仍是普通节点。
 * 默认参数不能直接写 BinaryTreeNode<T>，那是循环默认值。
 */
type PlainNode<T> = BinaryTreeNode<T, PlainNode<T>>

/**
 * @description: 二叉树节点。N 是 parent / left / right 的类型
 */
class BinaryTreeNode<T, N extends BinaryTreeNode<T, N> = PlainNode<T>> {
  value: T
  parent: N | null = null
  left: N | null = null
  right: N | null = null
  constructor(
    value: T,
    options: { parent?: N, left?: N, right?: N } = {},
  ) {
    this.value = value
    if (options.parent)
      this.parent = options.parent
    if (options.left)
      this.left = options.left
    if (options.right)
      this.right = options.right
  }

  get isLeaf() {
    return this.right === null && this.left === null
  }

  get isRoot() {
    return this.parent === null
  }

  /** 子树高度，空孩子按 0，叶子是 1 */
  getHeight(): number {
    return 1 + Math.max(this.left?.getHeight() ?? 0, this.right?.getHeight() ?? 0)
  }
}

/**
 * AVL 节点：value 参与二叉搜索序，height 是子树高度，叶子为 1
 * 平衡因子是左子树高度减去右子树高度
 * 旋转会改写 left / right，调用 updateHeight 后 height 才有效
 */
class AVLNode<T> extends BinaryTreeNode<T, AVLNode<T>> {
  height = 1

  constructor(value: T, parent: AVLNode<T> | null = null) {
    super(value, parent
      ? { parent }
      : {})
  }

  updateHeight(): this {
    this.height = 1 + Math.max(this.left?.height ?? 0, this.right?.height ?? 0)
    return this
  }

  /** 左子树高度减去右子树高度，空孩子按 0 */
  balanceFactor(): number {
    return (this.left?.height ?? 0) - (this.right?.height ?? 0)
  }
}

/**
 * 树堆节点：value 参与二叉搜索序，priority 参与最小堆序，size 是子树节点数
 * merge / split 和旋转都会改写 left / right，调用 resize 后 size 才有效
 */
class TreapNode<T> extends BinaryTreeNode<T, TreapNode<T>> {
  readonly priority: number
  size = 1

  constructor(value: T, priority: number, parent: TreapNode<T> | null = null) {
    super(value, parent
      ? { parent }
      : {})
    this.priority = priority
  }

  resize(): this {
    this.size = 1 + (this.left?.size ?? 0) + (this.right?.size ?? 0)
    return this
  }
}

/**
 * @description: 多叉树节点
 */
class TreeNode<T> {
  value: T
  parent: TreeNode<T> | null = null
  children: TreeNode<T>[] = []
  constructor(value: T, parent: TreeNode<T> | null) {
    this.value = value
    if (parent)
      this.parent = parent
  }

  get isLeaf() {
    return this.children.length === 0
  }
}

/**
 * @description: Fiber节点
 */
class FiberNode<T> {
  value: T
  parent: FiberNode<T> | null = null
  sibling: FiberNode<T> | null = null
  child: FiberNode<T> | null = null
  constructor(value: T, parent: FiberNode<T> | null) {
    this.value = value
    if (parent)
      this.parent = parent
  }
}

export { AVLNode, BinaryTreeNode, FiberNode, TreapNode, TreeNode }

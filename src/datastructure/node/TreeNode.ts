/**
 * @description: 二叉树节点
 */
class BinaryTreeNode<T> {
  value: T
  parent: BinaryTreeNode<T> | null = null
  left: BinaryTreeNode<T> | null = null
  right: BinaryTreeNode<T> | null = null
  constructor(
    value: T,
    options: { parent?: BinaryTreeNode<T>, left?: BinaryTreeNode<T>, right?: BinaryTreeNode<T> } = {},
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

  /**
   * 左旋：当前节点下沉为右孩子的左孩子，右孩子升上来
   * ```
   *     x                y
   *    / \              / \
   *   A   y     =>     x   C
   *      / \          / \
   *     B   C        A   B
   * ```
   * 不会更新树的 root 引用，旋转根节点时需由调用方处理
   * @returns 升上来的新子树根
   */
  rotateLeft(): BinaryTreeNode<T> {
    const y = this.right
    if (!y)
      throw new Error('rotateLeft: node has no right child')

    const p = this.parent
    this.right = y.left
    if (y.left)
      y.left.parent = this

    y.left = this
    this.parent = y

    y.parent = p
    if (p) {
      if (p.left === this)
        p.left = y
      else
        p.right = y
    }
    return y
  }

  /**
   * 右旋：当前节点下沉为左孩子的右孩子，左孩子升上来
   * ```
   *       y            x
   *      / \          / \
   *     x   C   =>   A   y
   *    / \              / \
   *   A   B            B   C
   * ```
   * 不会更新树的 root 引用，旋转根节点时需由调用方处理
   * @returns 升上来的新子树根
   */
  rotateRight(): BinaryTreeNode<T> {
    const x = this.left
    if (!x)
      throw new Error('rotateRight: node has no left child')

    const p = this.parent
    this.left = x.right
    if (x.right)
      x.right.parent = this

    x.right = this
    this.parent = x

    x.parent = p
    if (p) {
      if (p.left === this)
        p.left = x
      else
        p.right = x
    }
    return x
  }

  /**
   * 把当前节点上提一层：是左孩子则对父节点右旋，是右孩子则对父节点左旋
   * 不会更新树的 root 引用，旋转根节点时需由调用方处理
   */
  rotateUp(): this {
    const p = this.parent
    if (!p)
      throw new Error('rotateUp: node is already root')

    if (p.left === this)
      p.rotateRight()
    else
      p.rotateLeft()
    return this
  }
}

/**
 * 树堆节点：value 参与二叉搜索序，priority 参与最小堆序，size 是子树节点数
 * merge / split 和旋转都会改写 left / right，调用 resize 后 size 才有效
 */
class TreapNode<T> extends BinaryTreeNode<T> {
  override parent: TreapNode<T> | null
  override left: TreapNode<T> | null
  override right: TreapNode<T> | null
  readonly priority: number
  size = 1

  constructor(value: T, priority: number, parent: TreapNode<T> | null = null) {
    super(value, parent
      ? { parent }
      : {})
    this.priority = priority
    this.parent = parent
    this.left = null
    this.right = null
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

export { BinaryTreeNode, FiberNode, TreapNode, TreeNode }

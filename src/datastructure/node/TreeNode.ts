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
    options: { parent?: BinaryTreeNode<T>; left?: BinaryTreeNode<T>; right?: BinaryTreeNode<T> } = {},
  ) {
    this.value = value
    if (options.parent) this.parent = options.parent
    if (options.left) this.left = options.left
    if (options.right) this.right = options.right
  }

  get isLeaf() {
    return this.right === null && this.left === null
  }

  get isRoot() {
    return this.parent === null
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
    if (parent) this.parent = parent
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
    if (parent) this.parent = parent
  }
}

export { BinaryTreeNode, TreeNode, FiberNode }

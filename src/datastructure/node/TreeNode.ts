/**
 * @description: 二叉树节点
 */
class BinaryTreeNode<T> {
  value: T
  parent: BinaryTreeNode<T> | null = null
  left: BinaryTreeNode<T> | null = null
  right: BinaryTreeNode<T> | null = null
  constructor(value: T, parent?: BinaryTreeNode<T>) {
    this.value = value
    if (parent) this.parent = parent
  }

  get isLeaf() {
    return this.right === null && this.left === null
  }

  get isRoot() {
    return this.parent === null
  }

  rightRotate(): BinaryTreeNode<T> {
    if (!this.left) {
      throw new Error('右旋失败,左子节点为空')
    }

    const leftChild = this.left

    // 更新父子关系
    if (this.parent) {
      if (this === this.parent.left) {
        this.parent.left = leftChild
      } else {
        this.parent.right = leftChild
      }
    }
    leftChild.parent = this.parent

    // 执行右旋
    this.left = leftChild.right
    if (leftChild.right) {
      leftChild.right.parent = this
    }
    leftChild.right = this
    this.parent = leftChild

    return leftChild
  }

  leftRotate(): BinaryTreeNode<T> {
    if (!this.right) {
      throw new Error('左旋失败,右子节点为空')
    }

    const rightChild = this.right

    // 更新父子关系
    if (this.parent) {
      if (this === this.parent.left) {
        this.parent.left = rightChild
      } else {
        this.parent.right = rightChild
      }
    }
    rightChild.parent = this.parent

    // 执行左旋
    this.right = rightChild.left
    if (rightChild.left) {
      rightChild.left.parent = this
    }
    rightChild.left = this
    this.parent = rightChild

    return rightChild
  }

  // 获取兄弟节点
  getSibling(): BinaryTreeNode<T> | null {
    if (!this.parent) return null
    return this === this.parent.left ? this.parent.right : this.parent.left
  }

  // 判断是否为左子节点
  isLeftChild(): boolean {
    return this.parent !== null && this === this.parent.left
  }

  // 判断是否为右子节点
  isRightChild(): boolean {
    return this.parent !== null && this === this.parent.right
  }

  // 获取根节点
  getRoot(): BinaryTreeNode<T> {
    let current: BinaryTreeNode<T> = this
    while (current.parent) {
      current = current.parent
    }
    return current
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

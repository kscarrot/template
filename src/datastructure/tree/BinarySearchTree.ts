import { BinarySearchTreeADT } from 'src/datastructure/ADT'
import { BinaryTree } from 'src/datastructure/tree/BinaryTree'
import { Comparator } from 'src/util/Comparator'
import type { compareFunction } from 'src/util/Comparator'
import { BinaryTreeNode } from 'src/datastructure/node/TreeNode'

export class BinarySearchTree<T> extends BinaryTree<T> implements BinarySearchTreeADT<T> {
  comparator: Comparator<T>

  constructor(values?: Array<T | null>, comparator?: compareFunction<T>) {
    /** 搜索树有顺序 不适用按索引的初始化 */
    super([])
    this.comparator = new Comparator(comparator)
    if (values) {
      for (const value of values) {
        if (value !== null) {
          this.insert(value)
        }
      }
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

  insert(value: T, parentNode: BinaryTreeNode<T> | null = null) {
    /** 如果树为空，则直接插入替换根节点 */
    if (this.isEmpty) {
      this.root = new BinaryTreeNode(value)
      this.size++
      return this
    }

    /** 从根节点开始插入 */
    if (parentNode === null) {
      parentNode = this.root as BinaryTreeNode<T>
    }

    /** 判断插入到左子树还是右子树 */
    const child = this.comparator.lt(value, parentNode.value) ? 'left' : 'right'

    if (parentNode[child] === null) {
      /** 如果子节点为空，则直接插入 */
      parentNode[child] = new BinaryTreeNode(value, parentNode)
      this.size++
    } else {
      /** 如果子节点不为空，则递归插入 */
      this.insert(value, parentNode[child])
    }

    return this
  }

  #searchNode(value: T, currentNode: BinaryTreeNode<T> | null): BinaryTreeNode<T> | null {
    if (currentNode === null) {
      return null
    } else {
      switch (this.comparator.compare(value, currentNode.value)) {
        case 0:
          return currentNode
        case 1:
          return this.#searchNode(value, currentNode.right)
        case -1:
          return this.#searchNode(value, currentNode.left)
      }
    }
  }

  delete(value: T) {
    const node = this.#searchNode(value, this.root)
    /** 如果节点不存在，则直接返回 */
    if (node === null) {
      return this
    }

    if (node.right && node.left) {
      const minNode = this.searchMinNode(node.right) as BinaryTreeNode<T>
      this.delete(minNode.value)
      node.value = minNode.value
    } else {
      const parentNode = node.parent
      const child = node.left ?? node.right
      if (parentNode) {
        /** 删除当前节点,将当前节点的父节点指向对应的子节点 */
        parentNode[node === parentNode.left ? 'left' : 'right'] = child
      } else {
        /** 如果节点是根节点，则直接替换根节点 */
        this.root = child
      }
      /** 如果子节点不为空，则将子节点的父节点指向当前节点的父节点 */
      if (child) {
        child.parent = parentNode
      }
      this.size--
    }

    return this
  }

  protected getNodeSize(currentNode: BinaryTreeNode<T> | null): number {
    if (currentNode === null) {
      return 0
    } else if (currentNode.isLeaf) {
      return 1
    } else {
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
    } else if (leftSize < index) {
      /**
       * 当前节点不是第k个节点，需要继续在右子树中查找
       * 前往右子树的过程中,需要减去左子树的节点数
       */
      return this.getKthNode(currentNode.right, index - leftSize - 1)
    } else {
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
    } else {
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

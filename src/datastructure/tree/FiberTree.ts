import { TreeNode, BinaryTreeNode, FiberNode } from 'src/datastructure/node/TreeNode'
import { BinaryTree } from 'src/datastructure/tree/BinaryTree'

/**
 * @description 从二叉树节点递归构建 Fiber 树
 * @param binaryNode 当前处理的二叉树节点
 * @param parentFiberNode 目标 Fiber 树中的父节点
 * @returns 构建好的 Fiber 节点或 null
 */
function buildFiberTreeFromBinaryTree<T>(
  binaryNode: BinaryTreeNode<T> | null,
  parentFiberNode: FiberNode<T> | null,
): FiberNode<T> | null {
  // 如果二叉树节点为空，则返回 null
  if (!binaryNode) return null

  // 创建当前 Fiber 节点并链接父节点
  const currentFiberNode = new FiberNode<T>(binaryNode.value, parentFiberNode)

  // 递归构建左、右子树的 Fiber 节点
  const leftChildFiber = buildFiberTreeFromBinaryTree(binaryNode.left, currentFiberNode)
  const rightChildFiber = buildFiberTreeFromBinaryTree(binaryNode.right, currentFiberNode)

  // 第一个子节点作为 child 其余子节点作为 child 的兄弟节点
  currentFiberNode.child = leftChildFiber
  if (leftChildFiber) {
    leftChildFiber.sibling = rightChildFiber
  } else {
    currentFiberNode.child = rightChildFiber
  }

  // 返回当前 Fiber 节点
  return currentFiberNode
}

/**
 * @description 从多叉树节点递归构建 Fiber 树
 * @param treeNode 当前处理的多叉树节点
 * @param parentFiberNode 目标 Fiber 树中的父节点
 * @returns 构建好的 Fiber 节点
 */
function buildFiberTreeFromTreeNode<T>(treeNode: TreeNode<T>, parentFiberNode: FiberNode<T> | null): FiberNode<T> {
  // 创建当前 Fiber 节点并链接父节点
  const currentFiberNode = new FiberNode<T>(treeNode.value, parentFiberNode)

  // 遍历所有子节点
  if (treeNode.children && treeNode.children.length > 0) {
    let previousSibling: FiberNode<T> | null = null
    for (let i = 0; i < treeNode.children.length; i++) {
      const childTreeNode = treeNode.children[i]
      // 递归构建 Fiber 节点
      const childFiberNode = buildFiberTreeFromTreeNode(childTreeNode, currentFiberNode)
      //第一个子节点作为child
      if (i === 0) {
        currentFiberNode.child = childFiberNode
      } else if (previousSibling) {
        // 其余子节点作为 child 的兄弟节点F
        previousSibling.sibling = childFiberNode
      }
      previousSibling = childFiberNode
    }
  }

  // 返回当前 Fiber 节点
  return currentFiberNode
}

/**
 * @description 遍历Fiber树
 * @param fiberTree 要遍历的Fiber树
 * @returns 返回一个Generator，用于遍历Fiber树
 */
function* traverseFiberTreeNode<T>(fiberTree: FiberNode<T> | null): Generator<FiberNode<T>> {
  let current = fiberTree
  while (current) {
    yield current
    if (current.child) {
      current = current.child
    } else if (current.sibling) {
      current = current.sibling
    } else {
      current = current.parent?.sibling || null
    }
  }
}

function* traverseFiberTree<T>(fiberTree: FiberNode<T> | null): Generator<T> {
  for (const node of traverseFiberTreeNode(fiberTree)) {
    yield node.value
  }
}

class FiberTree<T> {
  root: FiberNode<T> | null = null

  constructor(tree: BinaryTree<T> | TreeNode<T> | null) {
    if (tree instanceof BinaryTree) {
      this.root = buildFiberTreeFromBinaryTree(tree.root, null)
    } else if (tree instanceof TreeNode) {
      this.root = buildFiberTreeFromTreeNode(tree, null)
    } else {
      this.root = null
    }
  }

  [Symbol.iterator](): Iterator<T> {
    return traverseFiberTree(this.root)
  }
}

export { traverseFiberTreeNode, FiberTree }

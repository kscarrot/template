import { TreeNode, BinaryTreeNode, FiberNode } from 'src/datastructure/node'
import { BinaryTree } from 'src/datastructure/tree/BinaryTree'

/** @description 把二叉树转换成Fiber树 */
/**
 * 将一个二叉树转换为 Fiber 树的核心递归函数
 * @param binaryNode 当前处理的二叉树节点，可能为 null
 * @param parentFiberNode 新生成的 Fiber 树中，当前节点的父节点
 * @returns 返回新创建的 Fiber 节点，或者 null
 */
function buildFiberTreeFromBinaryTree<T>(
  binaryNode: BinaryTreeNode<T> | null,
  parentFiberNode: FiberNode<T> | null,
): FiberNode<T> | null {
  // 1. 基本情况：如果二叉树节点为空，则返回 null
  if (!binaryNode) {
    return null
  }

  // 2. 创建新的 Fiber 节点，并链接其父节点
  const newFiberNode = new FiberNode<T>(binaryNode.value, parentFiberNode)

  // 3. 递归处理左子树 -> 转换为 newFiberNode 的 child
  //    此时，newFiberNode 是下一层递归调用的父节点
  newFiberNode.child = buildFiberTreeFromBinaryTree(binaryNode.left, newFiberNode)

  // 4. 递归处理右子树 -> 转换为 newFiberNode 的 sibling
  //    请注意：右子树的父节点和当前节点的父节点是同一个，所以我们传入 parentFiberNode
  newFiberNode.sibling = buildFiberTreeFromBinaryTree(binaryNode.right, parentFiberNode)

  // 5. 返回新创建的节点
  return newFiberNode
}

/**
 * @description: 从普通的树节点构建Fiber树
 * @param {TreeNode<T> | null} treeNode - 要转换的普通树的当前节点
 * @param {FiberNode<T> | null} parentFiberNode - 当前节点在Fiber树中的父节点
 * @return {FiberNode<T> | null} - 返回构建好的Fiber节点
 */
function buildFiberTreeFromTreeNode<T>(treeNode: TreeNode<T>, parentFiberNode: FiberNode<T> | null): FiberNode<T> {
  // 1. 为当前的 treeNode 创建对应的 FiberNode
  const currentFiberNode = new FiberNode<T>(treeNode.value, parentFiberNode)

  // 2. 遍历 treeNode 的子节点，并将它们链接为 FiberNode 的 child 和 sibling
  if (treeNode.children && treeNode.children.length > 0) {
    let previousSibling: FiberNode<T> | null = null

    for (let i = 0; i < treeNode.children.length; i++) {
      const childTreeNode = treeNode.children[i]

      // 递归地为子节点构建 FiberNode，并传入当前的 FiberNode 作为父节点
      const childFiberNode = buildFiberTreeFromTreeNode(childTreeNode, currentFiberNode)

      if (i === 0) {
        // 如果是第一个子节点，它成为 currentFiberNode 的 child
        currentFiberNode.child = childFiberNode
      } else if (previousSibling) {
        // 对于后续的子节点，它成为前一个兄弟节点的 sibling
        previousSibling.sibling = childFiberNode
      }

      // 更新 previousSibling 指针，为下一次循环做准备
      previousSibling = childFiberNode
    }
  }

  // 3. 返回创建好的当前 FiberNode
  return currentFiberNode
}

function* traverse<T>(fiberTree: FiberNode<T> | null): Generator<T> {
  let current = fiberTree
  while (current) {
    yield current.value
    if (current.child) {
      current = current.child
    } else if (current.sibling) {
      current = current.sibling
    } else {
      current = current.parent?.sibling || null
    }
  }
}

export class FiberTree<T> {
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

  [Symbol.iterator]() {
    return traverse(this.root)
  }
}

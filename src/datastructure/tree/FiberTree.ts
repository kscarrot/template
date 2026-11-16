import type { BinaryNode, FiberItem, FiberNode, MultiItem, MultiNode } from 'src/datastructure/Node'
import { createFiberNil, createFiberNode, E_NodeKind, isNil } from 'src/datastructure/Node'
import { traverseFiberTreeNode } from 'src/datastructure/traverse'
import { BinaryTree } from 'src/datastructure/tree/BinaryTree'
import { mapGenerator } from 'src/util/Iter'

type SourceNode<T> = BinaryNode<T, unknown> | MultiNode<T>

/** 二叉树按先左后右取存在的孩子，多叉树按 children 顺序 */
function childrenOf<T>(node: SourceNode<T>): SourceNode<T>[] {
  if (node.kind === E_NodeKind.multi)
    return node.children
  return [node.left, node.right].filter(child => !isNil(child))
}

/**
 * Fiber 树：每个节点只记第一个孩子 child 和下一个兄弟 sibling，可以表示任意多叉树
 * 可以从二叉树或多叉树建立，孩子顺序保持不变
 */
export class FiberTree<T> {
  protected readonly nil = createFiberNil()
  root: FiberItem<T> = this.nil

  constructor(tree: BinaryTree<T, unknown> | MultiItem<T>) {
    const source = tree instanceof BinaryTree
      ? tree.root
      : tree
    if (!isNil(source))
      this.root = this.build(source, this.nil)
  }

  traverseNodes = () => traverseFiberTreeNode(this.root);

  [Symbol.iterator] = () => mapGenerator(this.traverseNodes(), node => node.value)

  /** 第一个孩子挂到 child，其余孩子依次挂成前一个的 sibling */
  private build(node: SourceNode<T>, parent: FiberItem<T>): FiberNode<T> {
    const fiber = createFiberNode(node.value, parent, this.nil, this.nil)
    const children = childrenOf(node).map(child => this.build(child, fiber))
    children.forEach((child, index) => {
      child.sibling = children[index + 1] ?? this.nil
    })
    fiber.child = children[0] ?? this.nil
    return fiber
  }
}

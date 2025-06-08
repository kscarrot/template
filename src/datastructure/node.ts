const headSymbol = Symbol('head')
const tailSymbol = Symbol('tail')

class DoubleLinkNode<T> {
  value: T
  prev: DoubleLinkNode<T> | DoubleLinkHeadNode<T>
  next: DoubleLinkNode<T> | DoubleLinkTailNode<T>
  constructor(value: T) {
    this.value = value
    this.prev = this
    this.next = this
  }
}

class LinkNode<T> {
  value: T
  next: LinkNode<T> | LinkTailNode<T>
  constructor(value: T) {
    this.value = value
    this.next = this
  }
}

interface LinkHeadNode<T> {
  next: LinkNode<T> | LinkTailNode<T>
  value: Symbol
}

interface LinkTailNode<T> {
  next: null
  value: Symbol
}

type LinkNodes<T> = LinkHeadNode<T> | LinkNode<T> | LinkTailNode<T>

interface DoubleLinkHeadNode<T> {
  prev: null
  next: DoubleLinkNode<T> | DoubleLinkTailNode<T>
  value: Symbol
}

interface DoubleLinkTailNode<T> {
  prev: DoubleLinkNode<T> | DoubleLinkHeadNode<T>
  next: null
  value: Symbol
}

type DoubleLinkNodes<T> = DoubleLinkHeadNode<T> | DoubleLinkNode<T> | DoubleLinkTailNode<T>

const isHeadNode = <T>(node: LinkNodes<T>): node is LinkHeadNode<T> => {
  return node.value === headSymbol
}

const isTailNode = <T>(node: LinkNodes<T>): node is LinkTailNode<T> => {
  return node.value === tailSymbol
}

class CircularLinkNode<T> {
  value: T
  prev: CircularLinkNode<T>
  next: CircularLinkNode<T>
  constructor(value: T) {
    this.value = value
    this.prev = this
    this.next = this
  }
}

const createLinkNodes = <T>() => {
  const tailNode: LinkTailNode<T> = {
    next: null,
    value: tailSymbol,
  }
  const headNode: LinkHeadNode<T> = {
    next: tailNode,
    value: headSymbol,
  }
  return { headNode, tailNode }
}

const createDoubleLinkNodes = <T>() => {
  const tailNode: DoubleLinkTailNode<T> = {
    prev: null as unknown as DoubleLinkHeadNode<T>, // 下面连接保证
    next: null,
    value: tailSymbol,
  }
  const headNode: DoubleLinkHeadNode<T> = {
    prev: null,
    next: tailNode,
    value: headSymbol,
  }
  tailNode.prev = headNode
  return { headNode, tailNode }
}

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
}

/**
 * @description: 多叉树节点
 */
class MultiTreeNode<T> {
  value: T
  parent: MultiTreeNode<T> | null = null
  children: MultiTreeNode<T>[] = []
  constructor(value: T, parent?: MultiTreeNode<T>) {
    this.value = value
    if (parent) this.parent = parent
  }

  get isLeaf() {
    return this.children.length === 0
  }
}

export type { LinkHeadNode, LinkTailNode, LinkNodes, DoubleLinkHeadNode, DoubleLinkTailNode, DoubleLinkNodes }

export {
  isHeadNode,
  isTailNode,
  createLinkNodes,
  createDoubleLinkNodes,
  LinkNode,
  DoubleLinkNode,
  CircularLinkNode,
  BinaryTreeNode,
  MultiTreeNode,
}

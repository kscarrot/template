const headSymbol = Symbol('head')
const tailSymbol = Symbol('tail')

/**
 * @description: 双向链表节点
 */
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

/**
 * @description: 单向链表节点
 */
class LinkNode<T> {
  value: T
  next: LinkNode<T> | LinkTailNode<T>
  constructor(value: T) {
    this.value = value
    this.next = this
  }
}

/**
 * @description: 单向链表头节点接口
 */
interface LinkHeadNode<T> {
  next: LinkNode<T> | LinkTailNode<T>
  value: Symbol
}

/**
 * @description: 单向链表尾节点接口
 */
interface LinkTailNode<T> {
  next: null
  value: Symbol
}

/**
 * @description: 单向链表节点联合类型
 */
type LinkNodes<T> = LinkHeadNode<T> | LinkNode<T> | LinkTailNode<T>

/**
 * @description: 双向链表头节点接口
 */
interface DoubleLinkHeadNode<T> {
  prev: null
  next: DoubleLinkNode<T> | DoubleLinkTailNode<T>
  value: Symbol
}

/**
 * @description: 双向链表尾节点接口
 */
interface DoubleLinkTailNode<T> {
  prev: DoubleLinkNode<T> | DoubleLinkHeadNode<T>
  next: null
  value: Symbol
}

/**
 * @description: 双向链表节点联合类型
 */
type DoubleLinkNodes<T> = DoubleLinkHeadNode<T> | DoubleLinkNode<T> | DoubleLinkTailNode<T>

/**
 * @description: 循环链表节点
 */
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

/**
 * @description: 判断是否为头节点
 */
const isHeadNode = <T>(node: LinkNodes<T>): node is LinkHeadNode<T> => {
  return node.value === headSymbol
}

/**
 * @description: 判断是否为尾节点
 */
const isTailNode = <T>(node: LinkNodes<T>): node is LinkTailNode<T> => {
  return node.value === tailSymbol
}

/**
 * @description: 创建单向链表的头尾节点
 */
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

/**
 * @description: 创建双向链表的头尾节点
 */
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

export type { LinkHeadNode, LinkTailNode, LinkNodes, DoubleLinkHeadNode, DoubleLinkTailNode, DoubleLinkNodes }

export { isHeadNode, isTailNode, createLinkNodes, createDoubleLinkNodes, LinkNode, DoubleLinkNode, CircularLinkNode }

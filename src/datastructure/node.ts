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

export {
  headSymbol,
  DoubleLinkHeadNode,
  isHeadNode,
  tailSymbol,
  DoubleLinkTailNode,
  isTailNode,
  DoubleLinkNode,
  DoubleLinkNodes,
  CircularLinkNode,
  LinkNode,
  LinkHeadNode,
  LinkTailNode,
  LinkNodes,
}

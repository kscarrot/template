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

const isHeadNode = <T>(node: DoubleLinkNodes<T>): node is DoubleLinkHeadNode<T> => {
  return node.value === headSymbol
}

const isTailNode = <T>(node: DoubleLinkNodes<T>): node is DoubleLinkTailNode<T> => {
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
}

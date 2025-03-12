import { ListADT } from 'src/datastructure/ADT'
import type { DoubleLinkHeadNode, DoubleLinkTailNode, DoubleLinkNodes } from 'src/datastructure/node'
import { isHeadNode, isTailNode, DoubleLinkNode, createDoubleLinkNodes } from 'src/datastructure/node'

export class DoubleLinkList<T> implements ListADT<T> {
  size = 0
  head: DoubleLinkHeadNode<T>
  tail: DoubleLinkTailNode<T>

  constructor() {
    const { headNode, tailNode } = createDoubleLinkNodes<T>()
    this.head = headNode
    this.tail = tailNode
  }

  get isEmpty() {
    return this.size === 0
  }

  private getNode(index: number) {
    let nodeIterator = this.traverseNode()

    nodeIterator.next() // 第一个是头指针 放过去
    let cusor = nodeIterator.next()
    let count = 0
    while (count < index) {
      cusor = nodeIterator.next()
      count = count + 1
    }
    return cusor.value
  }

  get(index: number) {
    if (this.isEmpty) {
      throw new Error('List is Empty')
    }

    if (index >= this.size || index < 0) {
      throw new Error('get Data out of List size')
    }

    const indexNode = this.getNode(index) as DoubleLinkNode<T>
    return indexNode.value
  }

  insert(index: number, value: T) {
    if (index > this.size || index < 0) {
      throw new Error('insert Data out of List size')
    }

    const insertNode = new DoubleLinkNode(value)
    const nextNode = this.getNode(index) as DoubleLinkNode<T> | DoubleLinkTailNode<T>
    const prevNode = nextNode.prev

    prevNode.next = insertNode
    insertNode.prev = prevNode

    nextNode.prev = insertNode
    insertNode.next = nextNode

    this.size = this.size + 1
    return this
  }

  delete(index: number) {
    if (this.isEmpty) {
      throw new Error('Cant delete empty list')
    }

    if (index >= this.size || index < 0) {
      throw new Error('delete Data out of List size')
    }

    // 控制了index的范围 类型用size保证
    const deleteNode = this.getNode(index) as DoubleLinkNode<T>

    deleteNode.next.prev = deleteNode.prev
    deleteNode.prev.next = deleteNode.next

    this.size = this.size - 1
    return deleteNode.value
  }

  /** 从头节点开始迭代 遇到尾节点退出 返回 头 -> T -> 尾 */
  *traverseNode() {
    let current: DoubleLinkNodes<T> = this.head
    while (true) {
      yield current
      if (isTailNode<T>(current)) return
      current = current.next
    }
  }

  *traverse() {
    const traverse = this.traverseNode()

    let point = traverse.next()
    whileLoop: while (!point.done) {
      if (isTailNode<T>(point.value)) return

      if (isHeadNode<T>(point.value)) {
        point = traverse.next()
        continue whileLoop
      }

      yield point.value.value
      point = traverse.next()
    }
  }

  [Symbol.iterator] = this.traverse
}

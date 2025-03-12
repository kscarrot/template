import { ListADT } from 'src/datastructure/ADT'
import type { LinkHeadNode, LinkTailNode, LinkNodes } from 'src/datastructure/node'
import { isHeadNode, isTailNode, LinkNode, createLinkNodes } from 'src/datastructure/node'

export class LinkList<T> implements ListADT<T> {
  size = 0
  head: LinkHeadNode<T>
  tail: LinkTailNode<T>

  constructor() {
    const { headNode, tailNode } = createLinkNodes<T>()
    this.head = headNode
    this.tail = tailNode
  }

  add(value: T) {
    return this.insert(this.size, value)
  }

  get isEmpty() {
    return this.size === 0
  }

  private getNode(index: number) {
    let nodeIterator = this.traverseNode()

    let prevCursor = nodeIterator.next()
    let cursor = nodeIterator.next()
    let count = 0
    while (count < index) {
      prevCursor = cursor
      cursor = nodeIterator.next()
      count = count + 1
    }
    return {
      prevNode: prevCursor.value as LinkHeadNode<T> | LinkNode<T>,
      targetNode: cursor.value as LinkNode<T> | LinkTailNode<T>,
    }
  }

  get(index: number) {
    if (this.isEmpty) {
      throw new Error('List is Empty')
    }

    if (index >= this.size || index < 0) {
      throw new Error('get Data out of List size')
    }

    const { targetNode } = this.getNode(index)
    return (targetNode as LinkNode<T>).value
  }

  insert(index: number, value: T) {
    if (index > this.size || index < 0) {
      throw new Error('insert Data out of List size')
    }

    const insertNode = new LinkNode(value)
    const { prevNode, targetNode: nextNode } = this.getNode(index)

    prevNode.next = insertNode
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

    const { prevNode, targetNode } = this.getNode(index)
    const deleteNode = targetNode as LinkNode<T>
    prevNode.next = deleteNode.next

    this.size = this.size - 1
    return deleteNode.value
  }

  /** 从头节点开始迭代 遇到尾节点退出 返回 头 -> T -> 尾 */
  *traverseNode() {
    let current: LinkNodes<T> = this.head
    while (true) {
      yield current
      if (isTailNode(current)) return
      current = current.next
    }
  }

  *traverse() {
    const traverse = this.traverseNode()

    let point = traverse.next()
    whileLoop: while (!point.done) {
      if (isTailNode(point.value)) return

      if (isHeadNode(point.value)) {
        point = traverse.next()
        continue whileLoop
      }

      yield point.value.value
      point = traverse.next()
    }
  }

  [Symbol.iterator] = this.traverse
}

import type { ListADT } from 'src/datastructure/ADT'
import type { DoubleLinkHeadNode, DoubleLinkTailNode } from 'src/datastructure/node/ListNode'
import { createDoubleLinkNodes, DoubleLinkNode, isTailNode } from 'src/datastructure/node/ListNode'

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

  /** 从首数据节点起迭代，不含头尾哨兵；到达尾前结束，不产出尾节点 */
  * traverseNode(): Generator<DoubleLinkNode<T>, void, unknown> {
    let current: DoubleLinkNode<T> | DoubleLinkTailNode<T> = this.head.next
    while (!isTailNode<T>(current)) {
      yield current
      current = current.next
    }
  }

  private getNode(index: number) {
    let i = 0
    for (const node of this.traverseNode()) {
      if (i === index)
        return node
      i++
    }
    throw new Error('getNode index out of list size')
  }

  get(index: number) {
    if (this.isEmpty) {
      throw new Error('List is Empty')
    }

    if (index >= this.size || index < 0) {
      throw new Error('get Data out of List size')
    }

    return this.getNode(index).value
  }

  insert(index: number, value: T) {
    if (index > this.size || index < 0) {
      throw new Error('insert Data out of List size')
    }

    const insertNode = new DoubleLinkNode(value)

    const isTailInsert = index === this.size

    const nextNode = isTailInsert ? this.tail : this.getNode(index)
    const prevNode = isTailInsert ? this.tail.prev : nextNode.prev

    prevNode.next = insertNode
    insertNode.prev = prevNode

    nextNode.prev = insertNode
    insertNode.next = nextNode

    this.size = this.size + 1
    return this
  }

  add(value: T) {
    return this.insert(this.size, value)
  }

  delete(index: number) {
    if (this.isEmpty) {
      throw new Error('Cant delete empty list')
    }

    if (index >= this.size || index < 0) {
      throw new Error('delete Data out of List size')
    }

    const deleteNode = this.getNode(index)

    deleteNode.next.prev = deleteNode.prev
    deleteNode.prev.next = deleteNode.next

    this.size = this.size - 1
    return deleteNode.value
  }

  * traverse() {
    for (const node of this.traverseNode()) {
      yield node.value
    }
  }

  [Symbol.iterator] = this.traverse
}

import { ListADT } from 'src/datastructure/ADT'
import { CircularLinkNode } from 'src/datastructure/node/ListNode'

export class CircularLinkList<T> implements ListADT<T> {
  size = 0
  head: null | CircularLinkNode<T> = null
  tail: null | CircularLinkNode<T> = null

  add(value: T) {
    const insertNode = new CircularLinkNode(value)

    if (this.isEmpty) {
      this.head = insertNode
      this.tail = insertNode
      insertNode.next = insertNode
      insertNode.prev = insertNode
    } else {
      const prevNode = this.tail!
      const nextNode = this.head!

      prevNode.next = insertNode
      insertNode.prev = prevNode

      nextNode.prev = insertNode
      insertNode.next = nextNode

      this.tail = insertNode
    }

    this.size = this.size + 1
    return this
  }

  get isEmpty() {
    return this.size === 0
  }

  private getNode(index: number) {
    let count = 0
    let point = this.traverseNode()
    while (count < index) {
      point.next()
      count = count + 1
    }
    return point.next().value as CircularLinkNode<T>
  }

  get(index: number) {
    if (this.isEmpty) {
      throw new Error('List is Empty')
    }

    if (index < 0) {
      throw new Error('get Data out of List size')
    }

    const indexNode = this.getNode(index) as CircularLinkNode<T>
    return indexNode.value
  }

  insert(index: number, value: T) {
    if (this.isEmpty) {
      this.head = new CircularLinkNode(value)
      this.size = this.size + 1
      return this
    }

    const insertNode = new CircularLinkNode(value)
    const nextNode = this.getNode(index)
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

    if (this.size === 1) {
      const returnValue = this.head!.value
      this.head = null
      this.size = this.size - 1
      return returnValue
    }

    const deleteNode = this.getNode(index)

    deleteNode.next.prev = deleteNode.prev
    deleteNode.prev.next = deleteNode.next

    this.size = this.size - 1
    return deleteNode.value
  }

  *traverseNode() {
    let current = this.head
    while (current) {
      yield current
      current = current.next
    }
  }

  *traverse() {
    const traverse = this.traverseNode()

    let point = traverse.next()

    let count = 0
    while (!point.done && count < this.size) {
      yield point.value.value
      point = traverse.next()

      count++
    }
  }

  [Symbol.iterator] = this.traverse
}

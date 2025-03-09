import { ListADT } from 'src/datastructure/ADT'

// interface TCircularLinkedNode<T> {
//   value: T
//   prev: CircularLinkedNode<T>
//   next: CircularLinkedNode<T>
// }

class CircularLinkedNode<T> {
  value: T
  prev: CircularLinkedNode<T>
  next: CircularLinkedNode<T>
  constructor(value: T) {
    this.value = value
    this.prev = this
    this.next = this
  }
}

export class CircularLinkList<T> implements ListADT<T> {
  size = 0
  head: null | CircularLinkedNode<T> = null

  get isEmpty() {
    return this.size === 0
  }

  private getNode(index: number) {
    let count = 0
    let point = this.traverseNode(index + 1)
    while (count < index) {
      point.next()
      count = count + 1
    }
    return point.next().value as CircularLinkedNode<T>
  }

  get(index: number) {
    if (this.isEmpty) {
      throw new Error('List is Empty')
    }

    const indexNode = this.getNode(index)

    if (indexNode) {
      return indexNode.value
    }

    throw new Error('Get target index value fail')
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

  insert(index: number, value: T) {
    if (this.isEmpty) {
      this.head = new CircularLinkedNode(value)
      this.size = this.size + 1
      return this
    }

    const insertNode = new CircularLinkedNode(value)
    const nextNode = this.getNode(index)
    const prevNode = nextNode.prev

    prevNode.next = insertNode
    insertNode.prev = prevNode

    nextNode.prev = insertNode
    insertNode.next = nextNode

    this.size = this.size + 1
    return this
  }

  *traverseNode(step: number) {
    let current = this.head
    let index = 0
    while (current && index < step) {
      yield current
      current = current.next
      index++
    }
  }

  *traverse() {
    const traverse = this.traverseNode(this.size)

    let point = traverse.next()
    while (!point.done) {
      yield point.value.value
      point = traverse.next()
    }
  }

  [Symbol.iterator] = this.traverse
}

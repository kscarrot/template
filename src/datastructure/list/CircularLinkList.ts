import type { ListADT } from 'src/datastructure/ADT'
import type { DoublyItem, DoublyNil, DoublyNode } from 'src/datastructure/node/Node'
import { createDoublyNil, createDoublyNode, isNil } from 'src/datastructure/node/Node'

export class CircularLinkList<T> implements ListADT<T> {
  #head: DoublyItem<T>
  #nil: DoublyNil
  #size = 0
  constructor() {
    this.#nil = createDoublyNil()
    this.#head = this.#nil
  }

  get size() {
    return this.#size
  }

  get isEmpty() {
    return this.#size === 0
  }

  add(value: T) {
    const nextNode = createDoublyNode(value, this.#nil, this.#nil)
    if (this.isEmpty) {
      this.#head = nextNode
      this.#head.next = this.#head
      this.#head.prev = this.#head
    }
    else {
      const tailNode = this.#head.prev
      tailNode.next = nextNode
      nextNode.prev = tailNode
      nextNode.next = this.#head
      this.#head.prev = nextNode
    }
    this.#size++
    return this
  }

  * traverseNodes() {
    let current = this.#head
    for (let count = 0; count < this.#size && !isNil(current); count++) {
      yield current
      current = current.next
    }
  }

  * traverse() {
    for (const node of this.traverseNodes())
      yield node.value
  }

  [Symbol.iterator] = this.traverse

  #getNodeAt(index: number) {
    if (this.isEmpty)
      throw new RangeError('List is empty')
    if (!Number.isInteger(index))
      throw new RangeError(`Index must be an integer: index=${index}`)

    const mod = ((index % this.#size) + this.#size) % this.#size
    let step = 0
    for (const node of this.traverseNodes()) {
      if (step === mod)
        return node
      step++
    }
    throw new RangeError('Out of bounds: Node is nil')
  }

  get(index: number) {
    return this.#getNodeAt(index).value
  }

  insert(index: number, value: T) {
    if (!Number.isInteger(index))
      throw new RangeError(`Index must be an integer: index=${index}`)
    if (this.isEmpty)
      return this.add(value)

    const nextNode = this.#getNodeAt(index)
    const prevNode = nextNode.prev as DoublyItem<T>

    const insertNode = createDoublyNode(value, this.#nil, this.#nil)

    prevNode.next = insertNode
    insertNode.prev = prevNode
    nextNode.prev = insertNode
    insertNode.next = nextNode

    if (nextNode === this.#head)
      this.#head = insertNode

    this.#size++
    return this
  }

  delete(index: number) {
    if (this.isEmpty)
      throw new RangeError('Cant delete empty list')

    const deleteNode = this.#getNodeAt(index)
    if (this.#size === 1) {
      this.#head = this.#nil
    }
    else {
      const prevNode = deleteNode.prev as DoublyNode<T>
      const nextNode = deleteNode.next as DoublyNode<T>

      prevNode.next = nextNode
      nextNode.prev = prevNode
      if (this.#head === deleteNode)
        this.#head = nextNode
    }

    this.#size--
    return deleteNode.value
  }
}

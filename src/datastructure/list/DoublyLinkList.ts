import type { ListADT } from 'src/datastructure/ADT'
import type { DoublyItem, DoublyNil, DoublyNode } from 'src/datastructure/Node'
import { createDoublyNil, createDoublyNode, isNil } from 'src/datastructure/Node'
import { traverseLines } from 'src/datastructure/traverse'
import { assertIndex } from 'src/util/common'
import { mapGenerator } from 'src/util/Iter'

export class DoublyLinkList<T> implements ListADT<T> {
  #head: DoublyItem<T>
  #tail: DoublyItem<T>
  #nil: DoublyNil
  #size = 0

  constructor() {
    this.#nil = createDoublyNil()
    this.#head = this.#nil
    this.#tail = this.#nil
  }

  get size() {
    return this.#size
  }

  get isEmpty() {
    return this.#size === 0
  }

  add(value: T) {
    const node = createDoublyNode(value, this.#nil, this.#nil)

    if (this.isEmpty) {
      this.#head = node
      this.#tail = node
    }
    else {
      this.#tail.next = node
      node.prev = this.#tail
      this.#tail = node
    }

    this.#size++
    return this
  }

  traverseNodes = () => traverseLines(this.#head, this.#size);

  [Symbol.iterator] = () => mapGenerator(this.traverseNodes(), node => node.value)

  #getNodeAt(index: number) {
    if (this.isEmpty)
      throw new RangeError('Out of bounds: List is empty')

    assertIndex(index, 0, this.#size - 1)

    if (index === this.#size - 1)
      return this.#tail as DoublyNode<T>

    let step = 0
    for (const node of this.traverseNodes()) {
      if (step === index)
        return node
      step++
    }
    throw new RangeError('Out of bounds: Node is nil')
  }

  get(index: number) {
    const node = this.#getNodeAt(index)
    return node.value
  }

  insert(index: number, value: T) {
    assertIndex(index, 0, this.#size)

    /** 插入到末尾等同于调用add */
    if (index === this.#size)
      return this.add(value)

    const nextNode = this.#getNodeAt(index)
    const insertNode = createDoublyNode(value, this.#nil, this.#nil)
    const prevNode = nextNode.prev

    if (isNil(prevNode)) {
      /** 头部插入只连接一边 */
      insertNode.next = nextNode
      nextNode.prev = insertNode
      this.#head = insertNode
    }
    else {
      prevNode.next = insertNode
      insertNode.prev = prevNode
      nextNode.prev = insertNode
      insertNode.next = nextNode
    }

    this.#size++
    return this
  }

  delete(index: number) {
    if (this.isEmpty)
      throw new RangeError('Cant delete empty list')

    assertIndex(index, 0, this.#size - 1)

    const deleteNode = this.#getNodeAt(index)
    const prevNode = deleteNode.prev
    const nextNode = deleteNode.next

    if (isNil(prevNode))
      this.#head = nextNode
    else
      prevNode.next = nextNode

    if (isNil(nextNode))
      this.#tail = prevNode
    else
      nextNode.prev = prevNode

    this.#size--
    return deleteNode.value
  }
}

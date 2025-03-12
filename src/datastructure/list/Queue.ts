import { QueueADT } from 'src/datastructure/ADT'
import { DoubleLinkList as List } from 'src/datastructure/list/DoubleLinkList'

export class Queue<T> implements QueueADT<T> {
  #l: List<T>
  constructor() {
    this.#l = new List<T>()
  }

  get size() {
    return this.#l.size
  }

  get isEmpty() {
    return this.#l.isEmpty
  }

  traverse() {
    return this.#l.traverse()
  }

  enqueue(value: T) {
    this.#l.add(value)
    return this
  }

  dequeue() {
    if (this.isEmpty) {
      throw new Error('Queue is empty')
    }
    return this.#l.delete(0)
  }

  front() {
    if (this.isEmpty) {
      throw new Error('Queue is empty')
    }
    return this.#l.get(0)
  }

  [Symbol.iterator] = this.traverse
}

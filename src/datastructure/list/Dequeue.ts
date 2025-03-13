import { DequeueADT } from 'src/datastructure/ADT'
import { DoubleLinkList as List } from 'src/datastructure/list/DoubleLinkList'

export class Dequeue<T> implements DequeueADT<T> {
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

  push(value: T) {
    this.#l.add(value)
    return this
  }

  pop() {
    if (this.isEmpty) {
      throw new Error('Dequeue is empty')
    }
    return this.#l.delete(this.size - 1)
  }

  shift() {
    if (this.isEmpty) {
      throw new Error('Dequeue is empty')
    }
    return this.#l.delete(0)
  }

  unshift(value: T) {
    this.#l.insert(0, value)
    return this
  }

  front() {
    if (this.isEmpty) {
      throw new Error('Dequeue is empty')
    }
    return this.#l.get(0)
  }

  back() {
    if (this.isEmpty) {
      throw new Error('Dequeue is empty')
    }
    return this.#l.get(this.size - 1)
  }

  [Symbol.iterator] = this.traverse
}

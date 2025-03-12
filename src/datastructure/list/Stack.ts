import { StackADT } from 'src/datastructure/ADT'
import { DoubleLinkList as List } from 'src/datastructure/list/DoubleLinkList'

export class Stack<T> implements StackADT<T> {
  #l: List<T>

  constructor() {
    this.#l = new List()
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
    return this.#l.delete(this.size - 1)
  }

  top() {
    if (this.isEmpty) {
      throw new Error('Stack is empty')
    } else {
      return this.#l.get(this.size - 1)
    }
  }

  [Symbol.iterator] = this.traverse
}

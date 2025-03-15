import { HashSetADT } from 'src/datastructure/ADT'

import { HashTable } from 'src/datastructure/collecttion/HashTable'

export class HashSet<T> implements HashSetADT<T> {
  #h: HashTable<boolean>
  constructor() {
    this.#h = new HashTable<boolean>()
  }

  get size() {
    return this.#h.size
  }

  add(value: T) {
    this.#h.set(value, true)
    return this
  }

  delete(value: T) {
    this.#h.delete(value)
    return this
  }

  has(value: T) {
    return this.#h.get(value) === true
  }

  clear() {
    this.#h.clear()
  }
}

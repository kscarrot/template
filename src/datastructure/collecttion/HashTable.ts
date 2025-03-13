import { HashTableADT } from 'src/datastructure/ADT'
import { DoubleLinkList as List } from 'src/datastructure/list/DoubleLinkList'

interface SelfMap<T> {
  key: any
  value: T
}

export class HashTable<T> implements HashTableADT<T> {
  size: number = 0
  #table: List<SelfMap<T>>[]
  constructor(initalCapacity: number = 64) {
    this.#table = new Array(initalCapacity)
  }

  get capacity() {
    return this.#table.length
  }

  hash(s: any) {
    if (typeof s !== 'string') {
      s = JSON.stringify(s)
    }
    let hash = 0
    for (let i = 0; i < s.length; i++) {
      hash = (hash << 5) - hash + s.charCodeAt(i)
      hash &= hash
    }
    return hash
  }

  private position(key: any) {
    return Math.abs(this.hash(key)) % this.capacity
  }

  get(key: any) {
    return this.findSelfMap(key)?.value ?? null
  }

  set(key: any, value: T) {
    const i = this.position(key)
    if (!this.#table[i]) {
      this.#table[i] = new List()
    }
    const item = { key, value }
    const element = this.findSelfMap(key)
    if (element !== null) {
      element.value = value
    } else {
      this.#table[i].add(item)
      this.size++
    }

    return this
  }

  delete(key: any) {
    const i = this.position(key)
    const targetList = this.#table[i]
    const iterator = targetList.traverse()
    let node = iterator.next()
    let listIndex = 0
    while (!node.done) {
      if (node.value.key === key) {
        targetList.delete(listIndex)
        this.size = this.size - 1
      }
      listIndex = listIndex + 1
      node = iterator.next()
    }
    return this
  }

  private findSelfMap(key: any) {
    const i = this.position(key)
    if (this.#table[i]) {
      for (const map of this.#table[i]) {
        if (map.key === key) {
          return map
        }
      }
    }
    return null
  }

  clear() {
    this.#table = []
    this.size = 0
  }
}

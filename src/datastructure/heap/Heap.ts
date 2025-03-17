import { HeapADT } from 'src/datastructure/ADT'
import { Comparator } from 'src/util/Comparator'
import type { compareFunction } from 'src/util/Comparator'
export class Heap<T> implements HeapADT<T> {
  size: number = 0
  #data: T[] = []
  cmp: Comparator<T>
  constructor(cmpFn?: compareFunction<T>) {
    this.cmp = new Comparator(cmpFn)
  }

  get isEmpty() {
    return this.size === 0
  }

  private parentIndex(index: number) {
    return (index - 1) >> 1
  }

  private leftChildIndex(index: number) {
    return index * 2 + 1
  }

  private rightChildIndex(index: number) {
    return index * 2 + 2
  }

  private swap(a: number, b: number) {
    ;[this.#data[a], this.#data[b]] = [this.#data[b], this.#data[a]]
  }

  private shiftUp(index: number) {
    if (index > 0) {
      let parent = this.parentIndex(index)
      if (this.cmp.lt(this.#data[index], this.#data[parent])) {
        this.swap(index, parent)
        this.shiftUp(parent)
      }
    }
  }

  private shiftDown(index: number) {
    let left = this.leftChildIndex(index)
    let right = this.rightChildIndex(index)
    let largest = index
    if (left < this.size && this.cmp.lt(this.#data[left], this.#data[largest])) {
      largest = left
    }
    if (right < this.size && this.cmp.lt(this.#data[right], this.#data[largest])) {
      largest = right
    }
    if (largest !== index) {
      this.swap(index, largest)
      this.shiftDown(largest)
    }
  }

  insert(value: T) {
    this.#data.push(value)
    this.shiftUp(this.size)
    this.size++
    return this
  }

  extract() {
    if (this.isEmpty) {
      throw new Error('Heap is empty')
    }
    const root = this.#data[0]
    this.#data[0] = this.#data[this.size - 1]
    this.#data.pop()
    this.size--
    this.shiftDown(0)
    return root
  }

  peek() {
    if (this.isEmpty) {
      throw new Error('Heap is empty')
    }
    return this.#data[0]
  }

  *traverse() {
    let index = 0
    while (index < this.size) {
      yield this.#data[index]
      index++
    }
  }

  [Symbol.iterator] = this.traverse
}

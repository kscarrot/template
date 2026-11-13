import type { ListADT } from 'src/datastructure/ADT'
import type { SinglyItem, SinglyNil, SinglyNode } from 'src/datastructure/Node'
import { createSinglyNil, createSinglyNode, isNil } from 'src/datastructure/Node'
import { traverseLines } from 'src/datastructure/traverse'
import { assertIndex } from 'src/util/common'
import { mapGenerator } from 'src/util/Iter'

class SinglyLinkList<T> implements ListADT<T> {
  #nil: SinglyNil
  #head: SinglyItem<T>
  #tail: SinglyItem<T>
  #size = 0
  constructor() {
    this.#nil = createSinglyNil()
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
    const node = createSinglyNode(value, this.#nil)
    if (isNil(this.#tail)) {
      this.#head = node
    }
    else {
      this.#tail.next = node
    }
    this.#tail = node
    this.#size++
    return this
  }

  traverseNodes = () => traverseLines(this.#head, this.#size);

  [Symbol.iterator] = () => mapGenerator(this.traverseNodes(), node => node.value)

  #getNodeAt(index: number) {
    if (this.isEmpty)
      throw new RangeError('Out of bounds: List is empty')

    assertIndex(index, 0, this.#size - 1)

    /** 末尾节点直接返回尾指针 */
    if (index === this.#size - 1)
      return this.#tail as SinglyNode<T>

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

    const node = createSinglyNode(value, this.#nil)

    /** 插入到头部要同时修改头指针 */
    if (index === 0) {
      node.next = this.#head
      this.#head = node
    }
    else {
      const prevNode = this.#getNodeAt(index - 1)
      node.next = prevNode.next
      prevNode.next = node
    }
    this.#size++
    return this
  }

  delete(index: number) {
    if (this.isEmpty)
      throw new RangeError('Cant delete empty list')

    assertIndex(index, 0, this.#size - 1)

    let deleteNode: SinglyNode<T>
    let prevNode: SinglyItem<T>

    /** 头部删除 */
    if (index === 0) {
      prevNode = this.#nil
      deleteNode = this.#head as SinglyNode<T>
      this.#head = deleteNode.next
    }
    else {
    /** 非头部删除找到前置节点 */
      prevNode = this.#getNodeAt(index - 1)
      deleteNode = prevNode.next as SinglyNode<T>
      prevNode.next = deleteNode.next
    }

    /** 尾部删除 */
    if (this.#tail === deleteNode) {
      this.#tail = prevNode
    }

    this.#size--
    return deleteNode.value
  }
}

export {
  SinglyLinkList,
}

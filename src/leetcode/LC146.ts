/**
 * @name: LRU 缓存
 * @level: 中等
 * @link: https://leetcode.cn/problems/lru-cache
 * @description: 请你设计并实现一个满足  LRU (最近最少使用) 缓存 约束的数据结构。
 * @param {number} capacity
 * @return {void}
 */
class LRUCache {
  #capacity: number // 缓存容量
  #cache: Map<number, CacheNode> // 缓存
  #dummyHead: CacheNode // 虚拟头节点
  constructor(capacity: number) {
    this.#capacity = capacity
    this.#cache = new Map()
    this.#dummyHead = new CacheNode(Symbol('dummy'), 0)
  }

  get(key: number): number {
    const node = this.#cache.get(key)
    if (!node) return -1
    this.#moveToHead(node)
    return node.value
  }

  put(key: number, value: number): void {
    const node = this.#cache.get(key)
    if (node) {
      node.value = value
      this.#moveToHead(node)
    } else {
      const newNode = new CacheNode(key, value)
      this.#cache.set(key, newNode)
      this.#addNodeToHead(newNode)
      if (this.#cache.size > this.#capacity) {
        const tail = this.#dummyHead.prev
        this.#removeNode(tail)
        this.#cache.delete(tail.key as number)
      }
    }
  }

  #removeNode(node: CacheNode): void {
    node.prev.next = node.next
    node.next.prev = node.prev
  }

  #addNodeToHead(node: CacheNode): void {
    node.prev = this.#dummyHead
    node.next = this.#dummyHead.next
    this.#dummyHead.next.prev = node
    this.#dummyHead.next = node
  }

  #moveToHead(node: CacheNode): void {
    this.#removeNode(node)
    this.#addNodeToHead(node)
  }
}

class CacheNode {
  key: number | symbol
  value: number
  prev: CacheNode
  next: CacheNode
  constructor(key: number | symbol, value: number) {
    this.key = key
    this.value = value
    this.prev = this
    this.next = this
  }
}

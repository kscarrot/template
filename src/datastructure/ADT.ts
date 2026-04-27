export interface ListADT<T> {
  size: number
  isEmpty: boolean
  get: (index: number) => T
  delete: (index: number) => T
  insert: (index: number, value: T) => this
  add: (value: T) => this
}

export interface StackADT<T> {
  size: number
  isEmpty: boolean
  push: (value: T) => this
  pop: () => T
  /** or named Peek  */
  top: () => T
}

export interface QueueADT<T> {
  size: number
  isEmpty: boolean
  enqueue: (value: T) => this
  dequeue: () => T
  front: () => T
}

export interface DequeueADT<T> {
  size: number
  isEmpty: boolean
  /** or named push_back */
  push: (value: T) => this
  /** or named pop_back */
  pop: () => T
  /** or named push_front */
  unshift: (value: T) => this
  /** or named push_back */
  shift: () => T
  /** get the fisrt element of dequeue */
  front: () => T
  /** get the last element of dequeue */
  back: () => T
}

export interface HashTableADT<T> {
  size: number
  get: (key: any) => T | null
  set: (key: any, value: T) => this
  delete: (key: string) => this
}
export interface HashSetADT<T> {
  size: number
  add: (value: T) => this
  delete: (value: T) => this
  has: (value: T) => boolean
}

export interface HeapADT<T> {
  size: number
  isEmpty: boolean
  /** 插入一个元素到堆中 */
  insert: (value: T) => this
  /** 删除并返回堆顶元素 */
  extract: () => T
  /** 查看堆顶元素但不删除 */
  peek: () => T
}

export interface TreeADT<T> {
  /** 树的大小 */
  size: number
  /** 树是否为空 */
  isEmpty: boolean
  /** 打印树结构 */
  print: (options?: { showNull: boolean }) => void
  /** 遍历树 */
  [Symbol.iterator]: () => Generator<T>
  /** 查询一个元素是否在树中 */
  search: (value: T) => boolean
  /** 从树中插入一个元素（可选，取决于具体树实现） */
  insert?: (value: T) => this
  /** 从树中删除一个元素（可选，取决于具体树实现） */
  delete?: (value: T) => this
}

export interface SearchTreeADT<T> extends TreeADT<T> {
  /** 查找有序树中的最小值 */
  getMin: () => T | null
  /** 查找有序树中的最大值 */
  getMax: () => T | null
  /** 查找一个元素在有序树中的顺序排名 */
  getRank: (value: T) => number
  /** 查找一个元素在有序树中的前驱 */
  getPrev: (value: T) => T | null
  /** 查找一个元素在有序树中的后继 */
  getNext: (value: T) => T | null
  /** 查找有序树中的第k个元素 */
  getKth: (k: number) => T | null
}

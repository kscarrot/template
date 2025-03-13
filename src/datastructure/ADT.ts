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

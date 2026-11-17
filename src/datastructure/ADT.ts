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

export type NodeId = string

export interface Edge<Meta = EmptyMeta> {
  to: NodeId
  meta: Meta
}

export interface GraphADT<
  TNode = unknown,
  TMeta = EmptyMeta,
  TEdge extends Edge<TMeta> = Edge<TMeta>,
> {
  readonly nodeCount: number
  readonly edgeCount: number
  readonly isEmpty: boolean
  readonly isDirected: boolean

  /** ===== 节点操作 ===== */
  addNode: (id: NodeId, node: TNode) => this
  removeNode: (id: NodeId) => this
  hasNode: (id: NodeId) => boolean
  getNode: (id: NodeId) => TNode | undefined

  /** ===== 边操作 ===== */
  addEdge: (from: NodeId, to: NodeId, edge: TEdge) => this
  removeEdge: (from: NodeId, to: NodeId) => this
  hasEdge: (from: NodeId, to: NodeId) => boolean
  getEdge: (from: NodeId, to: NodeId) => TEdge | undefined

  /** ===== 遍历操作 ===== */
  [Symbol.iterator]: () => IterableIterator<[NodeId, TNode]>
  nodes: () => IterableIterator<[NodeId, TNode]>
  edges: () => IterableIterator<[NodeId, NodeId, TEdge]>

  /** 清空 */
  clear: () => this
  /** 转置 */
  transpose: () => this
  /** 克隆 */
  clone: () => this
}

export interface WeightedMeta { weight: number }

export type WeightedEdge<
  TEdgeMeta extends WeightedMeta = WeightedMeta,
> = Edge<TEdgeMeta>

/** 边 meta 至少带 weight；其余与 GraphADT 相同 */
export interface WeightedGraphADT<
  TNode = unknown,
  TMeta extends WeightedMeta = WeightedMeta,
  TEdge extends WeightedEdge<TMeta> = WeightedEdge<TMeta>,
> extends GraphADT<TNode, TMeta, TEdge> {
  readonly defaultWeight: number

  /** ===== 带权边操作（加边用 addEdge，权放在 meta.weight） ===== */

  /** 调整权重 */
  updateWeight: (from: NodeId, to: NodeId, updater: (weight: number) => number) => this
  /** 获取权重 */
  getWeight: (from: NodeId, to: NodeId) => number
  /** 加权出度 */
  weightedOutDegree: (id: NodeId) => number
  /** 加权入度 */
  weightedInDegree: (id: NodeId) => number
}

import type { Edge, GraphADT, NodeId } from 'src/datastructure/ADT'

/**
 * 简单有向图：同一有序对最多一条边
 * - #nodes：顶点数据
 * - #outEdges：邻接表 from → (to → edge)
 * - #inEdges：逆邻接索引 to → froms（只存端点，meta 仍在出边表）
 */
export class Graph<
  TNode = unknown,
  TMeta = EmptyMeta,
  TEdge extends Edge<TMeta> = Edge<TMeta>,
> implements GraphADT<TNode, TMeta, TEdge> {
  readonly #nodes = new Map<NodeId, TNode>()
  readonly #outEdges = new Map<NodeId, Map<NodeId, TEdge>>()
  readonly #inEdges = new Map<NodeId, Set<NodeId>>()
  #edgeCount = 0

  get nodeCount() {
    return this.#nodes.size
  }

  get edgeCount() {
    return this.#edgeCount
  }

  get isEmpty() {
    return this.#nodes.size === 0
  }

  get isDirected() {
    return true
  }

  addNode(id: NodeId, node: TNode): this {
    this.#nodes.set(id, node)
    // 已有顶点只更新数据，空桶只在第一次出现时创建
    this.#outEdges.getOrInsertComputed(id, () => new Map())
    this.#inEdges.getOrInsertComputed(id, () => new Set())
    return this
  }

  removeNode(id: NodeId): this {
    if (!this.#nodes.has(id))
      return this

    // 清出边：从各后继的入边索引里去掉自己
    const outgoing = this.outBucket(id)
    for (const to of outgoing.keys()) {
      this.inBucket(to).delete(id)
      this.#edgeCount--
    }
    this.#outEdges.delete(id)

    // 清入边：从前驱的出边表里去掉指向自己的边
    const incoming = this.inBucket(id)
    for (const from of incoming) {
      this.outBucket(from).delete(id)
      this.#edgeCount--
    }
    this.#inEdges.delete(id)

    this.#nodes.delete(id)
    return this
  }

  hasNode(id: NodeId) {
    return this.#nodes.has(id)
  }

  getNode(id: NodeId) {
    return this.#nodes.get(id)
  }

  addEdge(from: NodeId, to: NodeId, edge: TEdge): this {
    this.assertNode(from)
    this.assertNode(to)
    const bucket = this.outBucket(from)
    const existed = bucket.has(to)
    const stored = {
      ...edge,
      to,
      meta: { ...edge.meta },
    } as TEdge
    bucket.set(to, stored)
    this.inBucket(to).add(from)
    if (!existed)
      this.#edgeCount++
    return this
  }

  removeEdge(from: NodeId, to: NodeId): this {
    const bucket = this.#outEdges.get(from)
    if (!bucket?.delete(to))
      return this
    this.#inEdges.get(to)?.delete(from)
    this.#edgeCount--
    return this
  }

  hasEdge(from: NodeId, to: NodeId) {
    return this.#outEdges.get(from)?.has(to) ?? false
  }

  getEdge(from: NodeId, to: NodeId) {
    return this.#outEdges.get(from)?.get(to)
  }

  [Symbol.iterator](): IterableIterator<[NodeId, TNode]> {
    return this.#nodes.entries()
  }

  * nodes(): IterableIterator<[NodeId, TNode]> {
    yield* this.#nodes.entries()
  }

  * edges(): IterableIterator<[NodeId, NodeId, TEdge]> {
    for (const [from, bucket] of this.#outEdges) {
      for (const [to, edge] of bucket)
        yield [from, to, edge]
    }
  }

  clear(): this {
    this.#nodes.clear()
    this.#outEdges.clear()
    this.#inEdges.clear()
    this.#edgeCount = 0
    return this
  }

  /** 子类覆写以保留自身类型（如带权图的 defaultWeight） */
  protected createEmpty(): this {
    return new Graph() as this
  }

  transpose(): this {
    const graph = this.createEmpty()
    for (const [id, node] of this.nodes())
      graph.addNode(id, node)
    for (const [from, to, edge] of this.edges())
      graph.addEdge(to, from, edge)
    return graph
  }

  clone(): this {
    const graph = this.createEmpty()
    for (const [id, node] of this.nodes())
      graph.addNode(id, node)
    for (const [from, to, edge] of this.edges())
      graph.addEdge(from, to, edge)
    return graph
  }

  /** 出度 */
  outDegree(id: NodeId) {
    return this.#outEdges.get(id)?.size ?? 0
  }

  /** 入度 */
  inDegree(id: NodeId) {
    return this.#inEdges.get(id)?.size ?? 0
  }

  /** 供子类扫入边前驱 */
  protected predecessors(id: NodeId): ReadonlySet<NodeId> {
    return this.#inEdges.get(id) ?? new Set()
  }

  /** 供子类扫出边 */
  protected successors(id: NodeId): ReadonlyMap<NodeId, TEdge> {
    return this.#outEdges.get(id) ?? new Map()
  }

  protected assertNode(id: NodeId) {
    if (!this.#nodes.has(id))
      throw new Error(`Graph: node "${id}" does not exist`)
  }

  protected outBucket(id: NodeId): Map<NodeId, TEdge> {
    const bucket = this.#outEdges.get(id)
    if (!bucket)
      throw new Error(`Graph: missing outEdges for "${id}"`)
    return bucket
  }

  protected inBucket(id: NodeId): Set<NodeId> {
    const bucket = this.#inEdges.get(id)
    if (!bucket)
      throw new Error(`Graph: missing inEdges for "${id}"`)
    return bucket
  }
}

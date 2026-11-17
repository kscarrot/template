import type { NodeId, WeightedEdge, WeightedGraphADT, WeightedMeta } from 'src/datastructure/ADT'
import { Graph } from 'src/datastructure/graph/Graph'

/**
 * 带权有向简单图：权在 edge.meta.weight
 */
export class WeightedGraph<
  TNode = unknown,
  TMeta extends WeightedMeta = WeightedMeta,
  TEdge extends WeightedEdge<TMeta> = WeightedEdge<TMeta>,
> extends Graph<TNode, TMeta, TEdge>
  implements WeightedGraphADT<TNode, TMeta, TEdge> {
  readonly defaultWeight: number

  constructor(defaultWeight = 1) {
    super()
    this.defaultWeight = defaultWeight
  }

  updateWeight(from: NodeId, to: NodeId, updater: (weight: number) => number): this {
    const edge = this.getEdge(from, to)
    if (!edge)
      throw new Error(`WeightedGraph: edge "${from}" → "${to}" does not exist`)
    edge.meta.weight = updater(edge.meta.weight)
    return this
  }

  getWeight(from: NodeId, to: NodeId): number {
    const edge = this.getEdge(from, to)
    if (!edge)
      throw new Error(`WeightedGraph: edge "${from}" → "${to}" does not exist`)
    return edge.meta.weight
  }

  weightedOutDegree(id: NodeId): number {
    let sum = 0
    for (const edge of this.successors(id).values())
      sum += edge.meta.weight
    return sum
  }

  weightedInDegree(id: NodeId): number {
    let sum = 0
    for (const from of this.predecessors(id))
      sum += this.getWeight(from, id)
    return sum
  }

  protected override createEmpty(): this {
    return new WeightedGraph(this.defaultWeight) as this
  }
}

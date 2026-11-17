import { WeightedGraph } from 'src/datastructure/graph/WeightedGraph'

function edge(to: string, weight: number) {
  return {
    to,
    meta: { weight },
  }
}

describe('带权有向图', () => {
  it('用 addEdge 写入权重，可用 defaultWeight', () => {
    const g = new WeightedGraph<string>(3)
    g.addNode('a', 'A').addNode('b', 'B')
    g.addEdge('a', 'b', edge('b', g.defaultWeight))
    expect([
      g.defaultWeight,
      g.getWeight('a', 'b'),
      g.getEdge('a', 'b')?.meta.weight,
    ]).toStrictEqual([
      3,
      3,
      3,
    ])
  })

  it('addEdge 覆盖同一条边的权重', () => {
    const g = new WeightedGraph()
    g.addNode('a', 1).addNode('b', 2)
    g.addEdge('a', 'b', edge('b', 2))
    g.addEdge('a', 'b', edge('b', 5))
    expect([
      g.getWeight('a', 'b'),
      g.edgeCount,
    ]).toStrictEqual([
      5,
      1,
    ])
  })

  it('updateWeight 调整已有边', () => {
    const g = new WeightedGraph()
    g.addNode('a', 1).addNode('b', 2)
    g.addEdge('a', 'b', edge('b', 4))
    g.updateWeight('a', 'b', w => w * 2)
    expect(g.getWeight('a', 'b')).toBe(8)
  })

  it('不存在的边查权或更新时抛错', () => {
    const g = new WeightedGraph()
    g.addNode('a', 1).addNode('b', 2)
    expect(() => g.getWeight('a', 'b')).toThrow('does not exist')
    expect(() => g.updateWeight('a', 'b', w => w + 1)).toThrow('does not exist')
  })

  it('加权出入度', () => {
    const g = new WeightedGraph()
    g.addNode('a', 1).addNode('b', 2).addNode('c', 3)
    g.addEdge('a', 'b', edge('b', 2))
    g.addEdge('a', 'c', edge('c', 3))
    g.addEdge('c', 'b', edge('b', 4))
    expect([
      g.weightedOutDegree('a'),
      g.weightedInDegree('b'),
      g.weightedOutDegree('b'),
      g.weightedInDegree('a'),
    ]).toStrictEqual([
      5,
      6,
      0,
      0,
    ])
  })

  it('转置后权重跟着边走', () => {
    const g = new WeightedGraph<string>()
    g.addNode('a', 'A').addNode('b', 'B')
    g.addEdge('a', 'b', edge('b', 7))
    const t = g.transpose()
    expect([
      t.getWeight('b', 'a'),
      t.hasEdge('a', 'b'),
      t.defaultWeight,
    ]).toStrictEqual([
      7,
      false,
      1,
    ])
  })

  it('克隆保留 defaultWeight 且互不影响', () => {
    const g = new WeightedGraph(10)
    g.addNode('a', 1).addNode('b', 2)
    g.addEdge('a', 'b', edge('b', 1))
    const c = g.clone()
    c.updateWeight('a', 'b', () => 99)
    expect([
      g.getWeight('a', 'b'),
      c.getWeight('a', 'b'),
      c.defaultWeight,
    ]).toStrictEqual([
      1,
      99,
      10,
    ])
  })
})

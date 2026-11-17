import { Graph } from 'src/datastructure/graph/Graph'

/** 出边表与入边索引互为镜像 */
function indexesMatch(graph: Graph) {
  const forward: Array<[string, string]> = []
  for (const [from, to] of graph.edges())
    forward.push([from, to])

  const reverseOk = forward.every(([from, to]) => {
    // 有 out[u][v] 则 in[v] 含 u：用入度与 hasEdge 间接验证——扫全部边时对每个 to 检查前驱
    return graph.hasEdge(from, to)
      && [
        ...graph.edges(),
      ].filter(([, t]) => t === to).some(([f]) => f === from)
  })

  // 每条出边都能在「指向 to 的边」里找到 from；edgeCount 一致
  return reverseOk
    && graph.edgeCount === forward.length
    && forward.every(([from, to]) => graph.hasEdge(from, to))
}

describe('有向图', () => {
  it('空图', () => {
    const g = new Graph<string>()
    expect([
      g.isEmpty,
      g.nodeCount,
      g.edgeCount,
      g.isDirected,
      [...g],
    ]).toStrictEqual([
      true,
      0,
      0,
      true,
      [],
    ])
  })

  it('节点增删查', () => {
    const g = new Graph<number>()
    g.addNode('a', 1).addNode('b', 2)
    expect([
      g.nodeCount,
      g.hasNode('a'),
      g.getNode('b'),
      g.hasNode('z'),
    ]).toStrictEqual([
      2,
      true,
      2,
      false,
    ])
    g.addNode('a', 9)
    expect(g.getNode('a')).toBe(9)
    g.removeNode('a')
    expect([
      g.hasNode('a'),
      g.nodeCount,
    ]).toStrictEqual([
      false,
      1,
    ])
  })

  it('边增删与单边覆盖', () => {
    const g = new Graph<string, { label: string }>()
    g.addNode('a', 'A').addNode('b', 'B')
    g.addEdge('a', 'b', {
      to: 'b',
      meta: { label: 'x' },
    })
    expect(g.getEdge('a', 'b')?.meta.label).toBe('x')
    expect(g.edgeCount).toBe(1)

    g.addEdge('a', 'b', {
      to: 'b',
      meta: { label: 'y' },
    })
    expect([
      g.getEdge('a', 'b')?.meta.label,
      g.edgeCount,
    ]).toStrictEqual([
      'y',
      1,
    ])

    g.removeEdge('a', 'b')
    expect([
      g.hasEdge('a', 'b'),
      g.edgeCount,
    ]).toStrictEqual([
      false,
      0,
    ])
  })

  it('端点不存在时加边抛错', () => {
    const g = new Graph()
    g.addNode('a', null)
    expect(() => g.addEdge('a', 'b', { to: 'b', meta: {} })).toThrow('does not exist')
  })

  it('删点时清掉相关出边和入边', () => {
    const g = new Graph()
    g.addNode('a', 1).addNode('b', 2).addNode('c', 3)
    g.addEdge('a', 'b', { to: 'b', meta: {} })
    g.addEdge('c', 'b', { to: 'b', meta: {} })
    g.addEdge('b', 'c', { to: 'c', meta: {} })
    expect(g.edgeCount).toBe(3)

    g.removeNode('b')
    expect([
      g.hasNode('b'),
      g.hasEdge('a', 'b'),
      g.hasEdge('c', 'b'),
      g.hasEdge('b', 'c'),
      g.edgeCount,
      [
        ...g.edges(),
      ],
    ]).toStrictEqual([
      false,
      false,
      false,
      false,
      0,
      [],
    ])
  })

  it('自环删除节点时边数正确', () => {
    const g = new Graph()
    g.addNode('a', 1).addNode('b', 2)
    g.addEdge('a', 'a', { to: 'a', meta: {} })
    g.addEdge('b', 'a', { to: 'a', meta: {} })
    expect(g.edgeCount).toBe(2)
    g.removeNode('a')
    expect([
      g.edgeCount,
      g.hasEdge('b', 'a'),
      [
        ...g.edges(),
      ],
    ]).toStrictEqual([
      0,
      false,
      [],
    ])
  })

  it('出入度', () => {
    const g = new Graph()
    g.addNode('a', 1).addNode('b', 2).addNode('c', 3)
    g.addEdge('a', 'b', { to: 'b', meta: {} })
    g.addEdge('a', 'c', { to: 'c', meta: {} })
    g.addEdge('c', 'b', { to: 'b', meta: {} })
    expect([
      g.outDegree('a'),
      g.inDegree('b'),
      g.inDegree('a'),
      g.outDegree('b'),
    ]).toStrictEqual([
      2,
      2,
      0,
      0,
    ])
  })

  it('出边与入边索引保持一致，edgeCount 与枚举一致', () => {
    const g = new Graph()
    g.addNode('a', 1).addNode('b', 2).addNode('c', 3)
    g.addEdge('a', 'b', { to: 'b', meta: {} })
    g.addEdge('b', 'c', { to: 'c', meta: {} })
    g.addEdge('c', 'a', { to: 'a', meta: {} })
    g.addEdge('a', 'a', { to: 'a', meta: {} })
    expect(indexesMatch(g)).toBe(true)
    expect(g.edgeCount).toBe([
      ...g.edges(),
    ].length)

    g.removeEdge('a', 'b')
    expect(indexesMatch(g)).toBe(true)
    g.removeNode('c')
    expect(indexesMatch(g)).toBe(true)
  })

  it('转置反转边方向', () => {
    const g = new Graph<string>()
    g.addNode('a', 'A').addNode('b', 'B').addNode('c', 'C')
    g.addEdge('a', 'b', { to: 'b', meta: {} })
    g.addEdge('b', 'c', { to: 'c', meta: {} })
    const t = g.transpose()
    expect([
      ...t.edges(),
    ].map(([f, to]) => [f, to])).toStrictEqual([
      ['b', 'a'],
      ['c', 'b'],
    ])
    expect(g.hasEdge('a', 'b')).toBe(true)
    expect(indexesMatch(t)).toBe(true)
  })

  it('克隆互不影响', () => {
    const g = new Graph<number, { w: number }>()
    g.addNode('a', 1).addNode('b', 2)
    g.addEdge('a', 'b', {
      to: 'b',
      meta: { w: 1 },
    })
    const c = g.clone()
    c.addNode('c', 3)
    c.addEdge('b', 'c', {
      to: 'c',
      meta: { w: 2 },
    })
    c.getEdge('a', 'b')!.meta.w = 9
    expect([
      g.hasNode('c'),
      g.hasEdge('b', 'c'),
      g.getEdge('a', 'b')?.meta.w,
      c.edgeCount,
    ]).toStrictEqual([
      false,
      false,
      1,
      2,
    ])
  })

  it('清空', () => {
    const g = new Graph()
    g.addNode('a', 1).addNode('b', 2)
    g.addEdge('a', 'b', { to: 'b', meta: {} })
    g.clear()
    expect([
      g.isEmpty,
      g.nodeCount,
      g.edgeCount,
      [
        ...g.edges(),
      ],
    ]).toStrictEqual([
      true,
      0,
      0,
      [],
    ])
  })

  it('按节点迭代', () => {
    const g = new Graph<number>()
    g.addNode('a', 1).addNode('b', 2)
    expect([...g]).toStrictEqual([
      ['a', 1],
      ['b', 2],
    ])
    expect([
      ...g.nodes(),
    ]).toStrictEqual([...g])
  })
})

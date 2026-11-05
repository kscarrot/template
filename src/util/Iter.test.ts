import { mapGenerator, priorities } from 'src/util/Iter'

describe('priorities', () => {
  it('按顺序返回', () => {
    const next = priorities([0.1, 0.2])
    expect([
      next(),
      next(),
    ]).toStrictEqual([0.1, 0.2])
  })

  it('用完即抛错', () => {
    const next = priorities([])
    expect(() => next()).toThrow('priorities exhausted')
  })
})

describe('mapGenerator', () => {
  it('映射每次产出的值，并交出来源的返回值', () => {
    function* source() {
      yield 1
      yield 2
      return 'done'
    }
    const mapped = mapGenerator(source(), value => value * 10)
    expect([
      mapped.next(),
      mapped.next(),
      mapped.next(),
    ]).toStrictEqual([
      { done: false, value: 10 },
      { done: false, value: 20 },
      { done: true, value: 'done' },
    ])
  })

  it('把外部 next 传入的值交回来源', () => {
    function* source(): Generator<string, [string, string], string> {
      const first = yield 'a'
      const second = yield 'b'
      return [first, second]
    }
    const mapped = mapGenerator(source(), value => value.toUpperCase())
    expect([
      mapped.next(),
      mapped.next('x'),
      mapped.next('y'),
    ]).toStrictEqual([
      { done: false, value: 'A' },
      { done: false, value: 'B' },
      {
        done: true,
        value: ['x', 'y'],
      },
    ])
  })

  it('来源捕获异常后继续产出时，补偿值也会被映射', () => {
    function* source() {
      try {
        yield 1
      }
      catch {
        yield 999
      }
    }
    const mapped = mapGenerator(source(), value => value + 1)
    mapped.next()
    expect(mapped.throw(new Error('boom'))).toStrictEqual({ done: false, value: 1000 })
  })

  it('来源在异常后直接结束时，交出来源的返回值', () => {
    function* source() {
      try {
        yield 1
      }
      catch {
        return 'stopped'
      }
    }
    const mapped = mapGenerator(source(), value => value)
    mapped.next()
    expect(mapped.throw(new Error('boom'))).toStrictEqual({ done: true, value: 'stopped' })
  })

  it('提前结束时关闭来源', () => {
    let closed = false
    function* source() {
      try {
        yield 1
      }
      finally {
        closed = true
      }
    }
    const mapped = mapGenerator(source(), value => value)
    mapped.next()
    mapped.return(undefined)
    expect(closed).toBe(true)
  })
})

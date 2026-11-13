import { SinglyLinkList } from 'src/datastructure/list/SinglyLinkList'

it('空链表遍历和读取', () => {
  const l = new SinglyLinkList<number>()
  const nodes = [
    ...l.traverseNodes(),
  ]
  expect(nodes).toStrictEqual([])
  expect(() => l.get(0)).toThrow(new RangeError('Out of bounds: List is empty'))
})

it('插入、追加和按下标读取', () => {
  const l = new SinglyLinkList<number>()
  expect(l.isEmpty).toBe(true)
  expect([...l]).toStrictEqual([])
  expect(() => l.get(0)).toThrow()
  expect(() => l.get(1)).toThrow()
  l.insert(0, 77)
  expect([...l]).toStrictEqual([77])
  expect(l.delete(0)).toBe(77)
  expect([...l]).toStrictEqual([])
  expect(() => l.delete(0)).toThrow()

  l.insert(l.size, 1)
  l.insert(l.size, 2)
  l.insert(l.size, 3)
  expect([...l]).toStrictEqual([1, 2, 3])

  expect(l.isEmpty).toBe(false)
  expect(() => l.get(-1)).toThrow()

  l.insert(0, 10)
  expect([...l]).toStrictEqual([10, 1, 2, 3])
  l.insert(3, 100)
  expect([...l]).toStrictEqual([10, 1, 2, 100, 3])
  l.insert(l.size, 1000)
  expect(l.get(l.size - 1)).toBe(1000)
  expect(() => l.get(l.size)).toThrow()
})

it('删除头部、中间和尾部', () => {
  const l = new SinglyLinkList()
  l.insert(l.size, 1)
  l.insert(l.size, 2)
  l.insert(l.size, 3)
  l.insert(l.size, 4)
  l.insert(l.size, 5)

  expect(l.get(3)).toBe(4)
  expect([...l]).toStrictEqual([1, 2, 3, 4, 5])

  expect(() => l.delete(100)).toThrow()
  expect(() => l.delete(-2)).toThrow()
  l.delete(2)
  expect([...l]).toStrictEqual([1, 2, 4, 5])

  l.delete(3)
  expect([...l]).toStrictEqual([1, 2, 4])

  l.delete(0)
  expect([...l]).toStrictEqual([2, 4])

  l.delete(0)
  l.delete(0)
  expect(l.isEmpty).toBe(true)
  expect([...l]).toStrictEqual([])

  expect(() => l.insert(100, 123)).toThrow()
  expect(() => l.delete(100)).toThrow()
})

describe('单向链表', () => {
  it('add 追加到末尾，并支持链式调用', () => {
    const list = new SinglyLinkList<number>()

    list.add(1)
    expect(list.size).toBe(1)
    expect([...list]).toEqual([1])

    list.add(2).add(3)
    expect(list.size).toBe(3)
    expect([...list]).toEqual([1, 2, 3])

    const result = list.add(4)
    expect(result).toBe(list)
    expect(list.size).toBe(4)
    expect([...list]).toEqual([1, 2, 3, 4])
  })
})

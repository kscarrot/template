import { CircularLinkList } from 'src/datastructure/list/CircularLinkList'

it('空循环链表遍历没有节点', () => {
  const l = new CircularLinkList<number>()
  expect([
    ...l.traverseNodes(),
  ]).toStrictEqual([])
  expect([
    ...l.traverse(),
  ]).toStrictEqual([])
})

it('下标按长度取模，空链表和非整数报错', () => {
  const l = new CircularLinkList<number>()
  expect(() => l.get(0)).toThrow(RangeError)
  expect(() => l.get(1.5)).toThrow(RangeError)

  l.add(1).add(2).add(3).add(4).add(5)
  expect(l.get(0)).toBe(1)
  expect(l.get(5)).toBe(1)
  expect(l.get(-1)).toBe(5)
  expect(l.get(6)).toBe(2)
  expect(() => l.get(1.5)).toThrow(RangeError)
})
it('遍历在一圈后停止', () => {
  const l = new CircularLinkList<number>()
  l.add(1).add(2).add(3)

  const nodes = [
    ...l.traverseNodes(),
  ]
  expect(nodes.map(node => node.value)).toStrictEqual([1, 2, 3])
  expect([
    ...l.traverse(),
  ]).toStrictEqual([1, 2, 3])
})

it('插入落在取模后的下标，删除按同一规则取走节点', () => {
  const l = new CircularLinkList<number>()
  expect(() => l.insert(1.5, 1)).toThrow(RangeError)
  expect(() => l.delete(0)).toThrow(RangeError)

  l.insert(4, 1)
  expect([...l]).toStrictEqual([1])

  l.insert(0, 9)
  expect([...l]).toStrictEqual([9, 1])

  l.add(2).add(3).add(4).add(5)
  expect([...l]).toStrictEqual([9, 1, 2, 3, 4, 5])

  l.insert(l.size, 8)
  expect(l.get(0)).toBe(8)
  expect([...l]).toStrictEqual([8, 9, 1, 2, 3, 4, 5])

  l.insert(-1, 7)
  expect(l.get(-2)).toBe(7)
  expect(l.get(-1)).toBe(5)

  expect(l.delete(0)).toBe(8)
  expect(l.delete(-1)).toBe(5)
  expect(l.delete(l.size)).toBe(9)
  expect([...l]).toStrictEqual([1, 2, 3, 4, 7])

  expect(() => l.delete(1.5)).toThrow(RangeError)
  expect(l.delete(0)).toBe(1)
  expect(l.delete(0)).toBe(2)
  expect(l.delete(0)).toBe(3)
  expect(l.delete(0)).toBe(4)
  expect(l.delete(-1)).toBe(7)
  expect([...l]).toStrictEqual([])
  expect(() => l.get(0)).toThrow(RangeError)
})

import { LinkList } from 'src/datastructure/list/LinkList'
import { isHeadNode, isTailNode } from 'src/datastructure/node'

test('test Node traverse', () => {
  const l = new LinkList<number>()
  const nodeIterator = l.traverseNode()
  let cursor = nodeIterator.next()
  if (cursor.value) {
    expect(isHeadNode(cursor.value)).toBe(true)
  }
  cursor = nodeIterator.next()
  if (cursor.value) {
    expect(isTailNode(cursor.value)).toBe(true)
  }
  cursor = nodeIterator.next()
  expect(cursor.done).toBe(true)
})

test('test LinkList normal add insert', () => {
  const l = new LinkList<number>()
  expect(l.isEmpty).toBe(true)
  expect([...l]).toStrictEqual([])
  expect(() => l.get(0)).toThrow()
  expect(() => l.get(1)).toThrow()
  l.insert(0, 77)
  expect([...l]).toStrictEqual([77])
  expect(l.delete(0)).toBe(77)
  expect([...l]).toStrictEqual([])
  expect(() => l.delete(0)).toThrow()

  l.insert(l.size, 1) // H => 1 => T
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

test('test LinkList normal delete', () => {
  const l = new LinkList()
  l.insert(l.size, 1) // H => 1 => T
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

import { CircularLinkList } from 'src/datastructure/list/CircularLinkList'

test('test CircularLinkList normal index', () => {
  const l = new CircularLinkList()
  expect(l.isEmpty).toBe(true)
  expect(() => l.get(0)).toThrow()
  expect(() => l.get(1)).toThrow()

  l.insert(0, 1)
  expect(l.isEmpty).toBe(false)

  l.insert(0, 2)
  l.insert(0, 3)
  expect(l.size).toBe(3)

  expect(l.get(0)).toBe(1)
  expect(l.get(1)).toBe(2)
  expect(l.get(2)).toBe(3)
  expect([...l]).toStrictEqual([1, 2, 3])

  expect(l.get(3)).toBe(1)
})

test('test CircularLinkList insert', () => {
  const l = new CircularLinkList()

  l.insert(0, 3)
  l.insert(0, 2)
  l.insert(0, 1)
  expect(l.isEmpty).toBe(false)
  expect([...l]).toStrictEqual([3, 2, 1])

  expect(l.size).toBe(3)

  l.insert(l.size, 99)

  // // expect(l.get(0)).toBe(99)
  expect([...l]).toStrictEqual([3, 2, 1, 99])

  expect(() => l.get(-1)).toThrow()
  // expect(l.get(-1)).toBe(99)
})

test('test CircularLinkList traverse', () => {
  const l = new CircularLinkList()
  expect(() => l.delete(0)).toThrow()
  l.insert(0, 99)
  expect(l.delete(0)).toBe(99)

  const arr = [0, 1, 2, 3, 4]
  arr.map((e) => l.insert(0, e))
  expect([...l]).toStrictEqual(arr)
  l.insert(3, 9)
  expect([...l]).toStrictEqual([0, 1, 2, 9, 3, 4])
  l.delete(2)
  expect([...l]).toStrictEqual([0, 1, 9, 3, 4])
})

describe('CircularLinkList', () => {
  test('add should append element to the end of list', () => {
    const list = new CircularLinkList<number>()

    // Test adding to empty list
    list.add(1)
    expect(list.size).toBe(1)
    expect([...list]).toEqual([1])

    // Test adding multiple elements
    list.add(2).add(3)
    expect(list.size).toBe(3)
    expect([...list]).toEqual([1, 2, 3])

    // Test chaining add calls
    const result = list.add(4)
    expect(result).toBe(list)
    expect(list.size).toBe(4)
    expect([...list]).toEqual([1, 2, 3, 4])

    // Test circular nature
    const iterator = list.traverseNode()
    let node = iterator.next().value!
    let count = 0
    while (count < list.size) {
      expect(node.next).toBeDefined()
      expect(node.prev).toBeDefined()
      node = node.next
      count++
    }
  })
})

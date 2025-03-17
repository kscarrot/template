import { Heap } from 'src/datastructure/heap/Heap'

test('test min heap basic', () => {
  const h = new Heap()
  expect(h.isEmpty).toBe(true)
  expect(() => h.peek()).toThrow()
  expect(() => h.extract()).toThrow()
  h.insert(3)
  expect(h.peek()).toBe(3)
  h.insert(2)
  expect([...h]).toStrictEqual([2, 3])
  expect(h.peek()).toBe(2)
  h.insert(1)
  expect(h.peek()).toBe(1)
  h.insert(4)
  const arr1 = []
  for (let i = 0; i < 4; i++) {
    arr1.push(h.extract())
  }
  expect(arr1).toStrictEqual([1, 2, 3, 4])
})

test('test max heap', () => {
  const h = new Heap((a: number, b: number) => (b === a ? 0 : b > a ? 1 : -1))
  h.insert(3)
  h.insert(2)
  h.insert(1)
  h.insert(4)
  const arr = []
  for (let i = 0; i < 4; i++) {
    arr.push(h.extract())
  }
  expect(arr).toStrictEqual([4, 3, 2, 1])
})

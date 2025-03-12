import { Stack } from 'src/datastructure/list/Stack'
test('test Stack ', () => {
  const s = new Stack()
  expect(s.size).toBe(0)
  expect(s.isEmpty).toBe(true)

  s.push(1)
  expect(s.size).toBe(1)
  expect(s.pop()).toBe(1)
  expect(() => s.pop()).toThrow()
  expect(() => s.top()).toThrow()

  s.push(9)
  s.push(99)
  s.push(999)
  expect([...s]).toStrictEqual([9, 99, 999])
  expect(s.top()).toBe(999)
})

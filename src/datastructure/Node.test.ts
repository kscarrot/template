import { createBinaryNil, createDoublyNil, createMultiNil, createSinglyNil } from 'src/datastructure/Node'

describe('空节点', () => {
  it('单向哨兵的 next 只指向自己', () => {
    const nil = createSinglyNil()
    expect(nil.next).toBe(nil)

    nil.next = nil
    expect(nil.next).toBe(nil)
    expect(() => {
      nil.next = createSinglyNil()
    }).toThrow(TypeError)
  })

  it('双向哨兵的 next 和 prev 只指向自己', () => {
    const nil = createDoublyNil()
    expect(nil.next).toBe(nil)
    expect(nil.prev).toBe(nil)

    expect(() => {
      nil.next = createDoublyNil()
    }).toThrow(TypeError)
    expect(() => {
      nil.prev = createDoublyNil()
    }).toThrow(TypeError)
    expect(nil.next).toBe(nil)
    expect(nil.prev).toBe(nil)
  })

  it('二叉树哨兵的 parent、left、right 只指向自己', () => {
    const nil = createBinaryNil()
    expect(nil.parent).toBe(nil)
    expect(nil.left).toBe(nil)
    expect(nil.right).toBe(nil)

    expect(() => {
      nil.left = createBinaryNil()
    }).toThrow(TypeError)
    expect(nil.left).toBe(nil)
  })

  it('多叉哨兵的 parent 指向自己，children 保持空数组', () => {
    const nil = createMultiNil()
    expect(nil.parent).toBe(nil)
    expect(nil.children).toEqual([])

    expect(() => {
      nil.parent = createMultiNil()
    }).toThrow(TypeError)
    expect(() => {
      nil.children = []
    }).toThrow(TypeError)
    expect(nil.parent).toBe(nil)
    expect(nil.children).toEqual([])
  })
})

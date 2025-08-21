import { BinarySearchTree } from 'src/datastructure/tree/BinarySearchTree'

describe('二叉搜索树', () => {
  it('创建二叉搜索树', () => {
    const bst = new BinarySearchTree()
    expect(bst.getMax()).toBe(null)
    expect(bst.getMin()).toBe(null)
    expect(bst.isEmpty).toBe(true)
    expect(bst.root).toBe(null)
    expect(bst.search(10)).toBe(false)
    expect(bst.search(100)).toBe(false)

    bst.insert(10)
    expect(bst.size).toBe(1)
    expect(bst.root?.value).toBe(10)
    expect(bst.isEmpty).toBe(false)
    bst.insert(5)
    expect(bst.size).toBe(2)
    expect(bst.root?.left?.value).toBe(5)
    bst.insert(15)
    expect(bst.size).toBe(3)
    expect(bst.root?.right?.value).toBe(15)

    expect(bst.getMax()).toBe(15)
    expect(bst.getMin()).toBe(5)

    expect(bst.search(10)).toBe(true)
    expect(bst.search(100)).toBe(false)

    bst.insert(100)
    expect(bst.search(100)).toBe(true)
  })

  it('插入验证', () => {
    const bst = new BinarySearchTree([10, 12, 3, 4, 13, 9, 11])
    expect(bst.size).toBe(7)
    /**
     *             10
     *       3           12
     *          4      11    13
     *             9
     */
    expect([...bst]).toStrictEqual([3, 4, 9, 10, 11, 12, 13])
    expect(bst.getKth(1)).toBe(3)
    bst.delete(12)
    expect([...bst]).toStrictEqual([3, 4, 9, 10, 11, 13])
    expect([bst.getKth(1), bst.getKth(2), bst.getKth(3), bst.getKth(4), bst.getKth(5), bst.getKth(6)]).toStrictEqual([
      3, 4, 9, 10, 11, 13,
    ])
    expect([
      bst.getRank(3),
      bst.getRank(4),
      bst.getRank(9),
      bst.getRank(10),
      bst.getRank(11),
      bst.getRank(13),
    ]).toStrictEqual([1, 2, 3, 4, 5, 6])
    expect(bst.getPrev(10)).toBe(9)
    expect(bst.getNext(10)).toBe(11)
    expect(bst.getMax()).toBe(13)
    expect(bst.getMin()).toBe(3)
    expect(bst.getKth(99)).toBe(null)

    bst.delete(99)
    bst.delete(2)
    expect(bst.size).toBe(6)
  })

  it('边界情况测试 顺序插入', () => {
    const bst = new BinarySearchTree()
    bst.insert(4).insert(3).insert(2).insert(1)
    bst.delete(3)
    expect([...bst]).toStrictEqual([1, 2, 4])
    bst.delete(4)
    expect([...bst]).toStrictEqual([1, 2])
  })
})

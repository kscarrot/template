import { SplayTree } from 'src/datastructure/tree/SplayTree'

describe('二叉搜索树', () => {
  it('创建二叉搜索树', () => {
    const bst = new SplayTree()
    expect(bst.getMax()).toBe(null)
    expect(bst.getMin()).toBe(null)
    expect(bst.isEmpty).toBe(true)
    expect(bst.root).toBe(null)
    expect(bst.search(10)).toBe(false)
    expect(bst.delete(10)).toBe(bst)
    bst.insert(10)
    expect(bst.size).toBe(1)
    expect(bst.root?.value).toBe(10)
    expect(bst.isEmpty).toBe(false)
    bst.insert(5)
    expect(bst.size).toBe(2)
    bst.insert(15)
    expect(bst.size).toBe(3)

    expect(bst.getMax()).toBe(15)
    expect(bst.getMin()).toBe(5)
  })

  it('插入验证', () => {
    const bst = new SplayTree([10, 12, 3, 4, 13, 9, 11])
    expect(bst.size).toBe(7)
    /**
     *             10
     *       3           12
     *          4      11    13
     *             9
     */
    expect([...bst]).toStrictEqual([3, 4, 9, 10, 11, 12, 13])
    expect(bst.getKth(1)).toBe(3)
    expect(bst.search(10)).toBe(true)
    expect(bst.root?.value).toBe(10)

    bst.delete(12)
    expect([...bst]).toStrictEqual([3, 4, 9, 10, 11, 13])
    expect([bst.getKth(1), bst.getKth(2), bst.getKth(3), bst.getKth(4), bst.getKth(5), bst.getKth(6)]).toStrictEqual([
      3,
      4,
      9,
      10,
      11,
      13,
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

    /** 搜索后 会把最后一次访问的节点伸展到根节点 */
    expect(bst.search(100)).toBe(false)
    expect(bst.root?.value).toBe(13)
    expect(bst.search(3)).toBe(true)
    expect(bst.root?.value).toBe(3)
    bst.insert(100)
    expect(bst.root?.value).toBe(100)
    expect(bst.search(100)).toBe(true)
  })

  it('边界情况测试', () => {
    const bst = new SplayTree()
    bst.insert(4).insert(3).insert(2).insert(1)
    bst.delete(3)
    expect([...bst]).toStrictEqual([1, 2, 4])
    bst.delete(4)
    bst.insert(0)
    expect([...bst]).toStrictEqual([0, 1, 2])
    bst.delete(0)
    expect([...bst]).toStrictEqual([1, 2])
  })
})

describe('伸展树', () => {
  it('查找命中会把目标节点伸展到根节点', () => {
    const tree = new SplayTree([10, 5, 15, 3, 7, 13, 17])
    expect(tree.search(7)).toBe(true)
    expect(tree.root?.value).toBe(7)
    expect([...tree]).toStrictEqual([3, 5, 7, 10, 13, 15, 17])
  })

  it('查找未命中会把最后访问节点伸展到根节点', () => {
    const tree = new SplayTree([10, 5, 15, 3, 7, 13, 17])
    expect(tree.search(6)).toBe(false)
    expect(tree.root?.value).toBe(5)
    expect([...tree]).toStrictEqual([3, 5, 7, 10, 13, 15, 17])
  })

  it('删除根节点后仍保持有序且根节点可用', () => {
    const tree = new SplayTree([10, 5, 15, 3, 7, 13, 17])
    tree.delete(10)
    expect(tree.size).toBe(6)
    expect([...tree]).toStrictEqual([3, 5, 7, 13, 15, 17])
    expect(tree.root).not.toBe(null)
    expect(tree.search(13)).toBe(true)
    expect(tree.root?.value).toBe(13)
  })

  it('连续删除直到空树', () => {
    const tree = new SplayTree([2, 1, 3])
    tree.delete(2).delete(1).delete(3)
    expect(tree.size).toBe(0)
    expect(tree.root).toBe(null)
    expect(tree.getMin()).toBe(null)
    expect(tree.getMax()).toBe(null)
  })
})

import type { BinaryItem } from 'src/datastructure/Node'
import { isNil } from 'src/datastructure/Node'
import { SplayTree } from 'src/datastructure/tree/SplayTree'
import { expectTypeOf } from 'vitest'

function rootValue(tree: SplayTree<number>) {
  return isNil(tree.root)
    ? null
    : tree.root.value
}

describe('二叉搜索树', () => {
  it('创建二叉搜索树', () => {
    const bst = new SplayTree<number>()
    expect(bst.getMax()).toBe(null)
    expect(bst.getMin()).toBe(null)
    expect(bst.isEmpty).toBe(true)
    expect(isNil(bst.root)).toBe(true)
    expect(bst.search(10)).toBe(false)
    expect(bst.delete(10)).toBe(bst)
    bst.insert(10)
    expect(bst.size).toBe(1)
    expect(rootValue(bst)).toBe(10)
    expect(bst.isEmpty).toBe(false)
    bst.insert(5)
    expect(bst.size).toBe(2)
    bst.insert(15)
    expect(bst.size).toBe(3)

    expect(bst.getMax()).toBe(15)
    expect(bst.getMin()).toBe(5)
  })

  it('插入验证', () => {
    const bst = new SplayTree<number>().from([10, 12, 3, 4, 13, 9, 11])
    expect(bst.size).toBe(7)
    expect([...bst]).toStrictEqual([3, 4, 9, 10, 11, 12, 13])
    expect(bst.getKth(1)).toBe(3)
    expect(bst.search(10)).toBe(true)
    expect(rootValue(bst)).toBe(10)

    bst.delete(12)
    expect([...bst]).toStrictEqual([3, 4, 9, 10, 11, 13])
    expect([
      1,
      2,
      3,
      4,
      5,
      6,
    ].map(k => bst.getKth(k))).toStrictEqual([3, 4, 9, 10, 11, 13])
    expect([
      3,
      4,
      9,
      10,
      11,
      13,
    ].map(value => bst.getRank(value))).toStrictEqual([1, 2, 3, 4, 5, 6])
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
    expect(rootValue(bst)).toBe(13)
    expect(bst.search(3)).toBe(true)
    expect(rootValue(bst)).toBe(3)
    bst.insert(100)
    expect(rootValue(bst)).toBe(100)
    expect(bst.search(100)).toBe(true)
  })

  it('边界情况测试', () => {
    const bst = new SplayTree<number>()
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
    const tree = new SplayTree<number>().from([10, 5, 15, 3, 7, 13, 17])
    expect(tree.search(7)).toBe(true)
    expect(rootValue(tree)).toBe(7)
    expect([...tree]).toStrictEqual([3, 5, 7, 10, 13, 15, 17])
  })

  it('查找未命中会把最后访问节点伸展到根节点', () => {
    const tree = new SplayTree<number>().from([10, 5, 15, 3, 7, 13, 17])
    expect(tree.search(6)).toBe(false)
    expect(rootValue(tree)).toBe(5)
    expect([...tree]).toStrictEqual([3, 5, 7, 10, 13, 15, 17])
  })

  it('删除根节点后仍保持有序且根节点可用', () => {
    const tree = new SplayTree<number>().from([10, 5, 15, 3, 7, 13, 17])
    tree.delete(10)
    expect(tree.size).toBe(6)
    expect([...tree]).toStrictEqual([3, 5, 7, 13, 15, 17])
    expect(isNil(tree.root)).toBe(false)
    expect(tree.search(13)).toBe(true)
    expect(rootValue(tree)).toBe(13)
  })

  it('删除不存在的值会把最后访问节点伸展到根节点', () => {
    const tree = new SplayTree<number>().from([10, 5, 15, 3, 7, 13, 17])
    tree.delete(6)
    expect(rootValue(tree)).toBe(5)
    expect(tree.size).toBe(7)
    expect([...tree]).toStrictEqual([3, 5, 7, 10, 13, 15, 17])
  })

  it('删除有左子树的节点后，其前驱成为新根，parent 指向哨兵', () => {
    const tree = new SplayTree<number>().from([10, 5, 15, 3, 7, 13, 17])
    tree.delete(10)
    expect(rootValue(tree)).toBe(7)
    expect(!isNil(tree.root) && isNil(tree.root.parent)).toBe(true)
  })

  it('删除只有右子树的根，右子树成为新根', () => {
    const tree = new SplayTree<number>().from([1, 2, 3])
    tree.search(1)
    tree.delete(1)
    expect([...tree]).toStrictEqual([2, 3])
    expect(!isNil(tree.root) && isNil(tree.root.parent)).toBe(true)
  })

  it('构造时传入的比较器生效', () => {
    const descending = (a: number, b: number) => Math.sign(b - a) as -1 | 0 | 1
    const tree = new SplayTree(descending).from([1, 3, 2])
    expect([...tree]).toStrictEqual([3, 2, 1])
  })

  it('连续删除直到空树', () => {
    const tree = new SplayTree<number>().from([2, 1, 3])
    tree.delete(2).delete(1).delete(3)
    expect(tree.size).toBe(0)
    expect(isNil(tree.root)).toBe(true)
    expect(tree.getMin()).toBe(null)
    expect(tree.getMax()).toBe(null)
  })

  it('root 的类型是普通二叉节点或哨兵', () => {
    const tree = new SplayTree<number>()
    expectTypeOf(tree.root).toEqualTypeOf<BinaryItem<number>>()
  })

  it('from 返回伸展树', () => {
    expectTypeOf(new SplayTree<number>().from([1])).toEqualTypeOf<SplayTree<number>>()
  })
})

import type { TraverseType } from 'src/algorithm/tree/traverse'
import type { BinaryNode } from 'src/datastructure/Node'
import type { MockInstance } from 'vitest'
import { E_TraverseType } from 'src/algorithm/tree/traverse'
import { isNil } from 'src/datastructure/Node'
import { BinaryTree, countNodes, heightOf } from 'src/datastructure/tree/BinaryTree'
import { expectTypeOf, vi } from 'vitest'

function valuesOf(tree: BinaryTree<number>, type: TraverseType = E_TraverseType.IN_ORDER) {
  return tree.traverseNodes(type).map(node => node.value).toArray()
}

describe('二叉树', () => {
  it('空数组和根为 null 都得到空树', () => {
    for (const values of [
      [],
      [null, 1, 2],
    ]) {
      const tree = BinaryTree.from<number>(values)
      expect(tree.size).toBe(0)
      expect(tree.isEmpty).toBe(true)
      expect(isNil(tree.root)).toBe(true)
      expect([...tree]).toStrictEqual([])
      expect(tree.search(1)).toBe(false)
    }
  })

  it('按层序数组建树，三种遍历', () => {
    /**
     *            1
     *         /     \
     *        2       3
     *      /   \    /
     *     4     5  8
     *          / \ /
     *         6  7 9
     */
    const tree = BinaryTree.from([
      1,
      2,
      3,
      4,
      5,
      8,
      null,
      null,
      null,
      6,
      7,
      9,
    ])
    expect(valuesOf(tree, E_TraverseType.PRE_ORDER)).toStrictEqual([1, 2, 4, 5, 6, 7, 3, 8, 9])
    expect(valuesOf(tree)).toStrictEqual([4, 2, 6, 5, 7, 1, 9, 8, 3])
    expect(valuesOf(tree, E_TraverseType.POST_ORDER)).toStrictEqual([4, 6, 7, 5, 2, 9, 8, 3, 1])
  })

  it('迭代器默认中序', () => {
    /**
     *       1
     *      / \
     *     2   3
     *    / \ / \
     *   4  5 6  7
     *  / \
     * 8   9
     */
    const tree = BinaryTree.from([1, 2, 3, 4, 5, 6, 7, 8, 9])
    expect(tree.size).toBe(9)
    expect(tree.isEmpty).toBe(false)
    expect([...tree]).toStrictEqual([8, 4, 9, 2, 5, 1, 6, 3, 7])
  })

  it('搜索', () => {
    const tree = BinaryTree.from([1, 2, 3])
    expect(tree.search(3)).toBe(true)
    expect(tree.search(10)).toBe(false)
  })

  it('空位用哨兵补齐，挂在空位下面的值不会被建出', () => {
    const tree = BinaryTree.from([1, null, 3, 4])
    expect(tree.size).toBe(2)

    const [root, right] = tree.traverseNodes(E_TraverseType.PRE_ORDER)
    expect(tree.root).toBe(root)
    expect(isNil(root.parent)).toBe(true)
    expect(isNil(root.left)).toBe(true)
    expect(root.right).toBe(right)
    expect(right.parent).toBe(root)
    expect(isNil(right.left)).toBe(true)
    expect(isNil(right.right)).toBe(true)
  })

  it('值为 0 等假值的节点也计入 size', () => {
    expect(BinaryTree.from([0, 1, 2]).size).toBe(3)
  })

  it('树高：空树 0，叶子 1，取较高一侧加 1', () => {
    expect(BinaryTree.from([]).height).toBe(0)
    expect(BinaryTree.from([1]).height).toBe(1)
    expect(BinaryTree.from([2, 1, 3, null, null, null, 4]).height).toBe(3)
  })

  it('子树高度和节点数', () => {
    const tree = BinaryTree.from([1, 2, 3, 4])
    const [, left] = tree.traverseNodes(E_TraverseType.POST_ORDER)
    expect(left.value).toBe(2)
    expect(heightOf(left)).toBe(2)
    expect(countNodes(left)).toBe(2)
    expect(countNodes(tree.root)).toBe(4)
  })

  it('遍历得到的是数据节点', () => {
    const tree = BinaryTree.from([1])
    expectTypeOf(tree.traverseNodes()).toEqualTypeOf<Generator<BinaryNode<number>>>()
  })
})

describe('打印验证', () => {
  let consoleSpy: MockInstance<typeof console.log>

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleSpy.mockRestore()
  })

  function printed() {
    return consoleSpy.mock.calls.map(([line]) => line)
  }

  it('空树打印', () => {
    BinaryTree.from([]).print()
    expect(printed()).toStrictEqual(['(空树)'])
  })

  it('普通二叉树打印', () => {
    BinaryTree.from([1, 2, 3, 4, 5, null, 7]).print()
    expect(printed()).toStrictEqual([
      '└─1',
      '   ├─3',
      '   │  └─7',
      '   └─2',
      '      ├─5',
      '      └─4',
    ])
  })

  it('打印包含空节点的二叉树', () => {
    BinaryTree.from([1, 2, 3, 4, 5, null, 7]).print({ showNull: true })
    expect(printed()).toStrictEqual([
      '└─1',
      '   ├─3',
      '   │  └─7',
      '   │     └─null',
      '   │     └─null',
      '   │  └─null',
      '   └─2',
      '      ├─5',
      '      │  └─null',
      '      │  └─null',
      '      └─4',
      '         └─null',
      '         └─null',
    ])
  })

  it('打印平衡二叉树', () => {
    BinaryTree.from([1, 2, 3, 4, 5, 6, 7]).print()
    expect(printed()).toStrictEqual([
      '└─1',
      '   ├─3',
      '   │  ├─7',
      '   │  └─6',
      '   └─2',
      '      ├─5',
      '      └─4',
    ])
  })

  it('打印左偏树', () => {
    BinaryTree.from([1, 2, null, 4, 5]).print()
    expect(printed()).toStrictEqual([
      '└─1',
      '   └─2',
      '      ├─5',
      '      └─4',
    ])
  })

  it('打印右偏树', () => {
    BinaryTree.from([1, null, 3, null, null, 6, 7]).print()
    expect(printed()).toStrictEqual([
      '└─1',
      '   └─3',
      '      ├─7',
      '      └─6',
    ])
  })

  it('打印单节点树', () => {
    BinaryTree.from([42]).print()
    expect(printed()).toStrictEqual(['└─42'])
  })

  it('默认不打印空位', () => {
    BinaryTree.from([1, 2, 3]).print()
    expect(consoleSpy).not.toHaveBeenCalledWith(expect.stringContaining('null'))
  })

  it('右孩子为空、左孩子有值时，showNull 把右侧的 null 画成非最后一项', () => {
    BinaryTree.from([1, 2, null, 4, 5]).print({ showNull: true })
    expect(printed()).toStrictEqual([
      '└─1',
      '   ├─null',
      '   └─2',
      '      ├─5',
      '      │  └─null',
      '      │  └─null',
      '      └─4',
      '         └─null',
      '         └─null',
    ])
  })
})

import type { BinaryTreeNode } from 'src/datastructure/node/TreeNode'
import { TreapNode } from 'src/datastructure/node/TreeNode'
import { TreapRotate } from 'src/datastructure/tree/TreapRotate'

function range(start: number, end: number) {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}

/** 依次返回给定的优先级，用完即抛错，避免测试悄悄拿到 undefined */
function priorities(...values: number[]): () => number {
  let index = 0
  return () => {
    const priority = values[index]
    index++
    if (priority === undefined)
      throw new Error('priorities exhausted')
    return priority
  }
}

/** 可复现的 [0, 1) 随机数，用来检查随机优先级下的树高 */
function seeded(seed: number): () => number {
  let state = seed >>> 0
  return () => {
    state = (Math.imul(1664525, state) + 1013904223) >>> 0
    return state / 2 ** 32
  }
}

function heightOf<T>(node: BinaryTreeNode<T> | null): number {
  return node
    ? 1 + Math.max(heightOf(node.left), heightOf(node.right))
    : 0
}

function isTreapNode<T>(node: BinaryTreeNode<T>): node is TreapNode<T> {
  return node instanceof TreapNode
}

/** 父指针、最小堆、子树 size 三者同时成立 */
function structureOk<T>(root: BinaryTreeNode<T> | null): boolean {
  const visit = (node: BinaryTreeNode<T> | null, parent: BinaryTreeNode<T> | null): boolean => {
    if (!node)
      return true
    if (!isTreapNode(node) || node.parent !== parent)
      return false
    const leftSize = node.left && isTreapNode(node.left)
      ? node.left.size
      : 0
    const rightSize = node.right && isTreapNode(node.right)
      ? node.right.size
      : 0
    const sizeOk = node.size === 1 + leftSize + rightSize
    const heapOk = [node.left, node.right].every(child => !child || (isTreapNode(child) && node.priority <= child.priority))
    return sizeOk && heapOk && visit(node.left, node) && visit(node.right, node)
  }
  return visit(root, null)
}

describe('旋转树堆', () => {
  it('空树的查询都给出空结果', () => {
    const tree = new TreapRotate<number>()
    expect([
      tree.isEmpty,
      tree.size,
      tree.root,
      tree.search(1),
      tree.getMin(),
      tree.getMax(),
      tree.getKth(1),
    ]).toStrictEqual([
      true,
      0,
      null,
      false,
      null,
      null,
      null,
    ])
  })

  it('优先级已经满足堆序时，插入不旋转', () => {
    const tree = new TreapRotate([2, 1, 3], undefined, priorities(0.1, 0.5, 0.4))
    expect([
      tree.root?.value,
      tree.root?.left?.value,
      tree.root?.right?.value,
    ]).toStrictEqual([2, 1, 3])
    expect(structureOk(tree.root)).toBe(true)
  })

  it('新节点优先级更高时上提到堆序允许的位置', () => {
    // 2(0.5) 先入；1(0.1) 上提成根；3(0.2) 只上提过 2，停在 1 的右孩子
    const tree = new TreapRotate([2, 1, 3], undefined, priorities(0.5, 0.1, 0.2))
    expect([
      tree.root?.value,
      tree.root?.right?.value,
      tree.root?.right?.left?.value,
      tree.root?.left,
    ]).toStrictEqual([
      1,
      3,
      2,
      null,
    ])
    expect(structureOk(tree.root)).toBe(true)
  })

  it('优先级相同不上提', () => {
    const tree = new TreapRotate([2, 1], undefined, priorities(0.5, 0.5))
    expect([
      tree.root?.value,
      tree.root?.left?.value,
    ]).toStrictEqual([2, 1])
  })

  it('删除有两个孩子的节点时，上提优先级更高的孩子', () => {
    const tree = new TreapRotate([2, 1, 3], undefined, priorities(0.1, 0.5, 0.4))
    tree.delete(2)
    expect([
      tree.root?.value,
      tree.root?.left?.value,
      [...tree],
    ]).toStrictEqual([
      3,
      1,
      [1, 3],
    ])
    expect(structureOk(tree.root)).toBe(true)
  })

  it('两个孩子优先级相同时，删除时上提左孩子', () => {
    const tree = new TreapRotate([2, 1, 3], undefined, priorities(0.1, 0.5, 0.5))
    tree.delete(2)
    expect([
      tree.root?.value,
      tree.root?.right?.value,
      tree.root?.left,
    ]).toStrictEqual([
      1,
      3,
      null,
    ])
    expect(structureOk(tree.root)).toBe(true)
  })

  it('删除只有一个孩子的节点', () => {
    const tree = new TreapRotate([2, 1], undefined, priorities(0.1, 0.5))
    tree.delete(2)
    expect([
      tree.root?.value,
      tree.root?.left,
      tree.root?.right,
      tree.size,
    ]).toStrictEqual([
      1,
      null,
      null,
      1,
    ])
    expect(structureOk(tree.root)).toBe(true)
  })

  it('删除叶子只摘除该节点，树根不变', () => {
    const tree = new TreapRotate([2, 1, 3], undefined, priorities(0.1, 0.5, 0.4))
    const root = tree.root
    tree.delete(1)
    expect(tree.root).toBe(root)
    expect([...tree]).toStrictEqual([2, 3])
    expect(structureOk(tree.root)).toBe(true)
  })

  it('查找不改变树形', () => {
    const tree = new TreapRotate([2, 1, 3], undefined, priorities(0.5, 0.1, 0.2))
    const root = tree.root
    expect(tree.search(2)).toBe(true)
    expect(tree.search(99)).toBe(false)
    expect(tree.root).toBe(root)
  })

  it('连续插入和删除后，中序与大小仍正确', () => {
    const tree = new TreapRotate<number>()
    expect(tree.size).toBe(0)
    tree.insert(3).insert(2).insert(10).insert(-1).insert(100).insert(101).insert(1)
    expect([...tree]).toStrictEqual([-1, 1, 2, 3, 10, 100, 101])
    expect(tree.size).toBe(7)
    tree.insert(-100)
    expect(tree.size).toBe(8)

    tree.delete(200)
    expect(tree.size).toBe(8)
    tree.delete(100)
    expect(tree.size).toBe(7)
    tree.delete(1).delete(-1).delete(-1).delete(101)
    expect([...tree]).toStrictEqual([-100, 2, 3, 10])
    expect(tree.size).toBe(4)
    expect(structureOk(tree.root)).toBe(true)
  })

  it('查找命中的值返回真，未命中返回假', () => {
    const tree = new TreapRotate([3, 2, 1, -1])
    expect([
      tree.search(3),
      tree.search(2),
      tree.search(1),
      tree.search(-1),
      tree.search(4),
    ]).toStrictEqual([
      true,
      true,
      true,
      true,
      false,
    ])
  })

  it('只有一个节点时，删掉根的值后树变空', () => {
    const tree = new TreapRotate<number>()
    expect([
      tree.isEmpty,
      tree.root,
    ]).toStrictEqual([
      true,
      null,
    ])
    tree.insert(1)
    expect(tree.root?.value).toBe(1)
    tree.delete(1)
    expect([
      tree.isEmpty,
      tree.root,
      tree.size,
    ]).toStrictEqual([
      true,
      null,
      0,
    ])
  })

  it('删除不存在的值不改变树', () => {
    const tree = new TreapRotate([2, 1, 3], undefined, priorities(0.1, 0.5, 0.4))
    const root = tree.root
    tree.delete(99)
    expect([
      tree.root,
      tree.size,
      [...tree],
    ]).toStrictEqual([
      root,
      3,
      [1, 2, 3],
    ])
  })

  it('重复值按二叉搜索树规则放在右侧，并能逐个删除', () => {
    const tree = new TreapRotate([1, 1, 1], undefined, priorities(0.3, 0.2, 0.1))
    expect([...tree]).toStrictEqual([1, 1, 1])
    tree.delete(1).delete(1)
    expect([
      tree.size,
      [...tree],
    ]).toStrictEqual([
      1,
      [1],
    ])
    tree.delete(1)
    expect([
      tree.size,
      tree.root,
    ]).toStrictEqual([0, null])
  })

  it('插入和删除交替后，中序、排名和结构不变量仍然成立', () => {
    const values = range(1, 50)
    const tree = new TreapRotate(values, undefined, seeded(1))
    for (const value of values.filter(value => value % 3 === 0))
      tree.delete(value)
    tree.insert(0).insert(9)
    const expected = [
      0,
      ...values.filter(value => value % 3 !== 0),
      9,
    ].sort((a, b) => a - b)
    expect([...tree]).toStrictEqual(expected)
    expect(range(1, expected.length).map(k => tree.getKth(k))).toStrictEqual(expected)
    expect([
      tree.getRank(0),
      tree.getPrev(8),
      tree.getNext(8),
      tree.getMin(),
      tree.getMax(),
    ]).toStrictEqual([
      1,
      7,
      9,
      0,
      50,
    ])
    expect(structureOk(tree.root)).toBe(true)
  })

  it('顺序和倒序插入的树高保持对数级', () => {
    const values = range(1, 256)
    const bound = Math.ceil(4.311 * Math.log(values.length) + 15)
    const ascending = new TreapRotate(values, undefined, seeded(1))
    const descending = new TreapRotate([...values].reverse(), undefined, seeded(1))
    expect(heightOf(ascending.root)).toBeLessThanOrEqual(bound)
    expect(heightOf(descending.root)).toBeLessThanOrEqual(bound)
    expect(structureOk(ascending.root) && structureOk(descending.root)).toBe(true)
  })

  it('构造时传入的比较器生效', () => {
    const descending = (a: number, b: number) => (a === b
      ? 0
      : a < b
        ? 1
        : -1)
    const tree = new TreapRotate([1, 3, 2, 5, 4], descending, seeded(2))
    expect([...tree]).toStrictEqual([5, 4, 3, 2, 1])
    expect(structureOk(tree.root)).toBe(true)
  })

  it.each([
    Number.NaN,
    Number.POSITIVE_INFINITY,
    Number.NEGATIVE_INFINITY,
  ])('优先级为 %s 时插入抛错，树保持原样', (priority) => {
    const tree = new TreapRotate([1], undefined, priorities(0.1, priority))
    const root = tree.root
    expect(() => tree.insert(2)).toThrow('priority')
    expect([
      tree.root,
      tree.size,
      [...tree],
    ]).toStrictEqual([
      root,
      1,
      [1],
    ])
  })
})

import type { BinaryTreeNode } from 'src/datastructure/node/TreeNode'
import { TreapNode } from 'src/datastructure/node/TreeNode'
import { traverseBinaryTree } from 'src/datastructure/tree/BinaryTree'
import { Treap } from 'src/datastructure/tree/Treap'

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

function valuesOf<T>(node: BinaryTreeNode<T> | null): T[] {
  return [
    ...traverseBinaryTree(node),
  ]
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

describe('树堆', () => {
  it('空树的查询都给出空结果', () => {
    const tree = new Treap<number>()
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

  it('merge 让优先级更小的根留下，另一棵并进靠向对方的一侧', () => {
    const left = new Treap([1, 2], undefined, priorities(0.1, 0.4))
    const right = new Treap([3, 4], undefined, priorities(0.2, 0.5))
    const merged = left.merge(left.root, right.root)
    // 1(0.1) 留下；3(0.2) 比 2(0.4) 更优先，成为 1 的右孩子，2 并到 3 的左边
    expect([
      merged?.value,
      merged?.right?.value,
      merged?.right?.left?.value,
      merged?.right?.right?.value,
      valuesOf(merged),
    ]).toStrictEqual([
      1,
      3,
      2,
      4,
      [1, 2, 3, 4],
    ])
    expect(structureOk(merged)).toBe(true)
  })

  it('优先级相同时 merge 留下右树的根', () => {
    const tree = new Treap([1, 2], undefined, priorities(0.5, 0.5))
    expect([
      tree.root?.value,
      tree.root?.left?.value,
    ]).toStrictEqual([2, 1])
    expect(structureOk(tree.root)).toBe(true)
  })

  it('split 按中序位置切开，再 merge 回来中序和堆序都不变', () => {
    const tree = new Treap([1, 2, 3, 4], undefined, priorities(0.1, 0.4, 0.2, 0.5))
    const [firstTwo, rest] = tree.split(tree.root, 2)
    expect([
      valuesOf(firstTwo),
      valuesOf(rest),
    ]).toStrictEqual([
      [1, 2],
      [3, 4],
    ])
    expect(structureOk(firstTwo) && structureOk(rest)).toBe(true)
    const [none, all] = tree.split(tree.merge(firstTwo, rest), 0)
    expect([
      valuesOf(none),
      valuesOf(all),
    ]).toStrictEqual([
      [],
      [1, 2, 3, 4],
    ])
    const [whole, empty] = tree.split(all, 4)
    expect([
      valuesOf(whole),
      valuesOf(empty),
    ]).toStrictEqual([
      [1, 2, 3, 4],
      [],
    ])
    expect(structureOk(whole)).toBe(true)
  })

  it('splitV 把小于该值的节点和其余节点分开', () => {
    const tree = new Treap([1, 2, 3, 4], undefined, priorities(0.1, 0.4, 0.2, 0.5))
    const [smaller, rest] = tree.splitV(tree.root, 3)
    expect([
      valuesOf(smaller),
      valuesOf(rest),
    ]).toStrictEqual([
      [1, 2],
      [3, 4],
    ])
    expect(structureOk(smaller) && structureOk(rest)).toBe(true)
  })

  it('插入按 rank 切开后再把新节点 merge 进去', () => {
    const tree = new Treap([1], undefined, priorities(0.5, 0.1))
    tree.insert(2)
    // 2 的优先级 0.1 更高，merge 后成为根，1 落到左边
    expect([
      tree.root?.value,
      tree.root?.left?.value,
      [...tree],
      tree.size,
    ]).toStrictEqual([
      2,
      1,
      [1, 2],
      2,
    ])
    expect(structureOk(tree.root)).toBe(true)
  })

  it('deleteKth 摘掉中序第 k 个节点', () => {
    const tree = new Treap([1, 2, 3, 4], undefined, priorities(0.1, 0.4, 0.2, 0.5))
    expect(tree.deleteKth(2)).toBe(2)
    expect([...tree]).toStrictEqual([1, 3, 4])
    expect(tree.size).toBe(3)
    expect(structureOk(tree.root)).toBe(true)
  })

  it('删除存在的值时摘掉它的最后一次出现', () => {
    const tree = new Treap([1, 2, 2, 3], undefined, priorities(0.3, 0.2, 0.4, 0.1))
    tree.delete(2)
    expect([...tree]).toStrictEqual([1, 2, 3])
    expect(structureOk(tree.root)).toBe(true)
  })

  it('删除不存在的值不改变树', () => {
    const tree = new Treap([1, 2, 3], undefined, priorities(0.2, 0.3, 0.1))
    const root = tree.root
    tree.delete(0).delete(2.5).delete(99)
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

  it('重复值插在已有相等值的后面，并能逐个删除', () => {
    const tree = new Treap([1, 1, 1], undefined, priorities(0.3, 0.2, 0.1))
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
    const tree = new Treap(values, undefined, seeded(1))
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
    const ascending = new Treap(values, undefined, seeded(1))
    const descending = new Treap([...values].reverse(), undefined, seeded(1))
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
    const tree = new Treap([1, 3, 2, 5, 4], descending, seeded(2))
    expect([...tree]).toStrictEqual([5, 4, 3, 2, 1])
    expect(structureOk(tree.root)).toBe(true)
  })

  it('按原用例插入、按名次删除并用 splitV 分开后，名次和两端的顺序正确', () => {
    const tree = new Treap<number>()
    expect(tree.isEmpty).toBe(true)
    expect(tree.getKth(1)).toBe(null)
    expect(tree.deleteKth(1)).toBe(null)
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

    // 只有一个节点时，根的值就是它；删掉后树变空
    tree.insert(1)
    expect(tree.root?.value).toBe(1)
    tree.delete(1)
    expect(tree.isEmpty).toBe(true)

    tree.insert(5).insert(10).insert(99).insert(15).insert(50)
    expect(tree.size).toBe(5)
    expect([...tree]).toStrictEqual([5, 10, 15, 50, 99])
    expect([
      tree.getRank(5),
      tree.getRank(10),
      tree.getRank(99),
      tree.getPrev(15),
      tree.getNext(15),
    ]).toStrictEqual([
      1,
      2,
      5,
      10,
      50,
    ])
    expect(tree.deleteKth(2)).toBe(10)
    expect([...tree]).toStrictEqual([5, 15, 50, 99])
    tree.delete(15)
    expect([...tree]).toStrictEqual([5, 50, 99])

    tree.insert(9).insert(999)
    expect([...tree]).toStrictEqual([5, 9, 50, 99, 999])
    expect(tree.getKth(99)).toBe(null)
    expect(structureOk(tree.root)).toBe(true)

    const [smaller, rest] = tree.splitV(tree.root, 99)
    expect([
      valuesOf(smaller),
      valuesOf(rest),
    ]).toStrictEqual([
      [5, 9, 50],
      [99, 999],
    ])
    expect(structureOk(smaller) && structureOk(rest)).toBe(true)
  })

  it.each([
    Number.NaN,
    Number.POSITIVE_INFINITY,
    Number.NEGATIVE_INFINITY,
  ])('优先级为 %s 时插入抛错，树保持原样', (priority) => {
    const tree = new Treap([1], undefined, priorities(0.1, priority))
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

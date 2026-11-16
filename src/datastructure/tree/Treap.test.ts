import type { BinarySearchTree } from 'src/datastructure/tree/BinarySearchTree'
import type { TreapItem, TreapMeta, TreapOptions } from 'src/datastructure/tree/Treap'
import { list } from 'radash'
import { isNil } from 'src/datastructure/Node'
import { E_TraverseType, traverseBinaryTreeNode } from 'src/datastructure/traverse'
import { Treap } from 'src/datastructure/tree/Treap'
import { TreapRotate } from 'src/datastructure/tree/TreapRotate'
import { priorities } from 'src/util/Iter'
import { expectTypeOf } from 'vitest'

/** 两种树堆对外的查询、插入、删除相同，只是维持堆序的办法不同 */
const treaps: Array<{
  name: string
  create: (options?: TreapOptions<number>) => BinarySearchTree<number, TreapMeta>
}> = [
  {
    name: '树堆',
    create: options => new Treap(options),
  },
  {
    name: '旋转树堆',
    create: options => new TreapRotate(options),
  },
]

function valuesOf<T>(node: TreapItem<T>) {
  return traverseBinaryTreeNode(node).map(item => item.value).toArray()
}

/** 值互不相同时，先序序列唯一确定树形 */
function preOrderOf<T>(node: TreapItem<T>) {
  return traverseBinaryTreeNode(node, E_TraverseType.PRE_ORDER).map(item => item.value).toArray()
}

/** 父指针、最小堆、子树 size 三者同时成立 */
function structureOk<T>(root: TreapItem<T>): boolean {
  const sizeOf = (node: TreapItem<T>) => isNil(node)
    ? 0
    : node.meta.size
  const visit = (node: TreapItem<T>, parent: TreapItem<T>): boolean => {
    if (isNil(node))
      return true
    if (node.parent !== parent)
      return false
    const sizeOk = node.meta.size === 1 + sizeOf(node.left) + sizeOf(node.right)
    const heapOk = [node.left, node.right].every(child => isNil(child) || node.meta.priority <= child.meta.priority)
    return sizeOk && heapOk && visit(node.left, node) && visit(node.right, node)
  }
  return isNil(root) || (isNil(root.parent) && visit(root, root.parent))
}

describe.each(treaps)('$name', ({ create }) => {
  it('空树的查询都给出空结果', () => {
    const tree = create()
    expect([
      tree.isEmpty,
      tree.size,
      isNil(tree.root),
      tree.search(1),
      tree.getMin(),
      tree.getMax(),
      tree.getKth(1),
    ]).toStrictEqual([
      true,
      0,
      true,
      false,
      null,
      null,
      null,
    ])
  })

  it('查找命中的值返回真，未命中返回假', () => {
    const tree = create().from([3, 2, 1, -1])
    expect([
      3,
      2,
      1,
      -1,
      4,
    ].map(value => tree.search(value))).toStrictEqual([
      true,
      true,
      true,
      true,
      false,
    ])
  })

  it('查找不改变树形', () => {
    const tree = create({
      random: priorities([0.5, 0.1, 0.2]),
    }).from([2, 1, 3])
    const root = tree.root
    expect(tree.search(2)).toBe(true)
    expect(tree.search(99)).toBe(false)
    expect(tree.root).toBe(root)
  })

  it('只有一个节点时，删掉根的值后树变空', () => {
    const tree = create()
    tree.insert(1)
    expect(preOrderOf(tree.root)).toStrictEqual([1])
    tree.delete(1)
    expect([
      tree.isEmpty,
      isNil(tree.root),
      tree.size,
    ]).toStrictEqual([
      true,
      true,
      0,
    ])
  })

  it('删除不存在的值不改变树', () => {
    const tree = create({
      random: priorities([0.2, 0.3, 0.1]),
    }).from([1, 2, 3])
    const root = tree.root
    tree.delete(0).delete(2.5).delete(99)
    expect(tree.root).toBe(root)
    expect(tree.size).toBe(3)
    expect([...tree]).toStrictEqual([1, 2, 3])
  })

  it('重复值按二叉搜索树规则放在右侧，并能逐个删除', () => {
    const tree = create({
      random: priorities([0.3, 0.2, 0.1]),
    }).from([1, 1, 1])
    expect([...tree]).toStrictEqual([1, 1, 1])
    tree.delete(1).delete(1)
    expect(tree.size).toBe(1)
    expect([...tree]).toStrictEqual([1])
    tree.delete(1)
    expect(tree.size).toBe(0)
    expect(isNil(tree.root)).toBe(true)
  })

  it('连续插入和删除后，中序与大小仍正确', () => {
    const tree = create()
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

  it('插入和删除交替后，中序、排名和结构不变量仍然成立', () => {
    const values = list(1, 50)
    const tree = create().from(values)
    for (const value of values.filter(value => value % 3 === 0))
      tree.delete(value)
    tree.insert(0).insert(9)
    const expected = [
      0,
      ...values.filter(value => value % 3 !== 0),
      9,
    ].sort((a, b) => a - b)
    expect([...tree]).toStrictEqual(expected)
    expect(list(1, expected.length).map(k => tree.getKth(k))).toStrictEqual(expected)
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
    const values = list(1, 256)
    const bound = Math.ceil(4.311 * Math.log(values.length) + 15)
    const ascending = create().from(values)
    const descending = create().from([...values].reverse())
    expect(ascending.height).toBeLessThanOrEqual(bound)
    expect(descending.height).toBeLessThanOrEqual(bound)
    expect(structureOk(ascending.root) && structureOk(descending.root)).toBe(true)
  })

  it('构造时传入的比较器生效', () => {
    const descending = (a: number, b: number) => Math.sign(b - a) as -1 | 0 | 1
    const tree = create({ comparator: descending }).from([1, 3, 2, 5, 4])
    expect([...tree]).toStrictEqual([5, 4, 3, 2, 1])
    expect(structureOk(tree.root)).toBe(true)
  })

  it('root 的类型带树堆的优先级和子树大小', () => {
    const tree = create()
    expectTypeOf(tree.root).toEqualTypeOf<TreapItem<number>>()
  })
})

describe('树堆', () => {
  it('merge 让优先级更小的根留下，另一棵并进靠向对方的一侧', () => {
    const left = new Treap({
      random: priorities([0.1, 0.4]),
    }).from([1, 2])
    const right = new Treap({
      random: priorities([0.2, 0.5]),
    }).from([3, 4])
    const merged = left.merge(left.root, right.root)
    // 1(0.1) 留下；3(0.2) 比 2(0.4) 更优先，成为 1 的右孩子，2 并到 3 的左边
    expect(preOrderOf(merged)).toStrictEqual([1, 3, 2, 4])
    expect(valuesOf(merged)).toStrictEqual([1, 2, 3, 4])
    expect(structureOk(merged)).toBe(true)
  })

  it('优先级相同时 merge 留下右树的根', () => {
    const tree = new Treap({
      random: priorities([0.5, 0.5]),
    }).from([1, 2])
    expect(preOrderOf(tree.root)).toStrictEqual([2, 1])
    expect(structureOk(tree.root)).toBe(true)
  })

  it('split 按中序位置切开，再 merge 回来中序和堆序都不变', () => {
    const tree = new Treap({
      random: priorities([0.1, 0.4, 0.2, 0.5]),
    }).from([1, 2, 3, 4])
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
    const tree = new Treap({
      random: priorities([0.1, 0.4, 0.2, 0.5]),
    }).from([1, 2, 3, 4])
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
    const tree = new Treap({
      random: priorities([0.5, 0.1]),
    }).from([1])
    tree.insert(2)
    // 2 的优先级 0.1 更高，merge 后成为根，1 落到左边
    expect(preOrderOf(tree.root)).toStrictEqual([2, 1])
    expect([...tree]).toStrictEqual([1, 2])
    expect(tree.size).toBe(2)
    expect(structureOk(tree.root)).toBe(true)
  })

  it('deleteKth 摘掉中序第 k 个节点', () => {
    const tree = new Treap({
      random: priorities([0.1, 0.4, 0.2, 0.5]),
    }).from([1, 2, 3, 4])
    expect(tree.deleteKth(2)).toBe(2)
    expect([...tree]).toStrictEqual([1, 3, 4])
    expect(tree.size).toBe(3)
    expect(structureOk(tree.root)).toBe(true)
  })

  it('deleteKth 越界时返回 null 且树不变', () => {
    const tree = new Treap<number>().from([1, 2])
    expect(tree.deleteKth(5)).toBe(null)
    expect([...tree]).toStrictEqual([1, 2])
  })

  it('删除存在的值时摘掉它的最后一次出现', () => {
    const tree = new Treap({
      random: priorities([0.3, 0.2, 0.4, 0.1]),
    }).from([1, 2, 2, 3])
    tree.delete(2)
    expect([...tree]).toStrictEqual([1, 2, 3])
    expect(structureOk(tree.root)).toBe(true)
  })

  it('按原用例插入、按名次删除并用 splitV 分开后，名次和两端的顺序正确', () => {
    const tree = new Treap<number>()
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
})

describe('旋转树堆', () => {
  it('优先级已经满足堆序时，插入不旋转', () => {
    const tree = new TreapRotate({
      random: priorities([0.1, 0.5, 0.4]),
    }).from([2, 1, 3])
    expect(preOrderOf(tree.root)).toStrictEqual([2, 1, 3])
    expect(structureOk(tree.root)).toBe(true)
  })

  it('新节点优先级更高时上提到堆序允许的位置', () => {
    // 2(0.5) 先入；1(0.1) 上提成根；3(0.2) 只上提过 2，停在 1 的右孩子，2 落到 3 的左边
    const tree = new TreapRotate({
      random: priorities([0.5, 0.1, 0.2]),
    }).from([2, 1, 3])
    expect(preOrderOf(tree.root)).toStrictEqual([1, 3, 2])
    expect(structureOk(tree.root)).toBe(true)
  })

  it('优先级相同不上提', () => {
    const tree = new TreapRotate({
      random: priorities([0.5, 0.5]),
    }).from([2, 1])
    expect(preOrderOf(tree.root)).toStrictEqual([2, 1])
  })

  it('删除有两个孩子的节点时，上提优先级更高的孩子', () => {
    const tree = new TreapRotate({
      random: priorities([0.1, 0.5, 0.4]),
    }).from([2, 1, 3])
    tree.delete(2)
    expect(preOrderOf(tree.root)).toStrictEqual([3, 1])
    expect(structureOk(tree.root)).toBe(true)
  })

  it('两个孩子优先级相同时，删除时上提左孩子', () => {
    const tree = new TreapRotate({
      random: priorities([0.1, 0.5, 0.5]),
    }).from([2, 1, 3])
    tree.delete(2)
    expect(preOrderOf(tree.root)).toStrictEqual([1, 3])
    expect(structureOk(tree.root)).toBe(true)
  })

  it('删除只有一个孩子的节点', () => {
    const tree = new TreapRotate({
      random: priorities([0.1, 0.5]),
    }).from([2, 1])
    tree.delete(2)
    expect(preOrderOf(tree.root)).toStrictEqual([1])
    expect(tree.size).toBe(1)
    expect(structureOk(tree.root)).toBe(true)
  })

  it('删除只有右孩子的节点', () => {
    const tree = new TreapRotate({
      random: priorities([0.1, 0.5]),
    }).from([1, 2])
    tree.delete(1)
    expect(preOrderOf(tree.root)).toStrictEqual([2])
    expect(structureOk(tree.root)).toBe(true)
  })

  it('删除叶子只摘除该节点，树根不变', () => {
    const tree = new TreapRotate({
      random: priorities([0.1, 0.5, 0.4]),
    }).from([2, 1, 3])
    const root = tree.root
    tree.delete(1)
    expect(tree.root).toBe(root)
    expect([...tree]).toStrictEqual([2, 3])
    expect(structureOk(tree.root)).toBe(true)
  })
})

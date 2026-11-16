import type { BinaryItem } from 'src/datastructure/Node'
import { isNil } from 'src/datastructure/Node'
import { E_TraverseType } from 'src/datastructure/traverse'
import { BinarySearchTree } from 'src/datastructure/tree/BinarySearchTree'
import { expectTypeOf } from 'vitest'

function preOrderValues<Meta>(tree: BinarySearchTree<number, Meta>) {
  return tree.traverseNodes(E_TraverseType.PRE_ORDER).map(node => node.value).toArray()
}

function valueOf<Meta>(node: BinaryItem<number, Meta>) {
  return isNil(node)
    ? null
    : node.value
}

describe('二叉搜索树', () => {
  it('空树', () => {
    const bst = new BinarySearchTree<number>()
    expect(bst.isEmpty).toBe(true)
    expect(isNil(bst.root)).toBe(true)
    expect(bst.getMin()).toBe(null)
    expect(bst.getMax()).toBe(null)
    expect(bst.search(10)).toBe(false)
    expect(bst.getKth(1)).toBe(null)
    expect(bst.getRank(10)).toBe(0)
  })

  it('插入按大小挂到左右两侧', () => {
    const bst = new BinarySearchTree<number>()
    bst.insert(10).insert(5).insert(15)
    expect(bst.size).toBe(3)
    expect(preOrderValues(bst)).toStrictEqual([10, 5, 15])
    expect(bst.getMin()).toBe(5)
    expect(bst.getMax()).toBe(15)
    expect(bst.search(10)).toBe(true)
    expect(bst.search(100)).toBe(false)
  })

  it('from 逐个插入，中序有序', () => {
    /**
     *             10
     *       3           12
     *          4      11    13
     *             9
     */
    const bst = new BinarySearchTree<number>().from([10, 12, 3, 4, 13, 9, 11])
    expect(bst.size).toBe(7)
    expect([...bst]).toStrictEqual([3, 4, 9, 10, 11, 12, 13])
  })

  it('排名、第 k 个、前驱和后继', () => {
    const bst = new BinarySearchTree<number>().from([10, 12, 3, 4, 13, 9, 11])
    bst.delete(12)
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
    expect(bst.getKth(0)).toBe(null)
    expect(bst.getKth(99)).toBe(null)
  })

  it('删除不存在的值不改变树', () => {
    const bst = new BinarySearchTree<number>().from([10, 12, 3])
    bst.delete(99)
    expect(bst.size).toBe(3)
    expect([...bst]).toStrictEqual([3, 10, 12])
  })

  it('删除叶子、单孩子和双孩子节点', () => {
    const bst = new BinarySearchTree<number>().from([4, 3, 2, 1, 6, 5, 7])
    bst.delete(1)
    expect([...bst]).toStrictEqual([2, 3, 4, 5, 6, 7])
    bst.delete(3)
    expect([...bst]).toStrictEqual([2, 4, 5, 6, 7])
    bst.delete(6)
    expect([...bst]).toStrictEqual([2, 4, 5, 7])
    expect(bst.size).toBe(4)
  })

  it('删除有两个孩子的根时由后继顶替', () => {
    const bst = new BinarySearchTree<number>().from([10, 5, 15, 12])
    bst.delete(10)
    expect(preOrderValues(bst)).toStrictEqual([12, 5, 15])
  })

  it('删除只有一个孩子的根节点后，孩子成为新根且 parent 指向哨兵', () => {
    const bst = new BinarySearchTree<number>().from([10, 5, 3])
    bst.delete(10)
    expect(valueOf(bst.root)).toBe(5)
    expect(!isNil(bst.root) && isNil(bst.root.parent)).toBe(true)
  })

  it('删光所有节点后回到空树', () => {
    const bst = new BinarySearchTree<number>().from([2, 1, 3])
    bst.delete(2).delete(1).delete(3)
    expect(bst.isEmpty).toBe(true)
    expect(isNil(bst.root)).toBe(true)
    expect([...bst]).toStrictEqual([])
  })

  it('重复值插入到右侧，中序遍历保留全部重复值', () => {
    const bst = new BinarySearchTree<number>().from([5, 3, 5, 5])
    expect([...bst]).toStrictEqual([3, 5, 5, 5])
  })

  it('自定义比较函数', () => {
    const descending = (a: number, b: number) => Math.sign(b - a) as -1 | 0 | 1
    const bst = new BinarySearchTree(descending).from([1, 3, 2])
    expect([...bst]).toStrictEqual([3, 2, 1])
    expect(bst.getMin()).toBe(3)
  })

  it('from 返回原来的树', () => {
    expectTypeOf(new BinarySearchTree<number>().from([1])).toEqualTypeOf<BinarySearchTree<number>>()
  })
})

interface ProbeMeta { serial: number }

/** 暴露受保护的原语，并记录公开方法被调用的次数 */
class ProbeTree extends BinarySearchTree<number, ProbeMeta> {
  deleteCalls = 0
  #serial = 0

  protected override createMeta() {
    return { serial: this.#serial++ }
  }

  override delete(value: number) {
    this.deleteCalls++
    return super.delete(value)
  }

  removeByValue(value: number) {
    const node = this.searchNode(value)
    if (isNil(node))
      throw new Error(`ProbeTree: ${value} not found`)
    return this.removeNode(node)
  }
}

describe('二叉搜索树扩展点', () => {
  it('删除有两个孩子的节点时，子类重写的 delete 只被调用一次', () => {
    const tree = new ProbeTree().from([10, 5, 15, 12])
    tree.delete(10)
    expect(tree.deleteCalls).toBe(1)
  })

  it('每个插入的节点都带上 createMeta 生成的附加数据', () => {
    const tree = new ProbeTree().from([10, 5, 15])
    const serials = tree.traverseNodes(E_TraverseType.PRE_ORDER).map(node => node.meta.serial).toArray()
    expect(serials).toStrictEqual([0, 1, 2])
  })

  it('removeNode 删除有两个孩子的节点时，物理摘除的是后继节点', () => {
    const tree = new ProbeTree().from([10, 5, 15, 12])
    const { removed, child, parent } = tree.removeByValue(10)
    expect([
      removed.value,
      isNil(child),
      valueOf(parent),
    ]).toStrictEqual([12, true, 15])
  })

  it('removeNode 删除只有一个孩子的节点时，返回顶替它的孩子和原父节点', () => {
    const tree = new ProbeTree().from([10, 5, 3])
    const { removed, child, parent } = tree.removeByValue(5)
    expect([
      removed.value,
      valueOf(child),
      valueOf(parent),
    ]).toStrictEqual([5, 3, 10])
    expect(!isNil(child) && child.parent).toBe(tree.root)
  })

  it('removeNode 之后树的结构和 size 保持正确', () => {
    const tree = new ProbeTree().from([10, 5, 15, 12])
    tree.removeByValue(10)
    expect([
      [...tree],
      tree.size,
      valueOf(tree.root),
    ]).toStrictEqual([
      [5, 12, 15],
      3,
      12,
    ])
  })
})

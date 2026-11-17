import type { BinaryItem } from 'src/datastructure/Node'
import type { AVLMeta } from 'src/datastructure/tree/AVLTree'
import { list, shuffle } from 'radash'
import { E_TraverseType } from 'src/algorithm/tree/traverse'
import { isNil } from 'src/datastructure/Node'
import { AVLTree } from 'src/datastructure/tree/AVLTree'
import { heightOf } from 'src/datastructure/tree/BinaryTree'
import { expectTypeOf } from 'vitest'

/**
 * n 个节点的 AVL 树高上界
 * 高度 h 最少要 N(h) = 1 + N(h-1) + N(h-2) 个节点，N(1) = 1，N(2) = 2
 * 128 个节点时 N(9) = 88，N(10) = 143，上界是 9
 */
function maxAVLHeight(size: number): number {
  let prev = 0
  let minNodes = 1
  let height = 0
  while (minNodes <= size) {
    height++
    const next = 1 + minNodes + prev
    prev = minNodes
    minNodes = next
  }
  return height
}

/** 父指针、缓存高度和平衡因子都符合 AVL。哨兵算通过 */
function isAVL<T>(node: BinaryItem<T, AVLMeta>, parent: BinaryItem<T, AVLMeta>): boolean {
  if (isNil(node))
    return true
  const height = (child: BinaryItem<T, AVLMeta>) => isNil(child)
    ? 0
    : child.meta.height
  const linked = node.parent === parent
    && node.meta.height === heightOf(node)
    && Math.abs(height(node.left) - height(node.right)) <= 1
  return linked && isAVL(node.left, node) && isAVL(node.right, node)
}

function isAVLTree<T>(tree: AVLTree<T>) {
  return isNil(tree.root) || isAVL(tree.root, tree.root.parent)
}

function preOrderValues(tree: AVLTree<number>) {
  return tree.traverseNodes(E_TraverseType.PRE_ORDER).map(node => node.value).toArray()
}

function rootValue(tree: AVLTree<number>) {
  return isNil(tree.root)
    ? null
    : tree.root.value
}

describe('avl树', () => {
  it('顺序插入 1、2、3 后左旋，根是 2', () => {
    expect(preOrderValues(new AVLTree<number>().from([1, 2, 3]))).toStrictEqual([2, 1, 3])
  })

  it('倒序插入 3、2、1 后右旋，根是 2', () => {
    expect(preOrderValues(new AVLTree<number>().from([3, 2, 1]))).toStrictEqual([2, 1, 3])
  })

  it('插入 3、1、2 后先左旋再右旋，根是 2', () => {
    expect(preOrderValues(new AVLTree<number>().from([3, 1, 2]))).toStrictEqual([2, 1, 3])
  })

  it('插入 1、3、2 后先右旋再左旋，根是 2', () => {
    expect(preOrderValues(new AVLTree<number>().from([1, 3, 2]))).toStrictEqual([2, 1, 3])
  })

  it('顺序插入 1 到 7 后根是 4', () => {
    expect(rootValue(new AVLTree<number>().from(list(1, 7)))).toBe(4)
  })

  it('顺序插入 1 到 31 得到高度为 5 的树', () => {
    expect(new AVLTree<number>().from(list(1, 31)).height).toBe(5)
  })

  it('倒序插入 1 到 31 得到高度为 5 的树', () => {
    expect(new AVLTree<number>().from(list(1, 31).reverse()).height).toBe(5)
  })

  it('128 个随机元素构成的树高不超过 AVL 上界', () => {
    const values = shuffle(list(1, 128))
    const tree = new AVLTree<number>().from(values)
    expect(tree.height).toBeLessThanOrEqual(maxAVLHeight(values.length))
  })

  it('顺序插入再删掉引起旋转的叶子后，根变成 2', () => {
    const tree = new AVLTree<number>().from(list(1, 7))
    tree.delete(7).delete(6).delete(5)
    expect(rootValue(tree)).toBe(2)
    expect([...tree]).toStrictEqual([1, 2, 3, 4])
  })

  it('插入和删除交替后中序仍然有序，且每个节点平衡', () => {
    const tree = new AVLTree<number>().from(list(1, 31))
    for (const value of list(1, 31).filter(value => value % 2 === 0))
      tree.delete(value)
    tree.insert(0)
    const expected = [
      0,
      ...list(1, 31).filter(value => value % 2 === 1),
    ]
    expect([...tree]).toStrictEqual(expected)
    expect(isAVLTree(tree)).toBe(true)
  })

  it('删除不存在的值不改变树', () => {
    const tree = new AVLTree<number>().from([2, 1, 3])
    const root = tree.root
    tree.delete(99)
    expect(tree.size).toBe(3)
    expect(tree.root).toBe(root)
    expect([...tree]).toStrictEqual([1, 2, 3])
  })

  it('连续删除直到空树', () => {
    const tree = new AVLTree<number>().from([2, 1, 3])
    tree.delete(1).delete(2).delete(3)
    expect(tree.size).toBe(0)
    expect(isNil(tree.root)).toBe(true)
  })

  it('重复值插到右侧后仍然平衡', () => {
    const tree = new AVLTree<number>().from([1, 1, 1])
    expect([...tree]).toStrictEqual([1, 1, 1])
    expect(isAVLTree(tree)).toBe(true)
  })

  it('查找不改变树根', () => {
    const tree = new AVLTree<number>().from([1, 2, 3])
    const root = tree.root
    tree.search(1)
    tree.search(99)
    expect(tree.root).toBe(root)
  })

  it('删除有两个孩子的根之后，排名查询仍然正确', () => {
    const tree = new AVLTree<number>().from(list(1, 7))
    tree.delete(4)
    expect([
      [...tree],
      tree.getKth(1),
      tree.getKth(3),
      tree.getRank(5),
      tree.getPrev(5),
      tree.getNext(5),
      tree.getMin(),
      tree.getMax(),
    ]).toStrictEqual([
      [1, 2, 3, 5, 6, 7],
      1,
      3,
      4,
      3,
      6,
      1,
      7,
    ])
  })

  it('多次旋转后根的 parent 是哨兵，缓存高度和平衡因子都正确', () => {
    const tree = new AVLTree<number>().from(list(1, 50))
    for (const value of list(1, 40))
      tree.delete(value)
    expect(!isNil(tree.root) && isNil(tree.root.parent)).toBe(true)
    expect(isAVLTree(tree)).toBe(true)
  })

  it('构造时传入的比较器生效', () => {
    const descending = (a: number, b: number) => Math.sign(b - a) as -1 | 0 | 1
    const tree = new AVLTree(descending).from([1, 3, 2, 5, 4])
    expect([...tree]).toStrictEqual([5, 4, 3, 2, 1])
    expect(isAVLTree(tree)).toBe(true)
  })

  it('root 的类型带 AVL 的高度', () => {
    const tree = new AVLTree<number>()
    expectTypeOf(tree.root).toEqualTypeOf<BinaryItem<number, AVLMeta>>()
  })

  it('from 返回 AVL 树', () => {
    expectTypeOf(new AVLTree<number>().from([1])).toEqualTypeOf<AVLTree<number>>()
  })
})

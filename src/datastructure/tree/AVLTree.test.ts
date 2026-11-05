import type { AVLNode } from 'src/datastructure/node/TreeNode'
import { list, shuffle } from 'radash'
import { AVLTree } from 'src/datastructure/tree/AVLTree'
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

/** 父指针、缓存高度和平衡因子都符合 AVL。空孩子算通过 */
function isAVL<T>(node: AVLNode<T> | null, parent: AVLNode<T> | null = null): boolean {
  if (!node)
    return true
  const balance = (node.left?.height ?? 0) - (node.right?.height ?? 0)
  const linked = node.parent === parent
    && node.height === node.getHeight()
    && Math.abs(balance) <= 1
  return linked && isAVL(node.left, node) && isAVL(node.right, node)
}

describe('avl树', () => {
  it('顺序插入 1、2、3 后左旋，根是 2', () => {
    const tree = new AVLTree().from([1, 2, 3])
    expect([
      tree.root?.value,
      tree.root?.left?.value,
      tree.root?.right?.value,
    ]).toStrictEqual([2, 1, 3])
  })

  it('倒序插入 3、2、1 后右旋，根是 2', () => {
    const tree = new AVLTree().from([3, 2, 1])
    expect([
      tree.root?.value,
      tree.root?.left?.value,
      tree.root?.right?.value,
    ]).toStrictEqual([2, 1, 3])
  })

  it('插入 3、1、2 后先左旋再右旋，根是 2', () => {
    const tree = new AVLTree().from([3, 1, 2])
    expect([
      tree.root?.value,
      tree.root?.left?.value,
      tree.root?.right?.value,
    ]).toStrictEqual([2, 1, 3])
  })

  it('插入 1、3、2 后先右旋再左旋，根是 2', () => {
    const tree = new AVLTree().from([1, 3, 2])
    expect([
      tree.root?.value,
      tree.root?.left?.value,
      tree.root?.right?.value,
    ]).toStrictEqual([2, 1, 3])
  })

  it('顺序插入 1 到 7 后根是 4', () => {
    const tree = new AVLTree().from(list(1, 7))
    expect(tree.root?.value).toBe(4)
  })

  it('顺序插入 1 到 31 得到高度为 5 的树', () => {
    const tree = new AVLTree().from(list(1, 31))
    expect(tree.root?.getHeight() ?? 0).toBe(5)
  })

  it('倒序插入 1 到 31 得到高度为 5 的树', () => {
    const tree = new AVLTree().from(list(1, 31).reverse())
    expect(tree.root?.getHeight() ?? 0).toBe(5)
  })

  it('128 个随机元素构成的树高不超过 AVL 上界', () => {
    const values = shuffle(list(1, 128))
    const tree = new AVLTree().from(values)
    expect(tree.root?.getHeight() ?? 0).toBeLessThanOrEqual(maxAVLHeight(values.length))
  })

  it('顺序插入再删掉引起旋转的叶子后，根变成 2', () => {
    const tree = new AVLTree().from(list(1, 7))
    tree.delete(7).delete(6).delete(5)
    expect([
      tree.root?.value,
      [...tree],
    ]).toStrictEqual([
      2,
      [1, 2, 3, 4],
    ])
  })

  it('插入和删除交替后中序仍然有序，且每个节点平衡', () => {
    const tree = new AVLTree().from(list(1, 31))
    for (const value of list(1, 31).filter(value => value % 2 === 0))
      tree.delete(value)
    tree.insert(0)
    const expected = [
      0,
      ...list(1, 31).filter(value => value % 2 === 1),
    ]
    expect([...tree]).toStrictEqual(expected)
    expect(isAVL(tree.root)).toBe(true)
  })

  it('删除不存在的值不改变树', () => {
    const tree = new AVLTree().from([2, 1, 3])
    const root = tree.root
    tree.delete(99)
    expect([
      tree.size,
      tree.root,
      [...tree],
    ]).toStrictEqual([
      3,
      root,
      [1, 2, 3],
    ])
  })

  it('连续删除直到空树', () => {
    const tree = new AVLTree().from([2, 1, 3])
    tree.delete(1).delete(2).delete(3)
    expect([tree.size, tree.root]).toStrictEqual([0, null])
  })

  it('重复值插到右侧后仍然平衡', () => {
    const tree = new AVLTree().from([1, 1, 1])
    expect([...tree]).toStrictEqual([1, 1, 1])
    expect(isAVL(tree.root)).toBe(true)
  })

  it('查找不改变树根', () => {
    const tree = new AVLTree().from([1, 2, 3])
    const root = tree.root
    tree.search(1)
    tree.search(99)
    expect(tree.root).toBe(root)
  })

  it('删除有两个孩子的根之后，排名查询仍然正确', () => {
    const tree = new AVLTree().from(list(1, 7))
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

  it('多次旋转后根没有父节点，缓存高度和平衡因子都正确', () => {
    const tree = new AVLTree().from(list(1, 50))
    for (const value of list(1, 40))
      tree.delete(value)
    expect(isAVL(tree.root)).toBe(true)
  })

  it('构造时传入的比较器生效', () => {
    const descending = (a: number, b: number) => (a === b
      ? 0
      : a < b
        ? 1
        : -1)
    const tree = new AVLTree(descending).from([1, 3, 2, 5, 4])
    expect([...tree]).toStrictEqual([5, 4, 3, 2, 1])
    expect(isAVL(tree.root)).toBe(true)
  })

  it('root 的类型是 AVL 节点', () => {
    const tree = new AVLTree<number>()
    expectTypeOf(tree.root).toEqualTypeOf<AVLNode<number> | null>()
  })

  it('from 返回 AVL 树', () => {
    expectTypeOf(new AVLTree<number>().from([1])).toEqualTypeOf<AVLTree<number>>()
  })
})

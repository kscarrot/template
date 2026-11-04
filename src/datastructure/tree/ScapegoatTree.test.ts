import type { BinaryTreeNode } from 'src/datastructure/node/TreeNode'
import { traverseBinaryTreeNode } from 'src/datastructure/tree/BinaryTree'
import { ScapegoatTree } from 'src/datastructure/tree/ScapegoatTree'

function heightOf<T>(node: BinaryTreeNode<T> | null): number {
  return node
    ? 1 + Math.max(heightOf(node.left), heightOf(node.right))
    : 0
}

function range(start: number, end: number) {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}

/** α 平衡保证的树高上界：log_{1/α}(n) + 1 */
function heightBound(size: number, alpha: number) {
  return Math.log(size) / Math.log(1 / alpha) + 1
}

describe('替罪羊树', () => {
  it('顺序插入后树高不超过 α 平衡上界', () => {
    const tree = new ScapegoatTree(range(1, 100))
    expect(heightOf(tree.root)).toBeLessThanOrEqual(heightBound(100, 0.7))
  })

  it('倒序插入后树高不超过 α 平衡上界', () => {
    const tree = new ScapegoatTree(range(1, 100).reverse())
    expect(heightOf(tree.root)).toBeLessThanOrEqual(heightBound(100, 0.7))
  })

  it('α 越小树越平衡：α 为 0.5 时顺序插入得到高度最小的树', () => {
    const tree = new ScapegoatTree(range(1, 15), undefined, 0.5)
    expect(heightOf(tree.root)).toBe(4)
  })

  it('插入和删除交替进行后中序遍历仍有序', () => {
    const tree = new ScapegoatTree(range(1, 50))
    for (const value of range(1, 50).filter(value => value % 3 === 0))
      tree.delete(value)
    tree.insert(9).insert(0)
    const expected = [
      0,
      ...range(1, 50).filter(value => value % 3 !== 0),
      9,
    ].sort((a, b) => a - b)
    expect([...tree]).toStrictEqual(expected)
  })

  it('多次重建后根没有父节点，其余每个节点的 parent 都指向实际父节点', () => {
    const tree = new ScapegoatTree(range(1, 50))
    for (const value of range(1, 40))
      tree.delete(value)
    const nodes = [
      ...traverseBinaryTreeNode(tree.root),
    ]
    const isLinked = (node: BinaryTreeNode<number>) => [node.left, node.right].every(child => !child || child.parent === node)
    expect(tree.root?.parent === null && nodes.every(isLinked)).toBe(true)
  })

  it('删除使节点数低于 α × 历史最大节点数时，整棵树重建为最小高度', () => {
    const tree = new ScapegoatTree(range(1, 10))
    tree.delete(1).delete(2).delete(3).delete(4)
    expect(heightOf(tree.root)).toBe(3)
  })

  it('删除不存在的值不改变树', () => {
    const tree = new ScapegoatTree([2, 1, 3])
    tree.delete(99)
    expect([
      tree.size,
      [...tree],
    ]).toStrictEqual([
      3,
      [1, 2, 3],
    ])
  })

  it('连续删除直到空树', () => {
    const tree = new ScapegoatTree([2, 1, 3])
    tree.delete(1).delete(2).delete(3)
    expect([tree.size, tree.root]).toStrictEqual([0, null])
  })

  it('重建后排名查询仍然正确', () => {
    const tree = new ScapegoatTree(range(1, 20))
    expect([
      tree.getKth(1),
      tree.getKth(10),
      tree.getRank(15),
      tree.getPrev(8),
      tree.getNext(8),
    ]).toStrictEqual([1, 10, 15, 7, 9])
  })

  it('构造时传入的比较器生效', () => {
    const descending = (a: number, b: number) => (a === b
      ? 0
      : a < b
        ? 1
        : -1)
    const tree = new ScapegoatTree([1, 3, 2, 5, 4], descending)
    expect([...tree]).toStrictEqual([5, 4, 3, 2, 1])
  })

  it.each([0.4, 1])('α 为 %s 时超出 [0.5, 1) 范围，构造时抛错', (alpha) => {
    expect(() => new ScapegoatTree([], undefined, alpha)).toThrow('alpha')
  })
})

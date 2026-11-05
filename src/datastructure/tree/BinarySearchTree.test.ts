import { BinaryTreeNode } from 'src/datastructure/node/TreeNode'
import { BinarySearchTree } from 'src/datastructure/tree/BinarySearchTree'
import { expectTypeOf } from 'vitest'

class TaggedNode<T> extends BinaryTreeNode<T> {}

/** 暴露受保护的原语，并记录公开方法被调用的次数 */
class ProbeTree extends BinarySearchTree<number> {
  deleteCalls = 0

  override delete(value: number) {
    this.deleteCalls++
    return super.delete(value)
  }

  protected override createNode(value: number, parent: BinaryTreeNode<number> | null) {
    return new TaggedNode(value, parent
      ? { parent }
      : {})
  }

  removeByValue(value: number) {
    return this.removeNode(this.searchNode(value, this.root) as BinaryTreeNode<number>)
  }
}

function buildProbeTree(values: number[]) {
  const tree = new ProbeTree()
  for (const value of values)
    tree.insert(value)
  return tree
}

describe('二叉搜索树', () => {
  it('创建二叉搜索树', () => {
    const bst = new BinarySearchTree()
    expect(bst.getMax()).toBe(null)
    expect(bst.getMin()).toBe(null)
    expect(bst.isEmpty).toBe(true)
    expect(bst.root).toBe(null)
    expect(bst.search(10)).toBe(false)
    expect(bst.search(100)).toBe(false)

    bst.insert(10)
    expect(bst.size).toBe(1)
    expect(bst.root?.value).toBe(10)
    expect(bst.isEmpty).toBe(false)
    bst.insert(5)
    expect(bst.size).toBe(2)
    expect(bst.root?.left?.value).toBe(5)
    bst.insert(15)
    expect(bst.size).toBe(3)
    expect(bst.root?.right?.value).toBe(15)

    expect(bst.getMax()).toBe(15)
    expect(bst.getMin()).toBe(5)

    expect(bst.search(10)).toBe(true)
    expect(bst.search(100)).toBe(false)

    bst.insert(100)
    expect(bst.search(100)).toBe(true)
  })

  it('插入验证', () => {
    const bst = new BinarySearchTree().from([10, 12, 3, 4, 13, 9, 11])
    expect(bst.size).toBe(7)
    /**
     *             10
     *       3           12
     *          4      11    13
     *             9
     */
    expect([...bst]).toStrictEqual([3, 4, 9, 10, 11, 12, 13])
    expect(bst.getKth(1)).toBe(3)
    bst.delete(12)
    expect([...bst]).toStrictEqual([3, 4, 9, 10, 11, 13])
    expect([
      bst.getKth(1),
      bst.getKth(2),
      bst.getKth(3),
      bst.getKth(4),
      bst.getKth(5),
      bst.getKth(6),
    ]).toStrictEqual([
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
  })

  it('边界情况测试 顺序插入', () => {
    const bst = new BinarySearchTree()
    bst.insert(4).insert(3).insert(2).insert(1)
    bst.delete(3)
    expect([...bst]).toStrictEqual([1, 2, 4])
    bst.delete(4)
    expect([...bst]).toStrictEqual([1, 2])
  })

  it('重复值插入到右侧，中序遍历保留全部重复值', () => {
    const bst = new BinarySearchTree().from([5, 3, 5, 5])
    expect([...bst]).toStrictEqual([3, 5, 5, 5])
  })

  it('删除只有一个孩子的根节点后，孩子成为新根', () => {
    const bst = new BinarySearchTree().from([10, 5, 3])
    bst.delete(10)
    expect(bst.root?.value).toBe(5)
    expect(bst.root?.parent).toBe(null)
  })
})

describe('二叉搜索树扩展点', () => {
  it('删除有两个孩子的节点时，子类重写的 delete 只被调用一次', () => {
    const tree = buildProbeTree([10, 5, 15, 12])
    tree.delete(10)
    expect(tree.deleteCalls).toBe(1)
  })

  it('插入的所有节点都由 createNode 创建', () => {
    const tree = buildProbeTree([10, 5, 15])
    const nodes = [tree.root, tree.root?.left, tree.root?.right]
    expect(nodes.every(node => node instanceof TaggedNode)).toBe(true)
  })

  it('removeNode 删除有两个孩子的节点时，物理摘除的是后继节点', () => {
    const tree = buildProbeTree([10, 5, 15, 12])
    const { removed, child, parent } = tree.removeByValue(10)
    expect([removed.value, child, parent?.value]).toStrictEqual([12, null, 15])
  })

  it('removeNode 删除只有一个孩子的节点时，返回顶替它的孩子和原父节点', () => {
    const tree = buildProbeTree([10, 5, 3])
    const { removed, child, parent } = tree.removeByValue(5)
    expect([
      removed.value,
      child?.value,
      parent?.value,
      child?.parent,
    ]).toStrictEqual([5, 3, 10, tree.root])
  })

  it('removeNode 之后树的结构和 size 保持正确', () => {
    const tree = buildProbeTree([10, 5, 15, 12])
    tree.removeByValue(10)
    expect([
      [...tree],
      tree.size,
      tree.root?.value,
    ]).toStrictEqual([
      [5, 12, 15],
      3,
      12,
    ])
  })
})

describe('节点类型', () => {
  it('root 的类型是普通二叉节点', () => {
    const tree = new BinarySearchTree<number>()
    expectTypeOf(tree.root).toEqualTypeOf<BinaryTreeNode<number> | null>()
  })

  it('from 返回普通二叉搜索树', () => {
    expectTypeOf(new BinarySearchTree<number>().from([1])).toEqualTypeOf<BinarySearchTree<number>>()
  })
})

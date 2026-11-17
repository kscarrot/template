import type { FiberItem, MultiItem, MultiNode } from 'src/datastructure/Node'
import { traverseFiberTreeNode } from 'src/algorithm/tree/traverse'
import { createMultiNil, createMultiNode, isNil } from 'src/datastructure/Node'
import { BinaryTree } from 'src/datastructure/tree/BinaryTree'
import { FiberTree } from 'src/datastructure/tree/FiberTree'

interface Shape {
  value: number
  children: Shape[]
}

function shape(value: number, ...children: Shape[]): Shape {
  return { value, children }
}

function multiTree({ value, children }: Shape, parent: MultiItem<number> = createMultiNil()): MultiNode<number> {
  const node = createMultiNode(value, parent)
  node.children = children.map(child => multiTree(child, node))
  return node
}

/** 1 下面挂 2、5；2 下面一路单孩子 3、4。遍历到 4 后要连续上溯两层才能走到 5 */
const deepChain = () => multiTree(shape(1, shape(2, shape(3, shape(4))), shape(5)))

function valueOf(node: FiberItem<number>) {
  return isNil(node)
    ? null
    : node.value
}

/** 每个节点的 [值, child 的值, sibling 的值] */
function linksOf(tree: FiberTree<number>) {
  return tree.traverseNodes().map(node => [
    node.value,
    valueOf(node.child),
    valueOf(node.sibling),
  ]).toArray()
}

describe('fiber 树', () => {
  it('空二叉树和空多叉树都得到空 Fiber 树', () => {
    const fromBinary = new FiberTree(new BinaryTree<number>())
    const fromMulti = new FiberTree<number>(createMultiNil())
    expect([
      isNil(fromBinary.root),
      [...fromBinary],
      isNil(fromMulti.root),
      [...fromMulti],
    ]).toStrictEqual([
      true,
      [],
      true,
      [],
    ])
  })

  it('二叉树的左孩子成为 child，右孩子成为它的 sibling', () => {
    const tree = new FiberTree(BinaryTree.from([1, 2, 3]))
    expect(linksOf(tree)).toStrictEqual([
      [1, 2, null],
      [2, null, 3],
      [3, null, null],
    ])
  })

  it('二叉树只有右孩子时，右孩子直接成为 child', () => {
    const tree = new FiberTree(BinaryTree.from([1, null, 3]))
    expect(linksOf(tree)).toStrictEqual([
      [1, 3, null],
      [3, null, null],
    ])
  })

  it('从二叉树建立后按先序遍历', () => {
    const tree = new FiberTree(BinaryTree.from([1, 2, 3, 4, 5, 6, 7, 8, 9]))
    expect([...tree]).toStrictEqual([1, 2, 4, 8, 9, 5, 3, 6, 7])
  })

  it('从多叉树建立后按先序遍历', () => {
    /**
     *    1
     *  / | \
     * 2  3  4
     *    |
     *    5
     */
    const tree = new FiberTree(multiTree(shape(1, shape(2), shape(3, shape(5)), shape(4))))
    expect([...tree]).toStrictEqual([1, 2, 3, 5, 4])
  })

  it('叶子没有 sibling 时沿 parent 连续上溯多层', () => {
    const tree = new FiberTree(deepChain())
    expect([...tree]).toStrictEqual([1, 2, 3, 4, 5])
  })

  it('从子树出发只遍历这棵子树，不走到 root 的 sibling', () => {
    const tree = new FiberTree(deepChain())
    const second = tree.traverseNodes().find(node => node.value === 2)!
    expect(traverseFiberTreeNode(second).map(node => node.value).toArray()).toStrictEqual([2, 3, 4])
  })

  it('每个 child 和 sibling 的 parent 都指向所属的父节点', () => {
    const tree = new FiberTree(BinaryTree.from([1, 2, 3, 4, 5, 6, 7]))
    const linked = tree.traverseNodes().every((node) => {
      let child = node.child
      while (!isNil(child)) {
        if (child.parent !== node)
          return false
        child = child.sibling
      }
      return true
    })
    expect(isNil(tree.root) || isNil(tree.root.parent)).toBe(true)
    expect(linked).toBe(true)
  })
})

import { FiberTree, traverseFiberTreeNode } from 'src/datastructure/tree/FiberTree'
import { BinaryTree } from 'src/datastructure/tree/BinaryTree'
import { TreeNode } from 'src/datastructure/node'

describe('FiberTree', () => {
  test('从二叉树创建FiberTree', () => {
    const fiberTree = new FiberTree(null)
    expect(fiberTree.root).toBeNull()

    const bt = new BinaryTree([1])
    const fiberTreeOneElement = new FiberTree(bt)
    expect(fiberTreeOneElement.root).toBeDefined()
    expect(fiberTreeOneElement.root?.value).toBe(1)

    const bt2 = new BinaryTree([1, 2, 3])
    const fiberTreeThreeElements = new FiberTree(bt2)
    expect([...fiberTreeThreeElements]).toStrictEqual([1, 2, 3])

    const nodeIterator = traverseFiberTreeNode(fiberTreeThreeElements.root)
    expect(nodeIterator.next().value.value).toBe(1)
    expect(nodeIterator.next().value.value).toBe(2)
    expect(nodeIterator.next().value.value).toBe(3)
    expect(nodeIterator.next().done).toBe(true)

    expect(fiberTreeThreeElements.root).toBeDefined()
    expect(fiberTreeThreeElements.root?.value).toBe(1)
    expect(fiberTreeThreeElements.root?.child?.value).toBe(2)
    expect(fiberTreeThreeElements.root?.child?.sibling?.value).toBe(3)
  })

  test('从二叉树创建FiberTree并遍历', () => {
    const bt = new BinaryTree([1, 2, 3, 4, 5, 6, 7, 8, 9])
    const fiberTree = new FiberTree(bt)
    expect(fiberTree).toBeDefined()

    expect([...fiberTree]).toStrictEqual([1, 2, 4, 8, 9, 5, 3, 6, 7])
  })

  test('从普通树创建FiberTree', () => {
    const nullFiberTree = new FiberTree(null)
    expect(nullFiberTree.root).toBeNull()

    const tree = new TreeNode(1, null)
    const fiberTreeOneElement = new FiberTree(tree)
    expect(fiberTreeOneElement.root).toBeDefined()
    expect(fiberTreeOneElement.root?.value).toBe(1)

    const fiberTree = new FiberTree(tree)
    expect(fiberTree).toBeDefined()
    expect([...fiberTree]).toStrictEqual([1])

    /**
     *    1
     *   / | \
     *  2  3  4
     *     |
     *    5
     */
    const tree2 = new TreeNode(1, null)
    tree2.children.push(new TreeNode(2, tree2))
    tree2.children.push(new TreeNode(3, tree2))
    tree2.children.push(new TreeNode(4, tree2))
    // tree2.children[1].children.push(new TreeNode(5, tree2.children[1]))
    const fiberTree2 = new FiberTree(tree2)
    expect(fiberTree2).toBeDefined()
    expect([...fiberTree2]).toStrictEqual([1, 2, 3, 4])
  })
})

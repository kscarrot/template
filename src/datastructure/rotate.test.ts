import type { BinaryItem, BinaryNode } from 'src/datastructure/Node'
import { createBinaryNil, createBinaryNode, isNil } from 'src/datastructure/Node'
import { rotateLeft, rotateRight, rotateUp } from 'src/datastructure/rotate'
import { traverseBinaryTreeNode } from 'src/datastructure/traverse'
import { BinaryTree } from 'src/datastructure/tree/BinaryTree'
import { expectTypeOf } from 'vitest'

/**
 * ```
 *      10
 *     /  \
 *    5    20
 *        /  \
 *      15    25
 * ```
 */
function buildTree() {
  const [n5, n10, n15, n20, n25] = BinaryTree.from([10, 5, 20, null, null, 15, 25]).traverseNodes()
  return { n5, n10, n15, n20, n25 }
}

function inOrder(root: BinaryItem<number>) {
  return traverseBinaryTreeNode(root).map(node => node.value).toArray()
}

describe('旋转函数', () => {
  it('左旋根节点返回升上来的右孩子，且它的 parent 指向哨兵', () => {
    const { n10, n20 } = buildTree()
    const top = rotateLeft(n10)
    expect(top).toBe(n20)
    expect(isNil(n20.parent)).toBe(true)
  })

  it('左旋后中序序列不变', () => {
    const { n10 } = buildTree()
    expect(inOrder(rotateLeft(n10))).toStrictEqual([5, 10, 15, 20, 25])
  })

  it('左旋后中间子树改挂到下沉节点的右边', () => {
    const { n10, n15, n20 } = buildTree()
    rotateLeft(n10)
    expect(n20.left).toBe(n10)
    expect(n10.parent).toBe(n20)
    expect(n10.right).toBe(n15)
    expect(n15.parent).toBe(n10)
  })

  it('右旋非根节点时祖父节点指向新子树根', () => {
    const { n10, n15, n20 } = buildTree()
    const top = rotateRight(n20)
    expect(top).toBe(n15)
    expect(n10.right).toBe(n15)
    expect(n15.parent).toBe(n10)
    expect(n15.right).toBe(n20)
    expect(n20.parent).toBe(n15)
    expect(isNil(n20.left)).toBe(true)
  })

  it('左旋后再右旋可以完全复原', () => {
    const { n5, n10, n15, n20, n25 } = buildTree()
    rotateRight(rotateLeft(n10))
    expect(isNil(n10.parent)).toBe(true)
    expect([n10.left, n10.right]).toStrictEqual([n5, n20])
    expect([n20.left, n20.right]).toStrictEqual([n15, n25])
    expect(n15.parent).toBe(n20)
  })

  it('缺少对应孩子时旋转会抛错', () => {
    const nil = createBinaryNil()
    const leaf = createBinaryNode(1, {}, nil, nil, nil)
    expect(() => rotateLeft(leaf)).toThrowError('no right child')
    expect(() => rotateRight(leaf)).toThrowError('no left child')
  })

  it('rotateUp 左孩子时对父节点右旋', () => {
    const { n10, n15, n20 } = buildTree()
    expect(rotateUp(n15)).toBe(n15)
    expect(n10.right).toBe(n15)
    expect(n15.right).toBe(n20)
  })

  it('rotateUp 右孩子时对父节点左旋', () => {
    const { n10, n20 } = buildTree()
    rotateUp(n20)
    expect(isNil(n20.parent)).toBe(true)
    expect(n20.left).toBe(n10)
  })

  it('rotateUp 根节点会抛错', () => {
    const { n10 } = buildTree()
    expect(() => rotateUp(n10)).toThrowError('already root')
  })

  it('旋转保留节点的 meta 类型', () => {
    const nil = createBinaryNil()
    const node = createBinaryNode(1, { height: 2 }, nil, nil, nil)
    node.right = createBinaryNode(2, { height: 1 }, node, nil, nil)
    expectTypeOf(rotateLeft(node)).toEqualTypeOf<BinaryNode<number, { height: number }>>()
  })
})

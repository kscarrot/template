import { rotateLeft, rotateRight, rotateUp } from 'src/datastructure/node/rotate'
import { AVLNode, BinaryTreeNode } from 'src/datastructure/node/TreeNode'
import { traverseBinaryTree, traverseBinaryTreeNode, valuesToBinaryTree } from 'src/datastructure/tree/BinaryTree'
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
  const [n5, n10, n15, n20, n25] = traverseBinaryTreeNode(valuesToBinaryTree([10, 5, 20, null, null, 15, 25]))
  return { n5, n10, n15, n20, n25 }
}

describe('旋转函数', () => {
  it('左旋根节点返回升上来的右孩子，且它成为新根', () => {
    const { n10, n20 } = buildTree()
    const top = rotateLeft(n10)
    expect(top).toBe(n20)
    expect(n20.parent).toBeNull()
  })

  it('左旋后中序序列不变', () => {
    const { n10 } = buildTree()
    const top = rotateLeft(n10)
    expect([
      ...traverseBinaryTree(top),
    ]).toStrictEqual([5, 10, 15, 20, 25])
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
    expect(n20.left).toBeNull()
  })

  it('左旋后再右旋可以完全复原', () => {
    const { n5, n10, n15, n20, n25 } = buildTree()
    rotateRight(rotateLeft(n10))
    expect(n10.parent).toBeNull()
    expect([n10.left, n10.right]).toStrictEqual([n5, n20])
    expect([n20.left, n20.right]).toStrictEqual([n15, n25])
    expect(n15.parent).toBe(n20)
  })

  it('缺少对应孩子时旋转会抛错', () => {
    const leaf = new BinaryTreeNode(1)
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
    expect(n20.parent).toBeNull()
    expect(n20.left).toBe(n10)
  })

  it('rotateUp 根节点会抛错', () => {
    const { n10 } = buildTree()
    expect(() => rotateUp(n10)).toThrowError('already root')
  })

  it('左旋保持 AVL 节点类型', () => {
    const node = new AVLNode(1)
    const right = new AVLNode(2, node)
    node.right = right
    expectTypeOf(rotateLeft(node)).toEqualTypeOf<AVLNode<number>>()
  })
})

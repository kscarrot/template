import { BinaryTreeNode } from 'src/datastructure/node/TreeNode'

describe('树节点', () => {
  it('创建二叉树节点', () => {
    const node = new BinaryTreeNode(1)
    expect(node.value).toBe(1)
    expect(node.parent).toBeNull()
    expect(node.isRoot).toBe(true)
    expect(node.isLeaf).toBe(true)
    expect(node.left).toBeNull()
    expect(node.right).toBeNull()
  })

  it('创建二叉树节点', () => {
    const node = new BinaryTreeNode(1, {
      parent: new BinaryTreeNode(2),
      left: new BinaryTreeNode(3),
      right: new BinaryTreeNode(4),
    })
    expect(node.value).toBe(1)
    expect(node.parent?.value).toBe(2)
    expect(node.left?.value).toBe(3)
    expect(node.right?.value).toBe(4)
  })
})

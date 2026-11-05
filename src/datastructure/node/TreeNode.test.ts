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

  it('创建带 parent/left/right 的二叉树节点', () => {
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

  it('叶子高度是 1', () => {
    expect(new BinaryTreeNode(1).getHeight()).toBe(1)
  })

  it('树高是左右子树较高一侧加 1', () => {
    const root = new BinaryTreeNode(2, {
      left: new BinaryTreeNode(1),
      right: new BinaryTreeNode(3, {
        right: new BinaryTreeNode(4),
      }),
    })
    expect(root.getHeight()).toBe(3)
  })
})

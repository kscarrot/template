import { valuesToBinaryTree, traverse, TraverseType, BinaryTree } from 'src/datastructure/tree/BinaryTree'

describe('二叉树', () => {
  it('二叉树的构建和遍历', () => {
    expect(valuesToBinaryTree([])).toBeNull()

    // 构建和验证二叉树
    const root = valuesToBinaryTree([1, 2, 3, 4, 5, 8, null, null, null, 6, 7, 9])
    expect(root).toBeDefined()
    expect(root?.left?.value).toBe(2)
    expect(root?.left?.left?.isLeaf).toBe(true)
    expect(root?.left?.right?.value).toBe(5)
    expect(root?.left?.right?.left?.value).toBe(6)
    expect(root?.left?.right?.right?.value).toBe(7)

    expect(root?.right?.left?.value).toBe(8)
    expect(root?.right?.left?.left?.value).toBe(9)
    expect(root?.right?.left?.left?.isLeaf).toBe(true)

    // 前序遍历
    const preOrder = Array.from(traverse(root, TraverseType.PRE_ORDER))
    expect(preOrder).toStrictEqual([1, 2, 4, 5, 6, 7, 3, 8, 9])

    // 中序遍历
    const inOrder = Array.from(traverse(root))
    expect(inOrder).toStrictEqual([4, 2, 6, 5, 7, 1, 9, 8, 3])

    // 后序遍历
    const postOrder = Array.from(traverse(root, TraverseType.POST_ORDER))
    expect(postOrder).toStrictEqual([4, 6, 7, 5, 2, 9, 8, 3, 1])
  })

  it('二叉树类 基本功能测试', () => {
    // 空二叉树
    const emptyBinaryTree = new BinaryTree([])
    expect(emptyBinaryTree.size).toBe(0)
    expect(emptyBinaryTree.isEmpty).toBe(true)
    expect([...emptyBinaryTree]).toStrictEqual([])

    // 构建和验证普通二叉树
    /**
     *       1
     *      / \
     *     2   3
     *    / \ / \
     *   4  5 6  7
     *  / \
     * 8   9
     */
    const binaryTree = new BinaryTree([1, 2, 3, 4, 5, 6, 7, 8, 9])
    // 默认中序遍历
    expect([...binaryTree]).toStrictEqual([8, 4, 9, 2, 5, 1, 6, 3, 7])
    expect(binaryTree.size).toBe(9)
    expect(binaryTree.isEmpty).toBe(false)
  })

  describe('打印验证', () => {
    let consoleSpy: jest.SpyInstance

    beforeEach(() => {
      consoleSpy = jest.spyOn(console, 'log').mockImplementation()
    })

    afterEach(() => {
      consoleSpy.mockRestore()
    })

    it('空树打印', () => {
      const emptyTree = new BinaryTree([])
      emptyTree.print()

      expect(consoleSpy).toHaveBeenCalledWith('(空树)')
    })

    it('普通二叉树打印', () => {
      const tree = new BinaryTree([1, 2, 3, 4, 5, null, 7])
      tree.print()

      expect(consoleSpy).toHaveBeenCalledWith('└─1')
      expect(consoleSpy).toHaveBeenCalledWith('   ├─3')
      expect(consoleSpy).toHaveBeenCalledWith('   │  └─7')
      expect(consoleSpy).toHaveBeenCalledWith('   └─2')
      expect(consoleSpy).toHaveBeenCalledWith('      ├─5')
      expect(consoleSpy).toHaveBeenCalledWith('      └─4')
    })

    it('打印包含空节点的二叉树', () => {
      const tree = new BinaryTree([1, 2, 3, 4, 5, null, 7])
      tree.print({ showNull: true })

      expect(consoleSpy).toHaveBeenCalledWith('└─1')
      expect(consoleSpy).toHaveBeenCalledWith('   ├─3')
      expect(consoleSpy).toHaveBeenCalledWith('   │  └─7')
      expect(consoleSpy).toHaveBeenCalledWith('   │     └─null')
      expect(consoleSpy).toHaveBeenCalledWith('   │     └─null')
      expect(consoleSpy).toHaveBeenCalledWith('   │  └─null')
      expect(consoleSpy).toHaveBeenCalledWith('   └─2')
      expect(consoleSpy).toHaveBeenCalledWith('      ├─5')
      expect(consoleSpy).toHaveBeenCalledWith('      │  └─null')
      expect(consoleSpy).toHaveBeenCalledWith('      │  └─null')
      expect(consoleSpy).toHaveBeenCalledWith('      └─4')
      expect(consoleSpy).toHaveBeenCalledWith('         └─null')
      expect(consoleSpy).toHaveBeenCalledWith('         └─null')
    })

    it('打印平衡二叉树', () => {
      const tree = new BinaryTree([1, 2, 3, 4, 5, 6, 7])
      tree.print()

      expect(consoleSpy).toHaveBeenCalledWith('└─1')
      expect(consoleSpy).toHaveBeenCalledWith('   ├─3')
      expect(consoleSpy).toHaveBeenCalledWith('   │  ├─7')
      expect(consoleSpy).toHaveBeenCalledWith('   │  └─6')
      expect(consoleSpy).toHaveBeenCalledWith('   └─2')
      expect(consoleSpy).toHaveBeenCalledWith('      ├─5')
      expect(consoleSpy).toHaveBeenCalledWith('      └─4')
    })

    it('打印左偏树', () => {
      const tree = new BinaryTree([1, 2, null, 4, 5])
      tree.print()

      expect(consoleSpy).toHaveBeenCalledWith('└─1')
      expect(consoleSpy).toHaveBeenCalledWith('   └─2')
      expect(consoleSpy).toHaveBeenCalledWith('      ├─5')
      expect(consoleSpy).toHaveBeenCalledWith('      └─4')
    })

    it('打印右偏树', () => {
      const tree = new BinaryTree([1, null, 3, null, null, 6, 7])
      tree.print()

      expect(consoleSpy).toHaveBeenCalledWith('└─1')
      expect(consoleSpy).toHaveBeenCalledWith('   └─3')
      expect(consoleSpy).toHaveBeenCalledWith('      ├─7')
      expect(consoleSpy).toHaveBeenCalledWith('      └─6')
    })

    it('打印单节点树', () => {
      const tree = new BinaryTree([42])
      tree.print()

      expect(consoleSpy).toHaveBeenCalledWith('└─42')
    })

    it('打印大型二叉树', () => {
      const tree = new BinaryTree([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15])
      tree.print()

      expect(consoleSpy).toHaveBeenCalledWith('└─1')
      expect(consoleSpy).toHaveBeenCalledWith('   ├─3')
      expect(consoleSpy).toHaveBeenCalledWith('   │  ├─7')
      expect(consoleSpy).toHaveBeenCalledWith('   │  │  ├─15')
      expect(consoleSpy).toHaveBeenCalledWith('   │  │  └─14')
      expect(consoleSpy).toHaveBeenCalledWith('   │  └─6')
      expect(consoleSpy).toHaveBeenCalledWith('   │     ├─13')
      expect(consoleSpy).toHaveBeenCalledWith('   │     └─12')
      expect(consoleSpy).toHaveBeenCalledWith('   └─2')
      expect(consoleSpy).toHaveBeenCalledWith('      ├─5')
      expect(consoleSpy).toHaveBeenCalledWith('      │  ├─11')
      expect(consoleSpy).toHaveBeenCalledWith('      │  └─10')
      expect(consoleSpy).toHaveBeenCalledWith('      └─4')
      expect(consoleSpy).toHaveBeenCalledWith('         ├─9')
      expect(consoleSpy).toHaveBeenCalledWith('         └─8')
    })

    it('使用默认选项', () => {
      const tree = new BinaryTree([1, 2, 3])
      tree.print()

      // 应该不显示null节点（默认showNull: false）
      expect(consoleSpy).not.toHaveBeenCalledWith(expect.stringContaining('null'))
    })

    it('处理只有空值的树', () => {
      const tree = new BinaryTree([null])
      tree.print()

      expect(consoleSpy).toHaveBeenCalledWith('(空树)')
    })
  })
})

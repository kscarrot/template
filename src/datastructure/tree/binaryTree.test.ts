import { valuesToBinaryTree, traverse, TraverseType } from 'src/datastructure/tree/binaryTree'

describe('binaryTree', () => {
  it('valuesToBinaryTree and traverse', () => {
    expect(valuesToBinaryTree([])).toBeNull()

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

    const preOrder = Array.from(traverse(root, TraverseType.PRE_ORDER))
    expect(preOrder).toStrictEqual([1, 2, 4, 5, 6, 7, 3, 8, 9])

    const inOrder = Array.from(traverse(root))
    expect(inOrder).toStrictEqual([4, 2, 6, 5, 7, 1, 9, 8, 3])

    const postOrder = Array.from(traverse(root, TraverseType.POST_ORDER))
    expect(postOrder).toStrictEqual([4, 6, 7, 5, 2, 9, 8, 3, 1])
  })
})

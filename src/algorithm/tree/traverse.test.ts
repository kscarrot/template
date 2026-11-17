import type { BinaryItem, BinaryNode, SinglyItem, SinglyNode } from 'src/datastructure/Node'
import { bfs, dfs, dfsr, traverseLines } from 'src/algorithm/tree/traverse'
import { createBinaryNil, createBinaryNode, createSinglyNil, createSinglyNode } from 'src/datastructure/Node'
import { BinaryTree } from 'src/datastructure/tree/BinaryTree'
import { expectTypeOf } from 'vitest'

it('遇到哨兵就停止', () => {
  const nil = createSinglyNil()
  const head = createSinglyNode(1, createSinglyNode(2, nil))
  const values = [
    ...traverseLines(head),
  ].map(node => node.value)
  expect(values).toStrictEqual([1, 2])
})

it('环上最多走 maxStep 步', () => {
  const nil = createSinglyNil()
  const head = createSinglyNode(1, nil)
  head.next = head
  const values = [
    ...traverseLines(head, 3),
  ].map(node => node.value)
  expect(values).toStrictEqual([1, 1, 1])
})

it('头节点是数据节点或联合类型时都产出数据节点', () => {
  const nil = createSinglyNil()
  const node = createSinglyNode(1, nil)
  const item: SinglyItem<number> = node
  expectTypeOf(traverseLines(node)).toEqualTypeOf<Generator<SinglyNode<number>>>()
  expectTypeOf(traverseLines(item)).toEqualTypeOf<Generator<SinglyNode<number>>>()
})

/**
 * ```
 *     1
 *    / \
 *   2   3
 *  / \   \
 * 4   5   6
 * ```
 */
function sampleTree() {
  return BinaryTree.from([1, 2, 3, 4, 5, null, 6]).root
}

it('广度优先按层从左到右', () => {
  expect([
    ...bfs(sampleTree()),
  ].map(node => node.value)).toStrictEqual([1, 2, 3, 4, 5, 6])
})

it('迭代深度优先是先序', () => {
  expect([
    ...dfs(sampleTree()),
  ].map(node => node.value)).toStrictEqual([1, 2, 4, 5, 3, 6])
})

it('递归深度优先是先序', () => {
  expect([
    ...dfsr(sampleTree()),
  ].map(node => node.value)).toStrictEqual([1, 2, 4, 5, 3, 6])
})

it('空树不产出节点', () => {
  const nil = createBinaryNil()
  expect([
    [
      ...bfs(nil),
    ],
    [
      ...dfs(nil),
    ],
    [
      ...dfsr(nil),
    ],
  ]).toStrictEqual([[], [], []])
})

it('根节点是数据节点或联合类型时都产出数据节点', () => {
  const nil = createBinaryNil()
  const node = createBinaryNode<number, EmptyMeta>(1, {}, nil, nil, nil)
  const item: BinaryItem<number> = node
  expectTypeOf(bfs(node)).toEqualTypeOf<Generator<BinaryNode<number>>>()
  expectTypeOf(dfs(item)).toEqualTypeOf<Generator<BinaryNode<number>>>()
  expectTypeOf(dfsr(item)).toEqualTypeOf<Generator<BinaryNode<number>>>()
})

import type { SinglyItem, SinglyNode } from 'src/datastructure/Node'
import { createSinglyNil, createSinglyNode } from 'src/datastructure/Node'
import { traverseLines } from 'src/datastructure/traverse'
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

import type { Nil, Node } from 'src/datastructure/Node'
import { isNil } from 'src/datastructure/Node'

function isNode<Item extends Node<unknown, unknown> | Nil>(node: Item): node is Exclude<Item, Nil> {
  return !isNil(node)
}

export function* traverseLines<Item extends (Node<unknown, unknown> | Nil) & { next: Item }>(
  head: NoInfer<Item> & { next: Item },
  maxStep = 1000,
): Generator<Exclude<Item, Nil>> {
  let current = head
  for (let step = 0; step < maxStep; step++) {
    if (!isNode(current))
      return
    yield current
    current = current.next
  }
}

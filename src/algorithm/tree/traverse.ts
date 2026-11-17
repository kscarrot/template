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

export const E_TraverseType = {
  /** 前序遍历 */
  PRE_ORDER: 'preOrder',
  /** 中序遍历 */
  IN_ORDER: 'inOrder',
  /** 后序遍历 */
  POST_ORDER: 'postOrder',
} as const

export type TraverseType = ValueOf<typeof E_TraverseType>

export function* traverseBinaryTreeNode<Item extends (Node<unknown, unknown> | Nil) & { left: Item, right: Item }>(
  root: NoInfer<Item> & { left: Item, right: Item },
  type: TraverseType = E_TraverseType.IN_ORDER,
): Generator<Exclude<Item, Nil>> {
  function* order(current: Item): Generator<Exclude<Item, Nil>> {
    if (!isNode(current))
      return
    if (type === E_TraverseType.PRE_ORDER)
      yield current
    yield* order(current.left)
    if (type === E_TraverseType.IN_ORDER)
      yield current
    yield* order(current.right)
    if (type === E_TraverseType.POST_ORDER)
      yield current
  }
  yield* order(root)
}

/**
 * 广度优先：队列从左到右逐层访问
 */
export function* bfs<Item extends (Node<unknown, unknown> | Nil) & { left: Item, right: Item }>(
  root: NoInfer<Item> & { left: Item, right: Item },
): Generator<Exclude<Item, Nil>> {
  const queue: Array<Exclude<Item, Nil>> = []
  if (isNode(root))
    queue.push(root)
  for (let index = 0; index < queue.length; index++) {
    const node = queue[index]
    yield node
    if (isNode(node.left))
      queue.push(node.left)
    if (isNode(node.right))
      queue.push(node.right)
  }
}

/**
 * 深度优先，迭代先序：先压右孩子，弹出时先走到左孩子
 */
export function* dfs<Item extends (Node<unknown, unknown> | Nil) & { left: Item, right: Item }>(
  root: NoInfer<Item> & { left: Item, right: Item },
): Generator<Exclude<Item, Nil>> {
  const stack: Array<Exclude<Item, Nil>> = []
  if (isNode(root))
    stack.push(root)
  let node = stack.pop()
  while (node) {
    yield node
    if (isNode(node.right))
      stack.push(node.right)
    if (isNode(node.left))
      stack.push(node.left)
    node = stack.pop()
  }
}

/**
 * 深度优先，递归先序
 */
export function* dfsr<Item extends (Node<unknown, unknown> | Nil) & { left: Item, right: Item }>(
  root: NoInfer<Item> & { left: Item, right: Item },
): Generator<Exclude<Item, Nil>> {
  if (!isNode(root))
    return
  yield root
  yield* dfsr(root.left)
  yield* dfsr(root.right)
}

/**
 * Fiber 树的先序遍历：有 child 先走 child；没有就沿 parent 往上，走第一个带 sibling 的节点的 sibling
 * 回到 root 时结束，root 自己的 sibling 不属于这棵子树
 */
export function* traverseFiberTreeNode<Item extends (Node<unknown, unknown> | Nil) & { parent: Item, child: Item, sibling: Item }>(
  root: NoInfer<Item> & { parent: Item, child: Item, sibling: Item },
): Generator<Exclude<Item, Nil>> {
  let current = root
  while (isNode(current)) {
    yield current
    if (isNode(current.child)) {
      current = current.child
      continue
    }
    let ancestor: Item = current
    while (isNode(ancestor) && ancestor !== root && !isNode(ancestor.sibling))
      ancestor = ancestor.parent
    if (!isNode(ancestor) || ancestor === root)
      return
    current = ancestor.sibling
  }
}

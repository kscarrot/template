// ============================================================================
// 0. 通用基类与空标记
// ============================================================================

export type EmptyMeta = Record<string, never>

export const E_NodeKind = {
  nil: 'nil',
  singly: 'singly-node',
  doubly: 'doubly-node',
  binary: 'binary-node',
  multi: 'multi-node',
} as const

export type NodeKind = ValueOf<typeof E_NodeKind>

export type DataNodeKind = Exclude<NodeKind, typeof E_NodeKind.nil>

export interface Node<Data, Meta = EmptyMeta> {
  value: Data
  meta: Meta
  readonly kind: DataNodeKind
}

export interface Nil {
  readonly kind: typeof E_NodeKind.nil
}

export function isNil<Data, Meta>(node: Node<Data, Meta> | Nil): node is Nil {
  return node.kind === E_NodeKind.nil
}

// ============================================================================
// 1. 单向链表 (Singly Linked List)
// ============================================================================

export interface SinglyNil extends Nil {
  next: SinglyNil
}

export interface SinglyNode<Data, Meta = EmptyMeta> extends Node<Data, Meta> {
  kind: typeof E_NodeKind.singly
  next: SinglyItem<Data, Meta>
}

export type SinglyItem<Data, Meta = EmptyMeta>
  = | SinglyNode<Data, Meta>
    | SinglyNil

// ============================================================================
// 2. 双向链表 (Doubly Linked List)
// ============================================================================

export interface DoublyNil extends Nil {
  next: DoublyNil
  prev: DoublyNil
}

export interface DoublyNode<Data, Meta = EmptyMeta> extends Node<Data, Meta> {
  readonly kind: typeof E_NodeKind.doubly
  next: DoublyItem<Data, Meta>
  prev: DoublyItem<Data, Meta>
}

export type DoublyItem<Data, Meta = EmptyMeta>
  = | DoublyNode<Data, Meta>
    | DoublyNil

// ============================================================================
// 3. 二叉树 (Binary Tree)
// ============================================================================

export interface BinaryNil extends Nil {
  parent: BinaryNil
  left: BinaryNil
  right: BinaryNil
}

export interface BinaryNode<Data, Meta = EmptyMeta> extends Node<Data, Meta> {
  readonly kind: typeof E_NodeKind.binary
  parent: BinaryItem<Data, Meta>
  left: BinaryItem<Data, Meta>
  right: BinaryItem<Data, Meta>
}

export type BinaryItem<Data, Meta = EmptyMeta>
  = | BinaryNode<Data, Meta>
    | BinaryNil

// ============================================================================
// 4. 多叉树 (Multi-way Tree)
// ============================================================================

export interface MultiNil extends Nil {
  parent: MultiNil
  children: []
}

export interface MultiNode<Data, Meta = EmptyMeta> extends Node<Data, Meta> {
  readonly kind: typeof E_NodeKind.multi
  parent: MultiItem<Data, Meta>
  children: MultiNode<Data, Meta>[]
}

export type MultiItem<Data, Meta = EmptyMeta>
  = | MultiNode<Data, Meta>
    | MultiNil

// ============================================================================
// 5. 创建空节点
// ============================================================================

export function createSinglyNil(): SinglyNil {
  const nil: SinglyNil = {
    kind: E_NodeKind.nil,
    get next() {
      return nil
    },
    set next(value) {
      if (value !== nil)
        throw new TypeError('SinglyNil.next 只能指向自己')
    },
  }
  return nil
}

export function createSinglyNode<Data>(value: Data, next: SinglyItem<Data>): SinglyNode<Data> {
  return {
    kind: E_NodeKind.singly,
    value,
    meta: {},
    next,
  }
}

export function createDoublyNil(): DoublyNil {
  const nil: DoublyNil = {
    kind: E_NodeKind.nil,
    get next() {
      return nil
    },
    set next(value) {
      if (value !== nil)
        throw new TypeError('DoublyNil.next 只能指向自己')
    },
    get prev() {
      return nil
    },
    set prev(value) {
      if (value !== nil)
        throw new TypeError('DoublyNil.prev 只能指向自己')
    },
  }
  return nil
}

export function createDoublyNode<Data>(value: Data, next: DoublyItem<Data>, prev: DoublyItem<Data>): DoublyNode<Data> {
  return {
    kind: E_NodeKind.doubly,
    value,
    meta: {},
    next,
    prev,
  }
}

export function createBinaryNil(): BinaryNil {
  const nil: BinaryNil = {
    kind: E_NodeKind.nil,
    get parent() {
      return nil
    },
    set parent(value) {
      if (value !== nil)
        throw new TypeError('BinaryNil.parent 只能指向自己')
    },
    get left() {
      return nil
    },
    set left(value) {
      if (value !== nil)
        throw new TypeError('BinaryNil.left 只能指向自己')
    },
    get right() {
      return nil
    },
    set right(value) {
      if (value !== nil)
        throw new TypeError('BinaryNil.right 只能指向自己')
    },
  }
  return nil
}

export function createMultiNil(): MultiNil {
  const children: [] = []
  const nil: MultiNil = {
    kind: E_NodeKind.nil,
    get parent() {
      return nil
    },
    set parent(value) {
      if (value !== nil)
        throw new TypeError('MultiNil.parent 只能指向自己')
    },
    get children() {
      return children
    },
    set children(value) {
      if (value !== children)
        throw new TypeError('MultiNil.children 只能是空数组')
    },
  }
  Object.freeze(children)
  return nil
}

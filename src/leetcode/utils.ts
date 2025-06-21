export class ListNode {
  val: number
  next: ListNode | null
  constructor(val: number) {
    this.val = val
    this.next = null
  }
}

export function chunkArray<T>(arr: T[], size: number): T[][] {
  const result: T[][] = []
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size))
  }
  return result
}

export function arrayToLinkList(arr: number[]): ListNode | null {
  if (arr.length === 0) return null
  const arrayNodes = arr.map((val) => new ListNode(val))
  let head = arrayNodes[0]
  arrayNodes.slice(1).reduce((prev, current) => {
    prev.next = current
    return current
  }, head)
  return head
}

export function linkListToArray(head: ListNode | null): number[] {
  const result: number[] = []
  let current = head
  while (current) {
    result.push(current.val)
    current = current.next
  }
  return result
}

/**
 * @description: 缓存装饰器
 * @param fn 需要缓存的函数
 * @param initCache 初始缓存 key-TResult
 * @param getKey 自定义 key 计算函数
 * @returns 缓存后的函数
 */
export const memo = <TArgs extends any[], TResult>(
  fn: (...args: TArgs) => TResult,
  initCache: Record<string, TResult> = {},
  getKey: (...args: TArgs) => string = (...args) => JSON.stringify(args),
) => {
  const cache = new Map<string, TResult>(Object.entries(initCache))
  const memoizedFn = (...args: TArgs): TResult => {
    const key = getKey(...args)
    if (cache.has(key)) {
      return cache.get(key) as TResult
    }
    const result = fn(...args)
    cache.set(key, result)
    return result
  }

  return memoizedFn
}

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
 * @description: 参考Python3的 cache 装饰器，实现一个缓存装饰器
 * @param fn 需要缓存的函数
 * @param getKey 自定义 key 计算函数
 * @returns 缓存后的函数
 */
export function cacheFn<T extends (...args: any[]) => any>(
  fn: T,
  getKey: (...args: any[]) => any = (...args) => JSON.stringify(args),
  initCache: Record<string, any> = {},
): T {
  const cache = new Map<string, any>(Object.entries(initCache))

  const cachedFn = (...args: any[]): any => {
    const key = getKey(...args)

    if (cache.has(key)) {
      return cache.get(key)
    }

    const result = fn(...args)
    cache.set(key, result)
    return result
  }

  return cachedFn as T
}

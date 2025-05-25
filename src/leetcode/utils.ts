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

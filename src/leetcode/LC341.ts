/**
 * @name: 扁平化嵌套列表迭代器
 * @level: 中等
 * @link: https://leetcode.cn/problems/flatten-nested-list-iterator
 * @description: 给你一个嵌套的整数列表 nestedList 。请你设计一个迭代器，使其能够遍历这个列表中的所有整数。
 */

type NestedInteger = {
  isInteger: () => boolean
  getInteger: () => number
  getList: () => NestedInteger[]
}

function* NestedIntegerIterator(nestedList: NestedInteger[]): Generator<number> {
  for (const nestedInteger of nestedList) {
    if (nestedInteger.isInteger()) {
      yield nestedInteger.getInteger()
    } else {
      yield* NestedIntegerIterator(nestedInteger.getList())
    }
  }
}

class NestedIterator {
  private iterator: Generator<number>
  private nextValue: number | null = null
  constructor(nestedList: NestedInteger[]) {
    this.iterator = NestedIntegerIterator(nestedList)
  }

  hasNext(): boolean {
    const { value, done } = this.iterator.next()
    this.nextValue = value
    return !done
  }

  next(): number {
    return this.nextValue as number
  }
}

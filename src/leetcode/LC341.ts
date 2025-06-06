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

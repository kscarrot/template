/**
 * @link: https://leetcode.cn/problems/min-stack/
 * @description: 设计一个支持 push ，pop ，top 操作，并能在常数时间内检索到最小元素的栈。
 */
class MinStack {
  #stack: number[] = []
  #minStack: number[] = []

  push(val: number): void {
    this.#stack.push(val)
    if (this.#minStack.length === 0 || (this.#minStack.at(-1) as number) >= val) {
      this.#minStack.push(val)
    }
  }

  pop(): void {
    const val = this.#stack.pop()
    if (val === (this.#minStack.at(-1) as number)) {
      this.#minStack.pop()
    }
  }

  top(): number {
    return this.#stack.at(-1) as number
  }

  getMin(): number {
    return this.#minStack.at(-1) as number
  }
}

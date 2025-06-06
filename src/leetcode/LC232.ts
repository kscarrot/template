/**
 * @link: https://leetcode.cn/problems/implement-queue-using-stacks/
 * @description: 用栈实现队列
 */
class MyQueue {
  private stack: number[] = []
  private stackTemp: number[] = []
  constructor() {}

  get size(): number {
    return this.stack.length
  }

  push(x: number): void {
    // 入队时，将新元素压入栈底
    while (!this.empty()) {
      this.stackTemp.push(this.stack.pop() as number)
    }
    this.stack.push(x)
    while (this.stackTemp.length > 0) {
      this.stack.push(this.stackTemp.pop() as number)
    }
  }

  pop(): number {
    if (this.empty()) {
      throw new Error('Queue is empty')
    } else {
      return this.stack.pop() as number
    }
  }

  peek(): number {
    if (this.empty()) {
      throw new Error('Queue is empty')
    } else {
      return this.stack[this.stack.length - 1]
    }
  }

  empty(): boolean {
    return this.size === 0
  }
}

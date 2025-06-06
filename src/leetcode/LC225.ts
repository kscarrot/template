/**
 * @link: https://leetcode.cn/problems/implement-stack-using-queues/
 * @description: 用队列实现栈
 */
class MyStack {
  private queue: number[] = []
  constructor() {}

  get size(): number {
    return this.queue.length
  }

  push(x: number): void {
    this.queue.push(x)
    //把入栈的元素始终保持在队首即可
    for (let i = this.size - 1; i > 0; i--) {
      this.queue.push(this.queue.shift() as number)
    }
  }

  pop(): number {
    if (this.empty()) {
      throw new Error('Stack is empty')
    } else {
      return this.queue.shift() as number
    }
  }

  top(): number {
    if (this.empty()) {
      throw new Error('Stack is empty')
    } else {
      return this.queue[0]
    }
  }

  empty(): boolean {
    return this.size === 0
  }
}

// Monkey('Alan').eat('Banana').sleep(4).eat('Apple').sleep(5).eat('Pear');
// my name is Alan
// I eat Banana
// 等待 4s
// I eat Apple
// 等待 5s
// I eat Pear

class Monkey {
  #queue: (() => Promise<void>)[] = []
  #isRunning = false
  constructor(name: string) {
    console.log(`my name is ${name}`)
  }

  eat(food: string) {
    this.#queue.push(() => {
      console.log(`I eat ${food}`)
      return Promise.resolve()
    })
    this.run()
    return this
  }

  sleep(seconds: number) {
    this.#queue.push(() => {
      console.log(`等待 ${seconds}s`)
      return new Promise((resolve) =>
        setTimeout(() => {
          resolve()
          this.run()
        }, seconds * 1000),
      )
    })
    return this
  }

  async run() {
    if (this.#queue.length > 0 && !this.#isRunning) {
      this.#isRunning = true
      const task = this.#queue.shift() as () => Promise<void>
      await task()
      this.#isRunning = false
      this.run()
    }
  }
}

const monkey = new Monkey('Alan')
monkey.eat('Banana').sleep(4).eat('Apple').sleep(5).eat('Pear')

import { memo } from './utils'

/**
 * @name: 斐波那契数
 * @level: 简单
 * @link: https://leetcode.cn/problems/fibonacci-number
 * @description: 斐波那契数 （通常用 F(n) 表示）形成的序列称为 斐波那契数列 。该数列由 0 和 1 开始，后面的每一项数字都是前面两项数字的和。也就是：
 * @param {number} n
 * @return {number}
 */
function fib(n: number): number {
  const dfs = memo(
    // 递推式
    (n: number): number => dfs(n - 1) + dfs(n - 2),
    // 初始值
    {
      0: 0,
      1: 1,
    },
    //缓存key
    (n: number) => n.toString(),
  )
  return dfs(n)
}

export { fib }

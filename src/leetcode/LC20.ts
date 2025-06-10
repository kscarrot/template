/**
 * @name: 有效的括号
 * @level: 简单
 * @link: https://leetcode.cn/problems/valid-parentheses
 * @description: 给定一个只包括 '(', ')', '{', '}', '[', ']' 的字符串 s ，判断字符串是否有效。
 * @param {string} s
 * @return {boolean}
 */
function isValid(s: string): boolean {
  const stack: string[] = []
  const isLeft = (char: string) => ['(', '{', '['].includes(char)
  const parenthesesMap = {
    '(': ')',
    '{': '}',
    '[': ']',
  }
  for (const char of s) {
    if (isLeft(char)) {
      stack.push(char)
    } else {
      if (stack.length === 0) return false
      const top = stack.pop()
      if (parenthesesMap[top as keyof typeof parenthesesMap] !== char) return false
    }
  }
  return stack.length === 0
}

export default isValid

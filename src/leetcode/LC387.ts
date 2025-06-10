/**
 * @name: 字符串中的第一个唯一字符
 * @level: 简单
 * @link: https://leetcode.cn/problems/first-unique-character-in-a-string
 * @description: 给定一个字符串 s ，找到它的第一个不重复的字符，并返回它的索引。如果不存在，则返回 -1 。
 * @param {string} s
 * @return {number}
 */
function firstUniqChar(s: string): number {
  const map = new Map<string, number[]>()
  for (let i = 0; i < s.length; i++) {
    const char = s[i]
    if (map.has(char)) {
      map.get(char)!.push(i)
    } else {
      map.set(char, [i])
    }
  }
  for (const [_, indices] of map) {
    if (indices.length === 1) return indices[0]
  }
  return -1
}

export default firstUniqChar

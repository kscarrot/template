/**
 * @link: https://leetcode.cn/problems/remove-all-adjacent-duplicates-in-string/
 * @description: 给出由小写字母组成的字符串 S，重复项删除操作会选择两个相邻且相同的字母，并删除它们。
 * @param {string} s
 * @return {string}
 */
function removeDuplicates(s: string): string {
  const stack: string[] = []
  for (const char of s) {
    if (stack.length > 0 && stack.at(-1) === char) {
      stack.pop()
    } else {
      stack.push(char)
    }
  }
  return stack.join('')
}

export { removeDuplicates }

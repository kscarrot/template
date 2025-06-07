/**
 * @link: https://leetcode.cn/problems/count-number-of-texts/
 * @description: 给你一个字符串 pressedKeys，表示只包含数字 '2' 到 '9' 的字符串，返回按键的 总 可能组合数。
 * @param {string} pressedKeys
 * @return {number}
 */
function countTexts(pressedKeys: string): number {
  const strLength = pressedKeys.length
  const dp = Array(strLength + 1).fill(0)

  const MOD = 1e9 + 7
  dp[0] = 1
  dp[1] = 1
  for (let i = 1; i <= strLength; i++) {
    const char = pressedKeys[i - 1]
    // 单个字符
    dp[i] = dp[i - 1]

    // 两个连续相同字符
    if (i >= 2 && pressedKeys[i - 2] === char) {
      dp[i] = (dp[i] + dp[i - 2]) % MOD
    }

    // 三个连续相同字符
    if (i >= 3 && pressedKeys[i - 2] === char && pressedKeys[i - 3] === char) {
      dp[i] = (dp[i] + dp[i - 3]) % MOD
    }

    // 四个连续相同字符且为7或9
    if (
      (char === '7' || char === '9') &&
      i >= 4 &&
      pressedKeys[i - 4] === char &&
      pressedKeys[i - 3] === char &&
      pressedKeys[i - 2] === char &&
      pressedKeys[i - 1] === char
    ) {
      dp[i] = (dp[i] + dp[i - 4]) % MOD
    }
  }
  return dp[strLength]
}

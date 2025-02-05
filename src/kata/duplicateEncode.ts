/**
 * @link https://www.codewars.com/kata/54b42f9314d9229fd6000d9c/train/typescript
 */
export function duplicateEncode(word: string) {
  const lowerCaseString = word.toLocaleLowerCase()

  const map = new Map()
  for (const letter of lowerCaseString) {
    if (map.has(letter)) {
      map.set(letter, ')')
    } else {
      map.set(letter, '(')
    }
  }

  let result = ''
  for (const letter of lowerCaseString) {
    result = `${result}${map.get(letter)}`
  }

  return result
}

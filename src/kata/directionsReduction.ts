/**
 * @link https://www.codewars.com/kata/550f22f4d758534c1100025a/train/typescript
 * @mark 括号匹配换皮问题
 * @description
 * 这里有一个利用replace的解法
 * 可以参考: https://www.codewars.com/kata/reviews/5888ba59ea41d5095c0006a4/groups/5d979bfce1cd9d00016cd740
 */

export function dirReduc(arr: string[]): string[] {
  const OppositeDirectionMap = {
    NORTH: 'SOUTH',
    SOUTH: 'NORTH',
    EAST: 'WEST',
    WEST: 'EAST',
  }

  type directionType = keyof typeof OppositeDirectionMap

  let directionStack: string[] = []

  for (const element of arr) {
    const topStackElement = directionStack.at(-1)
    if (topStackElement === OppositeDirectionMap[element as directionType]) {
      directionStack.pop()
    } else {
      directionStack.push(element)
    }
  }

  return directionStack
}

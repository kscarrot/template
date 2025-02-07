/**
 * @link https://www.codewars.com/kata/5270d0d18625160ada0000e4/typescript
 * @mark 试了下grouBy新特性 map有点丑陋 通用是用除余来判断 这里把条件写到map里了
 */
export function score(dice: number[]): number {
  // Fill me in!
  const scoreMap: Record<string, number> = {
    '1': 100,
    '11': 200,
    '111': 1000,
    '1111': 1100,
    '11111': 1200,
    '5': 50,
    '55': 100,
    '555': 500,
    '5555': 550,
    '55555': 600,
    '666': 600,
    '444': 400,
    '333': 300,
    '222': 200,
  }

  return Object.values(Object.groupBy(dice, (v) => v))
    .map((sameArray) => sameArray?.join(''))
    .map((str) => scoreMap[str ?? ''] ?? 0)
    .reduce((sum, current) => (sum += current), 0)
}

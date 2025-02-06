/**
 * @link https://www.codewars.com/kata/51e0007c1f9378fa810002a9/typescript
 *
 */
/** return the output array and ignore all non-op characters */
export function parse(data: string): number[] {
  const opArray = [...data.replaceAll(/[^a-z]/g, '')]
  const result = opArray.reduce<{ output: number[]; value: number }>(
    (sum, currentOp: string) => {
      switch (currentOp) {
        case 'i':
          sum.value += 1
          break
        case 'd':
          sum.value -= 1
          break
        case 's':
          sum.value = sum.value ** 2
          break
        case 'o':
          sum.output.push(sum.value)
          break
        default:
          break
      }
      return sum
    },
    { output: [], value: 0 },
  )

  return result.output
}

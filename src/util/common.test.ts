import { assertIndex } from 'src/util/common'

it('下标在闭区间内通过', () => {
  expect(() => assertIndex(0, 0, 2)).not.toThrow()
  expect(() => assertIndex(2, 0, 2)).not.toThrow()
})

it('下标越界或不是整数时抛出 RangeError', () => {
  expect(() => assertIndex(-1, 0, 2)).toThrow(RangeError)
  expect(() => assertIndex(3, 0, 2)).toThrow(RangeError)
  expect(() => assertIndex(1.5, 0, 2)).toThrow(RangeError)
})

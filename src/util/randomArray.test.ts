import { randomArray } from 'src/util/randomArray'

it('should be empty', () => {
  expect(randomArray(-1)).toStrictEqual([])
})

it('should be interger', () => {
  expect(randomArray(3.5).length).toBe(3)
})

it('normal case', () => {
  expect(randomArray(10).length).toBe(10)
})

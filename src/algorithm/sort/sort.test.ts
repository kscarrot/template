import {
  binaryInsertionSort,
  bubbleSort,
  cocktailSort,
  heapSort,
  insertionSort,
  mergeSort,
  quickSort,
  quickSort3While,
  quickSortES6,
  selectionSort,
} from 'src/algorithm/sort/index'
import { randomArray } from 'src/util/randomArray'

type sortFn = (arr: number[]) => number[]

function ArraySortCmp(sortFn: sortFn) {
  const rightAnswer = (arr: number[]) => Array.from(arr).sort((a, b) => a - b)
  expect(sortFn([])).toStrictEqual([])
  expect(sortFn([1])).toStrictEqual([1])
  expect(sortFn([2, 1])).toStrictEqual([1, 2])
  expect(sortFn([999, 99, 9])).toStrictEqual([9, 99, 999])
  expect(sortFn([11, 11, 11, 11, 11])).toStrictEqual([11, 11, 11, 11, 11])
  const arrL10 = randomArray(10)
  expect(sortFn(arrL10)).toStrictEqual(rightAnswer(arrL10))
  const arrL99 = randomArray(99)
  expect(sortFn(arrL99)).toStrictEqual(rightAnswer(arrL99))
}

it('test BubbleSort ', () => {
  ArraySortCmp(bubbleSort)
})

it('test CocktailSort ', () => {
  ArraySortCmp(cocktailSort)
})

it('test HeapSort ', () => {
  ArraySortCmp(heapSort)
})

it('test InsertionSort ', () => {
  ArraySortCmp(insertionSort)
})

it('test BinaryInsertionSort ', () => {
  ArraySortCmp(binaryInsertionSort)
})

it('test MergeSort ', () => {
  ArraySortCmp(mergeSort)
})

it('test SelectionSort ', () => {
  ArraySortCmp(selectionSort)
})

it('test QuickSort ', () => {
  ArraySortCmp(quickSort)
})

it('test QuickSortES6 ', () => {
  ArraySortCmp(quickSortES6)
})

it('test QuickSort3While ', () => {
  ArraySortCmp(quickSort3While)
})

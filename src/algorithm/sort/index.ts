import { Comparator } from 'src/util/Comparator'
import bubbleSort from 'src/algorithm/sort/bubbleSort'
import cocktailSort from 'src/algorithm/sort/cocktailSort'
import heapSort from 'src/algorithm/sort/heapSort'
import { insertionSort, binaryInsertionSort } from 'src/algorithm/sort/insertionSort'
import mergeSort from 'src/algorithm/sort/mergeSort'
import { quickSort, quickSortES6, quickSort3While } from 'src/algorithm/sort/quickSort'
import selectionSort from 'src/algorithm/sort/selectionSort'

export const cmp = new Comparator()

export {
  bubbleSort,
  cocktailSort,
  heapSort,
  insertionSort,
  binaryInsertionSort,
  mergeSort,
  quickSort,
  quickSortES6,
  quickSort3While,
  selectionSort,
}

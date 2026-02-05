import bubbleSort from 'src/algorithm/sort/bubbleSort'
import cocktailSort from 'src/algorithm/sort/cocktailSort'
import heapSort from 'src/algorithm/sort/heapSort'
import { binaryInsertionSort, insertionSort } from 'src/algorithm/sort/insertionSort'
import mergeSort from 'src/algorithm/sort/mergeSort'
import { quickSort, quickSort3While, quickSortES6 } from 'src/algorithm/sort/quickSort'
import selectionSort from 'src/algorithm/sort/selectionSort'
import { Comparator } from 'src/util/Comparator'

export const cmp = new Comparator()

export {
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
}

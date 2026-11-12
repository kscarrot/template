export function assertIndex(index: number, min: number, max: number) {
  if (!Number.isInteger(index)
    || index < min
    || index > max) {
    throw new RangeError(`Index out of bounds: index=${index}, allowed=[${min}, ${max}]`)
  }
}

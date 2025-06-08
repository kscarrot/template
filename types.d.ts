/**
 * 获取对象所有值的类型
 * @example
 * type Obj = { a: string; b: number }
 * type Values = ValueOf<Obj> // string | number
 */
type ValueOf<T> = T[keyof T]

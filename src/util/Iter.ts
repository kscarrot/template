/**
 * 通用生成器映射工具
 * @param source 源生成器
 * @param mapper 转换函数 (TIn -> TOut)
 */
export function* mapGenerator<TIn, TOut, TReturn, TNext>(
  source: Generator<TIn, TReturn, TNext>,
  mapper: (val: TIn) => TOut,
): Generator<TOut, TReturn, TNext> {
  // 核心变量：保存外部通过 next(val) 传进来的“燃料”
  let nextToSource: TNext = undefined as any

  try {
    while (true) {
      // 驱动源生成器，并将上一次收到的 TNext 传进去
      const result = source.next(nextToSource)

      //  如果源生成器结束了，直接返回它的最终结果 (TReturn)
      if (result.done) {
        return result.value
      }

      // 转换产出值 (TIn -> TOut)
      // 并暂停在此处，等待外部下一次调用 next()
      // 将外部传来的新 TNext 赋值给 nextToSource，进入下一次循环
      nextToSource = yield mapper(result.value)
    }
  }
  catch (err) {
    // 6. 如果外部调用了 gen.throw(err)，我们将错误抛给源生成器
    if (source.throw) {
      const throwResult = source.throw(err)
      if (throwResult.done) {
        return throwResult.value
      }
      else {
        /**
         * 原函数触发异常也可能产出补偿值 需要继续映射
         * 如下例子:
         * ```typescript
         * function* origin() {
         *   try {
         *     yield { a: 1 }
         *   }
         *   catch (err) {
         *     // 捕获错误后仍继续产出（补偿值）
         *     yield { a: 999 }
         *   }
         *   return 'Finished'
         * }
         * ```
         */
        nextToSource = yield mapper(throwResult.value)
      }
    }
    throw err
  }
  finally {
    // 如果外部调用了 gen.return()，确保源生成器也被关闭
    source.return(undefined as any)
  }
}

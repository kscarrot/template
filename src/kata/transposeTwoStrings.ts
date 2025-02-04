/**
 * @link https://www.codewars.com/kata/581f4ac139dc423f04000b99/train/typescript
 * @mark kata可以直接在传参时进行解构赋值 , 遍历时尽量用 for  可以把索引控制在循环体内部
 */
export function transposeTwoStrings([str_1st, str_2nd]: [string, string]): string {
  let result = []

  for (let index = 0; index < Math.max(str_1st.length, str_2nd.length); index++) {
    const row = `${str_1st[index] ?? ' '} ${str_2nd[index] ?? ' '}`
    result.push(row)
  }

  return result.join('\n')
}

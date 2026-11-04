import { execFileSync } from 'node:child_process'
import { resolve } from 'node:path'

/** 用和 F5 调试相同的方式启动 Node：预加载解析钩子后直接运行 TS */
function runWithHooks(args: string[]) {
  return execFileSync(process.execPath, ['--import', './scripts/resolve-hooks.ts', ...args], {
    cwd: resolve(import.meta.dirname, '..'),
    encoding: 'utf8',
  })
}

describe('node 直接运行 ts 的解析钩子', () => {
  it('解析 src/ 路径别名', () => {
    const code = `import { ScapegoatTree } from 'src/datastructure/tree/ScapegoatTree'; console.log([...new ScapegoatTree([3, 1, 2])].join())`
    expect(runWithHooks(['--input-type=module', '-e', code]).trim()).toBe('1,2,3')
  })

  it('补全省略扩展名的相对导入', () => {
    expect(() => runWithHooks(['src/leetcode/LC23.ts'])).not.toThrow()
  })
})

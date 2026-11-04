import { statSync } from 'node:fs'
import { registerHooks } from 'node:module'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

/**
 * 让 Node 直接运行 src 下的 TS 文件时，按 tsconfig / Vite 的规则解析导入：
 * - `src/...` 路径别名
 * - 省略扩展名的相对导入，如 `./utils` → `./utils.ts`
 *
 * 用法：node --import ./scripts/resolve-hooks.ts <file.ts>
 */

const projectRoot = resolve(import.meta.dirname, '..')
const srcRoot = join(projectRoot, 'src')
const extensions = ['', '.ts', '.tsx']

function isFile(path: string): boolean {
  return statSync(path, { throwIfNoEntry: false })?.isFile() ?? false
}

/** 只处理 src 别名和 src 内部的相对导入，其余（node 内置模块、依赖包）交给默认解析 */
function toSourcePath(specifier: string, parentURL: string | undefined): string | null {
  if (specifier.startsWith('src/'))
    return join(projectRoot, specifier)
  if (!specifier.startsWith('./') && !specifier.startsWith('../'))
    return null
  if (!parentURL?.startsWith('file:'))
    return null
  const parentPath = fileURLToPath(parentURL)
  return parentPath.startsWith(srcRoot)
    ? resolve(dirname(parentPath), specifier)
    : null
}

registerHooks({
  resolve(specifier, context, nextResolve) {
    const sourcePath = toSourcePath(specifier, context.parentURL)
    const file = sourcePath && extensions.map(extension => sourcePath + extension).find(isFile)
    if (!file)
      return nextResolve(specifier, context)
    return nextResolve(pathToFileURL(file).href, context)
  },
})

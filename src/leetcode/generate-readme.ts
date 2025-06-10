import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execSync } from 'node:child_process'

interface LeetCodeProblem {
  number: number
  name: string
  level: string
  link: string
  file: string
}

function getUncommittedFiles(): string[] {
  try {
    const output = execSync('git status --porcelain', { encoding: 'utf-8' })
    return output
      .split('\n')
      .filter((line) => line.trim())
      .map((line) => line.split(' ').pop() || '')
      .filter((file) => file.startsWith('src/leetcode/LC') && file.endsWith('.ts'))
  } catch (error) {
    console.error('Error getting git status:', error)
    return []
  }
}

function extractProblemInfo(content: string): Partial<LeetCodeProblem> {
  const nameMatch = content.match(/@name:\s*([^\n]+)/)
  const levelMatch = content.match(/@level:\s*([^\n]+)/)
  const linkMatch = content.match(/@link:\s*([^\n]+)/)

  return {
    name: nameMatch?.[1]?.trim(),
    level: levelMatch?.[1]?.trim(),
    link: linkMatch?.[1]?.trim(),
  }
}

function generateReadme() {
  const currentDir = dirname(fileURLToPath(import.meta.url))
  const uncommittedFiles = getUncommittedFiles()
  const allFiles = readdirSync(currentDir)

  const problems: LeetCodeProblem[] = []

  for (const file of allFiles) {
    if (file.startsWith('LC') && file.endsWith('.ts')) {
      // 跳过未提交的文件
      if (uncommittedFiles.includes(join('src/leetcode', file))) {
        continue
      }

      const content = readFileSync(join(currentDir, file), 'utf-8')
      const info = extractProblemInfo(content)
      const number = parseInt(file.replace('LC', '').replace('.ts', ''))

      if (info.name && info.level && info.link) {
        problems.push({
          number,
          name: info.name,
          level: info.level,
          link: info.link,
          file: `[代码](./${file})`,
        })
      }
    }
  }

  // 按题号排序
  problems.sort((a, b) => a.number - b.number)

  // 生成表格内容
  const tableHeader = '| 题号 | 题目 | 难度 | 链接 | 解法 |\n|------|------|------|------|------|'
  const tableRows = problems.map((p) => `| ${p.number} | ${p.name} | ${p.level} | [链接](${p.link}) | ${p.file} |`)

  const tableContent = [tableHeader, ...tableRows].join('\n')

  // 写入 README.md
  writeFileSync(join(currentDir, 'README.md'), tableContent)
}

generateReadme()

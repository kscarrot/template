# CLAUDE.md

本文件为 Claude Code (claude.ai/code) 在本仓库中工作时提供指引。

## 项目概述

一个 TypeScript 数据结构与算法仓库，包含 LeetCode / Codewar 题解，以及基于 React 的树结构可视化应用。使用 pnpm 作为包管理器，Volta 锁定 Node 版本（Node 24.1.0）。

## 常用命令

- **安装依赖**：`pnpm install`
- **运行全部测试**：`pnpm test`（vitest run）
- **监听模式测试**：`pnpm test:watch`
- **运行单个测试文件**：`pnpm test -- src/datastructure/list/LinkList.test.ts`
- **带覆盖率测试**：`pnpm test:coverage`（覆盖范围限定在 `src/algorithm/`、`src/datastructure/`、`src/util/`）
- **Lint 检查**：`pnpm lint:check`
- **Lint 修复**：`pnpm lint`
- **类型检查**：`pnpm tc`（使用 `tsgo --noEmit`，原生 TypeScript 编译器预览版）
- **构建（库）**：`pnpm build`（SWC 编译输出到 `dist/`）
- **启动开发服务器（可视化）**：`pnpm dev`（Vite，入口在 `src/visual/`）
- **构建可视化应用**：`pnpm build-view`

## 架构

### 源码目录结构（`src/`）

- **`datastructure/`** — 通用数据结构实现，均实现 `ADT.ts` 中定义的接口：
  - `node/` — 节点类型（`ListNode`、`BinaryTreeNode`），供所有结构共用
  - `list/` — LinkList、DoubleLinkList、CircularLinkList、Stack、Queue、Dequeue
  - `tree/` — BinaryTree、BinarySearchTree、SplayTree、FiberTree
  - `heap/` — Min/Max Heap
  - `collection/` — HashTable、HashSet
  - `graph/` — 空目录，待实现
- **`algorithm/sort/`** — 排序算法实现（bubble、cocktail、heap、insertion、merge、quick、selection），统一签名 `(arr: number[]) => number[]`
- **`util/`** — 共享工具：`Comparator`（通用比较类，供数据结构和排序使用）、`randomArray`（测试辅助函数）
- **`leetcode/`** — LeetCode 题解，以 `LC{编号}.ts` 命名；不纳入 ESLint 检查
- **`kata/`** — Codewar kata 题解
- **`math/`** — 数学相关模块（当前为空）
- **`playground/`** — 实验性/草稿代码
- **`visual/`** — React + Vite 可视化应用，使用 Cytoscape 渲染树结构。入口 `index.html` 位于 `src/visual/`

### 关键模式

- **ADT 接口**：所有数据结构均实现 `src/datastructure/ADT.ts` 中的 TypeScript 接口。新增结构应遵循此模式。
- **模块导入**：使用 `src/` 前缀路径（如 `import { Comparator } from 'src/util/Comparator'`），通过 tsconfig `paths` 和 SWC `baseUrl` 解析。
- **测试就近放置**：测试文件与源文件同目录，命名为 `*.test.ts`。Vitest 全局变量（`describe`、`it`、`expect`）无需手动导入。
- **Comparator 模式**：需要排序能力的数据结构使用 `src/util/Comparator` 类，支持自定义比较函数和反向排序。

## Pre-commit Hook

Husky 在 pre-commit 阶段执行 `pnpm lint:check`。所有代码提交前必须通过 ESLint 检查。

## ESLint 配置

使用 `@antfu/eslint-config`，启用 React 和 TypeScript 支持。主要设置：
- 允许 `no-console`
- 允许 `no-labels`
- `src/leetcode/` 不纳入 Lint 检查

## 开发规范

- 增量推进：每次做小的、可编译、测试通过的改动
- TDD 流程：先写测试（红）→ 最小实现（绿）→ 重构
- 复杂任务拆分为 3-5 个阶段，记录在 `IMPLEMENTATION_PLAN.md`
- 连续 3 次尝试失败后，停下来重新评估方案
- 组合优于继承；优先使用显式数据流和依赖注入

// 链表节点
interface ListNode {
  val: number
  next: ListNode | null
}

// 二叉树节点
interface TreeNode {
  val: number
  left: TreeNode | null
  right: TreeNode | null
}

// N 叉树节点
interface NTreeNode {
  val: number
  children: NTreeNode[]
}

// 图节点
interface GraphNode {
  val: number
  neighbors: GraphNode[]
}

// 常见输入类型
type InputType = number | string | number[] | string[] | ListNode | TreeNode | GraphNode | null

// 常见输出类型
type OutputType = number | string | boolean | number[] | string[] | ListNode | TreeNode | null

// 测试用例类型
interface TestCase {
  input: InputType
  output: OutputType
  description?: string
}

// 解决方案函数类型
type Solution = (input: InputType) => OutputType

// 题目类型
interface Problem {
  id: number
  title: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  description: string
  solution: Solution
  testCases: TestCase[]
}

// 导出所有类型
export type { ListNode, TreeNode, NTreeNode, GraphNode, InputType, OutputType, TestCase, Solution, Problem }

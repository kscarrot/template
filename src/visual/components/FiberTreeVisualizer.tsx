import React, { useEffect, useRef } from 'react'
import cytoscape from 'cytoscape'
import { FiberNode } from 'src/datastructure/node'

interface FiberTreeVisualizerProps {
  root: FiberNode<any> | null
  style?: React.CSSProperties
}

type CyNode = { data: { id: string; label: string } }
type CyEdge = { data: { source: string; target: string; edgeType: 'child' | 'parent' | 'sibling' } }

// traverseFiberTree 生成器
function* traverseFiberTree<T>(fiberTree: FiberNode<T> | null): Generator<FiberNode<T>, void, unknown> {
  let current = fiberTree
  while (current) {
    yield current
    if (current.child) {
      current = current.child
    } else if (current.sibling) {
      current = current.sibling
    } else {
      current = current.parent?.sibling || null
    }
  }
}

/**
 * @description 将 FiberTree 转换为 Cytoscape.js 可视化数据
 * @param root FiberTree 根节点
 * @returns { nodes, edges }
 */
function fiberTreeToCytoscapeData(root: FiberNode<any> | null) {
  const nodes: CyNode[] = []
  const edges: CyEdge[] = []
  let id = 0
  const nodeMap = new Map<FiberNode<any>, string>()

  // 第一次遍历：收集所有节点
  for (const node of traverseFiberTree(root)) {
    let nodeId = nodeMap.get(node)
    if (!nodeId) {
      nodeId = String(node.value) + '_' + id++
      nodeMap.set(node, nodeId)
      nodes.push({ data: { id: nodeId, label: String(node.value) } })
    }
  }
  // 第二次遍历：收集所有边
  for (const node of traverseFiberTree(root)) {
    const nodeId = nodeMap.get(node)!
    // parent 边（箭头应从子指向父）
    if (node.parent) {
      const parentId = nodeMap.get(node.parent)!
      edges.push({ data: { source: nodeId, target: parentId, edgeType: 'parent' } })
    }
    // child 边
    if (node.child) {
      const childId = nodeMap.get(node.child)!
      edges.push({ data: { source: nodeId, target: childId, edgeType: 'child' } })
    }
    // sibling 边
    if (node.sibling) {
      const siblingId = nodeMap.get(node.sibling)!
      edges.push({ data: { source: nodeId, target: siblingId, edgeType: 'sibling' } })
    }
  }
  return { nodes, edges }
}

const edgeColors = {
  child: '#2ECC40', // 绿色
  parent: '#FF851B', // 橙色
  sibling: '#0074D9', // 蓝色
}

/**
 * @description FiberTree 可视化组件，画布自适应填满父容器并居中
 */
const FiberTreeVisualizer: React.FC<FiberTreeVisualizerProps> = ({ root, style }) => {
  const cyRef = useRef<HTMLDivElement>(null)
  const cyInstance = useRef<cytoscape.Core | null>(null)

  useEffect(() => {
    if (!cyRef.current) return
    cyRef.current.innerHTML = '' // 清空
    const { nodes, edges } = fiberTreeToCytoscapeData(root)
    const cy = cytoscape({
      container: cyRef.current,
      elements: [...nodes, ...edges.map((e) => ({ data: e.data, classes: e.data.edgeType }))],
      style: [
        {
          selector: 'node',
          style: {
            label: 'data(label)',
            'background-color': '#0074D9',
            color: '#fff',
            'text-valign': 'center',
            'text-halign': 'center',
            'font-size': 16,
            width: 40,
            height: 40,
          },
        },
        // child
        {
          selector: 'edge.child',
          style: {
            width: 3,
            'line-color': edgeColors.child,
            'target-arrow-color': edgeColors.child,
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
          },
        },
        // sibling
        {
          selector: 'edge.sibling',
          style: {
            width: 3,
            'line-color': edgeColors.sibling,
            'target-arrow-color': edgeColors.sibling,
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'line-style': 'dashed',
          },
        },
        // parent
        {
          selector: 'edge.parent',
          style: {
            width: 2,
            'line-color': edgeColors.parent,
            'target-arrow-color': edgeColors.parent,
            'target-arrow-shape': 'vee',
            'curve-style': 'bezier',
            'line-style': 'dotted',
          },
        },
      ],
      layout: {
        name: 'breadthfirst',
        directed: true,
        padding: 10,
        spacingFactor: 1.2,
      },
    })
    cyInstance.current = cy
    cy.center()
    cy.fit(undefined, 40)
    return () => {
      cy.destroy()
    }
  }, [root])

  return <div ref={cyRef} style={{ width: '100%', height: '100%', minHeight: 0, minWidth: 0, ...style }} />
}

export default FiberTreeVisualizer

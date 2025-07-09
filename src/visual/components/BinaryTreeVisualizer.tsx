import React, { useEffect, useRef } from 'react'
import cytoscape from 'cytoscape'
import { BinaryTreeNode } from 'src/datastructure/node'
import { traverseBinaryTreeNode } from 'src/datastructure/tree/BinaryTree'

interface BinaryTreeVisualizerProps {
  root: BinaryTreeNode<any> | null
  style?: React.CSSProperties
}

type CyNode = { data: { id: string; label: string } }
type CyEdge = { data: { source: string; target: string; edgeType: 'child' | 'parent' } }

function binaryTreeToCytoscapeData(root: BinaryTreeNode<any> | null) {
  const nodes: CyNode[] = []
  const edges: CyEdge[] = []
  let id = 0
  const nodeMap = new Map<BinaryTreeNode<any>, string>()

  // 第一次遍历：收集所有节点
  for (const node of traverseBinaryTreeNode(root)) {
    let nodeId = nodeMap.get(node)
    if (!nodeId) {
      nodeId = String(node.value) + '_' + id++
      nodeMap.set(node, nodeId)
      nodes.push({ data: { id: nodeId, label: String(node.value) } })
    }
  }
  // 第二次遍历：收集所有边
  for (const node of traverseBinaryTreeNode(root)) {
    const nodeId = nodeMap.get(node)!
    // child 边（不区分左右）
    if (node.left) {
      const childId = nodeMap.get(node.left)!
      edges.push({ data: { source: nodeId, target: childId, edgeType: 'child' } })
      // parent 边（子指向父）
      edges.push({ data: { source: childId, target: nodeId, edgeType: 'parent' } })
    }
    if (node.right) {
      const childId = nodeMap.get(node.right)!
      edges.push({ data: { source: nodeId, target: childId, edgeType: 'child' } })
      // parent 边（子指向父）
      edges.push({ data: { source: childId, target: nodeId, edgeType: 'parent' } })
    }
  }
  return { nodes, edges }
}

const edgeColors = {
  child: '#2ECC40', // 绿色
  parent: '#FF851B', // 橙色
}

const BinaryTreeVisualizer: React.FC<BinaryTreeVisualizerProps> = ({ root, style }) => {
  const cyRef = useRef<HTMLDivElement>(null)
  const cyInstance = useRef<cytoscape.Core | null>(null)

  useEffect(() => {
    if (!cyRef.current) return
    cyRef.current.innerHTML = ''
    const { nodes, edges } = binaryTreeToCytoscapeData(root)
    const cy = cytoscape({
      container: cyRef.current,
      elements: [...nodes, ...edges.map((e) => ({ data: e.data, classes: e.data.edgeType }))],
      style: [
        {
          selector: 'node',
          style: {
            label: 'data(label)',
            'background-color': '#2ECC40',
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

export default BinaryTreeVisualizer

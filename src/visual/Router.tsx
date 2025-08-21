import React from 'react'
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom'
import BinaryTreeVisualizer from './components/BinaryTreeVisualizer'
import FiberTreeVisualizer from './components/FiberTreeVisualizer'
import { BinaryTree } from 'src/datastructure/tree/BinaryTree'
import { FiberTree } from 'src/datastructure/tree/FiberTree'
import { SplayTree } from 'src/datastructure/tree/SplayTree'

const bt = new BinaryTree([1, 2, 3, 4, 5, 6, 7])
const fiberTree = new FiberTree(bt)
const splayTree = new SplayTree([10, 12, 3, 4, 13, 9, 11])

const navItems = [
  { path: '/binary-tree', label: '二叉树可视化' },
  { path: '/fiber-tree', label: 'FiberTree 可视化' },
  { path: '/splay-tree', label: '伸展树可视化' },
]

const Sidebar: React.FC = () => (
  <nav style={{ width: 180, padding: 16, borderRight: '1px solid #eee', height: '100vh', boxSizing: 'border-box' }}>
    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      {navItems.map((item) => (
        <li key={item.path} style={{ margin: '16px 0' }}>
          <Link to={item.path} style={{ textDecoration: 'none', color: '#0074D9', fontWeight: 500 }}>
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  </nav>
)

const Router: React.FC = () => (
  <BrowserRouter>
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: 24 }}>
        <Routes>
          <Route path="/binary-tree" element={<BinaryTreeVisualizer root={bt.root} />} />
          <Route path="/fiber-tree" element={<FiberTreeVisualizer root={fiberTree.root} />} />
          <Route path="/splay-tree" element={<BinaryTreeVisualizer root={splayTree.root} />} />
          <Route path="*" element={<Navigate to="/binary-tree" replace />} />
        </Routes>
      </div>
    </div>
  </BrowserRouter>
)

export default Router

import { useEffect } from 'react'
import './App.css'
import Scene from './components/3d/Scene'
import SidePanel from './components/ui/SidePanel'
import NodeEditPanel from './components/ui/NodeEditPanel'
import { useStore } from './store/useStore'
import { sampleNodes } from './utils/sampleData'

function App() {
  const addNode = useStore((state) => state.addNode)
  const nodes = useStore((state) => state.nodes)

  // 初回マウント時にサンプルデータを追加
  useEffect(() => {
    if (nodes.length === 0) {
      sampleNodes.forEach((node) => {
        addNode(node)
      })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="app">
      <header className="header">
        <h1 className="title">マーケティング導線3D可視化アプリ</h1>
        <p className="subtitle">Phase 4: ノード管理機能実装中... (ノード数: {nodes.length})</p>
      </header>
      <main className="main-content">
        <SidePanel />
        <div className="scene-container">
          <Scene />
        </div>
      </main>
      <NodeEditPanel />
    </div>
  )
}

export default App

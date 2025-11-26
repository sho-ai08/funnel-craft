import { useEffect } from 'react'
import './App.css'
import Scene from './components/3d/Scene'
import SidePanel from './components/ui/SidePanel'
import NodeEditPanel from './components/ui/NodeEditPanel'
import Header from './components/layout/Header'
import StatusBar from './components/layout/StatusBar'
import { useStore } from './store/useStore'
import { sampleNodes } from './utils/sampleData'

function App() {
  const addNode = useStore((state) => state.addNode)
  const addLink = useStore((state) => state.addLink)
  const nodes = useStore((state) => state.nodes)
  const links = useStore((state) => state.links)
  const isSidePanelOpen = useStore((state) => state.ui.isSidePanelOpen)
  const toggleSidePanel = useStore((state) => state.toggleSidePanel)

  // 初回マウント時にサンプルデータを追加
  useEffect(() => {
    if (nodes.length === 0) {
      const createdNodes: string[] = []
      sampleNodes.forEach((node) => {
        addNode(node)
        // ノードIDを後で取得するため、一時的にIDを保存
        // 実際には addNode が返す ID を使うべきですが、ここでは簡易的に
      })
    }

    // サンプルリンクを追加（ノードが作成された後）
    if (links.length === 0 && nodes.length >= 2) {
      // 最初のノードから2番目のノードへのリンク
      // 2番目のノードから3番目のノードへのリンク
      const nodeIds = nodes.map(n => n.id)
      if (nodeIds.length >= 3) {
        addLink({ source: nodeIds[0], target: nodeIds[1] })
        addLink({ source: nodeIds[1], target: nodeIds[2] })
      }
    }
  }, [nodes.length]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        {isSidePanelOpen && <SidePanel />}
        <div className="scene-container">
          <button
            onClick={toggleSidePanel}
            className="panel-toggle-btn"
            title={isSidePanelOpen ? 'サイドパネルを閉じる' : 'サイドパネルを開く'}
          >
            {isSidePanelOpen ? '◀' : '▶'}
          </button>
          <Scene />
        </div>
      </main>
      <StatusBar />
      <NodeEditPanel />
    </div>
  )
}

export default App

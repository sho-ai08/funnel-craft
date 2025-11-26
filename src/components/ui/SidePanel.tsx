import { useStore } from '../../store/useStore'

const SidePanel = () => {
  const nodes = useStore((state) => state.nodes)
  const addNode = useStore((state) => state.addNode)
  const selectNode = useStore((state) => state.selectNode)
  const setEditPanelOpen = useStore((state) => state.setEditPanelOpen)
  const selectedNodeId = useStore((state) => state.ui.selectedNodeId)

  const handleAddNode = () => {
    addNode({
      title: '新しいノード',
      category: 'traffic',
      type: 'sns',
      description: '',
      metrics: [],
      position: { x: 0, y: 0, z: 0 },
    })
  }

  const handleNodeClick = (nodeId: string) => {
    selectNode(nodeId)
    setEditPanelOpen(true)
  }

  const handleEditSelected = () => {
    if (selectedNodeId) {
      setEditPanelOpen(true)
    }
  }

  return (
    <div className="side-panel">
      <div className="panel-section">
        <h2 className="panel-title">ノード管理</h2>

        {/* ノード追加ボタン */}
        <button onClick={handleAddNode} className="btn btn-primary">
          <span className="text-xl">+</span> ノード追加
        </button>

        {/* 選択ノード編集ボタン */}
        {selectedNodeId && (
          <button onClick={handleEditSelected} className="btn btn-secondary mt-2">
            選択ノードを編集
          </button>
        )}
      </div>

      {/* ノード一覧 */}
      <div className="panel-section">
        <h3 className="section-title">ノード一覧 ({nodes.length})</h3>
        <div className="node-list">
          {nodes.map((node) => (
            <div
              key={node.id}
              className={`node-list-item ${selectedNodeId === node.id ? 'selected' : ''}`}
              onClick={() => handleNodeClick(node.id)}
            >
              <div
                className="node-color-indicator"
                style={{
                  backgroundColor: (() => {
                    switch (node.type) {
                      case 'sns': return '#3B82F6'
                      case 'article': return '#10B981'
                      case 'ad': return '#F59E0B'
                      case 'frontend': return '#F97316'
                      case 'backend': return '#EF4444'
                      default: return '#888'
                    }
                  })()
                }}
              />
              <span className="node-title">{node.title}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SidePanel

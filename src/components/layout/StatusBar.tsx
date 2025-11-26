import { useStore } from '../../store/useStore'

const StatusBar = () => {
  const nodes = useStore((state) => state.nodes)
  const links = useStore((state) => state.links)
  const selectedNodeId = useStore((state) => state.ui.selectedNodeId)
  const isLinkCreationMode = useStore((state) => state.ui.isLinkCreationMode)
  const linkCreationSourceId = useStore((state) => state.ui.linkCreationSourceId)

  const selectedNode = selectedNodeId ? nodes.find((n) => n.id === selectedNodeId) : null

  const getOperationHint = () => {
    if (isLinkCreationMode) {
      if (!linkCreationSourceId) {
        return '💡 開始ノードを選択してください'
      } else {
        return '💡 終了ノードを選択してください (同じノードでキャンセル)'
      }
    }
    if (selectedNode) {
      return `💡 選択中: ${selectedNode.title} | クリックして編集`
    }
    return '💡 ノードをクリックして選択 | ドラッグで視点を回転'
  }

  const getNodeTypeLabel = (type: string) => {
    switch (type) {
      case 'sns': return 'SNS'
      case 'article': return '記事'
      case 'ad': return '広告'
      case 'frontend': return 'フロントエンド'
      case 'backend': return 'バックエンド'
      default: return type
    }
  }

  return (
    <div className="status-bar">
      <div className="status-section">
        <span className="status-item">
          <span className="status-icon">📦</span>
          <span className="status-value">{nodes.length}</span>
          <span className="status-label">ノード</span>
        </span>
        <span className="status-divider">|</span>
        <span className="status-item">
          <span className="status-icon">🔗</span>
          <span className="status-value">{links.length}</span>
          <span className="status-label">リンク</span>
        </span>
      </div>

      <div className="status-section status-hint">
        {getOperationHint()}
      </div>

      {selectedNode && (
        <div className="status-section status-selected">
          <span className="status-badge">
            {getNodeTypeLabel(selectedNode.type)}
          </span>
          <span className="status-selected-title">{selectedNode.title}</span>
        </div>
      )}
    </div>
  )
}

export default StatusBar

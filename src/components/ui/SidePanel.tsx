import { useState } from 'react'
import { useStore } from '../../store/useStore'

const SidePanel = () => {
  const nodes = useStore((state) => state.nodes)
  const links = useStore((state) => state.links)
  const addNode = useStore((state) => state.addNode)
  const selectNode = useStore((state) => state.selectNode)
  const setEditPanelOpen = useStore((state) => state.setEditPanelOpen)
  const selectedNodeId = useStore((state) => state.ui.selectedNodeId)
  const selectedLinkId = useStore((state) => state.ui.selectedLinkId)
  const deleteLink = useStore((state) => state.deleteLink)

  const [searchQuery, setSearchQuery] = useState('')
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    traffic: true,
    cashpoint: true,
  })

  const isLinkCreationMode = useStore((state) => state.ui.isLinkCreationMode)
  const linkCreationSourceId = useStore((state) => state.ui.linkCreationSourceId)
  const setLinkCreationMode = useStore((state) => state.setLinkCreationMode)
  const setLinkCreationSource = useStore((state) => state.setLinkCreationSource)
  const triggerResetView = useStore((state) => state.triggerResetView)
  const triggerAutoFit = useStore((state) => state.triggerAutoFit)

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

  const handleToggleLinkMode = () => {
    if (isLinkCreationMode) {
      // モードOFF
      setLinkCreationMode(false)
      setLinkCreationSource(null)
    } else {
      // モードON
      setLinkCreationMode(true)
      setLinkCreationSource(null)
    }
  }

  const handleCancelLinkMode = () => {
    setLinkCreationMode(false)
    setLinkCreationSource(null)
  }

  const handleDeleteSelectedLink = () => {
    if (selectedLinkId) {
      if (window.confirm('このリンクを削除しますか？')) {
        deleteLink(selectedLinkId)
      }
    }
  }

  const getSourceNodeTitle = () => {
    if (linkCreationSourceId) {
      const node = nodes.find((n) => n.id === linkCreationSourceId)
      return node ? node.title : '不明'
    }
    return null
  }

  // Filter nodes based on search query
  const filteredNodes = nodes.filter((node) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      node.title.toLowerCase().includes(query) ||
      node.description?.toLowerCase().includes(query) ||
      node.url?.toLowerCase().includes(query)
    )
  })

  // Group filtered nodes by category
  const nodesByCategory = {
    traffic: filteredNodes.filter((node) => node.category === 'traffic'),
    cashpoint: filteredNodes.filter((node) => node.category === 'cashpoint'),
  }

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }))
  }

  const getCategoryLabel = (category: string) => {
    return category === 'traffic' ? '集客' : 'キャッシュポイント'
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
        {selectedNodeId && !isLinkCreationMode && (
          <button onClick={handleEditSelected} className="btn btn-secondary mt-2">
            選択ノードを編集
          </button>
        )}
      </div>

      {/* リンク管理 */}
      <div className="panel-section">
        <h2 className="panel-title">リンク管理</h2>

        {/* リンク作成モードトグル */}
        {!isLinkCreationMode && (
          <button onClick={handleToggleLinkMode} className="btn btn-primary">
            🔗 リンク作成モード
          </button>
        )}

        {/* リンク作成モード中 */}
        {isLinkCreationMode && (
          <div className="link-creation-panel">
            <div className="link-status">
              {!linkCreationSourceId ? (
                <p className="status-text">開始ノードをクリック</p>
              ) : (
                <div>
                  <p className="status-text">
                    開始: <strong>{getSourceNodeTitle()}</strong>
                  </p>
                  <p className="status-text">終了ノードをクリック</p>
                </div>
              )}
            </div>
            <button onClick={handleCancelLinkMode} className="btn btn-secondary">
              キャンセル
            </button>
          </div>
        )}

        {/* 選択リンク削除ボタン */}
        {selectedLinkId && !isLinkCreationMode && (
          <button onClick={handleDeleteSelectedLink} className="btn btn-danger mt-2">
            選択リンクを削除
          </button>
        )}

        <div className="mt-2 text-sm text-gray-400">
          リンク数: {links.length}
        </div>
      </div>

      {/* ビューコントロール */}
      <div className="panel-section">
        <h2 className="panel-title">ビューコントロール</h2>
        <div className="flex flex-col gap-2">
          <button onClick={triggerResetView} className="btn btn-secondary">
            🔄 ビューをリセット
          </button>
          <button onClick={triggerAutoFit} className="btn btn-secondary">
            🎯 全体を表示
          </button>
        </div>
      </div>

      {/* ノード一覧 */}
      <div className="panel-section">
        <h3 className="section-title">ノード一覧 ({nodes.length})</h3>

        {/* 検索フィルター */}
        <div className="search-box">
          <input
            type="text"
            placeholder="🔍 ノードを検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="search-clear-btn"
              title="検索をクリア"
            >
              ✕
            </button>
          )}
        </div>

        {filteredNodes.length === 0 && searchQuery && (
          <div className="no-results">
            検索結果が見つかりませんでした
          </div>
        )}

        {/* Category groupings */}
        {(['traffic', 'cashpoint'] as const).map((category) => {
          const categoryNodes = nodesByCategory[category]
          if (categoryNodes.length === 0 && !searchQuery) return null

          return (
            <div key={category} className="category-group">
              <button
                onClick={() => toggleCategory(category)}
                className="category-header"
              >
                <span className="category-arrow">
                  {expandedCategories[category] ? '▼' : '▶'}
                </span>
                <span className="category-label">
                  {getCategoryLabel(category)} ({categoryNodes.length})
                </span>
              </button>

              {expandedCategories[category] && (
                <div className="node-list">
                  {categoryNodes.map((node) => (
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
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default SidePanel

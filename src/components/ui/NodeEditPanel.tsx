import { useState, useEffect } from 'react'
import { useStore } from '../../store/useStore'
import { NodeType, NodeCategory, Metric, NODE_TYPE_LABELS, CATEGORY_LABELS } from '../../types'

const NodeEditPanel = () => {
  const selectedNodeId = useStore((state) => state.ui.selectedNodeId)
  const isEditPanelOpen = useStore((state) => state.ui.isEditPanelOpen)
  const setEditPanelOpen = useStore((state) => state.setEditPanelOpen)
  const getNodeById = useStore((state) => state.getNodeById)
  const updateNode = useStore((state) => state.updateNode)
  const deleteNode = useStore((state) => state.deleteNode)

  const node = selectedNodeId ? getNodeById(selectedNodeId) : null

  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [category, setCategory] = useState<NodeCategory>('traffic')
  const [type, setType] = useState<NodeType>('sns')
  const [description, setDescription] = useState('')
  const [metrics, setMetrics] = useState<Metric[]>([])

  useEffect(() => {
    if (node) {
      setTitle(node.title)
      setUrl(node.url || '')
      setCategory(node.category)
      setType(node.type)
      setDescription(node.description || '')
      setMetrics([...node.metrics])
    }
  }, [node])

  if (!isEditPanelOpen || !node) return null

  const handleSave = () => {
    updateNode(node.id, {
      title,
      url: url || undefined,
      category,
      type,
      description: description || undefined,
      metrics,
    })
    setEditPanelOpen(false)
  }

  const handleCancel = () => {
    setEditPanelOpen(false)
  }

  const handleDelete = () => {
    if (window.confirm(`「${node.title}」を削除しますか？`)) {
      deleteNode(node.id)
      setEditPanelOpen(false)
    }
  }

  const handleAddMetric = () => {
    if (metrics.length >= 10) {
      alert('メトリクスは最大10個までです')
      return
    }
    setMetrics([...metrics, { name: '', value: 0 }])
  }

  const handleRemoveMetric = (index: number) => {
    setMetrics(metrics.filter((_, i) => i !== index))
  }

  const handleMetricChange = (index: number, field: 'name' | 'value', value: string | number) => {
    const newMetrics = [...metrics]
    newMetrics[index] = {
      ...newMetrics[index],
      [field]: field === 'value' ? Number(value) : value,
    }
    setMetrics(newMetrics)
  }

  return (
    <>
      {/* オーバーレイ */}
      <div className="modal-overlay" onClick={handleCancel} />

      {/* モーダル */}
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">ノード編集</h2>
          <button onClick={handleCancel} className="close-btn">
            ✕
          </button>
        </div>

        <div className="modal-body">
          {/* タイトル */}
          <div className="form-group">
            <label className="form-label">タイトル *</label>
            <input
              type="text"
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="ノードのタイトル"
            />
          </div>

          {/* URL */}
          <div className="form-group">
            <label className="form-label">URL</label>
            <input
              type="url"
              className="form-input"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
            />
          </div>

          {/* カテゴリ */}
          <div className="form-group">
            <label className="form-label">カテゴリ *</label>
            <div className="radio-group">
              {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                <label key={key} className="radio-label">
                  <input
                    type="radio"
                    value={key}
                    checked={category === key}
                    onChange={(e) => setCategory(e.target.value as NodeCategory)}
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 種類 */}
          <div className="form-group">
            <label className="form-label">種類 *</label>
            <select
              className="form-select"
              value={type}
              onChange={(e) => setType(e.target.value as NodeType)}
            >
              {Object.entries(NODE_TYPE_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* 説明 */}
          <div className="form-group">
            <label className="form-label">説明</label>
            <textarea
              className="form-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="ノードの説明やメモ"
              rows={3}
            />
          </div>

          {/* メトリクス */}
          <div className="form-group">
            <div className="flex justify-between items-center mb-2">
              <label className="form-label mb-0">メトリクス</label>
              <button onClick={handleAddMetric} className="btn-sm btn-secondary">
                + 追加
              </button>
            </div>
            {metrics.length === 0 && (
              <p className="text-gray-400 text-sm">メトリクスが追加されていません</p>
            )}
            {metrics.map((metric, index) => (
              <div key={index} className="metric-row">
                <input
                  type="text"
                  className="form-input flex-1"
                  value={metric.name}
                  onChange={(e) => handleMetricChange(index, 'name', e.target.value)}
                  placeholder="項目名"
                />
                <input
                  type="number"
                  className="form-input w-32"
                  value={metric.value}
                  onChange={(e) => handleMetricChange(index, 'value', e.target.value)}
                  placeholder="値"
                />
                <button
                  onClick={() => handleRemoveMetric(index)}
                  className="btn-sm btn-danger"
                >
                  削除
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={handleDelete} className="btn btn-danger">
            ノード削除
          </button>
          <div className="flex gap-2">
            <button onClick={handleCancel} className="btn btn-secondary">
              キャンセル
            </button>
            <button onClick={handleSave} className="btn btn-primary">
              保存
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default NodeEditPanel

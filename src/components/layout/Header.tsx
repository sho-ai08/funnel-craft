import { useState } from 'react'
import { useStore } from '../../store/useStore'

const Header = () => {
  const nodes = useStore((state) => state.nodes)
  const links = useStore((state) => state.links)
  const [showExportMenu, setShowExportMenu] = useState(false)

  const handleSave = () => {
    const data = {
      nodes,
      links,
      exportedAt: new Date().toISOString(),
    }
    const jsonStr = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `marketing-flow-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleLoad = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (event) => {
          try {
            const data = JSON.parse(event.target?.result as string)
            if (data.nodes && data.links) {
              // TODO: Implement data loading into store
              console.log('Loaded data:', data)
              alert('データの読み込み機能は Phase 8 で実装予定です')
            } else {
              alert('無効なファイル形式です')
            }
          } catch (error) {
            alert('ファイルの読み込みに失敗しました')
            console.error(error)
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  const handleExportPNG = () => {
    alert('PNG エクスポート機能は Phase 9 で実装予定です')
    setShowExportMenu(false)
  }

  const handleExportPDF = () => {
    alert('PDF エクスポート機能は Phase 9 で実装予定です')
    setShowExportMenu(false)
  }

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="title">マーケティング導線3D可視化アプリ</h1>
          <p className="subtitle">Phase 6: UI/レイアウト実装中...</p>
        </div>
        <div className="header-right">
          <button onClick={handleSave} className="header-btn" title="データを保存">
            💾 保存
          </button>
          <button onClick={handleLoad} className="header-btn" title="データを読み込み">
            📂 読み込み
          </button>
          <div className="export-dropdown">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="header-btn"
              title="画像/PDFをエクスポート"
            >
              📤 エクスポート ▼
            </button>
            {showExportMenu && (
              <div className="export-menu">
                <button onClick={handleExportPNG} className="export-menu-item">
                  🖼️ PNG画像
                </button>
                <button onClick={handleExportPDF} className="export-menu-item">
                  📄 PDFファイル
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header

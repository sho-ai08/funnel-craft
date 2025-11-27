import { useState } from 'react'
import { useStore } from '../../store/useStore'
import { validateProjectData, checkDuplicateIds } from '../../utils/validation'
import ConfirmDialog from '../ui/ConfirmDialog'

const Header = () => {
  const nodes = useStore((state) => state.nodes)
  const links = useStore((state) => state.links)
  const loadProject = useStore((state) => state.loadProject)

  const [showExportMenu, setShowExportMenu] = useState(false)
  const [showLoadConfirm, setShowLoadConfirm] = useState(false)
  const [pendingData, setPendingData] = useState<{ nodes: any[], links: any[] } | null>(null)

  const handleSave = () => {
    try {
      const data = {
        version: '1.0',
        exportedAt: new Date().toISOString(),
        nodes,
        links,
      }

      const jsonStr = JSON.stringify(data, null, 2)
      const blob = new Blob([jsonStr], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
      a.download = `marketing-flow-${timestamp}.json`
      a.click()
      URL.revokeObjectURL(url)

      // 成功通知（将来的にトースト通知に置き換え可能）
      console.log('プロジェクトを保存しました')
    } catch (error) {
      console.error('保存エラー:', error)
      alert('データの保存中にエラーが発生しました')
    }
  }

  const handleLoad = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json,application/json'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const rawData = JSON.parse(event.target?.result as string)

          // データバリデーション
          const validation = validateProjectData(rawData)

          if (!validation.valid) {
            alert(`データの検証に失敗しました:\n${validation.error}`)
            return
          }

          if (!validation.data) {
            alert('データの読み込みに失敗しました')
            return
          }

          // ID重複チェック
          const duplicateCheck = checkDuplicateIds(validation.data.nodes, validation.data.links)
          if (duplicateCheck.hasDuplicates) {
            alert(
              `重複する${duplicateCheck.duplicateType === 'node' ? 'ノード' : 'リンク'}ID が見つかりました:\n${duplicateCheck.duplicateId}`
            )
            return
          }

          // 現在データがある場合は確認ダイアログを表示
          if (nodes.length > 0 || links.length > 0) {
            setPendingData(validation.data)
            setShowLoadConfirm(true)
          } else {
            // データがない場合は即座に読み込み
            loadProject(validation.data.nodes, validation.data.links)
            console.log(
              `プロジェクトを読み込みました (ノード: ${validation.data.nodes.length}, リンク: ${validation.data.links.length})`
            )
          }
        } catch (error) {
          console.error('読み込みエラー:', error)
          if (error instanceof SyntaxError) {
            alert('JSONファイルの形式が正しくありません')
          } else {
            alert('ファイルの読み込み中にエラーが発生しました')
          }
        }
      }

      reader.onerror = () => {
        alert('ファイルの読み込みに失敗しました')
      }

      reader.readAsText(file)
    }
    input.click()
  }

  const handleConfirmLoad = () => {
    if (pendingData) {
      loadProject(pendingData.nodes, pendingData.links)
      console.log(
        `プロジェクトを読み込みました (ノード: ${pendingData.nodes.length}, リンク: ${pendingData.links.length})`
      )
      setPendingData(null)
    }
    setShowLoadConfirm(false)
  }

  const handleCancelLoad = () => {
    setPendingData(null)
    setShowLoadConfirm(false)
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
    <>
      <header className="header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="title">マーケティング導線3D可視化アプリ</h1>
            <p className="subtitle">Phase 8: 保存・読み込み機能実装中...</p>
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

      {/* 読み込み確認ダイアログ */}
      <ConfirmDialog
        isOpen={showLoadConfirm}
        title="データを読み込みますか？"
        message={`現在のデータ（ノード: ${nodes.length}個, リンク: ${links.length}個）は失われます。\n\n読み込み予定:\nノード: ${pendingData?.nodes.length || 0}個\nリンク: ${pendingData?.links.length || 0}個`}
        confirmLabel="読み込む"
        cancelLabel="キャンセル"
        onConfirm={handleConfirmLoad}
        onCancel={handleCancelLoad}
        type="warning"
      />
    </>
  )
}

export default Header

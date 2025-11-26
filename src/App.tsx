import './App.css'
import Scene from './components/3d/Scene'

function App() {
  return (
    <div className="app">
      <header className="header">
        <h1 className="title">マーケティング導線3D可視化アプリ</h1>
        <p className="subtitle">Phase 2: 3D基本ビュー実装中...</p>
      </header>
      <main className="scene-container">
        <Scene />
      </main>
    </div>
  )
}

export default App

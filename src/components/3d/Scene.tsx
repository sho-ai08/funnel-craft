import { Canvas, ThreeEvent } from '@react-three/fiber'
import { OrbitControls, Grid } from '@react-three/drei'
import SceneObjects from './TestNodes'
import { useStore } from '../../store/useStore'

const Scene = () => {
  const selectNode = useStore((state) => state.selectNode)
  const selectLink = useStore((state) => state.selectLink)

  const handleBackgroundClick = (e: ThreeEvent<MouseEvent>) => {
    // 背景クリックで選択解除
    if (e.delta < 2) {
      // deltaが小さい = ドラッグではなくクリック
      selectNode(null)
      selectLink(null)
    }
  }

  return (
    <div className="w-full h-full">
      <Canvas
        camera={{
          position: [10, 10, 10],
          fov: 50,
        }}
        style={{ background: '#1a1a1a' }}
        onClick={handleBackgroundClick}
      >
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />

        {/* Camera Controls */}
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          minDistance={5}
          maxDistance={50}
        />

        {/* Grid Helper */}
        <Grid
          args={[20, 20]}
          cellSize={1}
          cellColor="#6b6b6b"
          sectionSize={5}
          sectionColor="#9d4b4b"
          fadeDistance={30}
          fadeStrength={1}
          followCamera={false}
        />

        {/* Axis Helper (development only) */}
        <axesHelper args={[5]} />

        {/* Scene Objects (Nodes & Links) */}
        <SceneObjects />
      </Canvas>
    </div>
  )
}

export default Scene

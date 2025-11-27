import { useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Grid } from '@react-three/drei'
import SceneObjects from './TestNodes'
import { useStore } from '../../store/useStore'
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib'

const Scene = () => {
  const selectNode = useStore((state) => state.selectNode)
  const selectLink = useStore((state) => state.selectLink)
  const resetViewTrigger = useStore((state) => state.ui.resetViewTrigger)
  const autoFitTrigger = useStore((state) => state.ui.autoFitTrigger)
  const nodes = useStore((state) => state.nodes)

  const controlsRef = useRef<OrbitControlsImpl>(null)

  const handleBackgroundClick = () => {
    // 背景クリックで選択解除
    selectNode(null)
    selectLink(null)
  }

  // Reset view handler
  useEffect(() => {
    if (resetViewTrigger > 0 && controlsRef.current) {
      controlsRef.current.reset()
    }
  }, [resetViewTrigger])

  // Auto-fit handler
  useEffect(() => {
    if (autoFitTrigger > 0 && controlsRef.current && nodes.length > 0) {
      // Calculate bounding box of all nodes
      const positions = nodes.map(n => n.position)
      const xs = positions.map(p => p.x)
      const ys = positions.map(p => p.y)
      const zs = positions.map(p => p.z)

      const centerX = (Math.max(...xs) + Math.min(...xs)) / 2
      const centerY = (Math.max(...ys) + Math.min(...ys)) / 2
      const centerZ = (Math.max(...zs) + Math.min(...zs)) / 2

      const maxDistance = Math.max(
        Math.max(...xs) - Math.min(...xs),
        Math.max(...ys) - Math.min(...ys),
        Math.max(...zs) - Math.min(...zs)
      )

      const distance = Math.max(maxDistance * 1.5, 10)

      controlsRef.current.target.set(centerX, centerY, centerZ)
      if (controlsRef.current.object) {
        controlsRef.current.object.position.set(
          centerX + distance,
          centerY + distance,
          centerZ + distance
        )
      }
      controlsRef.current.update()
    }
  }, [autoFitTrigger, nodes])

  return (
    <div className="w-full h-full">
      <Canvas
        camera={{
          position: [10, 10, 10],
          fov: 50,
        }}
        style={{ background: '#1a1a1a' }}
        onPointerMissed={handleBackgroundClick}
      >
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />

        {/* Camera Controls */}
        <OrbitControls
          ref={controlsRef}
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

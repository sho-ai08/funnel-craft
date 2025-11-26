import { Canvas } from '@react-three/fiber'
import { OrbitControls, Grid } from '@react-three/drei'
import TestNodes from './TestNodes'

const Scene = () => {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{
          position: [10, 10, 10],
          fov: 50,
        }}
        style={{ background: '#1a1a1a' }}
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

        {/* Test Nodes */}
        <TestNodes />
      </Canvas>
    </div>
  )
}

export default Scene

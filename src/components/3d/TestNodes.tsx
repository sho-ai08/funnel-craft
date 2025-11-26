import { useRef } from 'react'
import { Mesh } from 'three'
import { useFrame } from '@react-three/fiber'
import { useStore } from '../../store/useStore'
import { NODE_COLORS } from '../../types'

const NodeSphere = ({
  position,
  color
}: {
  position: [number, number, number]
  color: string
}) => {
  const meshRef = useRef<Mesh>(null)

  // 微細な回転アニメーション
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

const TestNodes = () => {
  const nodes = useStore((state) => state.nodes)

  return (
    <group>
      {nodes.map((node) => (
        <NodeSphere
          key={node.id}
          position={[node.position.x, node.position.y, node.position.z]}
          color={NODE_COLORS[node.type]}
        />
      ))}
    </group>
  )
}

export default TestNodes

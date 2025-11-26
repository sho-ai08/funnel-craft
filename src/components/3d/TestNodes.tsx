import { useRef } from 'react'
import { Mesh } from 'three'
import { useFrame } from '@react-three/fiber'

const TestNodes = () => {
  const mesh1Ref = useRef<Mesh>(null)
  const mesh2Ref = useRef<Mesh>(null)
  const mesh3Ref = useRef<Mesh>(null)

  // Optional: Add subtle rotation animation
  useFrame(() => {
    if (mesh1Ref.current) {
      mesh1Ref.current.rotation.y += 0.005
    }
    if (mesh2Ref.current) {
      mesh2Ref.current.rotation.y += 0.005
    }
    if (mesh3Ref.current) {
      mesh3Ref.current.rotation.y += 0.005
    }
  })

  return (
    <group>
      {/* SNS投稿ノード（青系） */}
      <mesh ref={mesh1Ref} position={[-5, 0, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="#3B82F6" />
      </mesh>

      {/* 記事ノード（緑系） */}
      <mesh ref={mesh2Ref} position={[0, 0, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="#10B981" />
      </mesh>

      {/* フロントエンド商品ノード（オレンジ系） */}
      <mesh ref={mesh3Ref} position={[5, 0, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="#F97316" />
      </mesh>
    </group>
  )
}

export default TestNodes

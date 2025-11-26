import { useRef, useState } from 'react'
import { Mesh } from 'three'
import { useFrame, ThreeEvent } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import { Node, NODE_COLORS } from '../../types'
import { useStore } from '../../store/useStore'

interface NodeMeshProps {
  node: Node
}

const NodeMesh = ({ node }: NodeMeshProps) => {
  const meshRef = useRef<Mesh>(null)
  const [hovered, setHovered] = useState(false)

  const selectedNodeId = useStore((state) => state.ui.selectedNodeId)
  const selectNode = useStore((state) => state.selectNode)
  const isLinkCreationMode = useStore((state) => state.ui.isLinkCreationMode)
  const linkCreationSourceId = useStore((state) => state.ui.linkCreationSourceId)
  const setLinkCreationSource = useStore((state) => state.setLinkCreationSource)
  const setLinkCreationMode = useStore((state) => state.setLinkCreationMode)
  const addLink = useStore((state) => state.addLink)

  const isSelected = selectedNodeId === node.id

  // 微細な回転アニメーション
  useFrame(() => {
    if (meshRef.current && !isSelected) {
      meshRef.current.rotation.y += 0.005
    }
  })

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()

    // リンク作成モードの場合
    if (isLinkCreationMode) {
      if (!linkCreationSourceId) {
        // 開始ノードを設定
        setLinkCreationSource(node.id)
      } else {
        // 終了ノードでリンク作成
        if (linkCreationSourceId !== node.id) {
          // 自分自身へのリンクは作成しない
          addLink({
            source: linkCreationSourceId,
            target: node.id,
          })
        }
        // リンク作成モード終了
        setLinkCreationMode(false)
        setLinkCreationSource(null)
      }
    } else {
      // 通常モード：ノード選択
      selectNode(node.id)
    }
  }

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    setHovered(true)
    document.body.style.cursor = 'pointer'
  }

  const handlePointerOut = () => {
    setHovered(false)
    document.body.style.cursor = 'default'
  }

  const baseColor = NODE_COLORS[node.type]
  const scale = isSelected ? 1.3 : hovered ? 1.15 : 1

  return (
    <group position={[node.position.x, node.position.y, node.position.z]}>
      {/* ノード球体 */}
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        scale={scale}
      >
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color={baseColor}
          emissive={isSelected ? baseColor : hovered ? baseColor : '#000000'}
          emissiveIntensity={isSelected ? 0.5 : hovered ? 0.3 : 0}
        />
      </mesh>

      {/* ノードラベル */}
      <Text
        position={[0, 0.8, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {node.title}
      </Text>

      {/* 選択インジケーター */}
      {isSelected && (
        <mesh position={[0, 0, 0]} scale={1.5}>
          <ringGeometry args={[0.4, 0.45, 32]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
        </mesh>
      )}
    </group>
  )
}

export default NodeMesh

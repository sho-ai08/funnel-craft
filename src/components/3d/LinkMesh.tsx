import { useMemo, useState } from 'react'
import { Vector3, Quaternion } from 'three'
import { Line } from '@react-three/drei'
import { ThreeEvent } from '@react-three/fiber'
import { useStore } from '../../store/useStore'
import { Link } from '../../types'

interface LinkMeshProps {
  link: Link
}

const LinkMesh = ({ link }: LinkMeshProps) => {
  const [hovered, setHovered] = useState(false)

  const getNodeById = useStore((state) => state.getNodeById)
  const selectedLinkId = useStore((state) => state.ui.selectedLinkId)
  const selectLink = useStore((state) => state.selectLink)

  const sourceNode = getNodeById(link.source)
  const targetNode = getNodeById(link.target)

  const isSelected = selectedLinkId === link.id

  // ノードが存在しない場合は何も表示しない
  if (!sourceNode || !targetNode) return null

  // 位置計算をuseMemoで最適化（ノード位置が変わった時のみ再計算）
  const { sourcePos, targetPos, arrowPosition, arrowRotation } = useMemo(() => {
    const src = new Vector3(
      sourceNode.position.x,
      sourceNode.position.y,
      sourceNode.position.z
    )
    const tgt = new Vector3(
      targetNode.position.x,
      targetNode.position.y,
      targetNode.position.z
    )

    // 矢印の方向
    const dir = new Vector3().subVectors(tgt, src).normalize()

    // 矢印の位置（ターゲットノードの手前）
    const offset = 0.6 // ノードの半径 + 少し余裕
    const arrPos = new Vector3()
      .copy(tgt)
      .sub(dir.clone().multiplyScalar(offset))

    // 矢印の回転を計算
    const up = new Vector3(0, 1, 0)
    const quaternion = new Quaternion()
    quaternion.setFromUnitVectors(up, dir)

    return {
      sourcePos: src,
      targetPos: tgt,
      arrowPosition: arrPos,
      arrowRotation: quaternion,
    }
  }, [
    sourceNode.position.x,
    sourceNode.position.y,
    sourceNode.position.z,
    targetNode.position.x,
    targetNode.position.y,
    targetNode.position.z,
  ])

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    selectLink(link.id)
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

  const lineColor = isSelected ? '#ffffff' : hovered ? '#a0a0a0' : '#666666'
  const lineWidth = isSelected ? 3 : hovered ? 2.5 : 2

  return (
    <group>
      {/* 線 */}
      <Line
        points={[sourcePos, targetPos]}
        color={lineColor}
        lineWidth={lineWidth}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      />

      {/* 矢印（コーン） */}
      <mesh
        position={arrowPosition}
        quaternion={arrowRotation}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <coneGeometry args={[0.15, 0.3, 8]} />
        <meshStandardMaterial color={lineColor} />
      </mesh>
    </group>
  )
}

export default LinkMesh

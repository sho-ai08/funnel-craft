import { useRef, useMemo, useState } from 'react'
import { Vector3, BufferGeometry, ConeGeometry } from 'three'
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

  const sourcePos = new Vector3(
    sourceNode.position.x,
    sourceNode.position.y,
    sourceNode.position.z
  )
  const targetPos = new Vector3(
    targetNode.position.x,
    targetNode.position.y,
    targetNode.position.z
  )

  // 矢印の方向と位置を計算
  const direction = useMemo(() => {
    return new Vector3().subVectors(targetPos, sourcePos).normalize()
  }, [sourcePos, targetPos])

  const distance = useMemo(() => {
    return sourcePos.distanceTo(targetPos)
  }, [sourcePos, targetPos])

  // 矢印の位置（ターゲットノードの手前）
  const arrowPosition = useMemo(() => {
    const offset = 0.6 // ノードの半径 + 少し余裕
    return new Vector3()
      .copy(targetPos)
      .sub(direction.clone().multiplyScalar(offset))
  }, [targetPos, direction])

  // 矢印の回転を計算
  const arrowRotation = useMemo(() => {
    const up = new Vector3(0, 1, 0)
    const quaternion = new (window as any).THREE.Quaternion()
    quaternion.setFromUnitVectors(up, direction)
    return quaternion
  }, [direction])

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

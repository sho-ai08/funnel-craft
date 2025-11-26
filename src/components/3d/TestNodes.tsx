import { useStore } from '../../store/useStore'
import NodeMesh from './NodeMesh'
import LinkMesh from './LinkMesh'

const SceneObjects = () => {
  const nodes = useStore((state) => state.nodes)
  const links = useStore((state) => state.links)

  return (
    <group>
      {/* リンクを先に描画（ノードの下に表示） */}
      {links.map((link) => (
        <LinkMesh key={link.id} link={link} />
      ))}

      {/* ノードを後に描画（リンクの上に表示） */}
      {nodes.map((node) => (
        <NodeMesh key={node.id} node={node} />
      ))}
    </group>
  )
}

export default SceneObjects

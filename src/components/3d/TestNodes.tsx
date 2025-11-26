import { useStore } from '../../store/useStore'
import NodeMesh from './NodeMesh'

const TestNodes = () => {
  const nodes = useStore((state) => state.nodes)

  return (
    <group>
      {nodes.map((node) => (
        <NodeMesh key={node.id} node={node} />
      ))}
    </group>
  )
}

export default TestNodes

import { create } from 'zustand'
import { Node, Link, UIState } from '../types'
import { generateNodeId, generateLinkId } from '../utils/idGenerator'

interface StoreState {
  // データ
  nodes: Node[]
  links: Link[]

  // UI状態
  ui: UIState

  // ノード操作
  addNode: (node: Omit<Node, 'id'>) => void
  updateNode: (id: string, updates: Partial<Node>) => void
  deleteNode: (id: string) => void
  getNodeById: (id: string) => Node | undefined

  // リンク操作
  addLink: (link: Omit<Link, 'id'>) => void
  deleteLink: (id: string) => void
  getLinkById: (id: string) => Link | undefined
  getLinksForNode: (nodeId: string) => Link[]

  // UI操作
  selectNode: (id: string | null) => void
  selectLink: (id: string | null) => void
  setEditPanelOpen: (open: boolean) => void
  setLinkCreationMode: (active: boolean) => void
  setLinkCreationSource: (nodeId: string | null) => void
  triggerResetView: () => void
  triggerAutoFit: () => void
  toggleSidePanel: () => void
  applyAutoLayout: () => void

  // プロジェクト操作
  loadProject: (nodes: Node[], links: Link[]) => void
  clearProject: () => void
}

export const useStore = create<StoreState>((set, get) => ({
  // 初期状態
  nodes: [],
  links: [],
  ui: {
    selectedNodeId: null,
    selectedLinkId: null,
    isEditPanelOpen: false,
    isLinkCreationMode: false,
    linkCreationSourceId: null,
    resetViewTrigger: 0,
    autoFitTrigger: 0,
    isSidePanelOpen: true,
  },

  // ノード操作
  addNode: (nodeData) => {
    const newNode: Node = {
      ...nodeData,
      id: generateNodeId(),
    }
    set((state) => ({
      nodes: [...state.nodes, newNode],
    }))
  },

  updateNode: (id, updates) => {
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === id ? { ...node, ...updates } : node
      ),
    }))
  },

  deleteNode: (id) => {
    set((state) => ({
      nodes: state.nodes.filter((node) => node.id !== id),
      // 関連するリンクも削除
      links: state.links.filter(
        (link) => link.source !== id && link.target !== id
      ),
      // 選択状態もクリア
      ui: {
        ...state.ui,
        selectedNodeId: state.ui.selectedNodeId === id ? null : state.ui.selectedNodeId,
      },
    }))
  },

  getNodeById: (id) => {
    return get().nodes.find((node) => node.id === id)
  },

  // リンク操作
  addLink: (linkData) => {
    const newLink: Link = {
      ...linkData,
      id: generateLinkId(),
    }
    set((state) => ({
      links: [...state.links, newLink],
    }))
  },

  deleteLink: (id) => {
    set((state) => ({
      links: state.links.filter((link) => link.id !== id),
      ui: {
        ...state.ui,
        selectedLinkId: state.ui.selectedLinkId === id ? null : state.ui.selectedLinkId,
      },
    }))
  },

  getLinkById: (id) => {
    return get().links.find((link) => link.id === id)
  },

  getLinksForNode: (nodeId) => {
    return get().links.filter(
      (link) => link.source === nodeId || link.target === nodeId
    )
  },

  // UI操作
  selectNode: (id) => {
    set((state) => ({
      ui: {
        ...state.ui,
        selectedNodeId: id,
        selectedLinkId: null, // リンク選択を解除
      },
    }))
  },

  selectLink: (id) => {
    set((state) => ({
      ui: {
        ...state.ui,
        selectedLinkId: id,
        selectedNodeId: null, // ノード選択を解除
      },
    }))
  },

  setEditPanelOpen: (open) => {
    set((state) => ({
      ui: {
        ...state.ui,
        isEditPanelOpen: open,
      },
    }))
  },

  setLinkCreationMode: (active) => {
    set((state) => ({
      ui: {
        ...state.ui,
        isLinkCreationMode: active,
        linkCreationSourceId: active ? state.ui.linkCreationSourceId : null,
      },
    }))
  },

  setLinkCreationSource: (nodeId) => {
    set((state) => ({
      ui: {
        ...state.ui,
        linkCreationSourceId: nodeId,
      },
    }))
  },

  triggerResetView: () => {
    set((state) => ({
      ui: {
        ...state.ui,
        resetViewTrigger: state.ui.resetViewTrigger + 1,
      },
    }))
  },

  triggerAutoFit: () => {
    set((state) => ({
      ui: {
        ...state.ui,
        autoFitTrigger: state.ui.autoFitTrigger + 1,
      },
    }))
  },

  toggleSidePanel: () => {
    set((state) => ({
      ui: {
        ...state.ui,
        isSidePanelOpen: !state.ui.isSidePanelOpen,
      },
    }))
  },

  applyAutoLayout: () => {
    const state = get()
    const { nodes, links } = state

    if (nodes.length === 0) return

    // Calculate node levels based on link structure
    const nodeLevels = new Map<string, number>()

    // Initialize all nodes to level 0
    nodes.forEach((node) => nodeLevels.set(node.id, 0))

    // Calculate levels based on links (BFS approach)
    let changed = true
    let iterations = 0
    const maxIterations = 100

    while (changed && iterations < maxIterations) {
      changed = false
      iterations++

      links.forEach((link) => {
        const sourceLevel = nodeLevels.get(link.source) || 0
        const targetLevel = nodeLevels.get(link.target) || 0
        const newTargetLevel = sourceLevel + 1

        if (newTargetLevel > targetLevel) {
          nodeLevels.set(link.target, newTargetLevel)
          changed = true
        }
      })
    }

    // Group nodes by level and category
    const levelGroups: Map<number, { traffic: string[]; cashpoint: string[] }> = new Map()

    nodes.forEach((node) => {
      const level = nodeLevels.get(node.id) || 0
      if (!levelGroups.has(level)) {
        levelGroups.set(level, { traffic: [], cashpoint: [] })
      }
      levelGroups.get(level)![node.category].push(node.id)
    })

    // Calculate positions
    const levelSpacing = 5 // Distance between levels
    const nodeSpacing = 3 // Distance between nodes in same level
    const maxLevel = Math.max(...Array.from(nodeLevels.values()))

    nodes.forEach((node) => {
      const level = nodeLevels.get(node.id) || 0
      const levelGroup = levelGroups.get(level)!
      const categoryNodes = levelGroup[node.category]
      const indexInCategory = categoryNodes.indexOf(node.id)
      const categoryCount = categoryNodes.length

      // X: Level-based (left to right progression)
      const x = (level - maxLevel / 2) * levelSpacing

      // Y: Spread nodes vertically within level
      const yOffset = (indexInCategory - (categoryCount - 1) / 2) * nodeSpacing
      const y = yOffset

      // Z: Separate traffic (negative) from cashpoint (positive)
      const z = node.category === 'traffic' ? -3 : 3

      // Update node position
      set((state) => ({
        nodes: state.nodes.map((n) =>
          n.id === node.id
            ? { ...n, position: { x, y, z } }
            : n
        ),
      }))
    })
  },

  // プロジェクト操作
  loadProject: (nodes, links) => {
    set({
      nodes,
      links,
      ui: {
        selectedNodeId: null,
        selectedLinkId: null,
        isEditPanelOpen: false,
        isLinkCreationMode: false,
        linkCreationSourceId: null,
        resetViewTrigger: 0,
        autoFitTrigger: 0,
        isSidePanelOpen: true,
      },
    })
  },

  clearProject: () => {
    set({
      nodes: [],
      links: [],
      ui: {
        selectedNodeId: null,
        selectedLinkId: null,
        isEditPanelOpen: false,
        isLinkCreationMode: false,
        linkCreationSourceId: null,
        resetViewTrigger: 0,
        autoFitTrigger: 0,
        isSidePanelOpen: true,
      },
    })
  },
}))

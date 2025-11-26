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
      },
    })
  },
}))

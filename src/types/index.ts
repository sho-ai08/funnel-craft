// ノードの種類
export type NodeType = 'sns' | 'article' | 'ad' | 'frontend' | 'backend'

// ノードのカテゴリ
export type NodeCategory = 'traffic' | 'cashpoint'

// メトリクス（カスタムフィールド）
export interface Metric {
  name: string
  value: number
}

// 3D座標
export interface Position {
  x: number
  y: number
  z: number
}

// ノード
export interface Node {
  id: string
  title: string
  url?: string
  category: NodeCategory
  type: NodeType
  description?: string
  metrics: Metric[]
  position: Position
}

// リンク（エッジ）
export interface Link {
  id: string
  source: string  // ノードID
  target: string  // ノードID
}

// プロジェクトファイル全体
export interface ProjectData {
  version: string
  exportedAt: string
  nodes: Node[]
  links: Link[]
}

// UI状態
export interface UIState {
  selectedNodeId: string | null
  selectedLinkId: string | null
  isEditPanelOpen: boolean
  isLinkCreationMode: boolean
  linkCreationSourceId: string | null
}

// ノードの色定義
export const NODE_COLORS: Record<NodeType, string> = {
  sns: '#3B82F6',       // 青系
  article: '#10B981',   // 緑系
  ad: '#F59E0B',        // 黄系
  frontend: '#F97316',  // オレンジ系
  backend: '#EF4444',   // 赤系
}

// カテゴリの日本語名
export const CATEGORY_LABELS: Record<NodeCategory, string> = {
  traffic: '集客',
  cashpoint: 'キャッシュポイント',
}

// ノード種類の日本語名
export const NODE_TYPE_LABELS: Record<NodeType, string> = {
  sns: 'SNS投稿',
  article: '記事',
  ad: '広告',
  frontend: 'フロントエンド商品',
  backend: 'バックエンド商品',
}

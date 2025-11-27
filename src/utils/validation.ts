import { Node, Link, ProjectData } from '../types'

/**
 * ノードデータのバリデーション
 */
export const validateNode = (node: any): node is Node => {
  if (!node || typeof node !== 'object') return false

  // 必須フィールドのチェック
  if (typeof node.id !== 'string' || !node.id) return false
  if (typeof node.title !== 'string' || !node.title) return false
  if (node.category !== 'traffic' && node.category !== 'cashpoint') return false

  const validTypes = ['sns', 'article', 'ad', 'frontend', 'backend']
  if (!validTypes.includes(node.type)) return false

  // メトリクスの検証
  if (!Array.isArray(node.metrics)) return false
  for (const metric of node.metrics) {
    if (typeof metric.name !== 'string' || typeof metric.value !== 'number') {
      return false
    }
  }

  // 位置情報の検証
  if (!node.position || typeof node.position !== 'object') return false
  if (
    typeof node.position.x !== 'number' ||
    typeof node.position.y !== 'number' ||
    typeof node.position.z !== 'number'
  ) {
    return false
  }

  // オプショナルフィールドの検証
  if (node.url !== undefined && typeof node.url !== 'string') return false
  if (node.description !== undefined && typeof node.description !== 'string') return false

  return true
}

/**
 * リンクデータのバリデーション
 */
export const validateLink = (link: any): link is Link => {
  if (!link || typeof link !== 'object') return false

  if (typeof link.id !== 'string' || !link.id) return false
  if (typeof link.source !== 'string' || !link.source) return false
  if (typeof link.target !== 'string' || !link.target) return false

  return true
}

/**
 * プロジェクトデータ全体のバリデーション
 */
export const validateProjectData = (data: any): {
  valid: boolean
  error?: string
  data?: ProjectData
} => {
  // データ形式の基本チェック
  if (!data || typeof data !== 'object') {
    return { valid: false, error: '無効なデータ形式です' }
  }

  // ノード配列のチェック
  if (!Array.isArray(data.nodes)) {
    return { valid: false, error: 'ノードデータが見つかりません' }
  }

  // リンク配列のチェック
  if (!Array.isArray(data.links)) {
    return { valid: false, error: 'リンクデータが見つかりません' }
  }

  // 各ノードのバリデーション
  for (let i = 0; i < data.nodes.length; i++) {
    if (!validateNode(data.nodes[i])) {
      return {
        valid: false,
        error: `ノード #${i + 1} のデータが不正です`
      }
    }
  }

  // 各リンクのバリデーション
  const nodeIds = new Set(data.nodes.map((n: Node) => n.id))
  for (let i = 0; i < data.links.length; i++) {
    const link = data.links[i]

    if (!validateLink(link)) {
      return {
        valid: false,
        error: `リンク #${i + 1} のデータが不正です`
      }
    }

    // リンクが存在しないノードを参照していないかチェック
    if (!nodeIds.has(link.source)) {
      return {
        valid: false,
        error: `リンク #${i + 1} が存在しないノード (${link.source}) を参照しています`
      }
    }
    if (!nodeIds.has(link.target)) {
      return {
        valid: false,
        error: `リンク #${i + 1} が存在しないノード (${link.target}) を参照しています`
      }
    }
  }

  // バージョン情報のチェック（オプショナル）
  const version = data.version || '1.0'
  const exportedAt = data.exportedAt || new Date().toISOString()

  return {
    valid: true,
    data: {
      version,
      exportedAt,
      nodes: data.nodes,
      links: data.links,
    },
  }
}

/**
 * ID重複チェック
 */
export const checkDuplicateIds = (nodes: Node[], links: Link[]): {
  hasDuplicates: boolean
  duplicateType?: 'node' | 'link'
  duplicateId?: string
} => {
  // ノードIDの重複チェック
  const nodeIds = new Set<string>()
  for (const node of nodes) {
    if (nodeIds.has(node.id)) {
      return {
        hasDuplicates: true,
        duplicateType: 'node',
        duplicateId: node.id,
      }
    }
    nodeIds.add(node.id)
  }

  // リンクIDの重複チェック
  const linkIds = new Set<string>()
  for (const link of links) {
    if (linkIds.has(link.id)) {
      return {
        hasDuplicates: true,
        duplicateType: 'link',
        duplicateId: link.id,
      }
    }
    linkIds.add(link.id)
  }

  return { hasDuplicates: false }
}

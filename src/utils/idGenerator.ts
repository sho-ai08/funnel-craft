import { nanoid } from 'nanoid'

/**
 * ノード用のユニークIDを生成
 */
export const generateNodeId = (): string => {
  return `node_${nanoid(10)}`
}

/**
 * リンク用のユニークIDを生成
 */
export const generateLinkId = (): string => {
  return `link_${nanoid(10)}`
}

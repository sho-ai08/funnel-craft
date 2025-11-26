import { Node } from '../types'

/**
 * テスト用のサンプルノードデータ
 */
export const sampleNodes: Omit<Node, 'id'>[] = [
  {
    title: 'X投稿：新商品告知',
    url: 'https://x.com/example/status/123456',
    category: 'traffic',
    type: 'sns',
    description: 'SNSでの新商品発売告知',
    metrics: [
      { name: 'インプレッション', value: 15000 },
      { name: 'クリック数', value: 320 },
      { name: 'CTR', value: 2.1 },
    ],
    position: { x: -5, y: 0, z: 0 },
  },
  {
    title: 'ブログ記事：商品レビュー',
    url: 'https://example.com/blog/review',
    category: 'traffic',
    type: 'article',
    description: '詳細な商品レビュー記事',
    metrics: [
      { name: 'PV', value: 5000 },
      { name: 'クリック数', value: 250 },
    ],
    position: { x: 0, y: 0, z: 0 },
  },
  {
    title: 'フロントエンド商品：入門書',
    url: 'https://example.com/products/beginner',
    category: 'cashpoint',
    type: 'frontend',
    description: '低価格の入門商品',
    metrics: [
      { name: '売上', value: 150000 },
      { name: '販売数', value: 50 },
      { name: '単価', value: 3000 },
    ],
    position: { x: 5, y: 0, z: 0 },
  },
]

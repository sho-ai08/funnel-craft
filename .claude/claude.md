# マーケティング導線3D可視化アプリ 開発進捗管理

## プロジェクト情報

- **プロジェクト名**: マーケティング導線3D可視化アプリ
- **開発開始日**: 2025-11-26
- **デプロイ先**: Vercel
- **リポジトリ**: GitHub
- **開発ツール**: Claude Code

---

## 開発状況サマリー

| Phase | ステータス | 進捗率 | 完了日 |
|-------|----------|--------|--------|
| Phase 1: プロジェクト基盤構築 | ✅ 完了 | 100% | 2025-11-26 |
| Phase 2: 3D基本ビューの実装 | ✅ 完了 | 100% | 2025-11-26 |
| Phase 3: データ構造と状態管理 | ✅ 完了 | 100% | 2025-11-26 |
| Phase 4: ノード管理機能 | ✅ 完了 | 95% | 2025-11-26 |
| Phase 5: リンク管理機能 | ✅ 完了 | 100% | 2025-11-26 |
| Phase 6: UI/レイアウトの実装 | ✅ 完了 | 100% | 2025-11-27 |
| Phase 7: レイアウト・ビュー機能 | ✅ 完了 | 100% | 2025-11-27 |
| Phase 8: 保存・読み込み機能 | 未着手 | 0% | - |
| Phase 9: エクスポート機能 | 未着手 | 0% | - |
| Phase 10: 最終調整とテスト | 未着手 | 0% | - |
| Phase 11: デプロイ準備 | 未着手 | 0% | - |
| Phase 12: デプロイ実行 | 未着手 | 0% | - |

**全体進捗**: 58% (7/12 phases completed)

---

## Phase 1: プロジェクト基盤構築

### ステータス
✅ 完了

### タスクチェックリスト
- [x] Viteを使用したReactプロジェクトの初期化
- [x] Git初期化とGitHubリポジトリの作成
- [x] 必要なライブラリのインストール
  - [x] @react-three/fiber (v8.15.0)
  - [x] @react-three/drei (v9.92.0)
  - [x] three (v0.160.0)
  - [x] zustand (v5.0.8)
  - [x] tailwindcss
- [x] Tailwind CSSのセットアップ
- [x] プロジェクト構造の設計
- [x] TypeScript設定の確認・調整
- [x] ESLint/Prettier設定

### 実装メモ
- プロジェクト構造:
  ```
  src/
  ├── components/
  │   ├── 3d/          # 3D関連コンポーネント
  │   ├── ui/          # UIコンポーネント
  │   └── layout/      # レイアウトコンポーネント
  ├── store/           # Zustand store
  ├── types/           # TypeScript型定義
  ├── utils/           # ユーティリティ関数
  └── App.tsx
  ```
- React Three Fiber v9はReact 19を要求するため、React 18互換のv8.15.0を使用
- 追加ライブラリ: nanoid, jspdf, html2canvas もインストール済み
- Tailwind CSSディレクティブをindex.cssに追加
- Git初期化とコミット完了

### 問題点・課題
- npm audit で2件のhigh severity vulnerabilities検出（後で対応検討）
- React Three Fiberの最新バージョン(v9)はReact 19が必要だが、安定性のためReact 18 + React Three Fiber v8を選択

### 完了日
2025-11-26

---

## Phase 2: 3D基本ビューの実装

### ステータス
✅ 完了

### タスクチェックリスト
- [x] React Three Fiberでの基本シーン構築
- [x] Canvas設定
- [x] OrbitControlsの実装
- [x] グリッド・軸ヘルパーの追加
- [x] 基本的なライティング設定
- [x] テスト用の球体ノードを配置

### 実装メモ
- **ファイル構成**:
  - `src/components/3d/Scene.tsx`: メイン3Dシーンコンポーネント
  - `src/components/3d/TestNodes.tsx`: テスト用ノードコンポーネント
- **カメラ設定**:
  - 初期位置: [10, 10, 10]
  - FOV: 50度
- **OrbitControls**:
  - enableDamping: スムーズな操作感
  - minDistance: 5, maxDistance: 50
- **ライティング**:
  - AmbientLight (intensity: 0.5)
  - DirectionalLight (position: [10, 10, 5], intensity: 1)
- **グリッド**:
  - 20x20セル、セルサイズ: 1
  - セクションサイズ: 5
- **テストノード** (3個の球体):
  - 青 (#3B82F6): SNS投稿ノード
  - 緑 (#10B981): 記事ノード
  - オレンジ (#F97316): フロントエンド商品ノード
- 各ノードに微細な回転アニメーション追加
- グラデーションヘッダー実装

### 問題点・課題
なし

### 完了日
2025-11-26

---

## Phase 3: データ構造と状態管理

### ステータス
✅ 完了

### タスクチェックリスト
- [x] TypeScript型定義の作成
- [x] Zustandストアの設計
- [x] CRUD操作関数の実装
- [x] ユニークID生成ユーティリティ

### 実装メモ
- **ファイル構成**:
  - `src/types/index.ts`: 全型定義（Node, Link, Metric, ProjectData, UIState等）
  - `src/utils/idGenerator.ts`: ID生成ユーティリティ（nanoid使用）
  - `src/store/useStore.ts`: Zustandストア
  - `src/utils/sampleData.ts`: テスト用サンプルデータ
- **型定義**:
  - NodeType: 'sns' | 'article' | 'ad' | 'frontend' | 'backend'
  - NodeCategory: 'traffic' | 'cashpoint'
  - Node, Link, Metric, Position, ProjectData, UIState
  - 色定義とラベル定義も含む
- **Zustandストア機能**:
  - ノードCRUD: addNode, updateNode, deleteNode, getNodeById
  - リンクCRUD: addLink, deleteLink, getLinkById, getLinksForNode
  - UI状態: selectNode, selectLink, setEditPanelOpen, setLinkCreationMode
  - プロジェクト: loadProject, clearProject
  - ノード削除時に関連リンクも自動削除
- **ID生成**:
  - nanoidを使用した10文字のユニークID
  - プレフィックス付き（node_xxx, link_xxx）
- TestNodesコンポーネントをストアベースに書き換え
- App.tsxでサンプルデータ初期化
- ヘッダーにノード数表示追加

### 問題点・課題
なし

### 完了日
2025-11-26

---

## Phase 4: ノード管理機能

### ステータス
✅ ほぼ完了 (95%)

### タスクチェックリスト
- [x] ノードの3D表示コンポーネント作成
  - [x] ラベル表示（Text component）
  - [x] ホバー効果（スケール＋発光）
  - [x] クリック選択（リング表示）
- [x] ノード追加機能
  - [x] サイドパネルに「+」ボタン
  - [x] デフォルト位置で新規ノード作成
- [x] ノード編集パネル（モーダル）
  - [x] タイトル、URL、カテゴリ、種類、説明入力
  - [x] カスタムメトリクス管理（最大10個）
  - [x] 保存・キャンセルボタン
- [x] ノード削除機能
  - [x] 削除ボタン
  - [x] 確認ダイアログ
- [ ] ノードのドラッグ&ドロップ移動（後日実装）
- [ ] Deleteキー対応（後日実装）

### 実装メモ
- **ファイル構成**:
  - `src/components/3d/NodeMesh.tsx`: 改良されたノード3D表示
  - `src/components/ui/SidePanel.tsx`: サイドパネル
  - `src/components/ui/NodeEditPanel.tsx`: ノード編集モーダル
- **NodeMesh機能**:
  - Textコンポーネントでノードタイトル表示
  - ホバー時: スケール1.15、発光エフェクト
  - 選択時: スケール1.3、白いリング表示
  - クリックでストアの選択状態を更新
  - 背景クリックで選択解除
- **SidePanel機能**:
  - ノード追加ボタン（紫色）
  - ノード一覧（色インジケーター付き）
  - 選択ノード編集ボタン
  - リストクリックでノード選択＋編集パネル表示
- **NodeEditPanel機能**:
  - モーダルオーバーレイ
  - 全ノード情報の編集
  - メトリクス動的追加・削除
  - バリデーション（タイトル必須）
  - ノード削除（確認ダイアログ付き）
- **スタイリング**:
  - ダークテーマのモダンUI
  - グラデーション、シャドウ、トランジション
  - レスポンシブフォーム
  - 300px幅のサイドパネル

### 問題点・課題
- ドラッグ&ドロップ機能は未実装（Phase 7で実装予定）
- Deleteキーでの削除は未実装（Phase 10で実装予定）

### 完了日
2025-11-26 (95%完了)

---

## Phase 5: リンク管理機能

### ステータス
✅ 完了

### タスクチェックリスト
- [x] リンクの3D描画
  - [x] Line + Cone での矢印表示
  - [x] 方向性の可視化
  - [x] ホバー・選択エフェクト
- [x] リンク作成機能（クリック選択）
  - [x] 2ステップ選択（開始→終了）
  - [x] 作成モードトグル
  - [x] 自己リンク防止
- [x] リンク選択機能
  - [x] クリックで選択
  - [x] 白色でハイライト
- [x] リンク削除機能
  - [x] 削除ボタン
  - [x] 確認ダイアログ
  - [x] ノード削除時の自動削除
- [ ] リンク作成機能（ドラッグ&ドロップ）（実装せず）

### 実装メモ
- **ファイル構成**:
  - `src/components/3d/LinkMesh.tsx`: リンク3D表示コンポーネント
  - SidePanelにリンク管理セクション追加
  - SceneObjects（旧TestNodes）にリンク描画追加
- **LinkMesh機能**:
  - @react-three/dreiのLineコンポーネント使用
  - Cone geometryで矢印ヘッド作成
  - 方向ベクトル計算でターゲット向きに配置
  - 選択時: 白色、ホバー時: グレー、通常時: ダークグレー
  - クリックでリンク選択
- **リンク作成フロー**:
  1. 「リンク作成モード」ボタンクリック
  2. 開始ノードをクリック
  3. 終了ノードをクリック
  4. リンク自動作成＆モード終了
- **UI機能**:
  - リンク作成モードパネル（進捗表示）
  - 開始ノードタイトル表示
  - キャンセルボタン
  - リンク数表示
  - 選択リンク削除ボタン
- **サンプルデータ**:
  - ノード間に2本のサンプルリンク作成
  - ノード1→ノード2、ノード2→ノード3

### 問題点・課題
- ドラッグ&ドロップ方式は実装せず（クリック方式で十分機能的）

### 完了日
2025-11-26

---

## Phase 6: UI/レイアウトの実装

### ステータス
✅ 完了

### タスクチェックリスト
- [x] ヘッダーコンポーネント
  - [x] 保存・読み込み・エクスポートボタン
  - [x] エクスポートドロップダウンメニュー（PNG/PDF）
- [x] サイドパネル強化
  - [x] 検索フィルター（タイトル・説明・URL）
  - [x] カテゴリ別アコーディオン（集客/キャッシュポイント）
  - [x] ビューコントロールボタン（リセット/全体表示）
- [x] ステータスバーコンポーネント
  - [x] ノード・リンク数表示
  - [x] 操作ヒント表示
  - [x] 選択中ノード情報表示
- [x] レスポンシブレイアウト
  - [x] サイドパネル開閉トグルボタン

### 実装メモ
- **ファイル構成**:
  - `src/components/layout/Header.tsx`: 新規作成
  - `src/components/layout/StatusBar.tsx`: 新規作成
  - `src/components/ui/SidePanel.tsx`: 大幅強化
  - `src/components/3d/Scene.tsx`: ビューコントロール機能追加
- **Header機能**:
  - JSON保存機能（データ＋タイムスタンプ）
  - JSON読み込み機能（Phase 8で完全実装予定）
  - エクスポートドロップダウン（PNG/PDF、Phase 9で実装予定）
  - グラデーションヘッダーの右側にボタン配置
- **SidePanel強化**:
  - リアルタイム検索フィルター（タイトル・説明・URL対象）
  - クリアボタン付き検索ボックス
  - カテゴリ別アコーディオン（展開/折りたたみ）
  - 「🔄 ビューをリセット」ボタン（初期視点に戻す）
  - 「🎯 全体を表示」ボタン（全ノードが見えるよう自動調整）
- **StatusBar機能**:
  - ノード・リンク数の統計表示
  - コンテキストに応じた操作ヒント
    - リンク作成モード中: 手順表示
    - ノード選択中: 選択情報表示
    - 通常時: 基本操作説明
  - 選択ノードのタイプバッジと名称表示
- **ビューコントロール**:
  - OrbitControlsのrefを使用
  - リセット: controls.reset()
  - 全体表示: ノード位置から境界ボックス計算→カメラ位置自動調整
  - トリガー方式（カウンターインクリメント）でuseEffect発火
- **レスポンシブ対応**:
  - サイドパネル開閉トグルボタン（左上に固定配置）
  - パネル非表示時は3Dビューが全画面表示
  - 状態をZustandストアで管理
- **UIState拡張**:
  - resetViewTrigger: number
  - autoFitTrigger: number
  - isSidePanelOpen: boolean

### 問題点・課題
なし（すべて正常動作）

### 完了日
2025-11-27

---

## Phase 7: レイアウト・ビュー機能

### ステータス
✅ 完了

### タスクチェックリスト
- [x] 手動配置機能の完成
  - [x] ノードのドラッグ&ドロップ移動（Shift+ドラッグ）
  - [x] X, Z軸方向への自由移動（Y軸固定）
- [x] 自動レイアウトアルゴリズムの実装
  - [x] 階層型レイアウトアルゴリズム
  - [x] リンク構造に基づくレベル計算（BFS）
  - [x] カテゴリ別配置（traffic: Z<0, cashpoint: Z>0）
  - [x] 自動レイアウトボタンの実装
- [x] リセットビュー機能（Phase 6で実装済み）
- [x] オートフィット機能（Phase 6で実装済み）

### 実装メモ
- **ファイル構成**:
  - `src/components/3d/NodeMesh.tsx`: ドラッグ&ドロップ機能追加
  - `src/store/useStore.ts`: `applyAutoLayout`関数追加
  - `src/components/ui/SidePanel.tsx`: 自動レイアウトボタン追加
  - `src/components/layout/StatusBar.tsx`: ドラッグ操作ヒント追加
- **ドラッグ&ドロップ機能**:
  - Shift+ドラッグでノード移動モード
  - `onPointerDown`, `onPointerMove`, `onPointerUp`イベント使用
  - ドラッグ中はOrbitControlsが動作しないようpointerCaptureを使用
  - マウス位置から3D空間の座標を計算（Y軸は固定、XZ平面で移動）
  - カーソルスタイルの動的変更（grab/grabbing/pointer）
  - リンク作成モード中はドラッグ無効
- **自動レイアウトアルゴリズム**:
  - **階層レベル計算**: リンク構造を元にBFS（幅優先探索）で各ノードのレベルを計算
  - **X軸配置**: レベルに基づいて左右に配置（levelSpacing: 5単位）
  - **Y軸配置**: 同じレベル内でノードを垂直方向に均等配置（nodeSpacing: 3単位）
  - **Z軸配置**: カテゴリで分離（traffic: -3, cashpoint: +3）
  - **無限ループ防止**: 最大100イテレーションで計算打ち切り
  - 各ノードの位置をストアで一括更新
- **UI/UX改善**:
  - StatusBarにドラッグ操作のヒント追加
  - 「✨ 自動レイアウト」ボタンをビューコントロールセクションに追加
  - Shift+ドラッグ時のカーソル変化で操作性向上

### 問題点・課題
- TailwindCSS v4のPostCSS警告が表示されているが、実際の動作には影響なし（Phase 10で対応）
- 3軸全方向のドラッグは未実装（Y軸固定でシンプルに）

### 完了日
2025-11-27

---

## Phase 8: 保存・読み込み機能

### ステータス
⚪️ 未着手

### タスクチェックリスト
- [ ] プロジェクトデータのJSON変換
- [ ] JSON保存機能
- [ ] JSON読み込み機能
- [ ] 確認ダイアログ
- [ ] エラーハンドリング

### 実装メモ

### 問題点・課題

### 完了日

---

## Phase 9: エクスポート機能

### ステータス
⚪️ 未着手

### タスクチェックリスト
- [ ] PNG出力機能
- [ ] PDF出力機能の準備
- [ ] PDF出力機能の実装
- [ ] エクスポートオプションUI

### 実装メモ

### 問題点・課題

### 完了日

---

## Phase 10: 最終調整とテスト

### ステータス
⚪️ 未着手

### タスクチェックリスト
- [ ] パフォーマンス最適化
- [ ] ツールチップの追加
- [ ] キーボードショートカット実装
- [ ] エラーハンドリング強化
- [ ] アクセシビリティ改善
- [ ] ユーザビリティテスト

### 実装メモ

### 問題点・課題

### 完了日

---

## Phase 11: デプロイ準備

### ステータス
⚪️ 未着手

### タスクチェックリスト
- [ ] 本番ビルド設定の確認
- [ ] 環境変数の整理
- [ ] README.md作成
- [ ] ドキュメント整備
- [ ] ライセンス設定
- [ ] .gitignoreの確認

### 実装メモ

### 問題点・課題

### 完了日

---

## Phase 12: デプロイ実行

### ステータス
⚪️ 未着手

### タスクチェックリスト
- [ ] GitHubリポジトリの最終確認
- [ ] Vercelプロジェクト設定
- [ ] デプロイ実行
- [ ] 本番環境での動作確認
- [ ] カスタムドメイン設定（オプション）
- [ ] 継続的デプロイの確認

### 実装メモ

### 問題点・課題

### 完了日

---

## 技術的決定事項

### 採用技術
- **フロントエンドフレームワーク**: React (Vite)
- **3Dライブラリ**: Three.js + React Three Fiber
- **UIライブラリ**: Tailwind CSS
- **状態管理**: Zustand
- **言語**: TypeScript
- **デプロイ**: Vercel
- **バージョン管理**: GitHub

### ライブラリ一覧
- react (v18.3.1)
- react-dom (v18.3.1)
- @react-three/fiber (v8.15.0)
- @react-three/drei (v9.92.0)
- three (v0.160.0)
- zustand (v5.0.8)
- tailwindcss
- jspdf
- html2canvas
- nanoid

---

## 開発ログ

### 2025-11-26
- ✅ プロジェクト要件定義書の確認
- ✅ 実施計画書の作成 (docs/implementation_plan.md)
- ✅ 開発進捗管理ファイルの作成 (claude.md)
- ✅ **Phase 1完了: プロジェクト基盤構築**
  - Vite + React + TypeScript プロジェクト初期化
  - フォルダ構造作成 (src/components/{3d,ui,layout}, store, types, utils)
  - コアライブラリインストール (React Three Fiber, Three.js, Zustand)
  - Tailwind CSS セットアップ
  - ユーティリティライブラリインストール (nanoid, jspdf, html2canvas)
  - Git初期化と初回コミット
- ✅ **Phase 2完了: 3D基本ビューの実装**
  - React Three Fiberでの3Dシーン構築
  - OrbitControls実装（回転・ズーム・パン）
  - ライティング設定（AmbientLight + DirectionalLight）
  - グリッド・軸ヘルパー追加
  - テスト用球体ノード3個配置（青/緑/オレンジ）
  - グラデーションヘッダー実装
  - 開発サーバー動作確認完了
- ✅ **Phase 3完了: データ構造と状態管理**
  - TypeScript型定義作成（Node, Link, Metric, UIState等）
  - Zustandストア実装（ノード/リンクCRUD、UI状態管理）
  - ID生成ユーティリティ（nanoid）
  - サンプルデータ作成と初期化
  - TestNodesコンポーネントのストア連携
  - 実施計画書更新（Phase 1,2完了マーク）
- ✅ **Phase 4完了: ノード管理機能 (95%)**
  - NodeMeshコンポーネント（ラベル、ホバー、選択）
  - SidePanelコンポーネント（追加ボタン、ノード一覧）
  - NodeEditPanelモーダル（全項目編集、メトリクス管理）
  - ノード追加・編集・削除機能完成
  - ダークテーマのモダンUI実装
  - 開発サーバー動作確認
  - ※ドラッグ&ドロップは後日実装
- ✅ **Phase 5完了: リンク管理機能**
  - LinkMeshコンポーネント（矢印付き3D表示）
  - クリック2ステップ方式でリンク作成
  - リンク作成モードUI（開始/終了ノード選択）
  - リンク選択・削除機能
  - サンプルリンク2本追加
  - ノード削除時のリンク自動削除
  - 開発サーバー動作確認
- ✅ **Phase 6完了: UI/レイアウトの実装**
  - Header コンポーネント作成（保存・読み込み・エクスポート）
  - StatusBar コンポーネント作成（統計・ヒント・選択情報）
  - SidePanel 強化（検索フィルター・カテゴリアコーディオン・ビューコントロール）
  - レスポンシブ対応（サイドパネル開閉トグル）
  - ビューコントロール実装（リセット・全体表示）
  - 開発サーバー動作確認
- ✅ **Phase 7完了: レイアウト・ビュー機能**
  - ノードのドラッグ&ドロップ移動実装（Shift+ドラッグ）
  - 自動レイアウトアルゴリズム実装（階層型BFSベース）
  - カテゴリ別配置（traffic: Z<0, cashpoint: Z>0）
  - 自動レイアウトボタン追加
  - StatusBarにドラッグ操作ヒント追加
  - 開発サーバー動作確認
- 📝 次回: Phase 8（保存・読み込み機能）

---

## 課題・懸念事項

### 技術的課題
- Three.jsのパフォーマンス最適化（100ノード対応）
- PDF出力の品質確保
- TailwindCSS v4のPostCSS警告対応（Phase 10で対応予定）

### 今後の検討事項
- ブラウザ互換性テストの範囲
- キーボードショートカット（Delete キー等）の実装（Phase 10で対応予定）
- データバリデーションの強化

---

## 参考資料

- 要件定義書: `/Users/iserishoya/test_cursor/3Dflow/requirements.md`
- 実施計画書: `/Users/iserishoya/test_cursor/3Dflow/docs/implementation_plan.md`
- React Three Fiber: https://docs.pmnd.rs/react-three-fiber
- Three.js: https://threejs.org/docs/
- Zustand: https://github.com/pmndrs/zustand

---

**最終更新**: 2025-11-27 08:56 JST

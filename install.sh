#!/bin/bash

# Funnel Craft インストールスクリプト
# 使い方: curl -fsSL https://raw.githubusercontent.com/sho-ai08/funnel-craft/main/install.sh | bash

set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Funnel Craft インストーラー"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 変数
APP_NAME="Funnel Craft"
DMG_URL="https://github.com/sho-ai08/funnel-craft/releases/download/v1.0.0/Funnel_Craft_v1.0.0_macOS.dmg"
TMP_DIR=$(mktemp -d)
DMG_PATH="$TMP_DIR/FunnelCraft.dmg"
MOUNT_POINT="$TMP_DIR/mount"
APP_PATH="/Applications/$APP_NAME.app"

# クリーンアップ関数
cleanup() {
    echo "クリーンアップ中..."
    if [ -d "$MOUNT_POINT" ]; then
        hdiutil detach "$MOUNT_POINT" 2>/dev/null || true
    fi
    rm -rf "$TMP_DIR"
}

trap cleanup EXIT

# ダウンロード
echo "📥 $APP_NAME をダウンロード中..."
if ! curl -L -o "$DMG_PATH" "$DMG_URL" --progress-bar; then
    echo "❌ エラー: ダウンロードに失敗しました。"
    exit 1
fi

# マウント
echo "📀 DMGをマウント中..."
mkdir -p "$MOUNT_POINT"
if ! hdiutil attach "$DMG_PATH" -mountpoint "$MOUNT_POINT" -nobrowse -quiet; then
    echo "❌ エラー: DMGのマウントに失敗しました。"
    exit 1
fi

# 既存のアプリを削除
if [ -d "$APP_PATH" ]; then
    echo "🗑️  既存のアプリを削除中..."
    rm -rf "$APP_PATH"
fi

# アプリケーションフォルダにコピー
echo "📦 $APP_NAME をインストール中..."
if ! cp -R "$MOUNT_POINT/$APP_NAME.app" "$APP_PATH"; then
    echo "❌ エラー: アプリのコピーに失敗しました。"
    exit 1
fi

# quarantine属性を削除
echo "🔓 セキュリティ属性を削除中..."
xattr -cr "$APP_PATH" 2>/dev/null || true

# デタッチ
hdiutil detach "$MOUNT_POINT" -quiet

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ インストール完了！"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "$APP_NAME は /Applications/ にインストールされました。"
echo "Launchpad または Finder から起動できます。"
echo ""
echo "起動するには以下のコマンドを実行："
echo "open -a '$APP_NAME'"
echo ""

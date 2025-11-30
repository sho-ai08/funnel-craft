#!/bin/bash

# Funnel Craft アプリの権限修正スクリプト
# 「アプリが壊れているため開けません」エラーを解決

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Funnel Craft 権限修正ツール"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

APP_PATH="/Applications/Funnel Craft.app"

# アプリが存在するか確認
if [ ! -d "$APP_PATH" ]; then
    echo "❌ エラー: Funnel Craft.app が見つかりません。"
    echo ""
    echo "アプリケーションフォルダに Funnel Craft.app を配置してから"
    echo "再度このスクリプトを実行してください。"
    echo ""
    exit 1
fi

echo "✓ Funnel Craft.app を検出しました"
echo ""
echo "quarantine 属性を削除しています..."

# quarantine属性を削除
xattr -cr "$APP_PATH"

if [ $? -eq 0 ]; then
    echo "✓ 権限修正が完了しました！"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "アプリを起動できるようになりました。"
    echo "Funnel Craft.app をダブルクリックして起動してください。"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
else
    echo "❌ エラー: 権限修正に失敗しました。"
    echo ""
    echo "以下のコマンドを手動で実行してください:"
    echo "sudo xattr -cr \"$APP_PATH\""
    echo ""
    exit 1
fi

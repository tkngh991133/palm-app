# 手相診断アプリ — デプロイ手順

## 必要なもの
- Gemini API キー（Google AI Studio: https://aistudio.google.com）
- GitHubアカウント
- Vercelアカウント（GitHubでログイン可）

---

## Step 1: GitHubにアップロード

1. https://github.com/new でリポジトリを作成（名前例: `palm-app`）
2. このフォルダをそのままアップロード（「uploading an existing file」から）

または、ターミナルが使える方は：
```bash
cd palm-app
git init
git add .
git commit -m "first commit"
git remote add origin https://github.com/あなたのID/palm-app.git
git push -u origin main
```

---

## Step 2: Vercelにデプロイ

1. https://vercel.com にアクセス（GitHubでログイン）
2. 「Add New → Project」をクリック
3. 作成したGitHubリポジトリを選択して「Import」
4. 「Environment Variables」に以下を追加：
   - Key: `GEMINI_API_KEY`
   - Value: あなたのGemini APIキー
5. 「Deploy」をクリック

---

## Step 3: 完了

デプロイが完了すると `https://palm-app-xxx.vercel.app` のようなURLが発行されます。
スマホのブラウザでアクセスして使用できます。

---

## ローカル動作確認（任意）

```bash
# .env.local にAPIキーを設定
echo "GEMINI_API_KEY=your_key_here" > .env.local

# 起動
npm run dev

# http://localhost:3000 でアクセス
```

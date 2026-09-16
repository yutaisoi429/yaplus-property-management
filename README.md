# YA PLUS Property Cloud

物件のエネルギー使用量・設備状況をクラウドで一元管理するデモ画面です。

## GitHub Pagesでデモを見る

このリポジトリにはGitHub Pagesへの自動デプロイ設定が含まれています。

> [!IMPORTANT]
> **Pagesを有効にするだけでは画面は表示されません。** このアプリはReact/Vite製のため、
> `.github/workflows/deploy-pages.yml` を含む変更を先にデフォルトブランチ（通常は`main`）へ
> マージし、GitHub Actionsでビルドした`dist`を公開する必要があります。

1. GitHubのリポジトリ画面で **Settings** を開きます。
2. 左メニューから **Pages** を選びます。
3. **Build and deployment** の **Source** を **GitHub Actions** にします。
4. `main`（または `work`）ブランチへ変更をpushします。
5. **Actions** タブの `Deploy demo to GitHub Pages` が完了するまで待ちます。
6. Actionsの実行結果に表示されるURL、または次の形式のURLを開きます。

```text
https://<GitHubユーザー名>.github.io/<リポジトリ名>/
```

初回のみPagesの有効化が必要です。以降は対象ブランチへpushするたびに自動更新されます。

### 公開ページが真っ白な場合

Pagesの設定画面に **“Workflow details will appear here once your site has been deployed”** と表示されている場合、
このリポジトリ専用のデプロイ処理はまだ実行されていません。GitHubがソースコードをそのまま公開すると、
ブラウザは`src/main.jsx`をビルドできないため画面が空白になります。

以下を順番に確認してください。

1. **Code** タブのブランチ選択を`main`にして、`.github/workflows/deploy-pages.yml`が存在することを確認します。
   ファイルがなければ、この変更が入ったPull Requestを先にマージしてください。
2. **Settings → Pages → Source** が **GitHub Actions** になっていることを確認します。
3. **Actions** タブから **Deploy demo to GitHub Pages** を開きます。
4. まだ実行されていなければ **Run workflow → Run workflow** を押します。
5. `deploy`ジョブが緑色のチェックになるまで待ち、ジョブ内またはPages設定画面のURLを開き直します。
6. 以前の空白ページが残る場合は、ブラウザで強制再読み込み（Windows: `Ctrl+F5`、Mac: `Cmd+Shift+R`）します。

**GitHub Pages Jekyll** や **Static HTML** の「Configure」は使用しません。本リポジトリに含まれる
`Deploy demo to GitHub Pages`ワークフローがViteのビルドと公開を行います。

## ローカルで確認する

Node.js 20以降を用意して、以下を実行します。

```bash
npm install
npm run dev
```

ターミナルに表示されるURL（通常は `http://localhost:5173`）をブラウザで開いてください。

本番用ファイルは次のコマンドで `dist` ディレクトリへ生成できます。

```bash
npm run build
```

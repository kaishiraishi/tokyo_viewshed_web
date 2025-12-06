# Tokyo Viewshed Web

東京の主要な建造物からの視界可視領域（Viewshed）を表示するWebアプリケーション。

## Features

- 4つの視点からのViewshedレイヤー:
  - Tokyo Tower (東京タワー)
  - Tokyo Skytree (東京スカイツリー)
  - Docomo Tower (ドコモタワー)
  - Tocho (都庁)
- レイヤーの透明度調整
- 現在地表示
- レスポンシブデザイン（PC/モバイル対応）

## Tech Stack

- React + TypeScript
- Vite
- MapLibre GL JS
- Tailwind CSS

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## GitHub Pages Deployment

### Prerequisites

タイルデータは約5.5GBあるため、GitHubリポジトリには含まれていません。
デプロイ前に、以下のいずれかの方法でタイルデータをホストする必要があります:

#### Option 1: Cloudflare R2 (推奨)
1. [Cloudflare R2](https://www.cloudflare.com/products/r2/)でバケットを作成
2. 以下のタイルディレクトリをアップロード:
   - `public/viewshed_docomo_inf_3857_rgba_tiles/`
   - `public/viewshed_skytree_inf_3857_rgba_tiles/`
   - `public/viewshed_tocho_inf_3857_rgba_tiles/`
   - `public/viewshed_tokyotower_inf_3857_rgba_tiles/`
3. `src/components/MapView.tsx`のタイルURLを更新

#### Option 2: AWS S3 + CloudFront
1. S3バケットを作成し、タイルをアップロード
2. CloudFrontディストリビューションを設定
3. `src/components/MapView.tsx`のタイルURLを更新

### Deploy Steps

1. GitHubで新規リポジトリを作成: https://github.com/new
   - Repository name: `tokyo_viewshed_web`
   - Visibility: **Public** (GitHub Pages無料利用のため)

2. コードをプッシュ:
```bash
git remote add origin https://github.com/YOUR_USERNAME/tokyo_viewshed_web.git
git branch -M main
git push -u origin main
```

3. GitHubリポジトリの Settings > Pages で:
   - Source: GitHub Actions を選択
   - 自動的に `.github/workflows/deploy.yml` が実行されます

4. デプロイURL: `https://YOUR_USERNAME.github.io/tokyo_viewshed_web/`

## License

MIT

## Credits

- **Map Engine**: [MapLibre GL JS](https://maplibre.org/)
- **Base Map**: [OpenStreetMap](https://www.openstreetmap.org/)


- **Data Source**: [Project PLATEAU](https://www.mlit.go.jp/plateau/) (MLIT Japan)

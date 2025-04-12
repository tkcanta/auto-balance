# オートバランス.com

## 概要

「オートバランス.com」は、5対5のゲーム（MOBA、FPS、スポーツなど）向けに、プレイヤーのパワーバランスを考慮した最適なチーム分けを自動で生成するWebアプリケーションです。

プレイヤーの実力（パワー値）を設定し、公平な対戦ができるよう、バランスの取れた2チームを複数のアルゴリズムで自動生成します。

サービスURL：https://tk-production.xyz/auto-balance/

## 主な機能

- **10人のプレイヤー情報管理**：名前とパワー値（1〜10）を設定
- **複数のチーム分けアルゴリズム**：3種類の異なる方法でバランスの良いチーム分けを生成
- **パワー差の最小化**：チーム間の総合力の差が最小になるよう最適化
- **特殊プレイヤー表示**：特定の名前（「めう」「meme」「meu」）に特殊アイコンを表示

## 使い方

1. 10人分のプレイヤー名を入力します
2. 各プレイヤーのパワー値（1〜10）をスライダーで調整します
3. 「チーム分け生成」ボタンをクリックします
4. 3種類のバランスのとれたチーム分けパターンが表示されます
5. パワー差が小さい順に表示されるため、一番上のパターンが最もバランスが取れています
6. 「リセット」ボタンで入力内容をクリアできます

## チーム分けアルゴリズム

オートバランスでは、3つの異なるアルゴリズムでチーム分けを生成し、その中で最もパワー差の小さいものを優先的に表示します。

### パターン1: ジグザグ割り当て

プレイヤーをランダムに並び替えた後、特定のインデックスのプレイヤーをチームAに、残りをチームBに振り分けます。具体的には、1番目、4番目、5番目、8番目、9番目のプレイヤーをチームAに、2番目、3番目、6番目、7番目、10番目のプレイヤーをチームBに割り当てます。

### パターン2: 強い順交互割り当て

プレイヤーをパワー値の高い順に並べ、交互にチームA、チームBへ割り当てます。これにより、両チームの強いプレイヤーと弱いプレイヤーのバランスを取ります。

### パターン3: 貪欲法によるバランス最適化

最初の2人を各チームに振り分けた後、残りのプレイヤーを「現時点でパワー合計が少ない方のチーム」に順次割り当てていきます。ただし、チームが5人に達した場合は、残りのプレイヤーは自動的に他方のチームに割り当てられます。

## 技術スタック

- **フロントエンド**：HTML5, CSS3, JavaScript (ES6+)
- **レイアウト**：Bootstrap 5
- **フォント**：Google Fonts (Noto Sans JP)
- **アイコン**：カスタムSVGアイコン

## プロジェクト構成

```
/
├── index.html      # メインのHTMLファイル
├── script.js       # アプリケーションのロジック
├── styles.css      # カスタムスタイル
└── img/            # 画像リソース
    ├── unko.svg    # 特殊プレイヤー用アイコン
    └── pen.svg     # 編集アイコン
```

## 開発者向け情報

### コード構造

- **script.js**: モジュール化されたJavaScriptコードで、各機能が関数ごとに分離されています。
- **styles.css**: CSS変数を使用し、セクションごとに整理されたスタイル定義です。

### カスタマイズ方法

#### 特殊プレイヤー名の変更

`script.js`の`CONFIG`オブジェクト内の`SPECIAL_NAMES`配列を編集します:

```javascript
const CONFIG = {
    MAX_PLAYERS: 10,
    SPECIAL_NAMES: ['めう', 'meme', 'meu'], // ここに特殊扱いしたい名前を追加
    DEFAULT_POWER: 5
};
```

#### カラーテーマの変更

`styles.css`の`:root`セレクタ内のCSS変数を編集します:

```css
:root {
    /* カラー */
    --primary-color: #007bff;  /* チームAとプライマリーボタンの色 */
    --danger-color: #dc3545;   /* チームBの色 */
    /* その他の変数... */
}
```

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。


© 2025 オートバランス.com 

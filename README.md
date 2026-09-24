# Drawing Archive / 三段腹ぽよ子

絵の練習、作品、考えたことを残すサイトです。HTML/CSS/JavaScriptだけで動き、投稿は `data/posts.js` の情報をもとに HOME・ARCHIVE・月別一覧へ自動表示します。

## 投稿の追加

1. 画像があれば、リポジトリの `assets` フォルダーを開き、GitHub画面上の「Add file」→「Upload files」で画像を追加して「Commit changes」を押します。画像がなければこの操作は不要です。
2. `data/posts.js` を開き、鉛筆の編集ボタンを押します。中の記入例を参考に `{ ... },` のまとまりを `[` と `]` の間に追加します。画像がない場合は `images: [],` とします。本文はバッククォート（`）の間に書くと改行できます。
3. 「Commit changes」で保存します。少し待って公開サイトを更新すると表示されます。日付順に自動で並びます。

`date` は `2026-09-24` のように、`type` は `STUDY`、`WORK`、`NOTE`、`MONTHLY` のいずれかで記入します。`id` は他の投稿と重ならない半角英数字とハイフンを使います。画像の `src` は `assets/画像名.jpg`、`alt` は画像の短い説明です。複数画像は `{ src: '...', alt: '...' }` をカンマで区切ります。

## WORKSへの登録

完成した作品の投稿を `type: 'WORK'` で追加した後、`data/works.js` の配列に `{ postId: '投稿のid' },` と追加します。これでその投稿の画像・タイトル・制作年・文章がWORKSにも表示されます。制作途中のWORK投稿はWORKSに登録しないでください。

## HOME・プロフィール・リンクの変更

`data/profile.js` にまとめています。`heroImage: ''` の中に `assets/main.jpg` のように書くと、HOMEに大きな画像が出ます。`heroAlt` に画像の説明を書きます。プロフィール画像を正方形の元画像に替えたら `avatar` を画像名にし、`avatarFromScreenshot: false` にします。XなどのURLは `links` 内の `url: ''` を変更してください。

## ファイル構成

| ファイル | 用途 |
| --- | --- |
| `index.html`、`archive.html`、`works.html`、`about.html`、`links.html`、`post.html` | ページ。通常は編集不要 |
| `data/posts.js` | 投稿 |
| `data/works.js` | WORKSに載せる作品 |
| `data/profile.js` | 名前・紹介・HOME画像・リンク |
| `assets/` | 画像とサイトの見た目 |

編集で記号を消すと表示が崩れる場合があります。GitHubでは以前の保存履歴から戻せます。iPhoneのSafariでもGitHub上で編集できますが、長文や複数画像の更新は大きい画面の方が操作しやすいです。

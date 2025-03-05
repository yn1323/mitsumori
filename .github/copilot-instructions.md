# ルール
- 必ず日本語で返答してください

## 作りたいもの
- プランニングポーカー
- firestoreのwebsocketを利用してリアルタイムでデータを同期する
- ルームを作成して、そのルームに参加する
- 実際にポーカーをする人と観客の役割がある


# コーディングルール

## ディレクトリ構成

## 関数の書き方
- export defaultを利用せず、named exportを多用します(export const と定数宣言の前にexportをつける)
   - ただし Next.jsの/app配下のpage, layout, componentはexport defaultを利用します。
- 関数の引数は、2つ以上の場合にオブジェクトを利用します。
   - ただし、第1引数がメイン処理、第2引数がオプションのような場合、第2引数のみをオブジェクトにします。

## 配列操作
- 配列の操作は、map, filter, reduceを利用し、可能な限りfor文を避けます。


## TypeScript利用
- 型推論を多様します。型定義を明示的に書く場合は、型推論が効かない場合に限ります。

## React
- なるべくuseEffectを避けてください。（それでも仕方のない場合もあります）
- コンポーネントはアロー関数で作成します。テンプレートは次を利用してください。
   ```
   type Types = {

   }
   export const Component = ({}: Types) => {
      return <div></div>
   }
   ```

## import
- import文は、アルファベット順に並べます。Module Path Aliasがある場合、そちらに従います。

## CSS、レイアウト
- shadcnのコンポーネントを利用してください


## 修正後
- 最後にpnpm lint:fixを実行してください

## Git操作
- Gitのコミット依頼時は、git add . で全てのファイルをステージングしてかまいません。
/*!
 * 自宅deトリイク よくある質問チャットボット（キーワードマッチ式・依存ライブラリなし）
 * -------------------------------------------------------------
 * 使い方：
 *   1. このファイルを jitaku-toriiku-chatbot.js としてサイトのリポジトリに追加
 *   2. 各ページの </body> 直前に以下を追加
 *      <script src="/home/jitaku-toriiku-chatbot.js" defer></script>
 *   3. これだけで画面右下にチャットボタンが表示されます
 *
 * FAQを増やす／直すときは、下の FAQ_DATA 配列を編集するだけでOKです。
 * サーバーもAPIキーも不要、すべてブラウザ内で完結します。
 *
 * ▼ 公開前に埋めてください（下の LINKS を編集）
 *   - LINKS.ios      : App Store の URL
 *   - LINKS.android  : Google Play の URL
 *   - LINKS.terms    : 利用規約ページの URL
 *   - LOGO_URL       : ヘッダーに出すアイコン画像の URL
 */
(function () {
  "use strict";

  /* =========================================================
   * 0. リンク・画像の設定（ここだけ直せば全FAQに反映されます）
   * ========================================================= */
  var LINKS = {
    point: "https://toriiku-jp.com/home/home_point.html",
    contact: "https://everywill-jp.com/contact/",
    privacy: "https://everywill-jp.com/privacy/",
    mlit: "https://takuhai-poc.jp/",
    ios: "", // ★未確定：App Store の URL を入れてください
    android: "", // ★未確定：Google Play の URL を入れてください
    terms: "" // ★未確定：利用規約ページの URL を入れてください
  };

  var LOGO_URL = "https://toriiku-jp.com/img/favicon.webp"; // ★自宅de版のアイコンがあれば差し替え

  // リンク付きの一行を作るヘルパー。URLが空のときは行ごと出しません。
  function link(url, label) {
    if (!url) return "";
    return '<br><a href="' + url + '" target="_blank" rel="noopener">→ ' + label + "</a>";
  }
  var L_POINT = link(LINKS.point, "ポイント詳細はこちら");
  var L_CONTACT = link(LINKS.contact, "お問い合わせフォーム");
  var L_PRIVACY = link(LINKS.privacy, "プライバシーポリシー");
  var L_MLIT = link(LINKS.mlit, "事業の特設サイトを見る");
  var L_TERMS = link(LINKS.terms, "利用規約");

  function storeLinks() {
    var s = link(LINKS.ios, "App Store（iPhone）") + link(LINKS.android, "Google Play（Android）");
    return s;
  }

  /* =========================================================
   * 1. FAQデータ
   *    - question : 想定する質問文（チップ表示用）
   *    - answer   : 回答（HTML可。改行は<br>、リンクは<a>タグでOK）
   *    - keywords : マッチ用キーワード（ユーザーの入力に含まれていたらヒット）
   *    - category : 関連質問の提案に使うグループ
   * ========================================================= */
  var FAQ_DATA = [
    /* ---------- サービス概要 ---------- */
    {
      category: "サービス概要",
      question: "自宅deトリイクってどんなサービス？",
      answer:
        "ご自宅で受け取った宅配便の送り状をアプリで撮影し、かんたんな質問に答えるだけでポイントが貯まるサービスです。日々の荷物の受け取りが、そのまま物流の課題解決につながります。",
      keywords: [
        "どんなサービス",
        "自宅deトリイク",
        "自宅deトリイクとは",
        "サービスとは",
        "何ができる",
        "どういうサービス",
        "概要"
      ]
    },
    {
      category: "サービス概要",
      question: "トリイク（スポット）と何が違うの？",
      answer:
        "「トリイクスポット」は指定の受取スポットで荷物を受け取る仕組み、「自宅deトリイク」はご自宅で受け取った荷物の送り状を撮るだけで完結する仕組みです。どちらもトリイクポイントが貯まります。",
      keywords: ["違い", "スポットと", "何が違", "どっち", "使い分け", "トリイクスポット"]
    },
    {
      category: "サービス概要",
      question: "利用料金はかかりますか？",
      answer: "アプリのダウンロード・会員登録・ご利用はすべて無料です。",
      keywords: ["料金", "お金", "有料", "無料", "費用", "コスト", "課金"]
    },
    {
      category: "サービス概要",
      question: "国土交通省の取り組みと聞きましたが？",
      answer:
        "本サービスは、国土交通省の補助事業として実施している取り組みです。事業の詳細は特設サイトをご覧ください。" + L_MLIT,
      keywords: ["国土交通省", "国交省", "補助事業", "実証", "国の事業", "公的"]
    },

    /* ---------- アプリ・会員登録 ---------- */
    {
      category: "アプリ・会員登録",
      question: "どうやって始めればいいですか？",
      answer:
        "①アプリをダウンロード → ②会員登録 → ③荷物を受け取ったら送り状を撮影 → ④かんたんな質問に回答して申請完了、の4ステップです。" +
        storeLinks(),
      keywords: ["始め方", "はじめ方", "使い方", "流れ", "手順", "やり方", "ステップ", "どうやって"]
    },
    {
      category: "アプリ・会員登録",
      question: "アプリはどこでダウンロードできますか？",
      answer:
        "App Store（iPhone）／Google Play（Android）からダウンロードいただけます。" + storeLinks(),
      keywords: [
        "ダウンロード",
        "アプリはどこ",
        "インストール",
        "appstore",
        "app store",
        "googleplay",
        "google play",
        "アプリストア",
        "android",
        "iphone"
      ]
    },
    {
      category: "アプリ・会員登録",
      question: "会員登録には何が必要ですか？",
      answer:
        "特別な書類は必要ありません。LINEアカウントまたはメールアドレスがあればご登録いただけます。あわせて、お名前・ご住所のご登録をお願いしています（荷物の送り状との照合に使用します）。",
      keywords: [
        "登録に必要",
        "必要なもの",
        "必要書類",
        "会員登録",
        "登録方法",
        "入会",
        "サインアップ",
        "本人確認書類",
        "免許証",
        "マイナンバー"
      ]
    },
    {
      category: "アプリ・会員登録",
      question: "ポイント交換のときに本人確認は必要ですか？",
      answer:
        "ポイントを交換する際は、オンラインでの本人確認が必要です。手続きの詳細はアプリ内でご案内します。" + L_POINT,
      keywords: ["本人確認", "ekyc", "交換 本人", "身分証", "確認書類"]
    },
    {
      category: "アプリ・会員登録",
      question: "年齢制限はありますか？",
      answer:
        "満18歳以上の個人の方に限りご利用いただけます。18歳未満の方および法人名義でのご登録はできません。" + L_TERMS,
      keywords: ["年齢制限", "年齢", "18歳", "未成年", "何歳", "高校生", "中学生", "子ども", "法人"]
    },
    {
      category: "アプリ・会員登録",
      question: "すでにトリイクスポットを使っています。アカウントは共通ですか？",
      answer:
        "同じアカウントでそのままご利用いただけます。貯まるポイントも同じ「トリイクポイント」です。",
      keywords: ["アカウント 共通", "共通", "既存", "すでに使って", "両方", "同じアカウント", "登録済み"]
    },
    {
      category: "アプリ・会員登録",
      question: "引っ越しました／登録した住所を変更したいです",
      answer:
        "登録内容に変更があった場合は、アプリからお早めに変更手続きをお願いします。ご住所が古いままだと送り状と照合できず、ポイントが付与されない場合があります。",
      keywords: ["引っ越し", "引越し", "住所変更", "住所を変更", "登録内容", "変更したい", "転居", "改姓"]
    },
    {
      category: "アプリ・会員登録",
      question: "アカウントは複数持てますか？",
      answer: "アカウントはお一人につき1つです。複数のアカウントを保有することはできません。",
      keywords: ["複数アカウント", "アカウント 複数", "2つ", "二つ", "家族で登録", "サブアカウント"]
    },
    {
      category: "アプリ・会員登録",
      question: "退会したいです",
      answer: "アプリのマイページから退会手続きが可能です。",
      keywords: ["退会", "解約", "やめたい", "辞めたい", "削除したい", "アカウント削除"]
    },

    /* ---------- 使い方 ---------- */
    {
      category: "使い方",
      question: "何を撮影すればいいですか？",
      answer:
        "荷物に貼られている「送り状（伝票）」です。送り状番号・お届け先のお名前・ご住所が読み取れるよう、伝票全体が写るように撮影してください。",
      keywords: [
        "何を撮影",
        "何を撮",
        "撮影",
        "伝票",
        "送り状",
        "写真",
        "どこを撮",
        "シール",
        "ラベル"
      ]
    },
    {
      category: "使い方",
      question: "いつまでに撮影・申請すればいいですか？",
      answer: "受け取ったその日のうちに撮影・申請いただくことをおすすめしています。",
      keywords: ["いつまで", "期限", "締切", "後から", "翌日", "何日以内", "遅れて", "忘れて"]
    },
    {
      category: "使い方",
      question: "どの配送会社の荷物でも対象ですか？",
      answer:
        "配送会社を問わずご利用いただけます。宅急便・ゆうパックなど、宅配便と同等の運送サービスでお届けされた荷物が対象です。",
      keywords: [
        "配送会社",
        "宅配業者",
        "ヤマト",
        "佐川",
        "日本郵便",
        "ゆうパック",
        "宅急便",
        "amazon",
        "アマゾン",
        "対象の荷物",
        "どの荷物"
      ]
    },
    {
      category: "使い方",
      question: "置き配で受け取った荷物も対象ですか？",
      answer:
        "対象です。対面・置き配・宅配ボックスなど、受け取り方法は問いません。ご自宅に届いた荷物の送り状を撮影してください。",
      keywords: ["置き配", "宅配ボックス", "宅配ロッカー", "対面", "受け取り方", "不在"]
    },
    {
      category: "使い方",
      question: "家族宛の荷物でも申請できますか？",
      answer:
        "ご本人宛の荷物のみが対象です。送り状に記載されたお名前・ご住所がご登録内容と一致することを確認できない場合、ポイントは付与されません。",
      keywords: ["家族", "家族宛", "妻", "夫", "子供宛", "同居", "本人以外", "代理", "別名義"]
    },
    {
      category: "使い方",
      question: "1日に何件まで申請できますか？／複数の荷物が届いたときは？",
      answer:
        "件数の上限はありませんが、1か月あたりに付与できるポイントの上限を設けています。上限に達した場合、その月の残りの期間はポイントが付与されません（アプリ上に表示されます）。なお、同じ送り状で重複して申請することはできません。" +
        L_POINT,
      keywords: [
        "何件",
        "何個",
        "上限",
        "制限",
        "複数",
        "まとめて",
        "1日に",
        "一日",
        "何回",
        "重複"
      ]
    },
    {
      category: "使い方",
      question: "送り状の宛名が「EAZY」などで省略されています",
      answer:
        "宛名が省略された送り状は、そのままでは確認ができない場合があります。お手数ですが、注文履歴や配送完了通知など、送り状番号とお名前が確認できる画像をあわせて、お問い合わせフォームよりお送りください。" +
        L_CONTACT,
      keywords: ["eazy", "イージー", "宛名が省略", "宛名省略", "省略", "宛名がない", "宛名がありません"]
    },
    {
      category: "使い方",
      question: "申請が承認されませんでした／写真がうまく読み取れません",
      answer:
        "文字がぼやけている、一部が切れている、光が反射しているなどの場合、読み取れないことがあります。明るい場所で、送り状全体が正面から写るように撮り直してください。それでも解決しない場合はお問い合わせください。" +
        L_CONTACT,
      keywords: [
        "承認されない",
        "却下",
        "読み取れ",
        "認識されない",
        "エラー",
        "できない",
        "失敗",
        "うまくいかない",
        "反映されない"
      ]
    },

    /* ---------- ポイント ---------- */
    {
      category: "ポイント",
      question: "どのくらいポイントが貯まりますか？",
      answer:
        "1回のご利用ごとにポイントが貯まります。会員ランクや回答内容に応じて加算されることもあります。詳しい付与ポイントはポイント詳細ページとアプリ内でご確認ください。" +
        L_POINT,
      keywords: ["どのくらい", "何ポイント", "いくら", "何pt", "ポイント数", "貯まる", "もらえる"]
    },
    {
      category: "ポイント",
      question: "付与されるポイント数は変わりますか？",
      answer:
        "付与ポイント数と月あたりの上限は毎月見直しており、変更する場合は毎月1日付で改定します。翌月に適用するポイント数は、前月末までにサイト上でお知らせします。" +
        L_POINT,
      keywords: ["変わり", "改定", "変更", "見直し", "来月", "翌月", "毎月"]
    },
    {
      category: "ポイント",
      question: "ポイントはいつ付与されますか？",
      answer:
        "申請の受付後、内容の確認を経て、原則として72時間以内に確定します。確認に時間がかかる場合はアプリでお知らせします。" +
        L_POINT,
      keywords: ["いつ付与", "付与", "いつもらえる", "72時間", "確定", "反映", "まだ入らない"]
    },
    {
      category: "ポイント",
      question: "ポイントは何に交換できますか？",
      answer:
        "アプリに表示される交換先から、1ポイント＝1円相当で交換いただけます。交換先の種類や交換単位は、ポイント詳細ページとアプリ内でご確認ください。" +
        L_POINT,
      keywords: [
        "交換",
        "何に交換",
        "paypay",
        "アマギフ",
        "ギフト",
        "楽天",
        "dポイント",
        "現金",
        "振込"
      ]
    },
    {
      category: "ポイント",
      question: "ポイントの有効期限はありますか？",
      answer:
        "獲得した月から6か月目の月末日までです。有効期限を過ぎたポイントは失効し、復活はできません。" + L_POINT,
      keywords: ["有効期限", "期限", "失効", "いつまで有効", "消える", "なくなる"]
    },
    {
      category: "ポイント",
      question: "会員ランクとは何ですか？",
      answer:
        "直近6か月間のご利用回数に応じて決まる区分です。ランクが上がると付与ポイントが加算されます。ご利用回数が基準を下回った場合はランクが下がることがあります。" +
        L_POINT,
      keywords: ["ランク", "会員ランク", "ゴールド", "プラチナ", "シルバー", "ブロンズ", "階級"]
    },
    {
      category: "ポイント",
      question: "ポイントを現金化したり、家族と合算したりできますか？",
      answer: "ポイントの現金での払い戻し、第三者への譲渡、利用者間での合算はできません。" + L_POINT,
      keywords: ["現金化", "払い戻し", "譲渡", "合算", "まとめる", "あげる", "相続"]
    },

    /* ---------- キャンペーン ---------- */
    {
      category: "キャンペーン",
      question: "キャンペーンはありますか？",
      answer:
        "毎月、期間限定のキャンペーンを実施予定です。内容はアプリ内のお知らせや公式LINEでご案内しますので、ぜひチェックしてください。",
      keywords: ["キャンペーン", "特典", "イベント", "抽選", "プレゼント", "お得"]
    },
    {
      category: "キャンペーン",
      question: "友だち紹介はできますか？",
      answer:
        "あります。アプリに表示される紹介コードをお友だちにお伝えいただき、お友だちが会員登録のうえ実際にご利用（送り状の提出）まで進むと、ポイントが付与されます。会員登録だけでは付与されませんのでご注意ください。なお、紹介できる人数には上限があります。" +
        L_POINT,
      keywords: ["紹介", "友だち紹介", "友達紹介", "招待", "紹介コード", "リファラル"]
    },

    /* ---------- 安心・プライバシー ---------- */
    {
      category: "安心・プライバシー",
      question: "送り状の写真から個人情報が漏れませんか？",
      answer:
        "お預かりした情報は、プライバシーポリシーに基づき厳重に管理します。送り状の画像は、必要な情報を抽出したあと、当社が定める期間の経過後に削除します。差出人などご本人以外の方の情報は、サービスの提供と統計情報の作成に必要な範囲でのみ取り扱い、その方への連絡や営業活動には一切利用しません。" +
        L_PRIVACY,
      keywords: [
        "個人情報",
        "漏れ",
        "プライバシー",
        "安全",
        "セキュリティ",
        "情報 管理",
        "削除",
        "差出人",
        "心配"
      ]
    },
    {
      category: "安心・プライバシー",
      question: "撮影した写真は何に使われるのですか？",
      answer:
        "物流の実態把握と改善のためのデータとして活用します。第三者に提供する場合も、個人を特定できない形に加工した統計情報としてのみ提供します。" +
        L_PRIVACY,
      keywords: ["何に使う", "使われ", "利用目的", "third", "第三者", "統計", "データ"]
    },
    {
      category: "安心・プライバシー",
      question: "問い合わせたいときは？",
      answer: "お問い合わせフォームよりご連絡ください。" + L_CONTACT,
      keywords: ["問い合わせ", "問合せ", "連絡", "サポート", "電話", "メール", "窓口", "相談"]
    }
  ];

  var FALLBACK_ANSWER =
    "申し訳ございませんが、その質問にはまだうまくお答えできません。<br>" +
    "お手数ですが、お問い合わせフォームよりご質問ください。担当者が確認してお答えします。" +
    L_CONTACT;

  var STARTER_QUESTIONS = [
    "自宅deトリイクってどんなサービス？",
    "どうやって始めればいいですか？",
    "何を撮影すればいいですか？",
    "ポイントはいつ付与されますか？"
  ];

  /* =========================================================
   * 2. かんたんキーワードマッチ検索
   * ========================================================= */
  function normalize(str) {
    return String(str || "")
      .toLowerCase()
      .replace(/[\s　!！?？。、,.]/g, "");
  }

  function scoreItem(item, normQuery) {
    var score = 0;
    for (var i = 0; i < item.keywords.length; i++) {
      var kw = normalize(item.keywords[i]);
      if (!kw) continue;
      if (normQuery.indexOf(kw) !== -1) {
        score += kw.length >= 2 ? 3 : 1; // 長いキーワード一致ほど信頼度が高い
      }
    }
    var normQuestion = normalize(item.question);
    if (normQuestion && (normQuery.indexOf(normQuestion) !== -1 || normQuestion.indexOf(normQuery) !== -1)) {
      score += 2;
    }
    return score;
  }

  function findAnswer(query) {
    var normQuery = normalize(query);
    if (!normQuery) return null;
    var best = null;
    var bestScore = 0;
    for (var i = 0; i < FAQ_DATA.length; i++) {
      var s = scoreItem(FAQ_DATA[i], normQuery);
      if (s > bestScore) {
        bestScore = s;
        best = FAQ_DATA[i];
      }
    }
    return bestScore > 0 ? best : null;
  }

  /* =========================================================
   * 3. スタイル（ブランドカラー #E8342A）
   * ========================================================= */
  var CSS = "\
  .jtk-chat-btn{position:fixed;right:20px;bottom:20px;width:60px;height:60px;border-radius:50%;\
    background:#E8342A;color:#fff;border:none;box-shadow:0 6px 20px rgba(196,42,33,.32);\
    cursor:pointer;z-index:999999;display:flex;align-items:center;justify-content:center;\
    transition:transform .15s ease;}\
  .jtk-chat-btn:hover{transform:translateY(-2px) scale(1.03);}\
  .jtk-chat-btn:focus-visible{outline:3px solid #7A1611;outline-offset:2px;}\
  .jtk-chat-btn svg{width:28px;height:28px;}\
  .jtk-chat-panel{position:fixed;right:20px;bottom:92px;width:340px;max-width:calc(100vw - 32px);\
    height:480px;max-height:calc(100vh - 140px);background:#FFF7F6;border-radius:16px;\
    box-shadow:0 12px 40px rgba(196,42,33,.24);display:none;flex-direction:column;overflow:hidden;\
    z-index:999999;font-family:'Hiragino Kaku Gothic ProN','Hiragino Sans','Yu Gothic',-apple-system,BlinkMacSystemFont,sans-serif;}\
  .jtk-chat-panel.jtk-open{display:flex;}\
  .jtk-chat-header{background:#E8342A;color:#fff;padding:14px 16px;display:flex;align-items:center;gap:10px;flex-shrink:0;}\
  .jtk-chat-header img{width:26px;height:26px;border-radius:6px;background:#fff;object-fit:contain;padding:2px;}\
  .jtk-chat-header .jtk-title{font-weight:700;font-size:14px;line-height:1.3;}\
  .jtk-chat-header .jtk-sub{font-size:11px;opacity:.85;}\
  .jtk-chat-close{margin-left:auto;background:none;border:none;color:#fff;opacity:.85;cursor:pointer;font-size:18px;line-height:1;padding:4px;}\
  .jtk-chat-close:hover{opacity:1;}\
  .jtk-chat-body{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px;background:#FFF7F6;}\
  .jtk-msg{max-width:86%;font-size:13.5px;line-height:1.6;padding:9px 12px;border-radius:14px;word-break:break-word;}\
  .jtk-msg a{color:inherit;text-decoration:underline;}\
  .jtk-msg.jtk-bot{align-self:flex-start;background:#FDECEB;color:#5A1512;border-bottom-left-radius:4px;}\
  .jtk-msg.jtk-user{align-self:flex-end;background:#E8342A;color:#fff;border-bottom-right-radius:4px;}\
  .jtk-chips{display:flex;flex-wrap:wrap;gap:6px;align-self:flex-start;max-width:100%;}\
  .jtk-chip{background:#fff;border:1px solid #F5BDB9;color:#C42A21;border-radius:999px;\
    padding:6px 12px;font-size:12px;cursor:pointer;transition:background .15s ease;text-align:left;}\
  .jtk-chip:hover{background:#FDECEB;border-color:#E8342A;}\
  .jtk-chat-inputrow{display:flex;gap:8px;padding:10px;border-top:1px solid #F5DEDC;background:#fff;flex-shrink:0;}\
  .jtk-chat-input{flex:1;border:1px solid #F3D3D0;border-radius:20px;padding:9px 14px;font-size:13.5px;outline:none;}\
  .jtk-chat-input:focus{border-color:#E8342A;}\
  .jtk-chat-send{background:#E8342A;color:#fff;border:none;border-radius:50%;width:36px;height:36px;\
    flex-shrink:0;cursor:pointer;display:flex;align-items:center;justify-content:center;}\
  .jtk-chat-send:hover{background:#C42A21;}\
  .jtk-chat-send svg{width:16px;height:16px;}\
  @media (max-width:400px){.jtk-chat-panel{right:16px;left:16px;width:auto;bottom:88px;}}\
  @media (prefers-reduced-motion:reduce){.jtk-chat-btn,.jtk-chip{transition:none;}.jtk-chat-btn:hover{transform:none;}}\
  ";

  function injectCSS() {
    var style = document.createElement("style");
    style.setAttribute("data-jtk-chatbot", "true");
    style.appendChild(document.createTextNode(CSS));
    document.head.appendChild(style);
  }

  /* =========================================================
   * 4. DOM構築
   * ========================================================= */
  var CHAT_ICON =
    '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M12 3C6.9 3 2.75 6.58 2.75 11c0 2.42 1.26 4.6 3.25 6.08V21l3.42-1.9c.82.18 1.68.28 2.58.28 5.1 0 9.25-3.58 9.25-8s-4.15-8-9.25-8Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>' +
    '<text x="12" y="14.2" text-anchor="middle" font-family="Arial, sans-serif" font-size="8.5" font-weight="700" fill="currentColor">?</text>' +
    "</svg>";

  var SEND_ICON =
    '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M3 12 L21 4 L13 21 L11 13 L3 12Z" fill="currentColor"/>' +
    "</svg>";

  var CLOSE_ICON = "&times;";

  function el(tag, attrs, html) {
    var e = document.createElement(tag);
    if (attrs) {
      for (var k in attrs) if (attrs.hasOwnProperty(k)) e.setAttribute(k, attrs[k]);
    }
    if (html !== undefined) e.innerHTML = html;
    return e;
  }

  function buildWidget() {
    var btn = el(
      "button",
      { class: "jtk-chat-btn", type: "button", "aria-label": "自宅deトリイクに質問する" },
      CHAT_ICON
    );

    var panel = el("div", {
      class: "jtk-chat-panel",
      role: "dialog",
      "aria-label": "自宅deトリイク よくある質問チャット"
    });

    var header = el(
      "div",
      { class: "jtk-chat-header" },
      '<img src="' +
        LOGO_URL +
        '" alt=""/>' +
        '<div><div class="jtk-title">自宅deトリイク よくある質問</div>' +
        '<div class="jtk-sub">気になることをきいてみてください</div></div>'
    );
    var closeBtn = el("button", { class: "jtk-chat-close", type: "button", "aria-label": "閉じる" }, CLOSE_ICON);
    header.appendChild(closeBtn);

    var body = el("div", { class: "jtk-chat-body" });

    var inputRow = el("div", { class: "jtk-chat-inputrow" });
    var input = el("input", {
      class: "jtk-chat-input",
      type: "text",
      placeholder: "質問を入力…",
      "aria-label": "質問を入力"
    });
    var sendBtn = el("button", { class: "jtk-chat-send", type: "button", "aria-label": "送信" }, SEND_ICON);
    inputRow.appendChild(input);
    inputRow.appendChild(sendBtn);

    panel.appendChild(header);
    panel.appendChild(body);
    panel.appendChild(inputRow);

    document.body.appendChild(btn);
    document.body.appendChild(panel);

    function addMsg(text, who) {
      var msg = el("div", { class: "jtk-msg jtk-" + who }, text);
      body.appendChild(msg);
      body.scrollTop = body.scrollHeight;
      return msg;
    }

    function addChips(questions) {
      var wrap = el("div", { class: "jtk-chips" });
      questions.forEach(function (q) {
        var chip = el("button", { class: "jtk-chip", type: "button" }, q);
        chip.addEventListener("click", function () {
          handleUserMessage(q);
        });
        wrap.appendChild(chip);
      });
      body.appendChild(wrap);
      body.scrollTop = body.scrollHeight;
    }

    function showWelcome() {
      body.innerHTML = "";
      addMsg(
        "こんにちは！自宅deトリイクのよくある質問チャットです😊 気になることを選ぶか、下に入力して聞いてください。",
        "bot"
      );
      addChips(STARTER_QUESTIONS);
    }

    function handleUserMessage(text) {
      text = (text || "").trim();
      if (!text) return;
      addMsg(escapeHtml(text), "user");
      input.value = "";
      var match = findAnswer(text);
      if (match) {
        addMsg(match.answer, "bot");
        addChips(pickRelated(match));
      } else {
        addMsg(FALLBACK_ANSWER, "bot");
      }
    }

    function pickRelated(current) {
      // 直前の回答と同じカテゴリから、まだ聞いていない質問を2つ提案
      var related = FAQ_DATA.filter(function (item) {
        return item.category === current.category && item.question !== current.question;
      }).slice(0, 2);
      if (related.length === 0) return STARTER_QUESTIONS.slice(0, 2);
      return related.map(function (r) {
        return r.question;
      });
    }

    function escapeHtml(str) {
      var d = document.createElement("div");
      d.textContent = str;
      return d.innerHTML;
    }

    function openPanel() {
      panel.classList.add("jtk-open");
      if (!body.hasChildNodes()) showWelcome();
      input.focus();
    }
    function closePanel() {
      panel.classList.remove("jtk-open");
      btn.focus();
    }

    btn.addEventListener("click", function () {
      panel.classList.contains("jtk-open") ? closePanel() : openPanel();
    });
    closeBtn.addEventListener("click", closePanel);
    sendBtn.addEventListener("click", function () {
      handleUserMessage(input.value);
    });
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") handleUserMessage(input.value);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && panel.classList.contains("jtk-open")) closePanel();
    });
  }

  function init() {
    injectCSS();
    buildWidget();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

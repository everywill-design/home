/*
  今月・来月の切り替え（日本時間で判定）
  - [data-pt="キー"] に、今月の数（js/points-month.js）を入れる
  - <img data-pt-img="キー"> の絵を、今月の絵（js/points-month.js）に替える
  - [data-pt-banner="top|friend"] に、来月改定するとき・今月改定したときのお知らせを出す
  - home_point.html の .pm[data-month] を「今月のポイント」「来月のポイント」のタブにする
  このファイルは毎月直さない。
*/
(function () {
  var data = window.TORIIKU_PT || {};
  var now = window.TORIIKU_ASOF ? new Date(window.TORIIKU_ASOF) : new Date();
  var j = new Date(now.getTime() + 9 * 3600 * 1000);
  var y = j.getUTCFullYear(), m = j.getUTCMonth() + 1, d = j.getUTCDate();
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  var ym = y + '-' + pad(m);
  var ny = m === 12 ? y + 1 : y, nm = m === 12 ? 1 : m + 1;
  var nextYm = ny + '-' + pad(nm);
  var lastDay = new Date(Date.UTC(y, m, 0)).getUTCDate();
  var WD = '日月火水木金土';
  function wdOf(yy, mm, dd) { return WD.charAt(new Date(Date.UTC(yy, mm - 1, dd)).getUTCDay()); }
  var wd = wdOf(ny, nm, 1), wdCur = wdOf(y, m, 1), wdLast = wdOf(y, m, lastDay);

  var keys = Object.keys(data).sort(), curKey = null, prevKey = null;
  for (var i = 0; i < keys.length; i++) { if (keys[i] <= ym) { prevKey = curKey; curKey = keys[i]; } }
  var cur = data[curKey] || {}, prev = data[prevKey] || null, nxt = data[nextYm] || null;
  var changedThisMonth = !!(cur.change && curKey === ym && d <= 7);

  // 1) 数を入れる
  var nums = document.querySelectorAll('[data-pt]');
  for (var a = 0; a < nums.length; a++) {
    var v = cur[nums[a].getAttribute('data-pt')];
    if (v !== undefined && v !== null) nums[a].textContent = v;
  }

  // 1b) 絵を替える（数が描いてある絵。例：トップのお友だち紹介のカード）
  var imgs = document.querySelectorAll('img[data-pt-img]');
  for (var c = 0; c < imgs.length; c++) {
    var src = cur[imgs[c].getAttribute('data-pt-img')];
    if (src && imgs[c].getAttribute('src') !== src) imgs[c].setAttribute('src', src);
  }

  // 2) トップ・お友だち紹介のページのお知らせ
  // お知らせの帯。色はサイトの決まりの色（style.css の :root の変数）だけを使う
  function box(text, linkText, href) {
    return '<div class="pm-banner"><span class="pm-banner__label">お知らせ</span>' +
      '<span class="pm-banner__text">' + text + '</span>' +
      '<a class="pm-banner__link" href="' + href + '">' + linkText + '</a></div>';
  }
  if (document.querySelector('[data-pt-banner]') && !document.getElementById('pm-banner-style')) {
    var st = document.createElement('style');
    st.id = 'pm-banner-style';
    st.textContent =
      '.pm-banner{max-width:60rem;margin:.75rem auto;padding:.75rem 1.25rem;background:var(--color-bg);border-radius:1.25rem;' +
      'font-family:var(--font-base);font-size:.9375rem;font-weight:700;line-height:1.7;color:var(--color-text);text-align:center;word-break:auto-phrase;}' +
      '.pm-banner__label{display:inline-block;margin-right:.5rem;padding:0 .625rem;border-radius:999px;background:var(--color-key);' +
      'color:#fff;font-size:.75rem;line-height:1.7;vertical-align:.0625rem;}' +
      '.pm-banner__link{display:inline-block;margin-left:.5rem;color:var(--color-key);text-decoration:underline;text-underline-offset:.2em;white-space:nowrap;}' +
      '.pm-banner__link:hover{text-decoration:none;}' +
      '@media (max-width:1099px){.pm-banner{margin:.75rem .9375rem;padding:.625rem 1rem;font-size:.8125rem;}}' +
      '.friend .pm-banner{margin:0 auto 2rem;}';
    document.head.appendChild(st);
  }
  var banners = document.querySelectorAll('[data-pt-banner]');
  for (var b = 0; b < banners.length; b++) {
    var kind = banners[b].getAttribute('data-pt-banner'), html = '';
    if (kind === 'friend') {
      if (nxt && nxt.friend !== undefined && nxt.friend !== cur.friend) {
        html = box(nm + '月1日（' + wd + '）より、お友だち紹介の特典が、それぞれ' + cur.friend + '円分から' + nxt.friend + '円分になります。', '詳しくはこちら', 'home_point.html#next');
      } else if (changedThisMonth && prev && prev.friend !== cur.friend) {
        html = box(m + '月1日（' + wdCur + '）より、お友だち紹介の特典が、それぞれ' + cur.friend + '円分になりました。', '詳しくはこちら', 'home_point.html');
      }
    } else {
      if (nxt && nxt.change) {
        html = box(nm + '月1日（' + wd + '）より、付与ポイントを改定します。', '詳しくはこちら', 'home_point.html#next');
      } else if (changedThisMonth) {
        html = box(m + '月1日（' + wdCur + '）より、付与ポイントを改定しました。', '詳しくはこちら', 'home_point.html');
      }
    }
    banners[b].innerHTML = html;
  }

  // 3) home_point.html のタブ
  var blocks = document.querySelectorAll('.pm[data-month]');
  if (!blocks.length) return;
  var curB = null, nextB = null;
  for (var k = 0; k < blocks.length; k++) {
    var bm = blocks[k].getAttribute('data-month');
    if (bm <= ym) curB = blocks[k];
    if (bm === nextYm) nextB = blocks[k];
  }
  // 見出しの id（#rank など。css の .pt-head#rank の中央寄せにも使う）は、見えている欄に付け替える
  function moveIds(toB) {
    if (!toB) return;
    var idHeads = document.querySelectorAll('.pm .pt-head[id]');
    for (var x = 0; x < idHeads.length; x++) {
      var hd = idHeads[x], blk = hd.closest('.pm');
      if (blk === toB) continue;
      var pos = Array.prototype.indexOf.call(blk.querySelectorAll('.pt-head'), hd);
      var tgt = toB.querySelectorAll('.pt-head')[pos];
      if (tgt && !tgt.id) { tgt.id = hd.id; hd.removeAttribute('id'); }
    }
  }
  var tabs = document.getElementById('pm-tabs');
  var tCur = document.getElementById('pm-tab-cur'), tNext = document.getElementById('pm-tab-next');
  var empty = document.getElementById('pm-empty'), notice = document.getElementById('pm-notice');
  var badge = (nextB && nextB.getAttribute('data-change') === 'yes') ? '<span class="pm-badge">変更あり</span>' : '';
  tCur.innerHTML = '<span class="pm-tab-sub">今月</span>' + m + '月のポイント';
  tNext.innerHTML = '<span class="pm-tab-sub">来月' + badge + '</span>' + nm + '月のポイント';
  tabs.hidden = false;

  function show(which) {
    for (var q = 0; q < blocks.length; q++) blocks[q].hidden = true;
    var isNext = which === 'next';
    tCur.setAttribute('aria-selected', String(!isNext));
    tNext.setAttribute('aria-selected', String(isNext));
    empty.hidden = true;
    if (isNext) {
      if (nextB) {
        nextB.hidden = false;
        moveIds(nextB);
        if (nextB.getAttribute('data-nochange') === 'yes') {
          empty.textContent = nm + '月のポイントに変更はありません（' + m + '月と同じです）。';
          empty.hidden = false;
        }
      } else {
        empty.textContent = nm + '月のポイントは、' + m + '月' + lastDay + '日（' + wdLast + '）までにこのページでお知らせします。';
        empty.hidden = false;
      }
    } else if (curB) {
      curB.hidden = false;
      moveIds(curB);
    }
  }
  tCur.addEventListener('click', function () { show('cur'); if (location.hash === '#next') history.replaceState(null, '', location.pathname + location.search); });
  tNext.addEventListener('click', function () { show('next'); });

  if (nextB && nextB.getAttribute('data-change') === 'yes') {
    notice.innerHTML = '<span class="pt-revise-head">お知らせ</span><p>' + ny + '年' + nm + '月1日（' + wd + '）0:00より、付与ポイントを改定します。<a id="pm-go-next" href="#next">' + nm + '月のポイントを見る</a></p>';
    notice.hidden = false;
    document.getElementById('pm-go-next').addEventListener('click', function (e) { e.preventDefault(); show('next'); tabs.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
  } else if (changedThisMonth) {
    notice.innerHTML = '<span class="pt-revise-head">お知らせ</span><p>' + y + '年' + m + '月1日（' + wdCur + '）より、付与ポイントを改定しました。' + m + '月のポイントは、下の「今月」のタブでご覧いただけます。</p>';
    notice.hidden = false;
  }

  show(location.hash === '#next' ? 'next' : 'cur');
  if (location.hash === '#next') setTimeout(function () { tabs.scrollIntoView({ block: 'start' }); }, 0);
  window.addEventListener('hashchange', function () { show(location.hash === '#next' ? 'next' : 'cur'); });
})();

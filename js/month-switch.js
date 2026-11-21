/*
  今月・来月の切り替え（日本時間で判定）
  - [data-pt="キー"] に、今月の数（js/points-month.js）を入れる
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

  // 2) トップ・お友だち紹介のページのお知らせ
  function box(strong, linkText, href) {
    return '<div style="max-width:960px;margin:12px auto;padding:12px 16px;background:#fff8e6;border:1px solid #f0c36d;border-radius:8px;font-size:14px;line-height:1.6;text-align:center;">' +
      '<strong style="color:#8a5a00;">' + strong + '</strong>　' +
      '<a href="' + href + '" style="color:#c0392b;font-weight:700;text-decoration:underline;">' + linkText + '</a></div>';
  }
  var banners = document.querySelectorAll('[data-pt-banner]');
  for (var b = 0; b < banners.length; b++) {
    var kind = banners[b].getAttribute('data-pt-banner'), html = '';
    if (kind === 'friend') {
      if (nxt && nxt.friend !== undefined && nxt.friend !== cur.friend) {
        html = box('【お知らせ】' + nm + '月1日（' + wd + '）より、お友だち紹介のポイントが' + cur.friend + 'pt→' + nxt.friend + 'ptになります', '詳しくはこちら', 'home_point.html#next');
      } else if (changedThisMonth && prev && prev.friend !== cur.friend) {
        html = box(m + '月1日（' + wdCur + '）より、お友だち紹介のポイントが' + cur.friend + 'ptになりました', '詳しくはこちら', 'home_point.html');
      }
    } else {
      if (nxt && nxt.change) {
        html = box('【お知らせ】' + nm + '月1日（' + wd + '）より、付与ポイントを改定します', '詳しくはこちら', 'home_point.html#next');
      } else if (changedThisMonth) {
        html = box(m + '月1日（' + wdCur + '）より、付与ポイントを改定しました', '詳しくはこちら', 'home_point.html');
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
  var tabs = document.getElementById('pm-tabs');
  var tCur = document.getElementById('pm-tab-cur'), tNext = document.getElementById('pm-tab-next');
  var empty = document.getElementById('pm-empty'), notice = document.getElementById('pm-notice');
  tCur.textContent = '今月（' + m + '月）のポイント';
  tNext.textContent = '来月（' + nm + '月）のポイント';
  if (nextB && nextB.getAttribute('data-change') === 'yes') tNext.insertAdjacentHTML('beforeend', '<span class="pm-badge">変更あり</span>');
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
    }
  }
  tCur.addEventListener('click', function () { show('cur'); if (location.hash === '#next') history.replaceState(null, '', location.pathname); });
  tNext.addEventListener('click', function () { show('next'); });

  if (nextB && nextB.getAttribute('data-change') === 'yes') {
    notice.innerHTML = '【お知らせ】' + ny + '年' + nm + '月1日（' + wd + '）0:00より、付与ポイントを改定します。<a id="pm-go-next">' + nm + '月のポイントを見る</a>';
    notice.hidden = false;
    document.getElementById('pm-go-next').addEventListener('click', function () { show('next'); tabs.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
  } else if (changedThisMonth) {
    notice.textContent = y + '年' + m + '月1日（' + wdCur + '）より、付与ポイントを改定しました。以下は' + m + '月のポイントです。';
    notice.hidden = false;
  }

  show(location.hash === '#next' ? 'next' : 'cur');
  if (location.hash === '#next') setTimeout(function () { tabs.scrollIntoView({ block: 'start' }); }, 0);
  window.addEventListener('hashchange', function () { show(location.hash === '#next' ? 'next' : 'cur'); });
})();

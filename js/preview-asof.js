/* 見本だけで使う「見る日」の切り替え。本番には入れない。 */
(function () {
  var key = 'toriiku_preview_asof', v = null;
  try { v = localStorage.getItem(key); } catch (e) {}
  if (v) window.TORIIKU_ASOF = v;
  var opts = [['', '今日'], ['2026-11-30T23:59:00+09:00', '11/30 23:59'], ['2026-12-01T00:00:00+09:00', '12/1 0:00'], ['2026-12-08T10:00:00+09:00', '12/8'], ['2026-12-26T10:00:00+09:00', '12/26']];
  document.addEventListener('DOMContentLoaded', function () {
    var w = document.createElement('div');
    w.setAttribute('style', 'position:fixed;right:8px;bottom:8px;z-index:99999;background:#7a1f16;color:#fff;font:700 12px/1.4 sans-serif;padding:8px 10px;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,.3);max-width:calc(100vw - 16px)');
    var h = '確認用の見本（公開前）　表示する日：';
    opts.forEach(function (o) {
      var on = (v || '') === o[0];
      h += '<button type="button" data-v="' + o[0] + '" style="margin:2px;padding:6px 8px;min-height:32px;border:1px solid #fff;border-radius:6px;font:700 12px sans-serif;cursor:pointer;background:' + (on ? '#fff;color:#7a1f16' : 'transparent;color:#fff') + '">' + o[1] + '</button>';
    });
    w.innerHTML = h;
    w.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      try { if (b.dataset.v) localStorage.setItem(key, b.dataset.v); else localStorage.removeItem(key); } catch (er) {}
      location.reload();
    });
    document.body.appendChild(w);
  });
  // 見本（htmlpreview）では、js があとから入れたリンク（お知らせの「詳しくはこちら」など）が raw のページ（HTML の中身の文字）に飛ぶので、見本の中のページに飛ばし直す
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]'); if (!a) return;
    var u = a.href;
    if (u.indexOf('https://raw.githubusercontent.com/') === 0 && /\.html(#.*)?$/.test(u)) {
      e.preventDefault();
      location.href = 'https://htmlpreview.github.io/?' + u;
    }
  }, true);
})();

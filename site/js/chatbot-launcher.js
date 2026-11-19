/*
 * 행운팡팡 챗봇 버튼 — 모든 페이지 오른쪽 아래 (QR 첫 화면인 언어 선택 화면은 제외)
 *
 * - 4개 국어 모두에서 보인다. 언어는 js/i18n.js 가 정한 값(window.I18N.lang), 행사는 js/renewal.js 의
 *   FESTIVAL.id 를 챗봇에 넘긴다 → chatbot.html?embed=1&lang=..&fest=..
 * - 버튼을 누르면 챗봇을 창(iframe)으로 띄운다. 처음 열 때만 불러온다.
 * - i18n.js 의 🌐 언어 버튼이 있는 화면(상단 바가 없는 화면)에서는 그 위로 비켜 선다.
 * - 이 파일은 i18n.js 뒤에 불러온다 (tools/apply_renewal.py 가 모든 페이지에 연결).
 */
(function () {
  'use strict';

  var TXT = {
    open: { ko: '챗봇 열기', en: 'Open chat', ja: 'チャットを開く', zh: '打开聊天' },
    close: { ko: '챗봇 닫기', en: 'Close chat', ja: 'チャットを閉じる', zh: '关闭聊天' },
    title: { ko: '행운팡팡 도우미', en: 'Lucky PangPang Helper', ja: 'ラッキーパンパン案内', zh: 'Lucky PangPang 助手' }
  };

  var ICON_CHAT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M8 9h.01M12 9h.01M16 9h.01"/></svg>';
  var ICON_CLOSE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>';

  var CSS =
    '.pp-chat-btn{position:fixed;right:14px;bottom:14px;z-index:99998;width:58px;height:58px;border:0;border-radius:50%;' +
    'background:var(--acc,#D4FF3A);color:var(--on-acc,#0E0D12);box-shadow:0 8px 24px rgba(0,0,0,.45);cursor:pointer;display:grid;place-items:center;padding:0}' +
    '.pp-chat-btn svg{width:26px;height:26px}' +
    '.pp-chat-btn.lift{bottom:58px}' +
    '.pp-chat-panel{position:fixed;right:14px;bottom:84px;z-index:99999;width:min(400px,calc(100vw - 28px));' +
    'height:min(620px,calc(100vh - 110px));background:#0E0D12;border:1px solid #34303D;border-radius:24px;box-shadow:0 18px 50px rgba(0,0,0,.6);' +
    'display:none;flex-direction:column;overflow:hidden}' +
    '.pp-chat-panel.lift{bottom:128px;height:min(620px,calc(100vh - 154px))}' +
    '.pp-chat-panel.open{display:flex}' +
    '.pp-chat-panel iframe{flex:1;width:100%;border:0;background:#0E0D12}';

  function init() {
    // QR 첫 화면(언어 선택)에는 띄우지 않는다
    if (document.querySelector('.lan_btn a[data-set-lang]')) return;
    var lang = (window.I18N && window.I18N.lang) || 'ko';
    var fest = (window.RENEWAL && window.RENEWAL.festival && window.RENEWAL.festival.id) || 'gwangyang';
    var t = function (k) { return TXT[k][lang] || TXT[k].ko; };
    var url = 'chatbot.html?embed=1&lang=' + encodeURIComponent(lang) + '&fest=' + encodeURIComponent(fest);

    var st = document.createElement('style');
    st.textContent = CSS;
    document.head.appendChild(st);

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'pp-chat-btn';
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', t('open'));
    btn.innerHTML = ICON_CHAT;

    var panel = document.createElement('div');
    panel.className = 'pp-chat-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', t('title'));

    function setOpen(open) {
      if (open && !panel.querySelector('iframe')) {
        var f = document.createElement('iframe');
        f.src = url;
        f.title = t('title');
        panel.appendChild(f);
      }
      panel.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.setAttribute('aria-label', open ? t('close') : t('open'));
      btn.innerHTML = open ? ICON_CLOSE : ICON_CHAT;
    }
    btn.addEventListener('click', function () { setOpen(!panel.classList.contains('open')); });
    function closeByKey() {
      if (!panel.classList.contains('open')) return;
      setOpen(false);
      btn.focus();   // 닫은 뒤 키보드 위치를 버튼으로 돌려줌
    }
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeByKey(); });
    // 챗봇 창(iframe) 안에서 ESC 를 누르면 chatbot.html 이 알려줌
    window.addEventListener('message', function (e) {
      if (e.origin === location.origin && e.data === 'pp-chat-close') closeByKey();
    });

    document.body.appendChild(panel);
    document.body.appendChild(btn);

    // i18n.js 의 🌐 언어 버튼(오른쪽 아래)과 겹치지 않게 (i18n.js 가 DOMContentLoaded 에서 만들므로 한 박자 뒤 확인)
    setTimeout(function () {
      if (document.querySelector('.i18n-switch')) { btn.classList.add('lift'); panel.classList.add('lift'); }
    }, 0);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

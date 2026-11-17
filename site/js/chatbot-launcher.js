/*
 * 행운팡팡 이용가이드 챗봇 버튼 (coupon.html)
 *
 * - 한국어를 선택했을 때만 오른쪽 아래에 💬 버튼이 생김 (챗봇이 한국어 전용이라서)
 *   언어는 js/i18n.js 가 정한 값(window.I18N.lang)을 따름 → 이 파일은 i18n.js 뒤에 넣을 것
 * - 버튼을 누르면 chatbot.html?embed=1 을 창(iframe)으로 띄움. 처음 열 때만 불러옴
 * - 🌐 언어 버튼(오른쪽 아래)과 겹치지 않게 그 바로 위에 둠
 */
(function () {
  'use strict';

  var lang = (window.I18N && window.I18N.lang) || 'ko';
  if (lang !== 'ko') return;

  var CHAT_URL = 'chatbot.html?embed=1';

  var CSS =
    '.pp-chat-btn{position:fixed;right:10px;bottom:52px;z-index:99998;width:52px;height:52px;border:none;border-radius:50%;' +
    'background:#6C4FD6;box-shadow:0 3px 10px rgba(0,0,0,.25);cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0}' +
    '.pp-chat-btn svg{width:26px;height:26px;stroke:#fff}' +
    '.pp-chat-panel{position:fixed;right:10px;bottom:112px;z-index:99999;width:min(380px,calc(100vw - 20px));' +
    'height:min(560px,calc(100vh - 130px));background:#fff;border-radius:14px;box-shadow:0 6px 24px rgba(0,0,0,.28);' +
    'display:none;flex-direction:column;overflow:hidden}' +
    '.pp-chat-panel.open{display:flex}' +
    '.pp-chat-head{display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:#6C4FD6;color:#fff;' +
    'font:700 14px "Noto Sans KR","Malgun Gothic",sans-serif;line-height:1.2}' +
    '.pp-chat-close{all:unset;cursor:pointer;font-size:22px;line-height:1;padding:0 2px;color:#fff}' +
    '.pp-chat-panel iframe{flex:1;width:100%;border:0}';

  var ICON_CHAT = '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
  var ICON_CLOSE = '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>';

  function init() {
    var st = document.createElement('style');
    st.textContent = CSS;
    document.head.appendChild(st);

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'pp-chat-btn';
    btn.setAttribute('aria-label', '행운팡팡 챗봇 열기');
    btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML = ICON_CHAT;

    var panel = document.createElement('div');
    panel.className = 'pp-chat-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', '행운팡팡 이용가이드 챗봇');
    panel.innerHTML =
      '<div class="pp-chat-head"><span>행운팡팡 이용가이드 챗봇</span>' +
      '<button type="button" class="pp-chat-close" aria-label="챗봇 닫기">×</button></div>';

    function setOpen(open) {
      if (open && !panel.querySelector('iframe')) {
        var f = document.createElement('iframe');
        f.src = CHAT_URL;
        f.title = '행운팡팡 이용가이드 챗봇';
        panel.appendChild(f);
      }
      panel.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.setAttribute('aria-label', open ? '행운팡팡 챗봇 닫기' : '행운팡팡 챗봇 열기');
      btn.innerHTML = open ? ICON_CLOSE : ICON_CHAT;
    }

    btn.addEventListener('click', function () { setOpen(!panel.classList.contains('open')); });
    panel.querySelector('.pp-chat-close').addEventListener('click', function () { setOpen(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });

    document.body.appendChild(panel);
    document.body.appendChild(btn);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

/*
 * 원래 사이트의 고장 난 부분을 화면 쪽에서 보완 (모든 페이지 <head> 에서 불러옴)
 *
 * 1) 안내창 함수 err_msg_layer 가 없는 페이지에서도 서버 안내가 보이게
 *    - 서버는 결과를 parent.err_msg_layer("...") 로 알려 주는데, 이 함수는 참여·포인트 조회 페이지에만 있다.
 *    - 그래서 설문(vote.html)처럼 페이지로 바로 열면 함수가 없어 빈 화면이 됐다 ("설문조사 기간이 지났습니다").
 *    - 페이지에 자기 함수가 있으면 그쪽이 덮어쓰므로 기존 동작은 그대로.
 * 2) 개인정보 동의 체크박스(.agree_chk) 모양
 * 3) 주소 링크 칸에 지도 <iframe> 코드가 들어가 깨진 링크 → 주소로 지도 검색 링크
 *
 * 안내 문구는 js/i18n.js 사전에 있으면 선택한 언어로 바뀐다.
 */
(function () {
  'use strict';

  // 색·모양은 리뉴얼 디자인(css/renewal.css)의 변수를 그대로 쓴다 → 축제 테마가 바뀌면 같이 바뀜.
  // 리뉴얼 CSS 가 없는 페이지에서는 뒤의 기본값(원래 사이트 색)으로 보인다.
  var CSS =
    '.sf-layer{position:fixed;inset:0;z-index:100000;display:flex;align-items:center;justify-content:center;' +
    'background:rgba(0,0,0,.65);padding:20px}' +
    '.sf-box{width:100%;max-width:330px;background:var(--tile-2,#fff);color:var(--text,#111);border:1px solid var(--line,transparent);' +
    'border-radius:var(--radius,16px);padding:28px 22px 20px;text-align:center;box-shadow:0 18px 50px rgba(0,0,0,.5);' +
    'font-family:var(--font,inherit);font-size:16px;font-weight:700;line-height:1.5}' +
    '.sf-msg{margin:0 0 20px;word-break:keep-all}' +
    '.sf-ok{all:unset;box-sizing:border-box;display:block;width:100%;height:54px;line-height:54px;border-radius:999px;' +
    'background:var(--acc,#DC294C);color:var(--on-acc,#fff);font-family:var(--font,inherit);font-size:17px;font-weight:800;cursor:pointer;text-align:center}' +
    '.sf-ok:focus-visible{outline:3px solid var(--pri,#000);outline-offset:3px}' +
    '.agree_chk{display:flex;align-items:center;gap:10px;margin:12px 4px 2px;color:var(--text,inherit);' +
    'font-family:var(--font,inherit);font-size:14px;font-weight:700;cursor:pointer;line-height:1.3}' +
    // 체크박스: 리뉴얼 입력칸처럼 어두운 칸 + 테마 테두리, 체크하면 포인트색으로 채움
    '.agree_chk input{-webkit-appearance:none;appearance:none;position:relative;width:24px;height:24px;margin:0;flex:none;cursor:pointer;' +
    'border:1.5px solid var(--line,#999);border-radius:8px;background:var(--tile,#fff);transition:background .15s,border-color .15s}' +
    '.agree_chk input:checked{background:var(--acc,#DC294C);border-color:var(--acc,#DC294C)}' +
    '.agree_chk input:checked::after{content:"";position:absolute;left:7px;top:3px;width:6px;height:11px;' +
    'border:solid var(--on-acc,#fff);border-width:0 2.5px 2.5px 0;transform:rotate(45deg)}' +
    '.agree_chk input:focus-visible{outline:3px solid var(--pri,#000);outline-offset:2px}';

  function addStyle() {
    if (document.getElementById('sf-style')) return;
    var st = document.createElement('style');
    st.id = 'sf-style';
    st.textContent = CSS;
    (document.head || document.documentElement).appendChild(st);
  }
  addStyle();

  // 3) 깨진 주소 링크 고치기
  //    원래 DB 의 주소 링크 칸에 지도 <iframe> 코드가 통째로 들어가 있어(72곳) 누르면 엉뚱한 주소가 열렸다.
  //    링크 글자(주소·장소 이름)로 지도 검색 링크를 새로 만든다. 번역되기 전(한국어)에 실행해야 해서
  //    i18n.js 보다 먼저 불러오는 이 파일에서 DOMContentLoaded 에 맨 먼저 처리한다.
  function fixMapLinks() {
    var links = document.querySelectorAll('a[href*="<iframe"], a[href*="%3Ciframe"]');
    for (var i = 0; i < links.length; i++) {
      var a = links[i];
      var q = (a.textContent || '').replace(/\s+/g, ' ').trim();
      if (!q) { a.removeAttribute('href'); continue; }
      a.href = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q);
      a.target = '_blank';
      a.rel = 'noopener';
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fixMapLinks);
  else fixMapLinks();

  // 4) 시연용 사이트(서버 없음) 안내
  //    참여(당첨확인)·인증번호받기·포인트 조회는 서버(PHP·DB)가 있어야 동작한다.
  //    정적 사이트에서는 눌러도 아무 반응이 없어 고장처럼 보였다 → 안내창을 띄운다.
  //    실제 서버(.kr 주소)에서는 이 부분이 동작하지 않으므로 원래 기능 그대로.
  if (!/\.kr$/i.test(location.hostname)) {
    var DEMO_MSG = '시연용 사이트에서는 실제 참여·인증·조회가 되지 않아요. 실제 서버에 연결하면 그대로 동작해요.';
    var demoNotice = function () {
      if (typeof window.err_msg_layer === 'function') window.err_msg_layer(DEMO_MSG);
      else alert(DEMO_MSG);
    };
    var nativeSubmit = HTMLFormElement.prototype.submit;
    HTMLFormElement.prototype.submit = function () {
      if (String(this.method).toLowerCase() === 'post') { demoNotice(); return; }
      return nativeSubmit.apply(this, arguments);
    };
    document.addEventListener('submit', function (e) {
      if (e.target && String(e.target.method).toLowerCase() === 'post') { e.preventDefault(); demoNotice(); }
    }, true);
    var hookAjax = function () {
      if (hookAjax.done || !window.jQuery || !window.jQuery.ajaxPrefilter) return;
      hookAjax.done = true;
      window.jQuery.ajaxPrefilter(function (o, orig, xhr) {
        if (/\.php(\?|$)/i.test(o.url || '')) { xhr.abort(); demoNotice(); }
      });
    };
    hookAjax();
    document.addEventListener('DOMContentLoaded', hookAjax);
  }

  if (typeof window.err_msg_layer !== 'function') {
    window.err_msg_layer = function (html) {
      // 안내만 있고 내용이 없는 페이지(설문 등)였는지: 확인을 누르면 이전 화면으로 돌아간다
      var blank = !document.body || !(document.body.innerText || '').trim();
      var layer = document.createElement('div');
      layer.className = 'sf-layer';
      layer.setAttribute('role', 'alertdialog');
      layer.setAttribute('aria-modal', 'true');
      layer.innerHTML = '<div class="sf-box"><p class="sf-msg"></p><button type="button" class="sf-ok">확 인</button></div>';
      layer.querySelector('.sf-msg').innerHTML = html;   // 서버가 보낸 안내 (원래 함수와 같은 방식)
      layer.querySelector('.sf-ok').addEventListener('click', function () {
        layer.remove();
        if (!blank) return;
        if (history.length > 1) history.back();
        else location.href = 'index.html';
      });
      (document.body || document.documentElement).appendChild(layer);
      layer.querySelector('.sf-ok').focus();
    };
  }
})();

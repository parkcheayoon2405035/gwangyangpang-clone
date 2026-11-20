/*
 * 원래 사이트의 고장 난 부분을 화면 쪽에서 보완 (모든 페이지 <head> 에서 불러옴)
 *
 * 1) 안내창 함수 err_msg_layer 가 없는 페이지에서도 서버 안내가 보이게
 *    - 서버는 결과를 parent.err_msg_layer("...") 로 알려 주는데, 이 함수는 참여·포인트 조회 페이지에만 있다.
 *    - 그래서 설문(vote.html)처럼 페이지로 바로 열면 함수가 없어 빈 화면이 됐다 ("설문조사 기간이 지났습니다").
 *    - 페이지에 자기 함수가 있으면 그쪽이 덮어쓰므로 기존 동작은 그대로.
 * 2) 개인정보 동의 체크박스(.agree_chk) 모양
 *
 * 안내 문구는 js/i18n.js 사전에 있으면 선택한 언어로 바뀐다.
 */
(function () {
  'use strict';

  var CSS =
    '.sf-layer{position:fixed;inset:0;z-index:100000;display:flex;align-items:center;justify-content:center;' +
    'background:rgba(0,0,0,.6);padding:20px}' +
    '.sf-box{width:100%;max-width:320px;background:#fff;color:#111;border-radius:16px;padding:26px 20px 18px;text-align:center;' +
    'box-shadow:0 12px 40px rgba(0,0,0,.4);font-size:16px;line-height:1.5}' +
    '.sf-msg{margin:0 0 18px;word-break:keep-all}' +
    '.sf-ok{all:unset;box-sizing:border-box;display:block;width:100%;padding:12px;border-radius:999px;background:#DC294C;' +
    'color:#fff;font-weight:700;cursor:pointer;text-align:center}' +
    '.agree_chk{display:flex;align-items:center;gap:8px;margin:10px 2px 4px;font-size:14px;font-weight:700;cursor:pointer;line-height:1.3}' +
    '.agree_chk input{width:20px;height:20px;margin:0;flex:none;accent-color:#DC294C;cursor:pointer}';

  function addStyle() {
    if (document.getElementById('sf-style')) return;
    var st = document.createElement('style');
    st.id = 'sf-style';
    st.textContent = CSS;
    (document.head || document.documentElement).appendChild(st);
  }
  addStyle();

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

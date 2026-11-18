/*
 * 마이스팡팡 디자인 리뉴얼 (MZ 테마) — 화면 구성 스크립트
 *
 * - 축제마다 바뀌는 값은 맨 위 FESTIVAL 하나만 고치면 된다. (행사명·교환 장소·포인트·색 테마)
 * - 글자가 그려진 이미지(로고·배너·제목·버튼)를 HTML 글자로 바꿔 새 디자인(css/renewal.css)을 입힌다.
 * - i18n.js 보다 먼저 실행된다. (i18n.js 앞에서 불러오고, DOMContentLoaded 리스너를 먼저 등록)
 *   그래서 i18n.js의 배너 교체는 이미 바뀐 이미지를 건드리지 않고, 문구 번역만 이어서 한다.
 * - 페이지 구조·폼 필드 이름은 바꾸지 않는다. 원래 이미지의 링크·onclick은 그대로 옮긴다.
 * - 테마 미리보기: 주소 끝에 ?theme=spring | edu | eco
 */
(function () {
  'use strict';

  /* ================================================================
     1. 축제 설정 (축제가 바뀌면 여기만 수정)
     ================================================================ */
  var FESTIVAL = {
    theme: 'spring',                       // 색 테마: spring(봄 축제) | edu(교육 축제) | eco(생태 행사)
    year: '2025-2026',
    name: {
      ko: '한국관광100선 탐방 이벤트',
      en: 'Korea Tourism 100 Tour Event',
      ja: '韓国観光100選 探訪イベント',
      zh: '韩国旅游100选 探访活动'
    },
    region: { ko: '광양', en: 'Gwangyang', ja: '光陽', zh: '光阳' },
    exchangePlace: {
      ko: '종합안내 7번 부스',
      en: 'Booth 7 (Information Center)',
      ja: '総合案内 7番ブース',
      zh: '综合咨询 7号展位'
    },
    giftPoints: '5,000P',
    expireTime: '23:00',
    phone: '1522-3475',
    phoneHours: {
      ko: '평일 09시~17시 (공휴일 제외)',
      en: 'Weekdays 9:00–17:00 (excl. holidays)',
      ja: '平日 9:00〜17:00（祝日を除く）',
      zh: '工作日 9:00–17:00（节假日除外）'
    }
  };

  var THEMES = ['spring', 'edu', 'eco'];

  /* ================================================================
     2. 언어 (i18n.js 와 같은 규칙으로 읽기만 한다. 저장은 i18n.js 가 한다)
     ================================================================ */
  var LANGS = ['ko', 'en', 'ja', 'zh'];
  function readCookie(name) {
    var m = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
    return m ? decodeURIComponent(m[1]) : null;
  }
  function currentLang() {
    var q = (location.search.match(/[?&]lang=([a-z]{2})/) || [])[1];
    if (q && LANGS.indexOf(q) >= 0) return q;
    var c = readCookie('lang');
    if (c && LANGS.indexOf(c) >= 0) return c;
    try {
      var s = localStorage.getItem('lang');
      if (s && LANGS.indexOf(s) >= 0) return s;
    } catch (e) { /* 저장소 막힘 */ }
    return 'ko';
  }
  var lang = currentLang();
  function L(v) { return (v && typeof v === 'object') ? (v[lang] != null ? v[lang] : v.ko) : v; }

  function currentTheme() {
    var q = (location.search.match(/[?&]theme=([a-z]+)/) || [])[1];
    if (q && THEMES.indexOf(q) >= 0) {
      try { localStorage.setItem('rn-theme', q); } catch (e) { /* 무시 */ }
      return q;
    }
    try {
      var s = localStorage.getItem('rn-theme');
      if (s && THEMES.indexOf(s) >= 0) return s;
    } catch (e) { /* 무시 */ }
    return FESTIVAL.theme;
  }

  // 화면 깜빡임 방지: <head> 에서 읽히는 즉시 표시를 붙여 첫 화면부터 새 디자인이 적용되게 한다.
  // (이미지 교체·번역이 끝나면 rn-ready 를 붙여 내용을 보여 준다. 오류가 나도 1.5초 뒤엔 무조건 보이게)
  var root = document.documentElement;
  root.classList.add('rn');
  root.setAttribute('data-theme', currentTheme());
  root.setAttribute('data-lang', lang);
  function ready() { root.classList.add('rn-ready'); }
  setTimeout(ready, 1500);

  /* ================================================================
     3. 새로 넣는 문구 (4개 국어)
     ================================================================ */
  var T = {
    survey: { ko: '설문', en: 'Survey', ja: 'アンケート', zh: '问卷' },
    myPoints: { ko: '내 포인트', en: 'My Points', ja: 'マイポイント', zh: '我的积分' },
    seeAll: { ko: '전체보기', en: 'See all', ja: 'すべて見る', zh: '查看全部' },
    more: { ko: '더보기', en: 'More', ja: 'もっと見る', zh: '查看更多' },
    guide: { ko: '이용 가이드', en: 'User Guide', ja: '利用ガイド', zh: '使用指南' },
    exchangeNote: {
      ko: '행운포인트는 {place}에서 선물로 교환해 드려요',
      en: 'Exchange Lucky Points for gifts at {place}',
      ja: 'ラッキーポイントは{place}でプレゼントと交換できます',
      zh: '幸运积分可在{place}兑换礼品'
    },
    popular: {
      food: { ko: '인기 음식점', en: 'Top Restaurants', ja: '人気の飲食店', zh: '人气餐厅' },
      hotel: { ko: '인기 숙박', en: 'Top Stays', ja: '人気の宿泊施設', zh: '人气住宿' },
      tour: { ko: '인기 관광지', en: 'Top Sights', ja: '人気の観光地', zh: '人气景点' },
      market: { ko: '인기 특산물 · 시장', en: 'Specialties & Markets', ja: '人気の特産品・市場', zh: '人气特产 · 市场' }
    },
    category: {
      food: { ko: '음식점', en: 'Restaurants', ja: '飲食店', zh: '餐厅' },
      fv: { ko: '행사안내', en: 'Events', ja: 'イベント', zh: '活动介绍' },
      hotel: { ko: '숙박', en: 'Stay', ja: '宿泊', zh: '住宿' },
      tour: { ko: '관광지', en: 'Sights', ja: '観光地', zh: '景点' },
      market: { ko: '지역 특산물', en: 'Local Specialties', ja: '地域特産品', zh: '地方特产' }
    },
    nearby: {
      tour: { ko: '인기글', en: 'Popular Posts', ja: '人気の投稿', zh: '热门文章' },
      food: { ko: '주변 음식점', en: 'Nearby Restaurants', ja: '周辺の飲食店', zh: '周边餐厅' },
      hotel: { ko: '주변 숙박', en: 'Nearby Stays', ja: '周辺の宿泊施設', zh: '周边住宿' },
      tour2: { ko: '주변 관광지', en: 'Nearby Sights', ja: '周辺の観光地', zh: '周边景点' },
      sp: { ko: '주변 특산물 · 시장', en: 'Nearby Specialties & Markets', ja: '周辺の特産品・市場', zh: '周边特产 · 市场' }
    },
    naverMap: { ko: '네이버 지도로 보기', en: 'View on Naver Map', ja: 'NAVERマップで見る', zh: '在 Naver 地图中查看' },
    pass: {
      label: 'LUCKY PASS',
      lead: { ko: 'QR 찍고 받는 행운포인트', en: 'Lucky Points you get by scanning QR', ja: 'QRで受け取るラッキーポイント', zh: '扫码即得幸运积分' },
      badge: { ko: '앱 설치<br>없이 OK', en: 'No app<br>needed', ja: 'アプリ<br>不要', zh: '无需<br>下载' },
      where: { ko: '선물 교환 장소', en: 'Gift exchange', ja: 'プレゼント交換場所', zh: '礼品兑换地点' }
    },
    steps: {
      title: '3 STEP',
      list: [
        { ko: 'QR 스캔', en: 'Scan QR', ja: 'QRスキャン', zh: '扫码' },
        { ko: '행운 추첨', en: 'Lucky draw', ja: '抽選', zh: '抽奖' },
        { ko: '선물 교환', en: 'Get a gift', ja: 'プレゼント交換', zh: '兑换礼品' }
      ]
    },
    expire: {
      ko: '포인트는 당일 {time}까지 사용할 수 있어요',
      en: 'Points expire at {time} on the same day',
      ja: 'ポイントは当日{time}まで使えます',
      zh: '积分当天{time}前有效'
    },
    surveyCard: {
      tag: { ko: '이벤트', en: 'EVENT', ja: 'イベント', zh: '活动' },
      title: { ko: '60초 만족도 조사', en: '60-second survey', ja: '60秒アンケート', zh: '60秒满意度调查' },
      body: {
        ko: '참여하면 추첨으로 <b>커피 쿠폰</b>을 드려요',
        en: 'Join for a chance to win a <b>coffee coupon</b>',
        ja: '参加すると抽選で<b>コーヒークーポン</b>をプレゼント',
        zh: '参与即有机会抽中<b>咖啡券</b>'
      },
      cta: { ko: '참여하기', en: 'Start', ja: '回答する', zh: '立即参与' }
    },
    guideCard: {
      title: { ko: '행운팡팡 이용 가이드', en: 'Lucky PangPang Guide', ja: 'ラッキーパンパン利用ガイド', zh: 'Lucky PangPang 使用指南' },
      body: { ko: '포인트 적립부터 선물 교환까지 한눈에', en: 'From earning points to getting gifts', ja: 'ポイント獲得からプレゼント交換まで', zh: '从获得积分到兑换礼品一目了然' }
    },
    mapCard: {
      title: { ko: '{region} 관광 안내도', en: '{region} Tour Map', ja: '{region}観光案内図', zh: '{region}旅游地图' },
      body: { ko: '지도로 둘러보기', en: 'Explore on the map', ja: '地図で見る', zh: '查看地图' }
    },
    contact: {
      title: { ko: '행운팡팡 프로그램 문의', en: 'Lucky PangPang Inquiries', ja: 'ラッキーパンパンお問い合わせ', zh: 'Lucky PangPang 咨询' }
    },
    intro: {
      title: '언어를 골라 주세요',
      sub: 'Choose your language · 言語を選択 · 选择语言',
      foot: {
        ko: '언어는 다음 화면 오른쪽 위에서도 바꿀 수 있어요',
        en: 'You can change the language anytime at the top right',
        ja: '言語は次の画面の右上でも変更できます',
        zh: '之后也可在右上角切换语言'
      }
    },
    entry: {
      ribbon: { ko: 'LUCKY DRAW ✦ 행운 추첨 ✦ QR 찍고 선물 받고 ✦', en: 'LUCKY DRAW ✦ SCAN QR ✦ GET A GIFT ✦', ja: 'LUCKY DRAW ✦ QRで抽選 ✦ プレゼント ✦', zh: 'LUCKY DRAW ✦ 扫码抽奖 ✦ 领取礼品 ✦' },
      title: { ko: '행운 받을<br>준비 됐나요?', en: 'Ready to<br>get lucky?', ja: '幸運を<br>つかもう！', zh: '准备好<br>抽好运了吗？' },
      formNote: { ko: '참여할 때 이름과 휴대폰 번호를 입력해요', en: 'You will enter your name and phone number', ja: '参加時にお名前と電話番号を入力します', zh: '参与时需填写姓名和手机号' },
      go: { ko: '행운 뽑으러 가기', en: 'Try my luck', ja: '抽選に参加する', zh: '去抽奖' },
      skip: { ko: '다음에 할게요', en: 'Maybe later', ja: 'また今度', zh: '下次再说' }
    }
  };
  function fill(s) {
    return String(s)
      .replace('{place}', L(FESTIVAL.exchangePlace))
      .replace('{time}', FESTIVAL.expireTime)
      .replace('{region}', L(FESTIVAL.region));
  }

  /* ================================================================
     4. 아이콘 (선 아이콘, currentColor)
     ================================================================ */
  var ICON = {
    survey: '<path d="M9 11l3 3 8-8"/><path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h9"/>',
    point: '<circle cx="12" cy="12" r="9"/><path d="M9.5 16V8h3.2a2.4 2.4 0 0 1 0 4.8H9.5"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a14 14 0 0 1 0 18a14 14 0 0 1 0-18"/>',
    arrow: '<path d="M5 12h14"/><path d="M13 6l6 6-6 6"/>',
    pin: '<path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
    phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>',
    map: '<path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2z"/><path d="M9 4v14M15 6v14"/>',
    book: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19a2 2 0 0 1 2-2h13"/>',
    coffee: '<path d="M17 8h1a4 4 0 0 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4z"/><path d="M6 2v2M10 2v2M14 2v2"/>',
    qr: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><path d="M14 14h3v3h-3zM20 14v.01M14 20v.01M17 20h4v-3"/>',
    chevron: '<path d="M6 9l6 6 6-6"/>'
  };
  function svg(name) {
    return '<svg class="rn-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICON[name] + '</svg>';
  }

  /* ================================================================
     5. 공통 부품 만들기
     ================================================================ */
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }

  // 원래 이미지를 새 요소로 바꾼다. onclick 등은 옮기고, 이미지를 감싼 링크는 그대로 둔다.
  function swapImage(img, node) {
    var oc = img.getAttribute('onclick');
    if (oc) { node.setAttribute('onclick', oc); node.style.cursor = 'pointer'; }
    var holder = img.parentNode;
    holder.replaceChild(node, img);
    // 이미지를 담던 상자의 line-height:0 / 고정 높이를 풀어 준다
    if (holder && holder.tagName !== 'A') holder.classList.add('rn-holder');
    else if (holder && holder.parentNode) holder.parentNode.classList.add('rn-holder');
    return node;
  }

  function langMenu() {
    var names = { ko: '한국어', en: 'English', ja: '日本語', zh: '中文' };
    var box = el('div', 'rn-lang');
    box.innerHTML =
      '<button type="button" class="rn-lang-btn" aria-haspopup="true" aria-label="Language">' + svg('globe') +
      '<span>' + lang.toUpperCase() + '</span></button>' +
      '<div class="rn-lang-menu" role="menu">' + LANGS.map(function (l) {
        return '<button type="button" role="menuitem" data-set-lang="' + l + '"' + (l === lang ? ' class="on"' : '') + '>' +
          '<b>' + l.toUpperCase() + '</b>' + names[l] + '</button>';
      }).join('') + '</div>';
    box.querySelector('.rn-lang-btn').addEventListener('click', function (e) {
      e.stopPropagation();
      box.classList.toggle('open');
    });
    document.addEventListener('click', function () { box.classList.remove('open'); });
    return box;
  }

  function buildHeader() {
    var bar = document.querySelector('.main_menu_11');
    if (!bar) return;
    var head = el('header', 'rn-top');
    head.innerHTML =
      '<a class="rn-logo" href="index.html"><small>' + FESTIVAL.year + '</small><b>' + L(FESTIVAL.name) + '</b></a>' +
      '<nav class="rn-top-actions">' +
      '<a class="rn-ico-btn" href="vote.html">' + svg('survey') + '<span>' + L(T.survey) + '</span></a>' +
      '<a class="rn-ico-btn rn-ico-btn--accent" href="phone_login__login_type_mylist.html">' + svg('point') + '<span>' + L(T.myPoints) + '</span></a>' +
      '</nav>';
    head.querySelector('.rn-top-actions').appendChild(langMenu());
    bar.innerHTML = '';
    bar.appendChild(head);
  }

  // 홈 화면 "인기 ○○" 배너 → 섹션 머리
  var POPULAR = {
    'banner_food.png': ['food', 'food_intro.html'],
    'banner_hotel.png': ['hotel', 'hotel_intro.html'],
    'banner_tour.png': ['tour', 'tour_intro.html'],
    'banner_market.png': ['market', 'sp_intro.html']
  };
  // 목록 페이지 위 카테고리 배너 → 큰 제목 영역
  var CATEGORY = {
    'banner_food_.png': 'food', 'banner_fv_.png': 'fv', 'banner_hotel_.png': 'hotel',
    'banner_tour_.png': 'tour', 'banner_market_.png': 'market'
  };
  // "- 주변 ○○ -" 제목 이미지 → 작은 섹션 제목
  var NEARBY = {
    'tour_title.png': 'tour', 'food_title.png': 'food', 'hotel_title.png': 'hotel',
    'tour_title2.png': 'tour2', 'sp_title.png': 'sp'
  };

  function replaceImages() {
    var imgs = Array.prototype.slice.call(document.querySelectorAll('img'));
    imgs.forEach(function (img) {
      var file = (img.getAttribute('src') || '').split('/').pop();
      var node = null;

      if (POPULAR[file]) {
        var p = POPULAR[file];
        node = el('div', 'rn-sec',
          '<div><span class="rn-eyebrow">' + L(FESTIVAL.region) + ' PICK</span><h2 class="rn-h2">' + L(T.popular[p[0]]) + '</h2></div>' +
          '<a class="rn-link" href="' + p[1] + '">' + L(T.seeAll) + svg('arrow') + '</a>');
      } else if (CATEGORY[file]) {
        node = el('div', 'rn-hero',
          '<span class="rn-eyebrow">' + L(FESTIVAL.region) + ' · ' + FESTIVAL.year + '</span>' +
          '<h1 class="rn-display">' + L(T.category[CATEGORY[file]]) + '</h1>' +
          '<p>' + fill(L(T.exchangeNote)) + '</p>' +
          '<a class="rn-chip" href="coupon.html">' + svg('book') + L(T.guide) + '</a>');
      } else if (NEARBY[file]) {
        node = el('h3', 'rn-h3', L(T.nearby[NEARBY[file]]));
      } else if (file === 'more_btn.png') {
        node = el('span', 'rn-more', L(T.more) + svg('chevron'));
      } else if (file === 'naver_map.png') {
        node = el('span', 'rn-btn rn-btn--ghost', svg('map') + L(T.naverMap));
      } else if (file === 'logo_img.png' || file === 'logo_w.png') {
        node = el('span', 'rn-wordmark', '<small>' + FESTIVAL.year + '</small><b>' + L(FESTIVAL.name) + '</b>');
      } else if (file === 'main_event.jpg') {
        node = el('div', 'rn-pass',
          '<span class="rn-pass-badge">' + L(T.pass.badge) + '</span>' +
          '<span class="rn-pass-label">' + T.pass.label + '</span>' +
          '<strong class="rn-pass-name">' + L(FESTIVAL.name) + '</strong>' +
          '<span class="rn-pass-cut"></span>' +
          '<span class="rn-pass-lead">' + L(T.pass.lead) + '</span>' +
          '<span class="rn-pass-row"><b class="rn-display">' + FESTIVAL.giftPoints + '</b>' + svg('qr') + '</span>');
        var after = el('div', 'rn-info-grid',
          '<div class="rn-tile">' + svg('pin') + '<span><small>' + L(T.pass.where) + '</small><b>' + L(FESTIVAL.exchangePlace) + '</b></span></div>' +
          '<div class="rn-tile rn-steps"><small>' + T.steps.title + '</small><ol>' +
          T.steps.list.map(function (s) { return '<li>' + L(s) + '</li>'; }).join('') + '</ol></div>' +
          '<p class="rn-note">' + fill(L(T.expire)) + '</p>');
        swapImage(img, node);
        node.parentNode.insertBefore(after, node.nextSibling);
        return;
      } else if (file === 'banner_event_.png') {
        node = el('div', 'rn-card rn-card--accent',
          '<span class="rn-card-ic">' + svg('coffee') + '</span>' +
          '<span class="rn-card-body"><small>' + L(T.surveyCard.tag) + '</small><b>' + L(T.surveyCard.title) + '</b>' +
          '<em>' + L(T.surveyCard.body) + '</em></span>' +
          '<span class="rn-card-go">' + svg('arrow') + '</span>');
      } else if (file === 'banner_guide.png' || file === 'banner_guide_1.png') {
        node = el('div', 'rn-card',
          '<span class="rn-card-ic">' + svg('book') + '</span>' +
          '<span class="rn-card-body"><b>' + L(T.guideCard.title) + '</b><em>' + L(T.guideCard.body) + '</em></span>' +
          (file === 'banner_guide.png' ? '<span class="rn-card-go">' + svg('arrow') + '</span>' : ''));
      } else if (file === 'banner_info.png') {
        node = el('div', 'rn-card',
          '<span class="rn-card-ic">' + svg('map') + '</span>' +
          '<span class="rn-card-body"><b>' + fill(L(T.mapCard.title)) + '</b><em>' + L(T.mapCard.body) + '</em></span>' +
          '<span class="rn-card-go">' + svg('arrow') + '</span>');
      } else if (file === 'banner_center.png') {
        node = el('div', 'rn-card rn-card--contact',
          '<span class="rn-card-ic">' + svg('phone') + '</span>' +
          '<span class="rn-card-body"><small>' + L(T.contact.title) + '</small><b class="rn-num">' + FESTIVAL.phone + '</b>' +
          '<em>' + L(FESTIVAL.phoneHours) + '</em></span>');
      } else if (file === 's_call_icon.png') {
        node = el('span', 'rn-mini-ic', svg('phone'));
      } else if (file === 's_map_icon.png') {
        node = el('span', 'rn-mini-ic', svg('pin'));
      }

      if (node) swapImage(img, node);
    });
  }

  // 이어서 나오는 카드(article.list_box)를 한 상자로 묶는다.
  // 목록 페이지(카테고리 머리가 있는 화면) → 2열 격자, 그 외(홈·상세) → 옆으로 넘기는 줄, 1개뿐이면 한 장
  function groupLists() {
    var isCategory = !!document.querySelector('.rn-hero');
    var cards = Array.prototype.slice.call(document.querySelectorAll('article.list_box'));
    var group = null, last = null;
    cards.forEach(function (card) {
      if (!group || card.previousElementSibling !== last) {
        group = el('div', 'rn-list');
        card.parentNode.insertBefore(group, card);
      }
      group.appendChild(card);
      last = group;
    });
    Array.prototype.forEach.call(document.querySelectorAll('.rn-list'), function (g) {
      var n = g.children.length;
      g.classList.add(n === 1 ? 'rn-list--single' : (isCategory ? 'rn-list--grid' : 'rn-list--rail'));
    });
    // 카드가 하나도 없는 '인기 ○○'(홈) · '주변 ○○'(상세) 섹션은 제목째 숨김
    var secs = document.querySelectorAll('.rn-sec');
    if (secs.length) document.querySelector('.wrap').classList.add('rn-home');
    Array.prototype.forEach.call(document.querySelectorAll('.rn-sec, .rn-h3'), function (sec) {
      var box = sec.closest('.rn-holder') || sec;
      var next = box.nextElementSibling;
      while (next && next.classList.contains('text_h4')) next = next.nextElementSibling;
      if (!next || !next.classList.contains('rn-list')) box.classList.add('rn-empty');
    });
  }

  /* ---------- QR로 처음 들어오는 화면: 언어 선택 ---------- */
  function buildIntro() {
    var links = document.querySelectorAll('.lan_btn a[data-set-lang]');
    if (!links.length) return;
    var box = document.querySelector('.lan_btn');
    var page = box.parentNode;
    page.classList.add('rn-page');
    document.body.classList.add('rn-intro');

    var hello = el('div', 'rn-hello',
      ['안녕하세요', 'HELLO', 'こんにちは', '你好'].map(function (w, i) {
        var row = '';
        for (var k = 0; k < 4; k++) row += '<span>' + w + '</span>';
        return '<div class="rn-hello-row' + (i === 0 ? ' on' : '') + '" style="--d:' + (i % 2 ? -1 : 1) + '">' + row + row + '</div>';
      }).join(''));
    var head = el('div', 'rn-intro-head',
      '<h1 class="rn-display">' + T.intro.title + '</h1><p>' + T.intro.sub + '</p>');
    page.insertBefore(hello, box);
    page.insertBefore(head, box);

    var codes = { ko: '한국어', en: 'English', ja: '日本語', zh: '中文' };
    Array.prototype.forEach.call(links, function (a) {
      var l = a.getAttribute('data-set-lang');
      var btn = a.querySelector('button');
      if (btn) btn.innerHTML = '<span class="rn-lang-name">' + codes[l] + '</span><span class="rn-lang-code">' + l.toUpperCase() + '</span>' +
        '<span class="rn-lang-go">' + svg('arrow') + '</span>';
      a.parentNode.classList.add('rn-lang-row');
      if (l === lang) a.parentNode.classList.add('on');
    });
    page.appendChild(el('p', 'rn-foot', L(T.intro.foot)));
  }

  /* ---------- 참여 안내 화면 (entry) ---------- */
  function buildEntry() {
    var go = document.querySelector('.lan_btn a[href^="view"]');
    if (!go) return;
    var box = go.closest('.lan_btn');
    var page = box.closest('.wrap > div') || box.parentNode;
    page.classList.add('rn-page');
    document.body.classList.add('rn-entry');

    // 원래 안내 문구(축제마다 서버가 넣던 글)는 숨기고, 축제 설정 값으로 다시 그린다
    Array.prototype.forEach.call(page.children, function (c) {
      if (!c.contains(box) && !c.querySelector('.rn-wordmark')) c.classList.add('rn-hide');
    });

    var top = el('div', 'rn-entry-body',
      '<div class="rn-ribbon"><span>' + L(T.entry.ribbon) + ' ' + L(T.entry.ribbon) + '</span></div>' +
      '<h1 class="rn-display rn-entry-title">' + L(T.entry.title) + '</h1>' +
      '<div class="rn-pass">' +
        '<span class="rn-pass-badge">' + L(T.pass.badge) + '</span>' +
        '<span class="rn-pass-label">' + T.pass.label + '</span>' +
        '<strong class="rn-pass-name">' + L(FESTIVAL.name) + '</strong>' +
        '<span class="rn-pass-cut"></span>' +
        '<span class="rn-pass-lead">' + L(T.pass.lead) + '</span>' +
        '<span class="rn-pass-row"><b class="rn-display">' + FESTIVAL.giftPoints + '</b>' + svg('qr') + '</span>' +
      '</div>' +
      '<div class="rn-info-grid">' +
        '<div class="rn-tile">' + svg('pin') + '<span><small>' + L(T.pass.where) + '</small><b>' + L(FESTIVAL.exchangePlace) + '</b></span></div>' +
        '<div class="rn-tile rn-steps"><small>' + T.steps.title + '</small><ol>' +
        T.steps.list.map(function (s) { return '<li>' + L(s) + '</li>'; }).join('') + '</ol></div>' +
      '</div>' +
      '<p class="rn-note">' + L(T.entry.formNote) + '</p>');
    box.parentNode.insertBefore(top, box);

    var links = box.querySelectorAll('a');
    if (links[0]) {
      links[0].classList.add('rn-cta-link');
      links[0].querySelector('button').innerHTML = '<span>' + L(T.entry.go) + '</span><span class="rn-cta-go">' + svg('arrow') + '</span>';
    }
    if (links[1]) {
      links[1].classList.add('rn-skip-link');
      links[1].querySelector('button').textContent = L(T.entry.skip);
    }
  }

  // 메인 사진(포스터) 두 장은 카드로 감싸 둥글게
  function markPhotos() {
    Array.prototype.forEach.call(document.querySelectorAll('img[src$="main_img1.jpg"], img[src$="main_img2.jpg"]'), function (img) {
      img.classList.add('rn-poster');
    });
  }

  function start() {
    // i18n.js 의 번역(같은 DOMContentLoaded 에서 이 함수 다음에 실행)까지 끝난 뒤에 보여 주도록 한 박자 늦춘다
    setTimeout(ready, 0);
    buildHeader();
    replaceImages();
    buildIntro();
    buildEntry();
    groupLists();
    markPhotos();
  }

  // i18n.js 보다 먼저 등록되도록 이 파일을 i18n.js 앞에서 불러온다
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();

  window.RENEWAL = { festival: FESTIVAL, lang: lang };
})();

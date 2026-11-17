/*
 * 광양행운팡팡 다국어(화면 고정 문구) 스크립트
 *
 * - 언어 선택: 쿠키 `lang` (ko | en | ja | zh). 서버 PHP에서도 $_COOKIE['lang']로 읽을 수 있음
 * - 주소에 ?lang=en 을 붙이면 그 언어로 바뀌고 쿠키에도 저장됨 (테스트용)
 * - data-set-lang="en" 이 붙은 링크/버튼을 누르면 언어를 저장한 뒤 이동
 * - 번역은 아래 DICT의 한국어 원문(공백 정리한 글자)과 화면 글자가 정확히 같을 때만 적용.
 *   사전에 없는 글자(DB에서 오는 업체 이름·설명 등)는 한국어 그대로 둠.
 * - 페이지 구조·폼 필드 이름은 바꾸지 않으므로 서버(DB) 처리에는 영향 없음
 */
(function () {
  'use strict';

  var LANGS = ['ko', 'en', 'ja', 'zh'];
  var HTML_LANG = { ko: 'ko', en: 'en', ja: 'ja', zh: 'zh-CN' };
  var LANG_NAMES = { ko: '한국어', en: 'English', ja: '日本語', zh: '中文' };

  // 공통으로 쓰는 고유명사
  var BRAND = { en: 'Lucky PangPang', ja: 'ラッキーパンパン', zh: 'Lucky PangPang' };

  /*
   * 키: 화면에 보이는 한국어 원문 (줄바꿈·<br>은 공백 한 칸으로)
   * 값: { en, ja, zh } — HTML 가능 (<b>, <br> 등)
   */
  var DICT = {
    // ── 공통: 페이지 제목 ──
    '광양행운팡팡(개발용)': {
      en: 'Gwangyang ' + BRAND.en + ' (Dev)',
      ja: '光陽' + BRAND.ja + '（開発用）',
      zh: '光阳 ' + BRAND.zh + '（开发版）'
    },

    // ── 공통: 하단 메뉴 ──
    '행사안내': { en: 'Events', ja: 'イベント', zh: '活动介绍' },
    '음식점': { en: 'Food', ja: '飲食店', zh: '餐厅' },
    '숙박': { en: 'Stay', ja: '宿泊', zh: '住宿' },
    '관광지': { en: 'Sights', ja: '観光地', zh: '景点' },
    '특산물': { en: 'Specialties', ja: '特産品', zh: '特产' },
    '지역 특산물': { en: 'Local Specialties', ja: '地域特産品', zh: '地方特产' },

    // ── 목록 공통 분류 ──
    '모범음식점': { en: 'Certified Restaurant', ja: '模範飲食店', zh: '模范餐厅' },

    // ── 공통: 하단 회사 정보 ──
    '정보 수정 / 업무 제휴 문의': {
      en: 'Corrections / Partnership Inquiries',
      ja: '情報修正・業務提携のお問い合わせ',
      zh: '信息修改 / 业务合作咨询'
    },
    '무지개컴퍼니 주식회사': {
      en: 'Mujigae Company Co., Ltd.',
      ja: '株式会社ムジゲカンパニー',
      zh: 'Mujigae Company 股份有限公司'
    },
    '여상호': { en: 'Yeo Sang-ho', ja: 'ヨ・サンホ', zh: 'Yeo Sang-ho' },
    '대구광역시 북구 연암로4길 1, 2층': {
      en: '2F, 1 Yeonam-ro 4-gil, Buk-gu, Daegu',
      ja: '大邱広域市 北区 延岩路4キル 1, 2階',
      zh: '大邱广域市 北区 延岩路4街 1号 2楼'
    },
    '본 사이트의 정보는 업체 및 기관의 사정에 따라 변경될 수 있습니다. Copyright © 2026 무지개컴퍼니 ALL RIGHT RESERVED.': {
      en: 'Information on this site may change depending on the circumstances of businesses and institutions.<br>Copyright © 2026 Mujigae Company ALL RIGHTS RESERVED.',
      ja: '本サイトの情報は、各事業者・機関の都合により変更される場合があります。<br>Copyright © 2026 Mujigae Company ALL RIGHTS RESERVED.',
      zh: '本网站信息可能因商家及机构情况而有所变更。<br>Copyright © 2026 Mujigae Company ALL RIGHTS RESERVED.'
    },

    // ── entry: 참여 안내 ──
    '행운포인트는 종합안내 7번 부스에서 선물로 교환하여 드립니다.': {
      en: 'Exchange your Lucky Points for a gift at the Information Center,<br><b style="font-size:35px;">Booth 7</b>',
      ja: 'ラッキーポイントは<br>総合案内<b style="font-size:35px;">7番</b>ブースで<br>プレゼントと<br>交換できます。',
      zh: '幸运积分可在<br>综合服务台<b style="font-size:35px;">7号</b>展位<br>兑换礼品。'
    },
    '이벤트 참여하실분들은 아래버튼을 눌러주세요': {
      en: 'To join the event,<br>tap the button below',
      ja: 'イベントに<br>参加する方は<br>下のボタンを<br>押してください',
      zh: '参与活动请<br>点击下方按钮'
    },
    '참여하기': { en: 'Join', ja: '参加する', zh: '参与' },
    '참여하지않음': { en: 'No thanks', ja: '参加しない', zh: '不参与' },

    // ── view: 참여(정보 입력) ──
    '확 인': { en: 'OK', ja: '確認', zh: '确认' },
    '방문을 환영합니다!': { en: 'Welcome!', ja: 'ようこそ！', zh: '欢迎光临！' },
    '행운팡팡 참여를 위한 정보 수집 동의 (필수) 1. 수집 항목 : 이름, 전화번호 2. 포인트 지급 및 사용에만 이용 됩니다 3. 4주 후 자동 삭제됩니다': {
      en: '<b>Consent to collection of personal information for ' + BRAND.en + ' (required)</b><div class="text_h1"></div>1. Collected: name, phone number<br>2. Used only for awarding and redeeming points<br>3. Automatically deleted after 4 weeks',
      ja: '<b>' + BRAND.ja + '参加のための個人情報収集への同意（必須）</b><div class="text_h1"></div>1. 収集項目：氏名、電話番号<br>2. ポイントの付与・利用のみに使用します<br>3. 4週間後に自動削除されます',
      zh: '<b>参与 ' + BRAND.zh + ' 的个人信息收集同意（必填）</b><div class="text_h1"></div>1. 收集项目：姓名、电话号码<br>2. 仅用于积分发放及使用<br>3. 4周后自动删除'
    },
    '등록되지않은 페이지 입니다.': { en: 'This page is not registered.', ja: '登録されていないページです。', zh: '该页面未注册。' },
    '동의 및 당첨확인': {
      en: 'Agree &amp; <b>Check Prize</b>',
      ja: '同意して<b>当選確認</b>',
      zh: '同意并<b>查看是否中奖</b>'
    },

    // ── phone_login: 나의 포인트 조회 ──
    '본인확인': { en: 'Identity Verification', ja: '本人確認', zh: '身份验证' },
    // ※ 원문에 '경북교육청'이 잘못 들어가 있음(다른 사이트 문구 복사). 원문을 고치면 이 키도 같이 바꿀 것
    '경북교육청 참여를 위한 정보 수집 동의 (필수) 1. 수집 항목 : 이름, 전화번호 2. 선물지급 및 사용에만 이용 됩니다 3. 4주 후 자동 삭제됩니다': {
      en: '<b>Consent to collection of personal information for participation (required)</b><div class="text_h1"></div>1. Collected: name, phone number<br>2. Used only for gift delivery and redemption<br>3. Automatically deleted after 4 weeks',
      ja: '<b>参加のための個人情報収集への同意（必須）</b><div class="text_h1"></div>1. 収集項目：氏名、電話番号<br>2. プレゼントの支給・利用のみに使用します<br>3. 4週間後に自動削除されます',
      zh: '<b>参与活动的个人信息收集同意（必填）</b><div class="text_h1"></div>1. 收集项目：姓名、电话号码<br>2. 仅用于礼品发放及使用<br>3. 4周后自动删除'
    },
    "연락처를 적으시고 '인증번호받기'버튼을 클릭 하세요": {
      en: "Enter your phone number and tap 'Get code'",
      ja: '電話番号を入力し、「認証コード取得」ボタンを押してください',
      zh: '请输入联系电话，然后点击“获取验证码”按钮'
    },
    '나의사용내역 조회': {
      en: 'View my <b>history</b>',
      ja: '利用履歴を<b>確認</b>',
      zh: '<b>查询</b>我的使用记录'
    },

    // ── 입력칸 placeholder / 버튼 value ──
    '이름': { en: 'Name', ja: 'お名前', zh: '姓名' },
    '연락처': { en: 'Phone number', ja: '電話番号', zh: '联系电话' },
    '인증번호를 받으세요': { en: 'Request a verification code', ja: '認証コードを取得してください', zh: '请获取验证码' },
    '인증번호받기': { en: 'Get code', ja: '認証コード取得', zh: '获取验证码' },
    '인증번호확인': { en: 'Verify code', ja: '認証コード確認', zh: '确认验证码' },

    // ── 스크립트가 띄우는 안내 문구 ──
    '발급받은 인증번호를 입력하세요': { en: 'Enter the verification code you received', ja: '受け取った認証コードを入力してください', zh: '请输入收到的验证码' },
    '인증번호가 확인되었습니다': { en: 'Verification code confirmed', ja: '認証コードが確認されました', zh: '验证码已确认' },
    '인증번호가 5회 틀렸습니다.': { en: 'The verification code was entered incorrectly 5 times.', ja: '認証コードを5回間違えました。', zh: '验证码已输错5次。' },
    '조회할 수 없습니다.': { en: 'Lookup failed.', ja: '確認できません。', zh: '无法查询。' },
    '이름을 적으세요': { en: 'Please enter your name', ja: 'お名前を入力してください', zh: '请输入姓名' },
    '연락처를 적으세요': { en: 'Please enter your phone number', ja: '電話番号を入力してください', zh: '请输入联系电话' },
    '조회할 수 없습니다. 이름을 적으세요': {
      en: '<b>Lookup failed.</b><div class="text_h1"></div>Please enter your name',
      ja: '<b>確認できません。</b><div class="text_h1"></div>お名前を入力してください',
      zh: '<b>无法查询。</b><div class="text_h1"></div>请输入姓名'
    },
    '조회할 수 없습니다. 연락처를 적으세요': {
      en: '<b>Lookup failed.</b><div class="text_h1"></div>Please enter your phone number',
      ja: '<b>確認できません。</b><div class="text_h1"></div>電話番号を入力してください',
      zh: '<b>无法查询。</b><div class="text_h1"></div>请输入联系电话'
    },

    // ── coupon: 이용 가이드 ──
    '- 이용 가이드 -': { en: '- User Guide -', ja: '- ご利用ガイド -', zh: '- 使用指南 -' },
    '"행운팡팡" 포인트 적립': {
      en: 'Earning "' + BRAND.en + '" Points',
      ja: '「' + BRAND.ja + '」ポイントを貯める',
      zh: '“' + BRAND.zh + '”积分累积'
    },
    '1. 관광지 내에서 행운팡팡 QR코드를 스캔하면 행운의 포인트를 받습니다. 2. 행운포인트는 종합안내 7번부스에서 선물로 교환하여 드립니다. 3. 만족도 조사에 참여하시면 추첨에 의해 커피 쿠폰을 보내드립니다.': {
      en: '1. Scan a ' + BRAND.en + ' QR code at tourist sites to receive Lucky Points.<br>2. Exchange Lucky Points for gifts at Booth 7 (Information Center).<br>3. Complete the satisfaction survey for a chance to win a coffee coupon.',
      ja: '1. 観光地で' + BRAND.ja + 'のQRコードをスキャンすると、ラッキーポイントがもらえます。<br>2. ラッキーポイントは総合案内7番ブースでプレゼントと交換できます。<br>3. 満足度アンケートにご参加いただくと、抽選でコーヒークーポンをお送りします。',
      zh: '1. 在景区扫描 ' + BRAND.zh + ' 二维码即可获得幸运积分。<br>2. 幸运积分可在综合服务台7号展位兑换礼品。<br>3. 参与满意度调查，即有机会抽中咖啡券。'
    },
    '"행운팡팡" 포인트 사용': {
      en: 'Using "' + BRAND.en + '" Points',
      ja: '「' + BRAND.ja + '」ポイントを使う',
      zh: '“' + BRAND.zh + '”积分使用'
    },
    // 원문 오타(스켐→스캔, 발습니다→밟습니다, 누리면→누르면)는 뜻대로 번역
    '1. 종합안내 7번부스에서 선물교환용 QR 코드를 스켐합니다. 2. 본인인증 절차를 발습니다. 3. 5,000포인트를 선택하고 확인을 누리면 선물교환이 이루어 집니다.': {
      en: '1. Scan the gift-exchange QR code at Booth 7 (Information Center).<br>2. Complete identity verification.<br>3. Select 5,000 points and tap OK to receive your gift.',
      ja: '1. 総合案内7番ブースでプレゼント交換用QRコードをスキャンします。<br>2. 本人認証を行います。<br>3. 5,000ポイントを選択して確認を押すと、プレゼントと交換されます。',
      zh: '1. 在综合服务台7号展位扫描礼品兑换二维码。<br>2. 完成身份验证。<br>3. 选择5,000积分并点击确认即可兑换礼品。'
    },
    '행운팡팡 포인트는 당일 23시 기준으로 사용하지 못한 포인트는 자동 소멸됩니다.': {
      en: 'Unused ' + BRAND.en + ' points expire automatically<br>at 11 PM on the same day.',
      ja: BRAND.ja + 'のポイントは当日23時をもって<br>未使用分が自動的に失効します。',
      zh: BRAND.zh + ' 积分以当日23点为准，<br>未使用的积分将自动失效。'
    }
  };

  /*
   * 글자가 그려진 이미지(배너·버튼·제목·로고) → 외국어일 때 "글자 지운 배경 + HTML 글자"로 교체
   *  - 배경: images/i18n/<이름>_bg.png  (tools/make_banner_bgs.py 로 생성)
   *  - w, h: 원본 이미지 크기(px) — 페이지에서 height만 지정된 이미지의 폭 계산용
   *  - boxes: 글자 영역 목록. box = 위치(원본 대비 %), align = left|right|center, justify = 세로 정렬
   *  - lines: 줄마다 { size: 글자 크기(이미지 폭의 %, 언어별 지정 가능), style, text: {en, ja, zh} 또는 {all} }
   *  - 한국어일 때는 원본 이미지를 그대로 사용
   */
  var F_ROUND = 'font-family:"Cafe24Ssurround","Noto Sans KR",sans-serif;';

  var T_POINT_EXCHANGE = {
    en: 'Exchange Lucky Points for gifts<br>at Booth 7 (Information Center).',
    ja: 'ラッキーポイントは総合案内7番ブースで<br>プレゼントと交換できます。',
    zh: '幸运积分可在综合服务台7号展位<br>兑换礼品。'
  };
  var T_VIEW = { en: 'View ▶', ja: '見る ▶', zh: '查看 ▶' };

  // 홈 화면 "인기 ○○" 배너 (오른쪽 정렬 2줄)
  function popularBanner(name, left, subColor, sub, title, titleSize) {
    return {
      bg: 'images/i18n/' + name + '_bg.png', w: 750, h: 200,
      boxes: [{
        box: 'left:' + left + ';right:6%;top:13%;bottom:37%;', align: 'right', justify: 'center',
        lines: [
          { size: { en: 2.8, ja: 3.6, zh: 3.4 }, style: 'font-weight:700;white-space:nowrap;color:' + subColor + ';' + F_ROUND, text: sub },
          { size: titleSize, style: 'font-weight:900;color:#000;white-space:nowrap;' + F_ROUND, text: title }
        ]
      }]
    };
  }
  var T_GWANGYANG_PP = { en: 'Gwangyang ' + BRAND.en, ja: '光陽' + BRAND.ja, zh: '光阳 ' + BRAND.zh };
  var T_RECOMMEND = { en: 'Recommended!!', ja: 'おすすめ!!', zh: '推荐!!' };

  // 목록 페이지 위 카테고리 배너 (제목 + 안내 2줄 + 오른쪽 위 "이용 가이드" 알약)
  function categoryBanner(name, left, subColor, title) {
    return {
      bg: 'images/i18n/' + name + '_bg.png', w: 750, h: 200,
      boxes: [
        {
          box: 'left:' + left + ';right:2%;top:23%;bottom:17%;', align: 'left',
          lines: [
            { size: { en: 5.6, ja: 6.2, zh: 7.0 }, style: 'font-weight:900;color:#000;white-space:nowrap;' + F_ROUND, text: title },
            { size: { en: 2.9, ja: 2.6, zh: 3.0 }, style: 'font-weight:700;color:' + subColor + ';line-height:1.3;margin-top:auto;', text: T_POINT_EXCHANGE }
          ]
        },
        {
          box: 'left:80.8%;width:14.6%;top:13.5%;height:12.5%;', align: 'center', justify: 'center',
          lines: [{ size: { en: 2.4, ja: 2.4, zh: 2.7 }, style: 'color:#000;white-space:nowrap;', text: { en: 'User Guide', ja: '利用ガイド', zh: '使用指南' } }]
        }
      ]
    };
  }

  // "- 주변 ○○ -" 제목 (글자뿐인 이미지)
  function titleImage(name, text) {
    return {
      bg: 'images/i18n/' + name + '_bg.png', w: 700, h: 40,
      boxes: [{
        box: 'left:0;right:0;top:0;bottom:0;', align: 'center', justify: 'center',
        lines: [{ size: { en: 4.2, ja: 4.6, zh: 4.6 }, style: 'font-weight:900;line-height:1;color:#000;white-space:nowrap;' + F_ROUND, text: text }]
      }]
    };
  }

  // "2025-2026 한국관광100선 탐방 이벤트" 로고
  function logoImage(name, w, yearColor, accentColor, mainColor) {
    return {
      bg: 'images/i18n/' + name + '_bg.png', w: w, h: 80,
      boxes: [{
        box: 'left:0;right:0;top:0;bottom:0;', align: 'left', justify: 'space-between',
        lines: [
          { size: 4.8, style: 'font-weight:900;line-height:1;color:' + yearColor + ';' + F_ROUND, text: { all: '2025-2026' } },
          { size: { en: 5.6, ja: 6.6, zh: 7.2 }, style: 'font-weight:900;line-height:1;white-space:nowrap;color:' + mainColor + ';' + F_ROUND,
            text: {
              en: '<span style="color:' + accentColor + '">Korea Tourism 100</span> Tour Event',
              ja: '<span style="color:' + accentColor + '">韓国観光100選</span> 探訪イベント',
              zh: '<span style="color:' + accentColor + '">韩国旅游100选</span> 探访活动'
            } }
        ]
      }]
    };
  }

  // 이용가이드 배너 (팻말 속 글자 + 오른쪽 문구)
  function guideBanner(name, withView) {
    var right = [{ size: { en: 3.1, ja: 3.7, zh: 4.1 }, style: 'color:#000;line-height:1.3;',
      text: { en: 'Make your trip<br>more fun<br>&amp; fulfilling!', ja: '旅行を<br>もっと楽しく<br>充実に！', zh: '让旅行<br>更有趣<br>更充实！' } }];
    if (withView) right.push({ size: 3.3, style: 'color:#fff;margin-top:auto;', text: T_VIEW });
    return {
      bg: 'images/i18n/' + name + '_bg.png', w: 750, h: 250,
      boxes: [
        {
          box: 'left:12%;width:50.5%;top:62%;height:21%;', align: 'center', justify: 'center',
          lines: [{ size: { en: 4.3, ja: 3.6, zh: 3.9 }, style: 'font-weight:900;color:#000;white-space:nowrap;' + F_ROUND,
            text: { en: BRAND.en + ' Guide', ja: BRAND.ja + '利用ガイド', zh: BRAND.zh + ' 使用指南' } }]
        },
        { box: 'left:74.4%;right:1%;top:18%;bottom:' + (withView ? '19%' : '33%') + ';', align: 'left', lines: right }
      ]
    };
  }

  // 동그란 버튼 (만족도 조사 / 나의 포인트)
  function roundButton(name, text, size) {
    return {
      bg: 'images/i18n/' + name + '_bg.png', w: 100, h: 72,
      boxes: [{
        box: 'left:6%;right:6%;top:4%;bottom:4%;', align: 'center', justify: 'center',
        lines: [{ size: size, style: 'font-weight:700;color:#fff;line-height:1.15;', text: text }]
      }]
    };
  }

  var BANNERS = {
    'banner_center.png': {
      bg: 'images/i18n/banner_center_bg.png', w: 750, h: 250,
      boxes: [{
        box: 'left:5.6%;top:24%;bottom:9%;width:58%;', align: 'left',
        lines: [
          { size: { en: 4.2, ja: 3.9, zh: 4.2 }, style: 'font-weight:700;color:#111;',
            text: { en: BRAND.en + ' Inquiries', ja: BRAND.ja + 'お問い合わせ', zh: BRAND.zh + ' 咨询' } },
          { size: 7.2, style: 'font-weight:800;color:#111;letter-spacing:-0.01em;', text: { all: '1522-3475' } },
          { size: 2.9, style: 'font-weight:700;color:#f0f0f6;margin-top:auto;',
            text: {
              en: 'Weekdays 9:00–17:00 <span style="font-weight:400">(excl. holidays)</span>',
              ja: '平日 9:00〜17:00 <span style="font-weight:400">（祝日を除く）</span>',
              zh: '工作日 9:00–17:00 <span style="font-weight:400">（节假日除外）</span>'
            } }
        ]
      }]
    },

    'banner_event_.png': {
      bg: 'images/i18n/banner_event__bg.png', w: 750, h: 300,
      boxes: [{
        box: 'left:35%;right:5%;top:13%;bottom:11%;', align: 'right',
        lines: [
          { size: 3.2, style: 'font-weight:700;color:#fff;', text: { all: 'event' } },
          { size: { en: 4.4, ja: 4.0, zh: 5.4 }, style: 'color:#111;line-height:1.25;margin-top:1%;',
            text: {
              en: 'Take our survey for<br>a chance to win a<br><b style="color:#dc294c">coffee coupon</b>!',
              ja: '満足度アンケートに参加すると<br>抽選で<b style="color:#dc294c">コーヒークーポン</b>を<br>プレゼントします。',
              zh: '参与满意度调查<br>即有机会抽中<br><b style="color:#dc294c">咖啡券</b>！'
            } },
          { size: 3.4, style: 'color:#fff;margin-top:auto;',
            text: { en: '<b>60-second survey</b> Start now', ja: '<b>60秒アンケート</b> 今すぐ回答', zh: '<b>60秒满意度调查</b> 立即参与' } }
        ]
      }]
    },

    'banner_info.png': {
      bg: 'images/i18n/banner_info_bg.png', w: 750, h: 150,
      boxes: [{
        box: 'left:5.7%;top:28%;bottom:14%;width:52%;', align: 'left',
        lines: [
          { size: { en: 4.7, ja: 6.4, zh: 6.4 }, style: 'font-weight:900;line-height:1.1;color:#000;white-space:nowrap;' + F_ROUND,
            text: { en: 'Gwangyang Tour Map', ja: '光陽観光案内図', zh: '光阳旅游地图' } },
          { size: 3.4, style: 'color:#fff;margin-top:auto;', text: T_VIEW }
        ]
      }]
    },

    'main_event.jpg': {
      bg: 'images/i18n/main_event_bg.png', w: 750, h: 300,
      boxes: [{
        box: 'left:36%;right:5%;top:20%;bottom:19%;', align: 'right',
        lines: [
          { size: { en: 3.8, ja: 4.2, zh: 3.8 }, style: 'color:#fff;line-height:1.3;white-space:nowrap;',
            text: {
              en: BRAND.en + ' <b>‘5,000 Points’</b><br>Grab your luck!',
              ja: BRAND.ja + '<b>「5,000P」</b><br>幸運をつかもう！',
              zh: BRAND.zh + ' <b>“5,000积分”</b><br>抓住好运！'
            } },
          { size: { en: 3.1, ja: 2.8, zh: 3.1 }, style: 'color:#e9e0ff;margin-top:auto;line-height:1.5;', text: T_POINT_EXCHANGE }
        ]
      }]
    },

    'banner_food.png': popularBanner('banner_food', '54%', '#939a77', T_GWANGYANG_PP,
      { en: 'Top Restaurants', ja: '人気の飲食店', zh: '人气餐厅' }, { en: 4.8, ja: 5.8, zh: 6.6 }),
    'banner_hotel.png': popularBanner('banner_hotel', '56%', '#fff', T_RECOMMEND,
      { en: 'Top Stays', ja: '人気の宿泊施設', zh: '人气住宿' }, { en: 4.8, ja: 5.0, zh: 6.6 }),
    'banner_tour.png': popularBanner('banner_tour', '54%', '#fff', T_GWANGYANG_PP,
      { en: 'Top Sights', ja: '人気の観光地', zh: '人气景点' }, { en: 4.8, ja: 5.8, zh: 6.6 }),
    'banner_market.png': popularBanner('banner_market', '46%', '#fd9856', T_RECOMMEND,
      { en: 'Specialties &amp; Markets', ja: '人気の特産品・市場', zh: '人气特产/市场' }, { en: 4.0, ja: 4.8, zh: 6.0 }),

    'banner_food_.png': categoryBanner('banner_food_', '46.5%', '#8f9674', { en: 'Restaurants', ja: '飲食店', zh: '餐厅' }),
    'banner_fv_.png': categoryBanner('banner_fv_', '42%', '#fff', { en: 'Events', ja: 'イベント', zh: '活动介绍' }),
    'banner_hotel_.png': categoryBanner('banner_hotel_', '46.5%', '#fff', { en: 'Stay', ja: '宿泊', zh: '住宿' }),
    'banner_tour_.png': categoryBanner('banner_tour_', '38%', '#fff', { en: 'Sights', ja: '観光地', zh: '景点' }),
    'banner_market_.png': categoryBanner('banner_market_', '44%', '#eb9c68', { en: 'Local Specialties', ja: '地域特産品', zh: '地方特产' }),

    'banner_guide.png': guideBanner('banner_guide', true),
    'banner_guide_1.png': guideBanner('banner_guide_1', false),

    'search_btn.png': roundButton('search_btn', { en: 'Survey', ja: 'アンケート', zh: '满意度<br>调查' }, { en: 17, ja: 14, zh: 16 }),
    'mypoint_btn.png': roundButton('mypoint_btn', { en: 'My<br>Points', ja: 'マイ<br>ポイント', zh: '我的<br>积分' }, { en: 17, ja: 15, zh: 17 }),

    'naver_map.png': {
      bg: 'images/i18n/naver_map_bg.png', w: 700, h: 98,
      boxes: [{
        box: 'left:35.5%;right:3%;top:0;bottom:0;', align: 'left', justify: 'center',
        lines: [{ size: 5.0, style: 'color:#000;white-space:nowrap;', text: { en: 'View on Naver Map', ja: 'NAVERマップで見る', zh: '在 Naver 地图中查看' } }]
      }]
    },
    'more_btn.png': {
      bg: 'images/i18n/more_btn_bg.png', w: 230, h: 48,
      boxes: [{
        box: 'left:18%;width:58%;top:0;bottom:0;', align: 'center', justify: 'center',
        lines: [{ size: { en: 10, ja: 8.5, zh: 9.5 }, style: 'color:#000;white-space:nowrap;', text: { en: 'More', ja: 'もっと見る', zh: '查看更多' } }]
      }]
    },

    'food_title.png': titleImage('food_title', { en: '- Nearby Restaurants -', ja: '- 周辺の飲食店 -', zh: '- 周边餐厅 -' }),
    'hotel_title.png': titleImage('hotel_title', { en: '- Nearby Stays -', ja: '- 周辺の宿泊施設 -', zh: '- 周边住宿 -' }),
    'sp_title.png': titleImage('sp_title', { en: '- Nearby Specialties &amp; Markets -', ja: '- 周辺の特産品・市場 -', zh: '- 周边特产/市场 -' }),
    'tour_title.png': titleImage('tour_title', { en: '- Popular Posts -', ja: '- 人気の投稿 -', zh: '- 热门文章 -' }),
    'tour_title2.png': titleImage('tour_title2', { en: '- Nearby Sights -', ja: '- 周辺の観光地 -', zh: '- 周边景点 -' }),

    'logo_img.png': logoImage('logo_img', 578, '#1a1311', '#e30083', '#000'),
    'logo_w.png': logoImage('logo_w', 577, '#fff', '#fff', '#fff')
  };

  // ───────────────────────── 언어 저장/읽기 ─────────────────────────

  function readCookie(name) {
    var m = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
    return m ? decodeURIComponent(m[1]) : null;
  }

  function saveLang(lang) {
    document.cookie = 'lang=' + lang + '; path=/; max-age=' + 60 * 60 * 24 * 30 + '; SameSite=Lax';
    try { localStorage.setItem('lang', lang); } catch (e) { /* 저장소 막힘: 쿠키만 사용 */ }
  }

  function currentLang() {
    var q = (location.search.match(/[?&]lang=([a-z]{2})/) || [])[1];
    if (q && LANGS.indexOf(q) >= 0) { saveLang(q); return q; }
    var c = readCookie('lang');
    if (c && LANGS.indexOf(c) >= 0) return c;
    try {
      var s = localStorage.getItem('lang');
      if (s && LANGS.indexOf(s) >= 0) return s;
    } catch (e) { /* 무시 */ }
    return 'ko';
  }

  // ───────────────────────── 번역 적용 ─────────────────────────

  var BLOCK = /^(ADDRESS|ARTICLE|BR|DIV|FORM|H[1-6]|LI|P|SECTION|TABLE|TD|TH|TR|UL)$/;
  var INTERACTIVE = 'a,button,input,select,textarea,iframe,form';

  // 화면 글자 정리: <br>·블록 경계는 공백, 연속 공백은 한 칸
  function textOf(node) {
    var out = '';
    (function walk(n) {
      for (var c = n.firstChild; c; c = c.nextSibling) {
        if (c.nodeType === 3) out += c.nodeValue;
        else if (c.nodeType === 1 && c.tagName !== 'SCRIPT' && c.tagName !== 'STYLE') {
          if (BLOCK.test(c.tagName)) out += ' ';
          walk(c);
          if (BLOCK.test(c.tagName)) out += ' ';
        }
      }
    })(node);
    return out.replace(/\s+/g, ' ').trim();
  }

  function lookup(key, lang) {
    var e = DICT[key];
    return e && e[lang];
  }

  function translateTree(root, lang) {
    // 1) 요소 단위: 글자 전체가 사전과 같은 가장 바깥 요소를 통째로 교체.
    //    단, 링크·버튼·입력칸을 품은 요소는 건드리지 않음(이벤트·폼이 깨지지 않게)
    var els = root.querySelectorAll('body *');
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      if (el.tagName === 'SCRIPT' || el.tagName === 'STYLE' || !el.isConnected) continue;
      if (el.querySelector(INTERACTIVE)) continue;
      var t = lookup(textOf(el), lang);
      if (t) el.innerHTML = t;
    }
    // 2) 남은 글자 조각 단위
    var walker = document.createTreeWalker(root.body || root, NodeFilter.SHOW_TEXT, null);
    var n;
    while ((n = walker.nextNode())) {
      var raw = n.nodeValue;
      var key = raw.replace(/\s+/g, ' ').trim();
      if (!key) continue;
      var tr = lookup(key, lang);
      if (tr && tr.indexOf('<') < 0) n.nodeValue = raw.replace(raw.trim(), tr);
    }
    // 3) 속성: placeholder, 버튼 value, title
    var attrEls = root.querySelectorAll('[placeholder],[title],input[type=button],input[type=submit]');
    for (var j = 0; j < attrEls.length; j++) {
      var a = attrEls[j];
      ['placeholder', 'title'].forEach(function (name) {
        var v = a.getAttribute(name);
        var tv = v && lookup(v.trim(), lang);
        if (tv) a.setAttribute(name, tv);
      });
      if (a.type === 'button' || a.type === 'submit') {
        var bv = lookup((a.value || '').trim(), lang);
        if (bv) a.value = bv;
      }
    }
    // 4) 탭 제목
    var tt = lookup(document.title.trim(), lang);
    if (tt) document.title = tt.replace(/<[^>]+>/g, '');
  }

  // ───────────────────────── 배너 이미지 교체 ─────────────────────────

  // 언어별 값 고르기: { en, ja, zh } 또는 { all } 또는 그냥 값
  function pick(v, lang) {
    if (v && typeof v === 'object') return v[lang] != null ? v[lang] : v.all;
    return v;
  }

  var ALIGN = { left: 'flex-start', right: 'flex-end', center: 'center' };

  // 줄마다 글자 크기(px) = 배너 실제 폭 × size%  (화면 크기가 바뀌면 다시 계산)
  var bannerWraps = [];
  function fitBanners() {
    for (var i = 0; i < bannerWraps.length; i++) {
      var w = bannerWraps[i].getBoundingClientRect().width;
      if (!w) continue;
      var ls = bannerWraps[i].querySelectorAll('[data-size]');
      for (var j = 0; j < ls.length; j++) ls[j].style.fontSize = (w * parseFloat(ls[j].getAttribute('data-size')) / 100) + 'px';
    }
  }

  function applyBanners(lang) {
    var imgs = document.querySelectorAll('img');
    var used = false;
    var wraps = bannerWraps;
    for (var i = 0; i < imgs.length; i++) {
      var img = imgs[i];
      var file = (img.getAttribute('src') || '').split('/').pop();
      var b = BANNERS[file];
      if (!b) continue;
      used = true;

      var wrap = document.createElement('span');
      // onclick 등 원래 이미지의 속성은 그대로 옮김 (크기·주소 제외)
      for (var a = 0; a < img.attributes.length; a++) {
        var at = img.attributes[a];
        if (['src', 'width', 'height', 'alt'].indexOf(at.name) < 0) wrap.setAttribute(at.name, at.value);
      }
      wrap.classList.add('i18n-banner');

      // 원래 이미지와 같은 크기로: width="100%" 이면 꽉 차게, height만 있으면 비율로 폭 계산
      var wA = img.getAttribute('width'), hA = img.getAttribute('height');
      if (wA && /%$/.test(wA)) {
        wrap.style.width = wA;
      } else if (hA) {
        wrap.style.display = 'inline-block';
        wrap.style.verticalAlign = 'middle';
        wrap.style.width = Math.round(parseFloat(hA) * b.w / b.h) + 'px';
      } else if (wA) {
        wrap.style.display = 'inline-block';
        wrap.style.width = parseFloat(wA) + 'px';
      } else {
        wrap.style.width = '100%';
      }

      var html = '<img src="' + b.bg + '" alt="">';
      b.boxes.forEach(function (bx) {
        var align = bx.align || 'left';
        html += '<span class="i18n-banner-text" style="' + bx.box +
          'text-align:' + align + ';align-items:' + ALIGN[align] + ';justify-content:' + (bx.justify || 'flex-start') + ';">';
        bx.lines.forEach(function (l) {
          html += '<span data-size="' + pick(l.size, lang) + '" style="' + l.style + '">' + pick(l.text, lang) + '</span>';
        });
        html += '</span>';
      });
      wrap.innerHTML = html;
      img.parentNode.replaceChild(wrap, img);
      wraps.push(wrap);
    }
    if (!used) return;
    fitBanners();
    window.addEventListener('resize', fitBanners);
    window.addEventListener('load', fitBanners);
    if (window.ResizeObserver) {
      var ro = new ResizeObserver(fitBanners);
      wraps.forEach(function (w) { ro.observe(w); });
    }
    var st = document.createElement('style');
    st.textContent =
      '.i18n-banner{position:relative;display:block;line-height:0}' +
      '.i18n-banner>img{display:block;width:100%;height:auto}' +
      '.i18n-banner-text{position:absolute;display:flex;flex-direction:column;line-height:1.2;word-break:keep-all;font-size:inherit !important;' +
      'font-family:"Noto Sans KR","Malgun Gothic","Apple SD Gothic Neo",sans-serif}' +
      '.i18n-banner-text>span{display:block}' +
      // 사이트 CSS가 b/span 글자 크기를 따로 정해 둔 것 무시 (강조 부분만 작아지는 문제)
      '.i18n-banner-text>span span,.i18n-banner-text>span b{font-size:inherit !important;line-height:inherit}';
    document.head.appendChild(st);
  }

  // ───────────────────────── 언어 바꾸기 버튼 ─────────────────────────

  function bindLangLinks() {
    document.addEventListener('click', function (e) {
      var t = e.target.closest ? e.target.closest('[data-set-lang]') : null;
      if (!t) return;
      var lang = t.getAttribute('data-set-lang');
      if (LANGS.indexOf(lang) < 0) return;
      saveLang(lang);
      if (!t.getAttribute('href')) location.reload();
    }, true);
  }

  // 언어 선택 화면(intro)이 아닌 페이지 오른쪽 아래에 작은 언어 전환 버튼 (누르면 펼쳐짐)
  function addSwitcher(lang) {
    if (document.querySelector('[data-set-lang]')) return;
    var box = document.createElement('div');
    box.className = 'i18n-switch';
    box.innerHTML =
      '<button type="button" class="i18n-toggle" aria-label="Language">🌐 ' + lang.toUpperCase() + '</button>' +
      '<div class="i18n-menu">' + LANGS.map(function (l) {
        return '<button type="button" data-set-lang="' + l + '"' + (l === lang ? ' class="on"' : '') + '>' + LANG_NAMES[l] + '</button>';
      }).join('') + '</div>';
    box.querySelector('.i18n-toggle').addEventListener('click', function () {
      box.classList.toggle('open');
    });
    document.body.appendChild(box);
    var st = document.createElement('style');
    st.textContent =
      'body{padding-bottom:48px !important}' +
      '.i18n-switch{position:fixed;right:10px;bottom:10px;z-index:99999;font-size:12px;font-family:sans-serif}' +
      '.i18n-switch button{all:unset;cursor:pointer;color:#fff;line-height:1.2}' +
      '.i18n-toggle{display:block;padding:6px 10px;background:rgba(0,0,0,.65);border-radius:16px}' +
      '.i18n-menu{display:none;position:absolute;right:0;bottom:34px;background:rgba(0,0,0,.8);border-radius:12px;padding:4px;' +
      'flex-direction:column;gap:2px;min-width:84px}' +
      '.i18n-switch.open .i18n-menu{display:flex}' +
      '.i18n-menu button{padding:7px 10px;border-radius:8px}' +
      '.i18n-menu button.on{background:#DC294C}';
    document.head.appendChild(st);
  }

  // ───────────────────────── 시작 ─────────────────────────

  var lang = currentLang();
  document.documentElement.lang = HTML_LANG[lang];
  bindLangLinks();

  // 사이트 한글 폰트(Cafe24 등)는 일부 한자 글리프가 비어 있어 글자가 빠져 보임 → 일/중은 해당 언어 폰트 사용
  var CJK_FONTS = {
    ja: '"Hiragino Sans","Hiragino Kaku Gothic ProN","Yu Gothic","Meiryo","Noto Sans JP",sans-serif',
    zh: '"PingFang SC","Microsoft YaHei","Noto Sans SC","Noto Sans CJK SC",sans-serif'
  };

  function start() {
    addSwitcher(lang);
    if (lang === 'ko') return;
    var fst = document.createElement('style');
    fst.textContent =
      // 외국어 메뉴명이 한국어보다 길어 메뉴 줄이 화면 밖으로 넘치는 것 방지: 5칸을 똑같이 나누고 줄바꿈 허용
      '.bottom_menu1,.bottom_menu1on{flex:1 1 0;min-width:0;padding:12px 2px !important;display:flex;align-items:center;justify-content:center}' +
      '.bottom_menu1 a,.bottom_menu1on a{font-size:12px !important;line-height:1.2 !important;word-break:keep-all}' +
      (CJK_FONTS[lang] ? 'body,body *{font-family:' + CJK_FONTS[lang] + ' !important}' : '');
    document.head.appendChild(fst);
    applyBanners(lang);
    translateTree(document, lang);
    // 스크립트가 나중에 띄우는 안내창 문구도 번역
    var pending = false;
    var obs = new MutationObserver(function () {
      if (pending) return;
      pending = true;
      setTimeout(function () {
        pending = false;
        obs.disconnect();
        translateTree(document, lang);
        obs.observe(document.body, { childList: true, subtree: true, characterData: true });
      }, 0);
    });
    obs.observe(document.body, { childList: true, subtree: true, characterData: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();

  // 다른 스크립트에서 쓸 수 있게
  window.I18N = { lang: lang, set: function (l) { saveLang(l); location.reload(); } };
})();

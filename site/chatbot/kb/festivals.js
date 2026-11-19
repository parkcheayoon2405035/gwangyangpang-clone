/*
 * 챗봇 행사별 자료 — 행사마다 하나씩. 챗봇 코드는 그대로 두고 이 값만 바꾸면 답이 바뀐다.
 *
 * - 회사에서 데이터를 받지 못해, 우리가 직접 확인한 것만 넣었다.
 * - short 는 챗봇 위쪽 '행사 바꾸기' 칸에 쓰는 짧은 이름
 *   광양: 복제한 행사 사이트 + 이용가이드 / 경북: 현장 사진(기둥 광고·시간표) + 행사 사이트 첫 화면 / 습지학교: 현장 사진 + 선물교환처 화면
 * - 모르는 칸은 null. 챗봇은 null 인 내용을 지어내지 않고 "자료에 없다 + 문의처"로 답한다.
 * - 실제 서비스에서는 회사가 행사를 등록할 때 입력하는 정보(관리자 페이지)를 그대로 이 모양으로 만들면 된다.
 */
window.CHAT_KB = window.CHAT_KB || {};
window.CHAT_KB.festivals = {

  gwangyang: {
    id: 'gwangyang',
    short: { ko: '광양 (관광100선)', en: 'Gwangyang', ja: '光陽', zh: '光阳' },
    theme: 'spring',
    places: 'gwangyang',              // 장소 자료(places-gwangyang.js)가 있는 행사
    name: {
      ko: '2025-2026 한국관광100선 탐방 이벤트 (광양)',
      en: 'Korea Tourism 100 Tour Event 2025-2026 (Gwangyang)',
      ja: '2025-2026 韓国観光100選 探訪イベント（光陽）',
      zh: '2025-2026 韩国旅游100选 探访活动（光阳）'
    },
    period: { ko: '2025~2026년', en: '2025–2026', ja: '2025～2026年', zh: '2025～2026年' },
    venue: {
      ko: '광양 매화마을 등 광양의 관광지 곳곳 (QR 팻말이 세워진 곳)',
      en: 'Tourist spots around Gwangyang, including Maehwa Village (wherever you see a QR sign)',
      ja: '光陽梅花村など光陽の観光地各所（QRの看板がある場所）',
      zh: '光阳梅花村等光阳各景点（设有二维码立牌的地方）'
    },
    organizer: null,
    earn: {
      ko: '관광지 곳곳의 <b>행운팡팡 QR 팻말</b>을 휴대폰 카메라로 스캔하면 행운 포인트를 받아요.',
      en: 'Scan the <b>Lucky PangPang QR signs</b> at tourist spots with your phone camera to get Lucky Points.',
      ja: '観光地各所の<b>ラッキーパンパンQR看板</b>をスマホのカメラで読み取ると、ラッキーポイントがもらえます。',
      zh: '用手机相机扫描各景点的<b>Lucky PangPang二维码立牌</b>，即可获得幸运积分。'
    },
    giftMethod: {
      ko: '<b>종합안내 7번 부스</b>에서 이렇게 하면 돼요.\n1. 선물교환용 QR을 스캔해요.\n2. 본인인증을 해요.\n3. <b>5,000포인트</b>를 선택하고 확인을 누르면 교환 완료예요.',
      en: 'At <b>Booth 7 (Information Center)</b>:\n1. Scan the gift-exchange QR code.\n2. Verify your identity.\n3. Select <b>5,000 points</b> and tap OK.',
      ja: '<b>総合案内7番ブース</b>で次のようにします。\n1. プレゼント交換用QRを読み取ります。\n2. 本人認証をします。\n3. <b>5,000ポイント</b>を選んで確認を押すと交換完了です。',
      zh: '请在<b>综合咨询7号展位</b>按以下步骤操作：\n1. 扫描礼品兑换二维码。\n2. 完成身份验证。\n3. 选择<b>5,000积分</b>并点击确认即可兑换。'
    },
    exchangePlace: { ko: '종합안내 7번 부스', en: 'Booth 7 (Information Center)', ja: '総合案内7番ブース', zh: '综合咨询7号展位' },
    giftPoints: '5,000P',
    expire: { ko: '받은 날 23시', en: '11 PM on the same day', ja: '当日23時', zh: '当天23点' },
    hours: null,
    survey: {
      ko: '상단의 <b>설문</b> 버튼에서 만족도 조사에 참여하면 추첨으로 <b>커피 쿠폰</b>을 드려요.',
      en: 'Take the satisfaction survey from the <b>Survey</b> button at the top for a chance to win a <b>coffee coupon</b>.',
      ja: '上部の<b>アンケート</b>ボタンから満足度調査に参加すると、抽選で<b>コーヒークーポン</b>がもらえます。',
      zh: '点击上方<b>问卷</b>按钮参与满意度调查，即有机会抽中<b>咖啡券</b>。'
    },
    phone: '1522-3475',
    phoneHours: { ko: '평일 09시~17시, 공휴일 제외', en: 'weekdays 9:00–17:00, excl. holidays', ja: '平日9:00～17:00、祝日を除く', zh: '工作日9:00～17:00，节假日除外' },
    source: { ko: '광양 행사 사이트 · 이용가이드', en: 'Gwangyang event site · User Guide', ja: '光陽イベントサイト・利用ガイド', zh: '光阳活动网站·使用指南' }
  },

  gyeongbuk: {
    id: 'gyeongbuk',
    short: { ko: '경북수업나눔축제', en: 'Gyeongbuk Class-Sharing', ja: '慶北授業シェア', zh: '庆北课堂分享' },
    theme: 'edu',
    places: null,
    name: { ko: '2026 경북수업나눔축제', en: '2026 Gyeongbuk Class-Sharing Festival', ja: '2026 慶北授業シェア祭り', zh: '2026 庆北课堂分享节' },
    period: { ko: '2026년 8월 8일(토) 10:00~17:00', en: 'Sat, Aug 8, 2026, 10:00–17:00', ja: '2026年8月8日(土) 10:00～17:00', zh: '2026年8月8日(周六) 10:00～17:00' },
    venue: { ko: '구미코(GUMICO, 구미 컨벤션센터) 1~3층', en: 'GUMICO (Gumi Convention Center), 1st–3rd floors', ja: 'GUMICO（亀尾コンベンションセンター）1～3階', zh: 'GUMICO（龟尾会展中心）1～3层' },
    organizer: { ko: '경상북도교육청', en: 'Gyeongsangbuk-do Office of Education', ja: '慶尚北道教育庁', zh: '庆尚北道教育厅' },
    earn: {
      ko: '<b>QR 찍고 선물 받고!</b> 행사장의 행운팡팡 QR을 스캔하면 <b>그 자리에서 바로</b> 당첨 여부를 확인해요.',
      en: '<b>Scan a QR, get a gift!</b> Scan the Lucky PangPang QR at the venue and see <b>right away</b> whether you won.',
      ja: '<b>QRを撮ってプレゼント！</b> 会場のラッキーパンパンQRを読み取ると、<b>その場ですぐ</b>当選かどうかがわかります。',
      zh: '<b>扫码领礼品！</b>扫描会场的Lucky PangPang二维码，<b>当场</b>就能知道是否中奖。'
    },
    giftMethod: {
      ko: '이 행사는 포인트를 모아 바꾸는 방식이 아니에요.\nQR을 스캔해 <b>당첨되면 모바일 상품권·기프티콘</b>으로 받아요.',
      en: 'This event does not use points.\nScan the QR, and <b>if you win, you receive a mobile gift card or gifticon</b>.',
      ja: 'このイベントはポイントを貯めて交換する方式ではありません。\nQRを読み取って<b>当選すると、モバイル商品券・ギフティコン</b>でもらえます。',
      zh: '本活动不采用积分兑换方式。\n扫码后<b>如果中奖，将以手机礼券或电子礼品券</b>形式领取。'
    },
    exchangePlace: null,
    giftPoints: null,
    expire: null,
    hours: null,
    survey: {
      ko: '행사 사이트 상단의 <b>만족도 조사</b> 버튼에서 참여할 수 있어요.',
      en: 'You can join from the <b>Survey</b> button at the top of the event site.',
      ja: 'イベントサイト上部の<b>満足度調査</b>ボタンから参加できます。',
      zh: '可通过活动网站上方的<b>满意度调查</b>按钮参与。'
    },
    phone: '1522-3475',
    phoneHours: null,
    source: { ko: '경북 행사 현장 사진 · 행사 사이트', en: 'Gyeongbuk event photos · event site', ja: '慶北イベント現場写真・イベントサイト', zh: '庆北活动现场照片·活动网站' }
  },

  wetland: {
    id: 'wetland',
    short: { ko: '습지학교 총회', en: 'Wetland School', ja: '湿地学校総会', zh: '湿地学校大会' },
    theme: 'eco',
    places: null,
    name: {
      ko: '2026 한국습지학교 네트워크 총회 (Wetlands Connect Us)',
      en: '2026 Korea Wetland School Network General Meeting (Wetlands Connect Us)',
      ja: '2026 韓国湿地学校ネットワーク総会（Wetlands Connect Us）',
      zh: '2026 韩国湿地学校网络大会（Wetlands Connect Us）'
    },
    period: null,
    venue: null,
    organizer: null,
    earn: {
      ko: '학교별 <b>부스 테이블에 놓인 QR</b>을 스캔하면 포인트를 받아요.',
      en: 'Scan the <b>QR codes on each school\'s booth table</b> to get points.',
      ja: '学校ごとの<b>ブースのテーブルに置かれたQR</b>を読み取るとポイントがもらえます。',
      zh: '扫描各学校<b>展位桌上的二维码</b>即可获得积分。'
    },
    giftMethod: {
      ko: '<b>선물교환처</b>에서 이렇게 하면 돼요.\n1. 선물교환용 QR을 스캔해요.\n2. 이름과 연락처를 입력해요.\n3. <b>문자로 받은 인증번호</b>로 본인 확인을 하면 선물로 바꿔 줘요.',
      en: 'At the <b>gift exchange desk</b>:\n1. Scan the gift-exchange QR.\n2. Enter your name and phone number.\n3. Confirm with the <b>verification code sent by text</b> to receive your gift.',
      ja: '<b>プレゼント交換所</b>で次のようにします。\n1. プレゼント交換用QRを読み取ります。\n2. 名前と連絡先を入力します。\n3. <b>SMSで届いた認証番号</b>で本人確認をするとプレゼントと交換できます。',
      zh: '请在<b>礼品兑换处</b>按以下步骤操作：\n1. 扫描礼品兑换二维码。\n2. 输入姓名和联系电话。\n3. 用<b>短信收到的验证码</b>完成身份确认即可领取礼品。'
    },
    exchangePlace: { ko: '선물교환처', en: 'the gift exchange desk', ja: 'プレゼント交換所', zh: '礼品兑换处' },
    giftPoints: null,
    expire: null,
    hours: null,
    survey: null,
    phone: null,
    phoneHours: null,
    source: { ko: '습지학교 총회 현장 사진 · 선물교환처 화면', en: 'Wetland School meeting photos · gift desk page', ja: '湿地学校総会の現場写真・交換所画面', zh: '湿地学校大会现场照片·兑换处页面' }
  }
};

/*
 * 챗봇 공통 자료 — 모든 행사에 똑같이 쓰는 질문·답 (행사마다 다른 값은 {이름} 빈칸)
 *
 * 출처(src)
 *   guide    : 사이트 '행운팡팡 이용가이드' (coupon.html)
 *   brochure : 무지개컴퍼니 '마이스팡팡' 홍보 브로슈어 (인쇄물 PDF)
 *   site     : 행사 사이트 화면에서 직접 확인한 것 (참여 화면, 나의 포인트, 언어 선택 등)
 *
 * 각 항목
 *   q     : 이런 질문이면 이 자료를 찾는다 (언어별 예시 질문 — 첫 번째는 빠른 질문 버튼 글자로도 쓴다)
 *   a     : 답. {name} {period} {venue} {organizer} {earn} {giftMethod} {exchangePlace} {giftPoints}
 *           {expire} {hours} {survey} {contact} 는 행사 자료(festivals.js) 값으로 채운다
 *   needs : 이 칸이 행사 자료에 없으면(null) 답을 지어내지 않고 "자료에 없어요 + 문의처"로 답한다
 *   chips : 답 아래에 보여 줄 다음 질문 (다른 항목 id)
 */
window.CHAT_KB = window.CHAT_KB || {};
window.CHAT_KB.common = [
  {
    id: 'about', src: 'brochure',
    q: {
      ko: ['행운팡팡이 뭐예요?', '이 이벤트 뭐야', '무슨 행사예요', '소개해 줘', '마이스팡팡'],
      en: ['What is Lucky PangPang?', 'what is this program', 'tell me about Lucky PangPang', 'introduce'],
      ja: ['ラッキーパンパンって何？', 'このイベントは何ですか', '紹介して'],
      zh: ['Lucky PangPang是什么？', '这是什么活动', '介绍一下']
    },
    a: {
      ko: '행운팡팡은 행사장·관광지의 <b>QR을 찍기만 하면</b> 행운 추첨과 선물을 받을 수 있는 이벤트예요.\n앱 설치나 회원가입 없이 이름과 전화번호만 있으면 돼요.\n지금 행사: <b>{name}</b>',
      en: 'Lucky PangPang is an event where you just <b>scan QR codes</b> at venues and tourist spots to join a lucky draw and get gifts.\nNo app or sign-up needed — just your name and phone number.\nCurrent event: <b>{name}</b>',
      ja: 'ラッキーパンパンは、会場や観光地の<b>QRを撮るだけ</b>で抽選やプレゼントに参加できるイベントです。\nアプリのインストールや会員登録は不要で、名前と電話番号だけでOKです。\n現在のイベント：<b>{name}</b>',
      zh: 'Lucky PangPang是只需<b>扫描会场和景点的二维码</b>，就能参与幸运抽奖、领取礼品的活动。\n无需下载应用或注册会员，只需姓名和手机号。\n当前活动：<b>{name}</b>'
    },
    chips: ['how', 'app', 'gift']
  },
  {
    id: 'how', src: 'brochure',
    q: {
      ko: ['어떻게 참여해요?', '참여 방법', '참여하려면', '어떻게 해요', '이용 방법', '시작'],
      en: ['How do I join?', 'how to participate', 'how to join the event', 'participation steps', 'join steps'],
      ja: ['どうやって参加しますか？', '参加方法', '使い方', '手順'],
      zh: ['怎么参加？', '参与方法', '怎么用', '步骤']
    },
    a: {
      ko: '참여는 이렇게 해요.\n1. 행운팡팡 QR을 휴대폰 카메라로 찍어요.\n2. 이름과 전화번호를 입력해요.\n3. 바로 당첨 결과를 확인해요.\n\n{earn}',
      en: 'Here\'s how to join:\n1. Scan a Lucky PangPang QR with your phone camera.\n2. Enter your name and phone number.\n3. Check your result right away.\n\n{earn}',
      ja: '参加方法はこちらです。\n1. ラッキーパンパンのQRをスマホのカメラで撮ります。\n2. 名前と電話番号を入力します。\n3. すぐに当選結果を確認します。\n\n{earn}',
      zh: '参与方法如下：\n1. 用手机相机扫描Lucky PangPang二维码。\n2. 输入姓名和手机号。\n3. 立即查看抽奖结果。\n\n{earn}'
    },
    chips: ['gift', 'app', 'privacy']
  },
  {
    id: 'app', src: 'brochure',
    q: {
      ko: ['앱 깔아야 해요?', '앱 설치', '회원가입 해야 돼요?', '가입', '로그인', '다운로드'],
      en: ['Do I need an app?', 'install app', 'sign up', 'register account', 'login', 'download'],
      ja: ['アプリは必要ですか？', 'アプリ インストール', '会員登録', 'ログイン', 'ダウンロード'],
      zh: ['需要下载应用吗？', '安装应用', '注册会员', '登录', '下载']
    },
    a: {
      ko: '아니요, <b>앱 설치도 회원가입도 필요 없어요.</b>\n휴대폰 기본 카메라로 QR을 찍고, 이름과 전화번호만 입력하면 돼요.',
      en: 'No — <b>no app and no sign-up needed.</b>\nJust scan the QR with your phone\'s camera and enter your name and phone number.',
      ja: 'いいえ、<b>アプリのインストールも会員登録も不要です。</b>\nスマホの標準カメラでQRを撮り、名前と電話番号を入力するだけです。',
      zh: '不需要，<b>无需下载应用，也无需注册会员。</b>\n用手机自带相机扫码，输入姓名和手机号即可。'
    },
    chips: ['how', 'privacy']
  },
  {
    id: 'earn', src: 'guide',
    q: {
      ko: ['포인트 어떻게 받아요?', '포인트 적립', '포인트 받는 법', '포인트 모으기', 'QR 위치', 'QR 팻말 찾기', 'QR 어디서 찍어요', 'QR 어디 있어요', '어디서 스캔해요'],
      en: ['How do I get points?', 'earn points', 'collect points', 'where are the QR codes', 'get points', 'where do I scan the QR'],
      ja: ['ポイントはどうやってもらえますか？', 'ポイント 貯める', 'QRはどこ', 'ポイント 獲得', 'QRはどこで読み取りますか'],
      zh: ['怎么获得积分？', '积分 累积', '二维码在哪里', '赚积分', '在哪里扫码']
    },
    a: { ko: '{earn}', en: '{earn}', ja: '{earn}', zh: '{earn}' },
    chips: ['gift', 'expire', 'already']
  },
  {
    id: 'gift', src: 'guide',
    q: {
      ko: ['선물은 어디서 받아요?', '선물 교환', '교환 방법', '선물 받는 법', '상품 수령', '경품', '어디서 바꿔요', '교환처'],
      en: ['Where do I get my gift?', 'exchange gift', 'redeem points', 'how to get the prize', 'where to exchange', 'claim reward'],
      ja: ['プレゼントはどこでもらえますか？', 'プレゼント 交換', '交換方法', '景品 受け取り', 'どこで交換'],
      zh: ['礼品在哪里领？', '兑换礼品', '兑换方法', '领奖', '在哪里兑换']
    },
    a: { ko: '{giftMethod}', en: '{giftMethod}', ja: '{giftMethod}', zh: '{giftMethod}' },
    needs: ['giftMethod'],
    chips: ['points', 'expire', 'mypoints']
  },
  {
    id: 'points', src: 'guide',
    q: {
      ko: ['몇 포인트 필요해요?', '필요한 포인트', '얼마나 모아야', '몇 점', '포인트 얼마'],
      en: ['How many points do I need?', 'points needed', 'how many points for a gift'],
      ja: ['何ポイント必要ですか？', '必要なポイント', '何点'],
      zh: ['需要多少积分？', '所需积分', '多少分']
    },
    a: {
      ko: '선물로 바꾸려면 <b>{giftPoints}</b>가 필요해요.',
      en: 'You need <b>{giftPoints}</b> to get a gift.',
      ja: 'プレゼントとの交換には<b>{giftPoints}</b>が必要です。',
      zh: '兑换礼品需要<b>{giftPoints}</b>。'
    },
    needs: ['giftPoints'],
    chips: ['gift', 'expire']
  },
  {
    id: 'expire', src: 'guide',
    q: {
      ko: ['포인트 언제까지 써요?', '포인트 소멸', '유효기간', '내일 써도 돼요?', '다음날', '사라져요', '언제까지'],
      en: ['When do points expire?', 'points expire', 'expiry', 'can I use them tomorrow', 'valid until'],
      ja: ['ポイントはいつまで使えますか？', 'ポイント 失効', '有効期限', '明日 使える'],
      zh: ['积分什么时候过期？', '积分 失效', '有效期', '明天还能用吗']
    },
    a: {
      ko: '포인트는 <b>{expire}</b>까지 쓸 수 있어요. 지나면 자동으로 사라지고 다음 날로 넘어가지 않으니, 그 전에 교환해 주세요.',
      en: 'Points are valid until <b>{expire}</b>. After that they disappear automatically and don\'t carry over, so please exchange them before then.',
      ja: 'ポイントは<b>{expire}</b>まで使えます。過ぎると自動で消え、翌日には持ち越せないので、それまでに交換してください。',
      zh: '积分可使用至<b>{expire}</b>，过期自动清零且不会延续到第二天，请在此之前兑换。'
    },
    needs: ['expire'],
    chips: ['gift', 'points']
  },
  {
    id: 'hours', src: 'guide',
    q: {
      ko: ['교환은 몇 시까지 해요?', '운영 시간', '몇 시에 열어요', '부스 운영시간', '마감'],
      en: ['What are the opening hours?', 'booth hours', 'what time does it close', 'opening time'],
      ja: ['交換は何時までですか？', '営業時間', '何時に開きますか', '締め切り'],
      zh: ['兑换开放到几点？', '营业时间', '几点开门', '几点关门']
    },
    a: {
      ko: '운영 시간은 <b>{hours}</b>예요.',
      en: 'Opening hours: <b>{hours}</b>.',
      ja: '運営時間は<b>{hours}</b>です。',
      zh: '开放时间：<b>{hours}</b>。'
    },
    needs: ['hours'],
    // 운영 시간이 자료에 없을 때 덧붙이는 말 (noteNeeds 값이 있는 행사만)
    unknownNote: {
      ko: '참고로 포인트는 <b>{expire}</b>에 사라지니 그 전에 교환해 주세요.',
      en: 'Note: points expire at <b>{expire}</b>, so please exchange them before then.',
      ja: 'なお、ポイントは<b>{expire}</b>に消えるので、それまでに交換してください。',
      zh: '提示：积分在<b>{expire}</b>失效，请在此之前兑换。'
    },
    noteNeeds: ['expire'],
    chips: ['expire', 'contact']
  },
  {
    // 선물 교환 때 본인 확인 — 방법은 행사 자료(giftMethod)에 적힌 것만 보여 준다
    id: 'auth', src: 'guide',
    q: {
      ko: ['본인인증 해야 돼요?', '본인 확인', '본인인증', '신분증 필요해요?', '신분 확인', '인증 해야 해요'],
      en: ['Do I need to verify my identity?', 'identity verification', 'ID verification', 'do I need ID', 'verify identity'],
      ja: ['本人確認は必要ですか？', '本人認証', '身分証', '認証は必要'],
      zh: ['需要身份验证吗？', '身份验证', '要带身份证吗', '实名认证']
    },
    a: {
      ko: '네, 선물로 바꿀 때 <b>본인인증</b>을 해요.\n{giftMethod}',
      en: 'Yes — you\'ll <b>verify your identity</b> when exchanging for a gift.\n{giftMethod}',
      ja: 'はい、プレゼントと交換するときに<b>本人認証</b>をします。\n{giftMethod}',
      zh: '是的，兑换礼品时需要<b>身份验证</b>。\n{giftMethod}'
    },
    needs: ['exchangePlace', 'giftMethod'],
    chips: ['gift', 'privacy']
  },
  {
    // 주차·화장실·와이파이 등 행사장 시설 — 지금 행사 자료에는 없어서 "자료에 없어요 + 문의처"로 답한다
    // (행사 자료 festivals.js 에 facilities 를 넣으면 그 내용으로 답함)
    id: 'facilities', src: 'festival',
    q: {
      ko: ['주차장 어디예요?', '주차', '화장실 어디예요?', '화장실', '와이파이', '분실물', '물품 보관', '짐 보관', '흡연 구역', '수유실', '휠체어', '편의시설'],
      en: ['Is there parking?', 'parking lot', 'where can I park', 'where is the restroom', 'restroom', 'toilet', 'bathroom', 'wifi', 'lost and found', 'luggage storage', 'smoking area', 'wheelchair', 'facilities'],
      ja: ['駐車場はありますか？', '駐車場', 'トイレはどこですか', 'トイレ', 'お手洗い', 'Wi-Fi', '落とし物', '荷物 預け', '喫煙所', '授乳室', '車椅子', '施設'],
      zh: ['有停车场吗？', '停车场', '停车', '洗手间在哪里', '洗手间', '厕所', '卫生间', '无线网', 'WiFi', '失物招领', '寄存行李', '吸烟区', '母婴室', '轮椅', '设施']
    },
    a: { ko: '{facilities}', en: '{facilities}', ja: '{facilities}', zh: '{facilities}' },
    needs: ['facilities'],
    chips: ['contact', 'event']
  },
  {
    id: 'mypoints', src: 'site',
    q: {
      ko: ['내 포인트 어떻게 봐요?', '포인트 조회', '내 포인트', '사용 내역', '잔액 확인', '내 포인트 몇 점이에요'],
      en: ['How do I check my points?', 'check my points', 'my point balance', 'usage history'],
      ja: ['自分のポイントはどう確認しますか？', 'マイポイント', 'ポイント 残高', '利用履歴'],
      zh: ['怎么查看我的积分？', '我的积分', '积分余额', '使用记录']
    },
    a: {
      ko: '화면 위쪽 <b>내 포인트</b> 버튼을 누르고 이름과 연락처를 입력한 뒤, 문자로 받은 인증번호를 넣으면 사용 내역을 볼 수 있어요.',
      en: 'Tap <b>My Points</b> at the top, enter your name and phone number, then type the verification code sent by text to see your history.',
      ja: '画面上部の<b>マイポイント</b>を押し、名前と連絡先を入力して、SMSで届いた認証番号を入れると利用履歴が見られます。',
      zh: '点击页面上方的<b>我的积分</b>，输入姓名和联系电话，再输入短信收到的验证码，即可查看使用记录。'
    },
    chips: ['expire', 'gift']
  },
  {
    id: 'privacy', src: 'site',
    q: {
      ko: ['개인정보는 어떻게 돼요?', '번호를 왜 받아요', '개인정보', '정보 삭제', '번호 저장'],
      en: ['What happens to my personal info?', 'why do you need my number', 'privacy', 'personal data deleted'],
      ja: ['個人情報はどうなりますか？', 'なぜ電話番号', '個人情報', '削除'],
      zh: ['我的个人信息会怎样？', '为什么要手机号', '隐私', '信息删除']
    },
    a: {
      ko: '이름과 전화번호만 받고, <b>포인트 지급과 사용에만</b> 써요. 그리고 <b>4주 뒤 자동으로 삭제</b>돼요.',
      en: 'Only your name and phone number are collected, used <b>only for giving and using points</b>, and <b>deleted automatically after 4 weeks</b>.',
      ja: '名前と電話番号のみを集め、<b>ポイントの付与と利用にだけ</b>使います。<b>4週間後に自動で削除</b>されます。',
      zh: '只收集姓名和手机号，<b>仅用于发放和使用积分</b>，<b>4周后自动删除</b>。'
    },
    chips: ['how', 'app']
  },
  {
    id: 'already', src: 'site',
    q: {
      ko: ['이미 참여했다고 떠요', '이미 참여하였습니다', '중복', '또 참여할 수 있어요?', '다시 참여', '한 번 더'],
      en: ['It says I already participated', 'already participated', 'can I join again', 'duplicate'],
      ja: ['すでに参加済みと出ます', 'もう一度参加', '重複'],
      zh: ['显示已经参与过了', '可以再参加吗', '重复']
    },
    a: {
      ko: '같은 QR은 <b>전화번호 하나당 한 번만</b> 참여할 수 있어요. 그래서 이미 찍은 QR을 다시 찍으면 "이미 참여하였습니다"가 떠요.\n<b>다른 장소의 QR</b>을 찾아서 찍어 보세요!',
      en: 'Each QR can be used <b>once per phone number</b>, so scanning the same one again shows "already participated".\nTry finding <b>a QR at another spot</b>!',
      ja: '同じQRは<b>電話番号1つにつき1回</b>だけ参加できます。そのため同じQRをもう一度撮ると「すでに参加済み」と表示されます。\n<b>別の場所のQR</b>を探してみてください！',
      zh: '同一个二维码<b>每个手机号只能参与一次</b>，所以重复扫描会显示“已参与”。\n请去找<b>其他地点的二维码</b>吧！'
    },
    chips: ['earn', 'qr']
  },
  {
    id: 'qr', src: 'site',
    q: {
      ko: ['QR이 안 찍혀요', '큐알 인식이 안 돼요', '스캔이 안 돼요', '카메라', 'QR 오류'],
      en: ['The QR code won\'t scan', 'qr not working', 'can\'t scan', 'camera problem'],
      ja: ['QRが読み取れません', 'スキャンできない', 'カメラ', 'QR エラー'],
      zh: ['二维码扫不出来', '扫码失败', '相机', '二维码 错误']
    },
    a: {
      ko: '이렇게 해 보세요.\n1. 휴대폰 <b>기본 카메라 앱</b>으로 QR을 비춰요. (네이버·카카오 앱의 QR 스캔도 돼요)\n2. QR이 화면에 꽉 차도록 <b>조금 떨어져서</b> 비춰요.\n3. 너무 어둡거나 빛이 반사되면 각도를 바꿔요.\n그래도 안 되면 {contact}',
      en: 'Try this:\n1. Point your phone\'s <b>default camera app</b> at the QR (Naver or KakaoTalk QR scanners also work).\n2. Hold it <b>a little farther away</b> so the QR fills the screen.\n3. If it\'s too dark or there\'s glare, change the angle.\nStill not working? {contact}',
      ja: '次を試してください。\n1. スマホの<b>標準カメラアプリ</b>でQRを映します（NAVERやカカオのQRスキャンも使えます）。\n2. QRが画面いっぱいになるよう<b>少し離して</b>映します。\n3. 暗すぎたり光が反射したら角度を変えます。\nそれでもだめなら {contact}',
      zh: '请试试：\n1. 用手机<b>自带相机</b>对准二维码（Naver、KakaoTalk的扫码功能也可以）。\n2. <b>稍微拉远一点</b>，让二维码占满屏幕。\n3. 太暗或有反光时，换个角度。\n仍然不行的话，{contact}'
    },
    chips: ['already', 'contact']
  },
  {
    id: 'survey', src: 'guide',
    q: {
      ko: ['커피 쿠폰은 어떻게 받아요?', '만족도 조사', '설문', '커피', '쿠폰'],
      en: ['How do I get a coffee coupon?', 'survey', 'satisfaction survey', 'coffee', 'coupon'],
      ja: ['コーヒークーポンはどうやってもらえますか？', 'アンケート', '満足度調査', 'コーヒー', 'クーポン'],
      zh: ['怎么获得咖啡券？', '问卷', '满意度调查', '咖啡', '优惠券']
    },
    a: { ko: '{survey}', en: '{survey}', ja: '{survey}', zh: '{survey}' },
    needs: ['survey'],
    chips: ['gift', 'about']
  },
  {
    id: 'shop', src: 'brochure',
    q: {
      ko: ['포인트로 가게에서 결제돼요?', '상점에서 사용', '결제', '가맹점', '주변 가게에서 써요'],
      en: ['Can I pay at shops with points?', 'use points at stores', 'payment', 'partner stores'],
      ja: ['ポイントでお店で支払えますか？', 'お店で使う', '支払い', '加盟店'],
      zh: ['积分能在商店付款吗？', '在店里使用', '付款', '加盟店']
    },
    a: {
      ko: '마이스팡팡은 행사장 주변 <b>가맹점에 놓인 결제용 QR</b>로 포인트를 쓸 수 있게 만든 서비스예요. (지역 상권 살리기)\n다만 가맹점이 있는지는 행사마다 달라서, 이용할 가게는 {contact}',
      en: 'MICE PangPang lets you spend points with the <b>payment QR at partner shops</b> near the venue (to support local businesses).\nWhether partner shops are available differs by event — to check, {contact}',
      ja: 'マイスパンパンは、会場周辺の<b>加盟店にある決済用QR</b>でポイントを使えるサービスです（地域商圏の活性化）。\nただし加盟店の有無はイベントごとに違うので、利用できるお店は {contact}',
      zh: 'MICE PangPang支持在会场周边<b>加盟店的付款二维码</b>使用积分（带动当地商圈）。\n是否有加盟店因活动而异，具体商店请{contact}'
    },
    chips: ['gift', 'contact']
  },
  {
    id: 'event', src: 'festival',
    q: {
      ko: ['행사 언제 어디서 해요?', '행사 정보', '기간', '장소', '어디서 해요', '언제 해요', '주최'],
      en: ['When and where is the event?', 'event dates and venue', 'event info', 'event schedule', 'dates', 'venue', 'location', 'organizer'],
      ja: ['イベントはいつどこで？', 'イベント情報', '期間', '場所', '主催'],
      zh: ['活动什么时候在哪里？', '活动信息', '活动时间', '地点', '主办']
    },
    a: {
      ko: '<b>{name}</b>\n· 기간: {period}\n· 장소: {venue}',
      en: '<b>{name}</b>\n· Dates: {period}\n· Venue: {venue}',
      ja: '<b>{name}</b>\n・期間：{period}\n・場所：{venue}',
      zh: '<b>{name}</b>\n· 时间：{period}\n· 地点：{venue}'
    },
    needs: ['period', 'venue'],
    chips: ['how', 'gift']
  },
  {
    id: 'contact', src: 'festival',
    q: {
      ko: ['문의는 어디로 해요?', '문의 전화번호', '전화번호', '문의', '연락처', '고객센터', '상담'],
      en: ['Who can I contact?', 'contact phone number', 'phone number', 'contact', 'help desk', 'customer service'],
      ja: ['問い合わせ先は？', '電話番号', '問い合わせ', '連絡先'],
      zh: ['联系方式是什么？', '电话号码', '咨询', '客服']
    },
    a: { ko: '{contact}', en: '{contact}', ja: '{contact}', zh: '{contact}' },
    chips: ['about', 'how']
  },
  {
    id: 'language', src: 'site',
    q: {
      ko: ['언어 바꾸고 싶어요', '영어로', '언어 변경', '외국어'],
      en: ['Change language', 'language', 'english', 'korean'],
      ja: ['言語を変えたい', '日本語', '言語'],
      zh: ['更改语言', '中文', '语言']
    },
    a: {
      ko: '화면 오른쪽 위의 <b>언어 버튼(🌐)</b>을 누르면 한국어 · English · 日本語 · 中文 중에서 고를 수 있어요. 챗봇은 묻는 말의 언어로 대답해요.',
      en: 'Tap the <b>language button (🌐)</b> at the top right to choose 한국어 · English · 日本語 · 中文. I answer in the language you write in.',
      ja: '画面右上の<b>言語ボタン(🌐)</b>から 한국어 · English · 日本語 · 中文 を選べます。チャットボットは質問の言語で答えます。',
      zh: '点击右上角的<b>语言按钮(🌐)</b>即可在 한국어 · English · 日本語 · 中文 中选择。聊天机器人会用你提问的语言回答。'
    },
    chips: ['about', 'how']
  },
  {
    id: 'hello', src: 'site',
    q: {
      ko: ['안녕하세요', '안녕', '하이', '반가워요'],
      en: ['hello', 'hi', 'hey'],
      ja: ['こんにちは', 'やあ'],
      zh: ['你好', '您好', '嗨']
    },
    a: {
      ko: '안녕하세요! 행사 이용 방법을 알려 드릴게요. 아래에서 고르거나 궁금한 걸 입력해 주세요.',
      en: 'Hello! I can help you with this event. Pick a topic below or type your question.',
      ja: 'こんにちは！イベントの使い方をご案内します。下から選ぶか、質問を入力してください。',
      zh: '你好！我来为你介绍活动的使用方法。请选择下方话题或直接输入问题。'
    },
    chips: ['how', 'gift', 'about']
  },
  {
    id: 'thanks', src: 'site',
    q: {
      ko: ['고마워요', '감사합니다', '땡큐', '알겠어요'],
      en: ['thank you', 'thanks', 'ok got it'],
      ja: ['ありがとう', 'わかりました'],
      zh: ['谢谢', '明白了']
    },
    a: {
      ko: '도움이 됐다니 다행이에요! 또 궁금한 게 있으면 언제든 물어보세요.',
      en: 'Glad I could help! Ask me anything else anytime.',
      ja: 'お役に立ててよかったです！ほかにも気になることがあればいつでもどうぞ。',
      zh: '很高兴能帮到你！还有问题随时问我。'
    },
    chips: []
  }
];

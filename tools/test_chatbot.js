/*
 * 챗봇 회귀 테스트 — 질문을 넣어서 기대한 답(자료 id)이 나오는지 확인
 *
 * 사용: node tools/test_chatbot.js          (틀린 것만 출력)
 *       node tools/test_chatbot.js -v       (전부 출력)
 *
 * 기대값
 *   'earn'            → 그 자료 id 로 답해야 함
 *   'hours:unknown'   → 그 자료지만 행사 값이 없어 "자료에 없어요 + 문의처"로 답해야 함
 *   'fallback'        → 모르는 질문으로 처리해야 함
 *   'list:food'       → 음식점 목록, 'place:*' → 어떤 장소 카드든 OK
 *   'unknown'         → 자료 id 와 상관없이 "자료에 없다"(unknown/fallback/noplaces) 계열이면 OK
 * 질문을 추가할 때는 [행사, 화면 언어, 질문, 기대값] 한 줄만 넣으면 된다.
 */
'use strict';
const fs = require('fs');
const path = require('path');

const SITE = path.join(__dirname, '..', 'site');
global.window = {};
for (const f of ['chatbot/kb/common.js', 'chatbot/kb/festivals.js', 'chatbot/kb/places-gwangyang.js', 'chatbot/rag.js']) {
  (0, eval)(fs.readFileSync(path.join(SITE, f), 'utf8'));
}
const R = window.ChatRAG;

const G = 'gwangyang', K = 'gyeongbuk', W = 'wetland';
const CASES = [
  // ── 기본 (한국어) ──
  [G, 'ko', '포인트 어떻게 받아요?', 'earn'],
  [G, 'ko', 'QR 어디서 찍어요?', 'earn'],
  [G, 'ko', '교환 장소', 'gift'],
  [G, 'ko', '선물 교환 방법', 'gift'],
  [G, 'ko', '선물 어디서 바꿔요?', 'gift'],
  [G, 'ko', '몇 포인트 필요해?', 'points'],
  [G, 'ko', '5000점 모아야 돼?', 'points'],
  [G, 'ko', '내일 써도 돼?', 'expire'],
  [G, 'ko', '포인트 언제 사라져요?', 'expire'],
  [G, 'ko', '유효기간이 어떻게 돼요', 'expire'],
  [G, 'ko', '커피 쿠폰', 'survey'],
  [G, 'ko', '설문하면 뭐 줘요?', 'survey'],
  [G, 'ko', '본인인증 해야 돼요?', 'auth'],
  [G, 'ko', '신분증 필요해요?', 'auth'],
  [G, 'ko', '앱 깔아야 해요?', 'app'],
  [G, 'ko', '행운팡팡이 뭐예요?', 'about'],
  [G, 'ko', '어떻게 참여해요?', 'how'],
  [G, 'ko', '내 포인트 조회', 'mypoints'],
  [G, 'ko', '포인트 확인은 어디서 해요?', 'mypoints'],
  [G, 'ko', 'QR 코드가 안 찍혀요', 'qr'],
  [G, 'ko', '이미 참여했다고 떠요', 'already'],
  [G, 'ko', '개인정보는 어떻게 돼요?', 'privacy'],
  [G, 'ko', '문의 전화번호', 'contact'],
  [G, 'ko', '안녕', 'hello'],
  [G, 'ko', '고마워요', 'thanks'],
  // 운영 시간: 자료에 없음 → 모른다고 + (광양은) 23시 소멸 안내
  [G, 'ko', '교환은 몇 시까지 돼요?', 'hours:unknown'],
  [G, 'ko', '7번부스 몇시까지 해요?', 'hours:unknown'],
  // ── 장소 (광양) ──
  [G, 'ko', '근처 맛집 추천해줘', 'list:food'],
  [G, 'ko', '숙소 추천', 'list:hotel'],
  [G, 'ko', '소학재 어디예요', 'place:*'],
  [G, 'ko', '장어 먹고 싶어', 'place:*'],
  // ── 자료에 없는 시설 → 지어내지 않고 문의처 ──
  [G, 'ko', '주차장 어디예요?', 'unknown'],
  [G, 'ko', '화장실 어디야', 'unknown'],
  [G, 'ko', '와이파이 돼요?', 'unknown'],
  [G, 'ko', '분실물 어디서 찾아요?', 'unknown'],
  [G, 'en', 'Is there parking?', 'unknown'],
  [G, 'en', 'Where can I park my car?', 'unknown'],
  [G, 'en', 'Where is the restroom?', 'unknown'],
  [G, 'en', 'Where is the toilet?', 'unknown'],
  [G, 'en', 'Is there wifi?', 'unknown'],
  [G, 'ja', '駐車場はありますか', 'unknown'],
  [G, 'ja', 'トイレはどこですか', 'unknown'],
  [G, 'zh', '有停车场吗', 'unknown'],
  [G, 'zh', '洗手间在哪里', 'unknown'],
  // ── 영어 ──
  [G, 'en', 'How do I get points?', 'earn'],
  [G, 'en', 'Where can I exchange my gift?', 'gift'],
  [G, 'en', 'How many points do I need?', 'points'],
  [G, 'en', 'Can I use my points tomorrow?', 'expire'],
  [G, 'en', 'Do I need ID verification?', 'auth'],
  [G, 'en', 'The QR code won\'t scan', 'qr'],
  [G, 'en', 'good restaurants nearby', 'list:food'],
  [G, 'en', 'What time does the booth close?', 'hours:unknown'],
  // ── 일본어 ──
  [G, 'ja', 'ポイントはどこで交換できますか', 'gift'],
  [G, 'ja', '有効期限は？', 'expire'],
  [G, 'ja', '本人確認は必要ですか', 'auth'],
  [G, 'ja', '何ポイント必要ですか', 'points'],
  // ── 중국어 ──
  [G, 'zh', '积分在哪里兑换', 'gift'],
  [G, 'zh', '附近有什么好吃的', 'list:food'],
  [G, 'zh', '需要身份验证吗', 'auth'],
  [G, 'zh', '积分什么时候过期', 'expire'],
  // ── 다른 행사: 같은 질문, 행사별 답 ──
  [K, 'ko', '선물 어디서 받아요?', 'gift'],
  [W, 'ko', '선물 어디서 받아요?', 'gift'],
  [K, 'ko', '포인트 언제 사라져요?', 'expire:unknown'],
  [K, 'ko', '행사 언제 어디서 해요?', 'event'],
  [W, 'ko', '행사 언제 어디서 해요?', 'event:unknown'],
  [K, 'ko', '근처 맛집', 'noplaces:food'],
  // ── 새 항목(본인인증·시설)이 엉뚱한 질문을 가로채지 않는지 ──
  [G, 'ko', '오늘 날씨 어때?', 'fallback'],
  [G, 'ko', '로또 번호 알려줘', 'fallback'],
  [G, 'en', 'What is the capital of France?', 'fallback'],
  [G, 'ko', '카메라가 안 켜져요', 'qr'],
  [G, 'ko', '캠핑장 추천해줘', 'list:hotel'],
  [G, 'ko', '선물 받을 때 본인 확인 어떻게 해요?', 'auth'],
  [K, 'ko', '본인인증 해야 돼요?', 'auth:unknown'],
  [W, 'ko', '본인인증 해야 돼요?', 'auth'],
  [G, 'ko', '포인트 몇 시까지 써요?', 'expire'],
];

const UNKNOWN = /(:unknown$|^fallback$|^noplaces:)/;
function ok(hit, exp) {
  if (exp === 'unknown') return UNKNOWN.test(hit);
  if (exp === 'place:*') return hit.startsWith('place:');
  return hit === exp;
}
const strip = s => s.replace(/<[^>]+>/g, '').replace(/\n+/g, ' / ');

const verbose = process.argv.includes('-v');
let fail = 0;
for (const [fest, ui, q, exp] of CASES) {
  const r = R.localAnswer(q, fest, ui);
  const good = ok(r.hit, exp);
  if (!good) fail++;
  if (!good || verbose) {
    console.log(`${good ? 'ok  ' : 'FAIL'} [${fest}/${r.lang}] ${q}\n       기대 ${exp} / 결과 ${r.hit}\n       → ${strip(r.html).slice(0, 110)}`);
  }
}
console.log(`\n${CASES.length - fail}/${CASES.length} 통과${fail ? `, ${fail}개 실패` : ''}`);
process.exit(fail ? 1 : 0);

# 광양행운팡팡 사이트 복제 · 다국어 · 챗봇

의뢰받은 **광양행운팡팡**(www.gwangyangpang.com) 사이트를 통째로 받아와서 로컬에서 그대로 띄우고,
그 위에 **다국어(영어·일본어·중국어)** 와 **이용가이드 챗봇**을 붙인 작업물입니다.

---

## 진행 상황 (2026-11-20 기준, `integration` 브랜치)

### 📋 업데이트 기록 (한눈에)
| 날짜 | 누가 | 내용 | 브랜치 / PR |
|---|---|---|---|
| 11/17 | parkcheayoon2405035 | 사이트 복제(119페이지), 언어 선택 연결, 화면 문구·글자 이미지 25개 번역, 이용가이드 챗봇 | `main` 첫 커밋 |
| 11/19 | jeongit1256 | 디자인 리뉴얼(MZ 다크 테마), DB 내용 번역, 제목 글꼴, 새 챗봇(4개 국어·자료 검색) | PR #1~#4 → `main` |
| 11/20 | parkcheayoon2405035 | 원래 사이트 버그 수정: 개인정보 동의 확인, 설문 빈 화면, '경북교육청' 문구 | `fix/consent-survey-text` → `integration` |
| 11/20 | parkcheayoon2405035 | 챗봇 오답 11개 수정, 시연용 선택창 숨김, 회귀 테스트(75개) | `fix/chatbot` → `integration` |
| 11/20 | parkcheayoon2405035 | 전체 재검수(472화면·링크 9,026개): 추적 코드 제거, 주소 링크 72곳, 외국어 제목 잘림, 챗봇 버튼 겹침 | `integration` |


### ✅ 완료
- **사이트 복제**: 페이지 119개, 파일 519개를 받아서 로컬에서 원본과 똑같이 뜨는 것 확인
  - 링크를 전부 로컬 경로로 바꾸고, 네이버 추적 코드·에러 나는 `url_list.php` 제거
- **언어 선택 기능**: 첫 화면(QR로 들어오는 화면)의 English / 日本語 / 中文 버튼이 원래 주석 처리돼 동작하지 않던 것을 연결
  - 원래 개발사는 `eng/` `jpn/` `chn/` 폴더를 만들려다 미완성("Under construction" 이미지만 존재)
- **화면 고정 문구 번역**: 메뉴, 버튼, 안내문, 참여 폼, 포인트 조회, 이용가이드, 하단 회사 정보, 경고창 문구
- **글자가 그려진 이미지 25개 번역**: 상단 버튼·로고, 배너 13종, 제목 5종, 더보기·네이버 지도 버튼
  - 그림은 그대로 두고 글자만 지운 배경 + HTML 글자로 교체 (한국어일 땐 원본 이미지 그대로)
- **번역 검수**: 119페이지 전수 검사로 놓친 문구 확인, 표현 10곳 수정, 배너 글자 넘침 검사
- **챗봇 연결**: 처음엔 이용가이드 페이지에 한국어 전용으로 붙였으나, 11/19 새 챗봇으로 교체됨 (아래 참고)

### ✅ 추가 (2026-11-19): DB 내용 번역
- 회사에서 소스·DB를 받을 수 없어 이 복제본이 시연용 결과물이 됨 → 내용이 고정이므로 번역 파일로 관리 가능
- **설명 · 상세 본문 · 행사 기간 · 대표 메뉴** 번역 (원문 294개 × 영·일·중)
- **주소**: 로마자 주소 + 아래에 한국어 원문 작게 (택시 기사에게 보여 주기 · 지도 검색용)
- **가게·장소 이름은 한국어 유지** (현장 간판과 맞춰 보기 쉽게, 소리대로 표기 오류 방지)
- 실제 서비스에서는 여전히 관리자가 등록할 때 외국어도 함께 입력하는 구조(DB·관리자 페이지 수정)가 필요 → 의뢰처에 다음 단계로 제안

### ✅ 추가 (2026-11-19): 챗봇 — 자료에서 찾아 답하는 구조 (RAG 의 '찾기')
- 회사가 챗봇 데이터를 주지 않아, **이용가이드 · 브로슈어 · 행사 사이트 · 현장 사진**에서 확인한 것만으로 자료를 만듦
- **4개 국어**: 질문한 언어로 답함 (모든 페이지 오른쪽 아래 버튼, QR 첫 화면만 제외)
- **행사별 자료**: 챗봇 코드는 하나, 행사마다 자료 파일만 다름 → 같은 질문에 행사마다 다른 답
  - 시연: 주소에 `?demo=1` 을 붙여 연 챗봇 위쪽 **'시연용 · 행사 바꾸기'** 에서 광양 / 경북수업나눔축제 / 습지학교 총회로 바꿔 "선물 어디서 받아요?" 물어보기 (방문객 화면에는 이 선택창이 안 보임)
- 자료에 없는 것은 **지어내지 않고** "자료에 없어요 + 문의처"로 답함. 답 아래에 **근거(어느 자료를 보고 답했는지)** 표시
- 광양은 사이트의 음식점·숙박·관광지·특산물·행사 **84곳**도 찾아 줌 ("근처 맛집", "소학재 어디예요")
- 처음 버전(이용가이드 키워드 챗봇)의 화면 구성과 '잘못 답하던 질문 3개'(교환 시간 · QR 인식 · 내 포인트)도 반영
- **11/20 오답 수정**: 시설(주차·화장실·와이파이 등)·본인인증 항목 추가, 영·일·중에서 시설 질문이 엉뚱한 답(숙소·선물 교환)으로 가던 문제 해결, 운영 시간을 모를 땐 포인트 소멸 시각을 덧붙임
  - 회귀 테스트: `node tools/test_chatbot.js` (질문 75개, 자료를 고친 뒤 꼭 돌려 볼 것)
- 생성형 AI 는 API 키가 없어 연결하지 않음. `chatbot.html` 의 `CHAT_CONFIG.aiEndpoint` 에 서버 주소를 넣으면 찾은 자료를 근거로 AI 가 답하는 자리를 만들어 둠

### ✅ 추가 (2026-11-20): 원래 사이트 버그 수정
- **개인정보 동의 확인 되살림**: 참여·포인트 조회 페이지에 "위 내용에 동의합니다 (필수)" 체크박스 추가. 체크 안 하면 전송 안 됨
  - 원래는 동의 검사 코드가 `|| 1`(항상 통과) 또는 주석 처리돼 **동의 없이 이름·전화번호가 전송**됐음
  - 체크박스 값 `agree_info=Y` 가 함께 전송되므로 **실서버 PHP 에서도 이 값을 검사해야 함** (화면 쪽 검사만으론 우회 가능)
- **설문 버튼 빈 화면 해결**: 서버 안내창 함수(`err_msg_layer`)가 없는 페이지에서도 안내가 뜨도록 `js/site-fixes.js` 추가 (모든 페이지)
  - 설문 → "설문조사 기간이 지났습니다." 안내 + 확인 누르면 이전 화면으로 (4개 국어)
- **"경북교육청" 문구 바로잡음**: 포인트 조회 동의 문구 → "행운팡팡 참여를 위한 정보 수집 동의 (필수)"

### ✅ 추가 (2026-11-20): 전체 재검수 (리뉴얼·DB 번역·챗봇 합친 integration 기준)
- **자동 검사 118페이지 × 4개 국어 = 472화면**: 화면 넘침 0, 깨진 이미지 0, 콘솔 에러 0(설문 페이지는 검사 방식 탓의 착시 — 실제 정상), 번역 누락 0
  - 남은 한국어는 모두 방침대로(가게·축제 이름, 로마자 주소 아래 원문, 번역 속 이름 병기, 언어 선택 전 첫 화면)
- **링크 검사 9,026개**: 아래 문제 발견 → 수정
- **네이버 방문 추적 코드 제거(111페이지)**: 처음 복제 때 `wcs.naver.net` 만 지워 `wcs.pstatic.net` 이 남아 있었음 → 복제본 방문이 의뢰처 통계에 잡히던 것. `tools/build2.py` 도 수정
- **깨진 주소 링크 72곳**: 원래 DB 의 주소 링크 칸에 지도 `<iframe>` 코드가 들어 있었음 → `js/site-fixes.js` 가 한국어 주소로 구글 지도 검색 링크를 만들어 줌 (외국어 화면에서도 정확한 위치)
- **외국어 제목줄 잘림**: "Korea Tourism 100 T…" → 외국어일 때 두 줄까지, 일·중은 띄어쓰기에서만 줄바꿈 (`css/renewal.css`). LUCKY PASS 티켓 제목도 같은 처리
- **챗봇 버튼이 '참여하기' 버튼을 가림** → 참여 흐름 화면(참여 안내·참여·포인트 조회·설문)에서는 챗봇 버튼을 띄우지 않음. 나머지 페이지는 그대로
- **행사 안내에 '제25회 광양매화축제'가 두 번 나오던 것**: 원래 사이트 DB 에 같은 축제가 두 번(com_idx 1·7) 등록돼 있었음 — 글자·사진 5장까지 완전히 같음 → 목록에서 1번을 빼고 챗봇 장소 자료도 다시 만듦(85→84곳). 상세 페이지 파일은 남겨 둠. **의뢰처 DB 에서도 한 건 지워야 함** (11/21)
- **동백축제 포스터 2장 로컬로**: DB 에 `www.gwangyangpang.kr` 주소로 적혀 있어 처음 복제 때 빠졌던 것 → `file__U_index_499.png`, `500.png` 로 받아 3개 페이지 연결 (11/21)
- 원래 서버에도 없는 파일(나눔고딕·Noto 글꼴, tablet.css 등 40개)은 화면 영향 없어 그대로 둠

### 🚫 하지 않기로 한 것
- **사진 포스터 속 글자** (메인 사진 2장, 관광지도, 업체가 올린 축제 포스터)

### ⏳ 남은 일 / 확인 필요
- [ ] **실제 서버 반영**: 서버 파일 접근 권한 필요 (아래 "실제 서버에 반영하는 방법" 참고)
- [ ] **서버가 보내는 결과 메시지 번역**: 참여·포인트 조회를 실제로 제출했을 때 서버가 돌려주는 문구는 확인 못 함 → 운영 서버에서 테스트 후 사전에 추가
- [ ] **일본어·중국어 원어민 검수** (권장)
- [ ] 실서버 PHP: 참여·조회 처리에서 `agree_info=Y` 없으면 거부 (개인정보 동의 서버 검사)

---

## 실행 방법

```bash
cd site
python -m http.server 8125
```

브라우저에서:

| 보고 싶은 것 | 주소 |
|---|---|
| QR로 들어오는 첫 화면 (언어 선택) | http://localhost:8125/intro__num_D604B24477545F5C60502405576165.html |
| 메인 (영어) | http://localhost:8125/index.html?lang=en |
| 이용가이드 + 챗봇 (한국어) | http://localhost:8125/coupon.html?lang=ko |
| 챗봇만 크게 (행사·언어 지정) | http://localhost:8125/chatbot.html?fest=gyeongbuk&lang=en |
| 챗봇 시연 (행사 바꾸기 보임) | http://localhost:8125/chatbot.html?demo=1 |

### 웹에서 보기 (GitHub Pages 시연 사이트)

`main` 에 올라오면 `.github/workflows/pages.yml` 이 `site` 폴더를 자동으로 배포한다.

- 주소: https://parkcheayoon2405035.github.io/gwangyangpang-clone/intro__num_D604B24477545F5C60502405576165.html (언어 선택 첫 화면)
- 처음 한 번만: 저장소 **Settings → Pages → Source = GitHub Actions** (저장소가 Public 이어야 무료로 됨)
- 배포본에만 검색 차단(`noindex`)을 넣는다 → 진짜 사이트로 오해받지 않게. 저장소 파일은 그대로라 실서버용 파일에는 영향 없음
- 서버(PHP·DB)가 없어서 참여·인증·포인트 조회는 "시연용 사이트" 안내창이 뜬다. 실제 주소(gwangyangpang.com)에서는 원래 기능 그대로
| 번역 이미지 25개 한눈에 비교 | http://localhost:8125/_i18n_gallery.html?lang=en |

- 주소 끝 `?lang=` 을 `ko` `en` `ja` `zh` 로 바꾸면 그 언어로 바뀜. 페이지 안에서는 오른쪽 아래 🌐 버튼
- 모바일 사이트라서 PC에선 `F12` → `Ctrl+Shift+M` 으로 휴대폰 크기로 보는 게 실제와 비슷함
- 포인트 조회·참여·설문은 **서버(PHP)와 DB가 없어서 로컬에선 동작하지 않음** (정상)

---

## 폴더 구조

```
orig/            원본 그대로 (수정 금지 — 비교 기준)
site/            작업용 복제본 (여기서 수정)
  js/renewal.js           디자인 리뉴얼 (제목줄·메뉴·티켓 등 화면 구성, 축제별 테마)
  js/i18n-content.js      DB 내용 번역 데이터 (자동 생성: python tools/build_i18n_content.py)
  js/site-fixes.js        원래 사이트 고장 보완 (안내창 함수, 동의 체크박스 모양, 깨진 주소 링크)
  js/i18n.js              다국어 스크립트 (번역 사전 + 배너 교체)
  js/chatbot-launcher.js  챗봇 버튼 (4개 국어 · QR 첫 화면과 참여 흐름 화면 제외)
  css/renewal.css, fonts/ 리뉴얼 디자인 · 글꼴(Pretendard, Gasoek One)
  chatbot.html            챗봇 화면 (처음 버전: 별도 ync-chatbot 프로젝트의 pangpang_web/chatbot.html)
  chatbot/rag.js          자료에서 찾아 답하는 엔진 (언어 판단 → BM25 로 찾기 → 답 만들기)
  chatbot/kb/common.js    공통 자료 (이용가이드 · 브로슈어 · 사이트 화면) — 질문 예시와 답, 행사 값은 {빈칸}
  chatbot/kb/festivals.js 행사별 자료 (광양 · 경북수업나눔축제 · 습지학교 총회) — 행사가 바뀌면 여기만
  chatbot/kb/places-gwangyang.js  광양 장소 84곳 (자동 생성: python tools/build_chatbot_kb.py)
  images/i18n/            글자 지운 배너 배경 25개
  _i18n_gallery.html      번역 이미지 확인용 (실서버엔 올리지 말 것)
tools/           다시 만들 때 쓰는 스크립트
urlmap.json      원래 주소 ↔ 로컬 파일 이름 대응표
```

주소 뒤 값만 다른 페이지는 파일 이름에 붙여 저장했습니다.
예) `festival_s1.html?com_idx=1` → `festival_s1__com_idx_1.html`, `file.php?U_index=138` → `file__U_index_138.jpg`

---

## 다국어 동작 방식

- 모든 페이지에 `js/i18n.js` 한 줄 추가. 화면 글자를 사전과 비교해 선택한 언어로 바꿈
- 페이지 구조·폼 필드 이름(`B_name`, `B_phone`, `num`)은 그대로 → **서버/DB 처리에 영향 없음**
- 선택한 언어는 쿠키 `lang` 에 저장 (나중에 서버 PHP에서 `$_COOKIE['lang']` 으로 읽을 수 있음)
- 사전에 없는 글자(DB 내용)는 한국어 그대로

**번역 고치기**: `site/js/i18n.js` 의 `DICT` (문구) / `BANNERS` (이미지 속 글자)를 수정

**DB 내용 번역 고치기** (가게·장소 설명, 주소, 기간, 메뉴):
1. `tools/i18n_content/*.json` 수정 — `places.json`(주소·기간·메뉴), `cards.json`(목록 설명), `details.json`(상세 본문)
2. `python tools/build_i18n_content.py` 실행 → `site/js/i18n-content.js` 가 다시 만들어짐
   - 원문이 실제 페이지 글자와 한 글자라도 다르면 알려 주고 멈춤 (오타로 번역이 안 되는 것 방지)
   - 번역문에 `<` 를 쓰면 적용되지 않으므로 빌드가 막음
3. `i18n.js` 는 `DICT` 에 없으면 `window.I18N_CONTENT`(위 파일)를 찾아봄 — 이 한 줄만 고침

---

## 디자인 리뉴얼 (MZ 테마) — `design-css` 브랜치

기존 CSS·HTML은 그대로 두고 그 위에 새 디자인을 덮어씁니다.

| 파일 | 하는 일 |
|---|---|
| `site/css/renewal.css` | 새 디자인 (어두운 바탕 + 주색/포인트색, 카드형 목록, 알약 탭) |
| `site/js/renewal.js` | 글자가 그려진 이미지(로고·배너·제목·버튼)를 HTML 글자로 교체, 언어 선택·참여 안내 화면 재구성 |
| `tools/apply_renewal.py` | 모든 페이지에 위 두 파일 연결 (여러 번 실행해도 중복 안 됨) |

- **축제가 바뀌면** `renewal.js` 맨 위 `FESTIVAL` 만 고치면 됩니다 (행사명, 지역, 교환 장소, 포인트, 소멸 시각, 문의 전화, 색 테마)
- **색 테마**: `spring`(핫핑크+라임) · `edu`(블루+옐로) · `eco`(민트+오렌지). 미리보기는 주소 끝에 `?theme=edu` (다시 원래대로 `?theme=spring`)
- 새로 넣은 문구도 4개 국어로 들어 있음. `renewal.js` 가 `i18n.js` 보다 먼저 실행되도록 연결됨
- 확인한 것: 118페이지 × (한국어·영어) 자동 점검 — 글자 이미지 남은 곳·가로 넘침·상단 바 가림 없음

**글꼴** (`site/fonts/`, 둘 다 OFL — 라이선스 파일 같은 폴더) — 인터넷 없이도 똑같이 보임
- **Pretendard**: 본문·한글 제목 전부 (당근·야놀자·마이리얼트립·한국관광공사 등이 쓰는 글꼴)
- **Gasoek One(영어·숫자만)**: "5,000P", "LUCKY PASS", "HELLO" 같은 강조. 한 글자씩 자동으로 나뉨
  - 처음엔 제목 전체가 Gasoek One 이었는데 한글(특히 ㄹ)이 뭉개져 읽기 어려워서 바꿈
  - 업체가 입력하는 상세 제목은 숫자가 단어 중간에 섞여("4대계곡") Pretendard 만 사용
- 일본어·중국어 화면은 `i18n.js` 가 각 언어 글꼴을 쓰도록 되어 있어 이 설정과 무관

---

## 도구 (tools/)

| 파일 | 하는 일 |
|---|---|
| `crawl2.py` | 사이트 전체를 따라가며 `orig/` 에 저장 |
| `build2.py` | `orig/` → `site/` 로 복사하며 링크를 로컬로 바꾸고 추적 코드 제거 |
| `apply_i18n.py` | `site/` 모든 페이지에 `site-fixes.js`·다국어 스크립트 추가, 언어 버튼 연결 |
| `apply_renewal.py` | `site/` 모든 페이지에 리뉴얼 디자인·챗봇 버튼 연결 |
| `build_i18n_content.py` | `tools/i18n_content/*.json` → `js/i18n-content.js` (DB 내용 번역) |
| `build_chatbot_kb.py` | 사이트 페이지 → `chatbot/kb/places-gwangyang.js` (챗봇 장소 자료) |
| `test_chatbot.js` | 챗봇 회귀 테스트 (질문 75개) — `node tools/test_chatbot.js` |
| `erase_banner_text.py` | 배너 이미지에서 글자만 지우기 |
| `make_banner_bgs.py` | 배너 25개의 글자 지운 배경 일괄 생성 |

사이트를 다시 받아올 때:

```bash
python tools/crawl2.py "http://www.gwangyangpang.com/intro.html?num=D604B24477545F5C60502405576165" . 500
python tools/build2.py .
python tools/apply_i18n.py site
python tools/apply_renewal.py site
python tools/make_banner_bgs.py site
python tools/build_i18n_content.py
python tools/build_chatbot_kb.py
node tools/test_chatbot.js
```

(그 뒤 `js/`, `css/renewal.css`, `fonts/`, `chatbot.html`, `chatbot/`, `_i18n_gallery.html` 은 이 저장소 것을 다시 넣고, 참여·포인트 조회 페이지의 동의 체크박스 수정을 다시 해야 함 — 원본 HTML 을 새로 받으면 지워지므로)

---

## 실제 서버에 반영하는 방법

실제 사이트는 PHP 가 HTML 을 만들어 보내는 구조라, 우리 HTML 파일을 그대로 덮어쓰면 안 되고 **파일을 올린 뒤 PHP 에 아래만 추가**하면 됩니다.

**1. 파일 올리기** (`site/` 아래 같은 경로로)
- `js/` : `renewal.js`, `i18n-content.js`, `site-fixes.js`, `i18n.js`, `chatbot-launcher.js`
- `css/renewal.css`, `fonts/` 폴더 전체
- `images/i18n/` 폴더 전체 (글자 지운 배너 배경)
- `chatbot.html`, `chatbot/` 폴더 전체
- 올리지 않을 것: `_i18n_gallery.html`(확인용), `orig/`, `tools/`

**2. 공통 헤더 PHP 의 `</head>` 앞에 이 순서 그대로** (순서가 바뀌면 번역·주소 링크가 어긋남)
```html
<script type="text/javascript" src="js/renewal.js"></script>
<script type="text/javascript" src="js/i18n-content.js"></script>
<script type="text/javascript" src="js/site-fixes.js"></script>
<script type="text/javascript" src="js/i18n.js"></script>
<script type="text/javascript" src="js/chatbot-launcher.js"></script>
<link rel="stylesheet" type="text/css" href="css/renewal.css">
```

**3. 페이지별 PHP 수정**
- `intro.html` : English / 日本語 / 中文 버튼에 링크 연결 (`data-set-lang` — `site/intro__num_…html` 참고)
- `view.html`, `phone_login.html` : 동의 체크박스와 `send_submit()` 의 동의 검사 (`site/view__num_…html` 참고)
- `phone_login.html` : 동의 문구 '경북교육청' → '행운팡팡'
- 네이버 방문 추적 코드(`wcs.pstatic.net`)는 **실서버에서는 의뢰처가 쓰는 것이므로 그대로 둠** (복제본에서만 지움)

**4. 서버 쪽 처리 (PHP 개발자 몫)**
- 참여·조회 처리에서 `agree_info=Y` 가 없으면 거부 (화면 검사만으로는 우회 가능)

---

## 발견한 문제 (보안·버그) — 참고용

받아온 코드를 읽거나 접속만으로 확인한 것 (공격성 점검은 하지 않음. 하려면 의뢰처 서면 허락 필요)

- HTTP만 사용(HTTPS 아님), PHP 5.2.17(2011년 지원 종료), 서버 버전이 응답 헤더에 노출
- 제목이 "광양행운팡팡(개발용)" — 개발용 사이트가 외부 공개 상태
- 참여 페이지의 개인정보 동의 체크 코드가 주석 처리돼 동의 없이 전송됨 → **화면 쪽은 수정함(11/20)**, 서버 검사는 남음. 휴대폰 인증 코드는 있으나 미사용
- `file.php?U_index=번호` 가 순번이라 번호만 바꾸면 업로드 파일을 모두 볼 수 있음
- 숙박업소 이름 칸에 `<iframe>` 코드가 섞여 있음 (입력값 필터링 안 함 → XSS 위험 신호)
- 프로그램 문의 배너의 전화번호(1522-3475)와 실제 연결 번호(053-951-5555)가 다름
- 같은 축제(제25회 광양매화축제)가 DB 에 두 번 등록됨 (com_idx 1·7, 내용·사진 동일) — 실제 사이트 목록에도 두 번 나옴
